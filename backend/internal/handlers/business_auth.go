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

type BusinessAuthHandler struct {
	db           *gorm.DB
	emailService *services.EmailService
	config       *config.Config
}

func NewBusinessAuthHandler(db *gorm.DB, emailService *services.EmailService, cfg *config.Config) *BusinessAuthHandler {
	return &BusinessAuthHandler{
		db:           db,
		emailService: emailService,
		config:       cfg,
	}
}

// RegisterBusiness handles business registration
func (h *BusinessAuthHandler) RegisterBusiness(c *gin.Context) {
	var req models.CreateBusinessRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"message": err.Error(),
		})
		return
	}

	// Validate input
	var errors []middleware.ValidationError

	// Validate email
	if emailErr := middleware.ValidateEmail(req.Email); emailErr != nil {
		errors = append(errors, *emailErr)
	}

	// Validate password
	if passwordErrors := middleware.ValidatePassword(req.Password); passwordErrors != nil {
		errors = append(errors, passwordErrors...)
	}

	// Validate password confirmation
	if req.Password != req.ConfirmPassword {
		errors = append(errors, middleware.ValidationError{
			Field:   "confirmPassword",
			Message: "パスワードが一致しません",
			Code:    "password_mismatch",
		})
	}

	// Validate names
	if nameErr := middleware.ValidateName(req.FirstName, "firstName"); nameErr != nil {
		errors = append(errors, *nameErr)
	}
	if nameErr := middleware.ValidateName(req.LastName, "lastName"); nameErr != nil {
		errors = append(errors, *nameErr)
	}

	// Validate business name
	if req.BusinessName == "" {
		errors = append(errors, middleware.ValidationError{
			Field:   "businessName",
			Message: "事業者名は必須です",
			Code:    "required",
		})
	}

	// Validate business type
	validTypes := map[models.BusinessType]bool{
		models.BusinessTypeCorporation: true,
		models.BusinessTypeLimited:     true,
		models.BusinessTypePartnership: true,
		models.BusinessTypeIndividual:  true,
		models.BusinessTypeNPO:         true,
		models.BusinessTypeOther:       true,
	}
	if !validTypes[req.BusinessType] {
		errors = append(errors, middleware.ValidationError{
			Field:   "businessType",
			Message: "有効な事業形態を選択してください",
			Code:    "invalid_type",
		})
	}

	// Validate phone if provided
	if req.Phone != "" {
		if phoneErr := middleware.ValidatePhone(req.Phone); phoneErr != nil {
			errors = append(errors, *phoneErr)
		}
	}

	// Validate terms acceptance
	if !req.AcceptTerms {
		errors = append(errors, middleware.ValidationError{
			Field:   "acceptTerms",
			Message: "利用規約への同意が必要です",
			Code:    "required",
		})
	}

	if len(errors) > 0 {
		middleware.ValidationErrorHandler(c, errors)
		return
	}

	// Normalize email
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Check if user already exists
	var existingUser models.User
	if err := h.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
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

	// Start transaction
	tx := h.db.Begin()

	// Create user with business role
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
		Role:                   models.UserRoleSponsor, // Business role
		EmailVerificationToken: &tokenInfo.Token,
	}

	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		log.Printf("Error creating user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to create user account",
		})
		return
	}

	// Create business record
	business := models.Business{
		UserID:           user.ID,
		BusinessName:     strings.TrimSpace(req.BusinessName),
		BusinessNameKana: strings.TrimSpace(req.BusinessNameKana),
		BusinessType:     req.BusinessType,
		Description:      strings.TrimSpace(req.Description),
		Website:          strings.TrimSpace(req.Website),
		Address:          strings.TrimSpace(req.Address),
		PostalCode:       strings.TrimSpace(req.PostalCode),
	}

	if err := tx.Create(&business).Error; err != nil {
		tx.Rollback()
		log.Printf("Error creating business: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to create business account",
		})
		return
	}

	// Commit transaction
	tx.Commit()

	// Load user with business data for response
	business.User = user

	// Send verification email
	fullName := user.FirstName + " " + user.LastName
	if err := h.emailService.SendBusinessVerificationEmail(user.Email, fullName, req.BusinessName, tokenInfo.Token); err != nil {
		log.Printf("Error sending verification email to %s: %v", user.Email, err)
		// Don't return error to user, as account was created successfully
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "事業者登録が完了しました。メールをご確認ください。",
		"user":     user.ToResponse(),
		"business": business.ToResponse(),
	})
}

// LoginBusiness handles business login
func (h *BusinessAuthHandler) LoginBusiness(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Login binding error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "不正なリクエスト",
			"message": "入力内容を確認してください",
		})
		return
	}

	// Manual validation
	if req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "不正なリクエスト",
			"message": "メールアドレスとパスワードは必須です",
		})
		return
	}

	// Normalize email
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// Validate email format
	if emailErr := middleware.ValidateEmail(req.Email); emailErr != nil {
		validationErrors := []middleware.ValidationError{*emailErr}
		c.JSON(http.StatusBadRequest, middleware.CreateValidationErrorResponse(validationErrors))
		return
	}

	// Find user by email and role
	var user models.User
	if err := h.db.Where("email = ? AND role = ?", req.Email, models.UserRoleSponsor).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "認証エラー",
				"message": "メールアドレスまたはパスワードが違います",
			})
			return
		}
		log.Printf("Database error finding user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "内部エラー",
			"message": "しばらくしてからもう一度お試しください",
		})
		return
	}

	// Check if email is verified
	if !user.IsEmailVerified() {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "メール未確認",
			"message": "メールアドレスの確認が必要です。確認メールをご確認ください",
		})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "認証エラー",
			"message": "メールアドレスまたはパスワードが違います",
		})
		return
	}

	// Get business information
	var business models.Business
	if err := h.db.Where("user_id = ?", user.ID).First(&business).Error; err != nil {
		log.Printf("Error finding business for user %d: %v", user.ID, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "内部エラー",
			"message": "事業者情報の取得に失敗しました",
		})
		return
	}
	business.User = user

	// Generate JWT token
	token, err := utils.GenerateJWT(
		user.ID,
		user.Email,
		user.FirstName,
		user.LastName,
		string(user.Role),
		h.config.App.JWTSecret,
	)
	if err != nil {
		log.Printf("Error generating JWT token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "内部エラー",
			"message": "ログイン処理に失敗しました",
		})
		return
	}

	// Generate refresh token
	refreshToken, err := utils.GenerateRefreshToken(
		user.ID,
		user.Email,
		h.config.App.JWTSecret,
	)
	if err != nil {
		log.Printf("Error generating refresh token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "内部エラー",
			"message": "ログイン処理に失敗しました",
		})
		return
	}

	// Update last login time
	now := time.Now()
	if err := h.db.Model(&user).Update("last_login_at", now).Error; err != nil {
		log.Printf("Error updating last login time: %v", err)
		// Don't return error, as login was successful
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "ログインに成功しました",
		"token":         token,
		"refresh_token": refreshToken,
		"user":          user.ToResponse(),
		"business":      business.ToResponse(),
	})
}

// RegisterRoutes registers all business authentication routes
func (h *BusinessAuthHandler) RegisterRoutes(r *gin.RouterGroup) {
	business := r.Group("/business")
	{
		business.POST("/register", middleware.RateLimitMiddleware(), h.RegisterBusiness)
		business.POST("/login", middleware.RateLimitMiddleware(), h.LoginBusiness)
	}
}