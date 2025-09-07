package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/redis/go-redis/v9"
)

var (
	db  *sql.DB
	rdb *redis.Client
	ctx = context.Background()
)

func initDB() {
	var err error
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		getEnv("DB_USER", "root"),
		getEnv("DB_PASSWORD", "rootpassword"),
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "3306"),
		getEnv("DB_NAME", "hatamo"),
	)

	for i := 0; i < 30; i++ {
		db, err = sql.Open("mysql", dsn)
		if err == nil {
			if err = db.Ping(); err == nil {
				log.Println("Successfully connected to MySQL")
				return
			}
		}
		log.Printf("Failed to connect to MySQL. Retrying in 2 seconds... (%d/30)\n", i+1)
		time.Sleep(2 * time.Second)
	}
	log.Fatal("Failed to connect to MySQL after 30 attempts")
}

func initRedis() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", getEnv("REDIS_HOST", "localhost"), getEnv("REDIS_PORT", "6379")),
		Password: "",
		DB:       0,
	})

	for i := 0; i < 30; i++ {
		_, err := rdb.Ping(ctx).Result()
		if err == nil {
			log.Println("Successfully connected to Redis")
			return
		}
		log.Printf("Failed to connect to Redis. Retrying in 2 seconds... (%d/30)\n", i+1)
		time.Sleep(2 * time.Second)
	}
	log.Fatal("Failed to connect to Redis after 30 attempts")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func setupRouter() *gin.Engine {
	r := gin.Default()

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

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World from Go Backend!",
			"status":  "ok",
		})
	})

	r.GET("/health", func(c *gin.Context) {
		dbErr := db.Ping()
		_, redisErr := rdb.Ping(ctx).Result()

		health := gin.H{
			"status": "healthy",
			"services": gin.H{
				"database": dbErr == nil,
				"redis":    redisErr == nil,
			},
		}

		if dbErr != nil || redisErr != nil {
			c.JSON(http.StatusServiceUnavailable, health)
			return
		}

		c.JSON(http.StatusOK, health)
	})

	return r
}

func main() {
	initDB()
	initRedis()

	router := setupRouter()
	log.Println("Server starting on port 8080...")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}