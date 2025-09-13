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

	// Check if business auth already exists
	var existingBusinessAuth models.BusinessAuth
	if err := h.db.Where("email = ?", req.Email).First(&existingBusinessAuth).Error; err == nil {
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
		log.Printf("Database error checking existing business auth: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Please try again later",
		})
		return
	}

	// Also check if user already exists with this email (for backward compatibility)
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

	// Create user with business role (for backward compatibility)
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

	// Create sponsor record
	sponsor := models.Sponsor{
		UserID:             user.ID,
		CompanyName:        strings.TrimSpace(req.BusinessName),
		CompanyType:        string(req.BusinessType),
		RepresentativeName: user.FirstName + " " + user.LastName,
		Address:            strings.TrimSpace(req.Address),
		Description:        strings.TrimSpace(req.Description),
		WebsiteURL:         strings.TrimSpace(req.Website),
		ApprovalStatus:     models.ApprovalStatusPending,
	}

	if err := tx.Create(&sponsor).Error; err != nil {
		tx.Rollback()
		log.Printf("Error creating sponsor: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to create sponsor account",
		})
		return
	}

	// Create business auth record
	businessAuth := models.BusinessAuth{
		Email:                      req.Email,
		PasswordHash:               string(hashedPassword),
		SponsorID:                  sponsor.ID,
		IsVerified:                 false,
		VerificationToken:          &tokenInfo.Token,
		VerificationTokenExpiresAt: &tokenInfo.ExpiresAt,
	}

	if err := tx.Create(&businessAuth).Error; err != nil {
		tx.Rollback()
		log.Printf("Error creating business auth: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"message": "Failed to create business authentication",
		})
		return
	}

	// Also create business record for backward compatibility
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
	sponsor.User = user

	// Send verification email
	fullName := user.FirstName + " " + user.LastName
	if err := h.emailService.SendBusinessVerificationEmail(req.Email, fullName, req.BusinessName, tokenInfo.Token); err != nil {
		log.Printf("Error sending verification email to %s: %v", req.Email, err)
		// Don't return error to user, as account was created successfully
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "事業者登録が完了しました。メールをご確認ください。",
		"user":     user.ToResponse(),
		"business": business.ToResponse(),
		"sponsor":  sponsor.ToResponse(),
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

	// Find business auth by email
	var businessAuth models.BusinessAuth
	if err := h.db.Preload("Sponsor").Preload("Sponsor.User").Where("email = ?", req.Email).First(&businessAuth).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Fallback to check old user table for backward compatibility
			var user models.User
			if err := h.db.Where("email = ? AND role = ?", req.Email, models.UserRoleSponsor).First(&user).Error; err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{
					"error":   "認証エラー",
					"message": "メールアドレスまたはパスワードが違います",
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

			// Get sponsor information for backward compatibility
			var sponsor models.Sponsor
			if err := h.db.Where("user_id = ?", user.ID).First(&sponsor).Error; err != nil {
				log.Printf("Error finding sponsor for user %d: %v", user.ID, err)
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "内部エラー",
					"message": "事業者情報の取得に失敗しました",
				})
				return
			}
			sponsor.User = user

			// Generate JWT token with business role
			token, err := utils.GenerateJWT(
				sponsor.ID,
				user.Email,
				user.FirstName,
				user.LastName,
				"business",
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
				sponsor.ID,
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
				"sponsor":       sponsor.ToResponse(),
				"role":          "business",
			})
			return
		}
		log.Printf("Database error finding business auth: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "内部エラー",
			"message": "しばらくしてからもう一度お試しください",
		})
		return
	}

	// Check if email is verified
	if !businessAuth.IsEmailVerified() {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "メール未確認",
			"message": "メールアドレスの確認が必要です。確認メールをご確認ください",
		})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(businessAuth.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "認証エラー",
			"message": "メールアドレスまたはパスワードが違います",
		})
		return
	}

	// Generate JWT token with business role
	token, err := utils.GenerateJWT(
		businessAuth.SponsorID,
		businessAuth.Email,
		businessAuth.Sponsor.User.FirstName,
		businessAuth.Sponsor.User.LastName,
		"business",
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
		businessAuth.SponsorID,
		businessAuth.Email,
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
	if err := h.db.Model(&businessAuth).Update("last_login_at", now).Error; err != nil {
		log.Printf("Error updating last login time: %v", err)
		// Don't return error, as login was successful
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "ログインに成功しました",
		"token":         token,
		"refresh_token": refreshToken,
		"user":          businessAuth.Sponsor.User.ToResponse(),
		"sponsor":       businessAuth.Sponsor.ToResponse(),
		"role":          "business",
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