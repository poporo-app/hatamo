package handlers

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/j-nasu/hatamo/backend/internal/config"
	"github.com/j-nasu/hatamo/backend/internal/middleware"
	"github.com/j-nasu/hatamo/backend/internal/models"
	"github.com/j-nasu/hatamo/backend/internal/services"
	"github.com/j-nasu/hatamo/backend/internal/utils"
)

type AuthHandler struct {
	db           *gorm.DB
	emailService *services.EmailService
	config       *config.Config
}

func NewAuthHandler(db *gorm.DB, emailService *services.EmailService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		db:           db,
		emailService: emailService,
		config:       cfg,
	}
}

// RegisterUser handles user registration
func (h *AuthHandler) RegisterUser(c *gin.Context) {
	var req models.CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"message": err.Error(),
		})
		return
	}

	// Validate input
	errors := middleware.ValidateRegistrationInput(
		req.Email,
		req.Password,
		req.FirstName,
		req.LastName,
		req.Phone,
	)

	if len(errors) > 0 {
		middleware.ValidationErrorHandler(c, errors)
		return
	}

	// Normalize email
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Check if user already exists
	var existingUser models.User
	if err := h.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		// Return as validation error so it appears under the email field
		validationErrors := []middleware.ValidationError{
			{
				Field:   "email",
				Message: "このメールアドレスは既に登録されています",
				Code:    "already_exists",
			},
		}
		c.JSON(http.StatusBadRequest, middleware.CreateValidationErrorResponse(validationErrors))
		return
	} else if err != gorm.ErrRecordNotFound {
		log.Printf("Database error checking existing user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Please try again later",
		})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to process password",
		})
		return
	}

	// Generate email verification token
	tokenInfo, err := utils.NewTokenInfo()
	if err != nil {
		log.Printf("Error generating verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to generate verification token",
		})
		return
	}

	// Create user
	var phone *string
	if req.Phone != "" {
		phone = &req.Phone
	}

	user := models.User{
		Email:                  req.Email,
		PasswordHash:           string(hashedPassword),
		FirstName:              strings.TrimSpace(req.FirstName),
		LastName:               strings.TrimSpace(req.LastName),
		FirstNameKana:          strings.TrimSpace(req.FirstNameKana),
		LastNameKana:           strings.TrimSpace(req.LastNameKana),
		Phone:                  phone,
		Role:                   models.UserRoleUser,
		EmailVerificationToken: &tokenInfo.Token,
	}

	if err := h.db.Create(&user).Error; err != nil {
		log.Printf("Error creating user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to create user account",
		})
		return
	}

	// Send verification email
	fullName := user.FirstName + " " + user.LastName
	if err := h.emailService.SendVerificationEmail(user.Email, fullName, tokenInfo.Token); err != nil {
		log.Printf("Error sending verification email to %s: %v", user.Email, err)
		// Don't return error to user, as account was created successfully
		// The user can request a new verification email later
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully. Please check your email to verify your account.",
		"user":    user.ToResponse(),
	})
}

// VerifyEmail handles email verification
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Missing verification token",
			"message": "Verification token is required",
		})
		return
	}

	// Find user by verification token
	var user models.User
	if err := h.db.Where("email_verification_token = ?", token).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Invalid verification token",
				"message": "The verification token is invalid or has expired",
			})
			return
		}
		log.Printf("Database error finding user by token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Please try again later",
		})
		return
	}

	// Check if email is already verified
	if user.IsEmailVerified() {
		c.JSON(http.StatusConflict, gin.H{
			"error":   "Email already verified",
			"message": "This email address has already been verified",
		})
		return
	}

	// Check token expiration (24 hours)
	if utils.IsTokenExpired(user.CreatedAt) {
		c.JSON(http.StatusGone, gin.H{
			"error":   "Token expired",
			"message": "The verification token has expired. Please request a new one.",
		})
		return
	}

	// Update user - mark as verified and clear token
	now := time.Now()
	if err := h.db.Model(&user).Updates(models.User{
		EmailVerifiedAt:        &now,
		EmailVerificationToken: nil,
	}).Error; err != nil {
		log.Printf("Error updating user verification status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to verify email",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Email verified successfully",
		"user":    user.ToResponse(),
	})
}

// ResendVerificationEmail handles resending verification email
func (h *AuthHandler) ResendVerificationEmail(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"message": err.Error(),
		})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Find user
	var user models.User
	if err := h.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Don't reveal if email exists or not for security
			c.JSON(http.StatusOK, gin.H{
				"message": "If an account with this email exists and is not verified, a verification email has been sent.",
			})
			return
		}
		log.Printf("Database error finding user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Please try again later",
		})
		return
	}

	// Check if already verified
	if user.IsEmailVerified() {
		c.JSON(http.StatusConflict, gin.H{
			"error":   "Email already verified",
			"message": "This email address is already verified",
		})
		return
	}

	// Generate new verification token
	tokenInfo, err := utils.NewTokenInfo()
	if err != nil {
		log.Printf("Error generating verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to generate verification token",
		})
		return
	}

	// Update user with new token
	if err := h.db.Model(&user).Update("email_verification_token", tokenInfo.Token).Error; err != nil {
		log.Printf("Error updating verification token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to generate new verification token",
		})
		return
	}

	// Send verification email
	fullName := user.FirstName + " " + user.LastName
	if err := h.emailService.SendVerificationEmail(user.Email, fullName, tokenInfo.Token); err != nil {
		log.Printf("Error sending verification email to %s: %v", user.Email, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to send verification email",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Verification email sent successfully",
	})
}

// GetUserProfile gets user profile (for authenticated users)
func (h *AuthHandler) GetUserProfile(c *gin.Context) {
	// This would typically require authentication middleware
	// For now, just return a placeholder response
	c.JSON(http.StatusNotImplemented, gin.H{
		"error":   "Not implemented",
		"message": "User authentication not yet implemented",
	})
}

// RegisterRoutes registers all authentication routes
func (h *AuthHandler) RegisterRoutes(r *gin.RouterGroup) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", middleware.RateLimitMiddleware(), h.RegisterUser)
		auth.GET("/verify-email", h.VerifyEmail)
		auth.POST("/resend-verification", middleware.RateLimitMiddleware(), h.ResendVerificationEmail)
		auth.GET("/profile", h.GetUserProfile) // Requires auth middleware in production
	}
}