package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/j-nasu/hatamo/backend/internal/config"
	"github.com/j-nasu/hatamo/backend/internal/handlers"
	"github.com/j-nasu/hatamo/backend/internal/models"
	"github.com/j-nasu/hatamo/backend/internal/services"
)

type Application struct {
	config               *config.Config
	db                   *gorm.DB
	redis                *redis.Client
	emailService         *services.EmailService
	authHandler          *handlers.AuthHandler
	businessAuthHandler  *handlers.BusinessAuthHandler
	adminHandler         *handlers.AdminHandler
}

func NewApplication() *Application {
	// Load configuration
	cfg := config.Load()

	app := &Application{
		config: cfg,
	}

	// Initialize services
	app.initDB()
	app.initRedis()
	app.initServices()
	app.initHandlers()

	return app
}

func (app *Application) initDB() {
	var err error

	// Configure GORM logger
	gormLogger := logger.Default.LogMode(logger.Info)

	// Connect to database with retry logic
	for i := 0; i < 30; i++ {
		app.db, err = gorm.Open(mysql.Open(app.config.GetDSN()), &gorm.Config{
			Logger: gormLogger,
		})
		
		if err == nil {
			// Get underlying SQL DB to configure connection pool
			sqlDB, err := app.db.DB()
			if err == nil {
				if err = sqlDB.Ping(); err == nil {
					// Configure connection pool
					sqlDB.SetMaxIdleConns(10)
					sqlDB.SetMaxOpenConns(100)
					sqlDB.SetConnMaxLifetime(time.Hour)
					
					log.Println("Successfully connected to MySQL with GORM")
					return
				}
			}
		}
		
		log.Printf("Failed to connect to MySQL. Retrying in 2 seconds... (%d/30)", i+1)
		time.Sleep(2 * time.Second)
	}
	
	log.Fatal("Failed to connect to MySQL after 30 attempts")
}

func (app *Application) initRedis() {
	app.redis = redis.NewClient(&redis.Options{
		Addr:     app.config.GetRedisAddr(),
		Password: "",
		DB:       0,
	})

	ctx := context.Background()
	for i := 0; i < 30; i++ {
		_, err := app.redis.Ping(ctx).Result()
		if err == nil {
			log.Println("Successfully connected to Redis")
			return
		}
		log.Printf("Failed to connect to Redis. Retrying in 2 seconds... (%d/30)", i+1)
		time.Sleep(2 * time.Second)
	}
	log.Fatal("Failed to connect to Redis after 30 attempts")
}

func (app *Application) initServices() {
	app.emailService = services.NewEmailService(app.config)
}

func (app *Application) initHandlers() {
	app.authHandler = handlers.NewAuthHandler(app.db, app.emailService, app.config)
	app.businessAuthHandler = handlers.NewBusinessAuthHandler(app.db, app.emailService, app.config)
	app.adminHandler = handlers.NewAdminHandler(app.db)
}

func (app *Application) setupRouter() *gin.Engine {
	// Set Gin mode based on environment
	if app.config.App.Name == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Root endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "HATAMO API Server",
			"status":  "ok",
			"version": "1.0.0",
		})
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		// Check database connection
		sqlDB, err := app.db.DB()
		dbHealthy := err == nil && sqlDB.Ping() == nil

		// Check Redis connection
		_, redisErr := app.redis.Ping(context.Background()).Result()
		redisHealthy := redisErr == nil

		health := gin.H{
			"status": "healthy",
			"timestamp": time.Now().Format(time.RFC3339),
			"services": gin.H{
				"database": dbHealthy,
				"redis":    redisHealthy,
			},
		}

		if !dbHealthy || !redisHealthy {
			health["status"] = "unhealthy"
			c.JSON(http.StatusServiceUnavailable, health)
			return
		}

		c.JSON(http.StatusOK, health)
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Register authentication routes
		app.authHandler.RegisterRoutes(api)
		// Register business authentication routes
		app.businessAuthHandler.RegisterRoutes(api)
		// Register admin routes
		app.adminHandler.RegisterRoutes(api)
	}

	return r
}

func (app *Application) autoMigrate() {
	log.Println("Running database auto-migration...")
	
	if err := app.db.AutoMigrate(&models.User{}, &models.Business{}); err != nil {
		log.Fatalf("Failed to auto-migrate database: %v", err)
	}
	
	log.Println("Database auto-migration completed successfully")
}

func main() {
	log.Println("Starting HATAMO API Server...")

	app := NewApplication()
	
	// Run auto-migration (in production, you might want to disable this)
	app.autoMigrate()

	router := app.setupRouter()
	
	serverAddr := fmt.Sprintf(":%s", app.config.Server.Port)
	log.Printf("Server starting on port %s...", app.config.Server.Port)
	
	if err := router.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}