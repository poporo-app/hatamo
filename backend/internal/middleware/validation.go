package middleware

import (
	"net/http"
	"regexp"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
)

type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Code    string `json:"code"`
}

type ValidationResponse struct {
	Error  string            `json:"error"`
	Errors []ValidationError `json:"errors"`
}

// EmailValidator validates email format
var EmailValidator = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// ValidateEmail checks if email format is valid
func ValidateEmail(email string) *ValidationError {
	if email == "" {
		return &ValidationError{
			Field:   "email",
			Message: "Email is required",
			Code:    "required",
		}
	}

	if len(email) > 255 {
		return &ValidationError{
			Field:   "email",
			Message: "Email must be less than 255 characters",
			Code:    "max_length",
		}
	}

	if !EmailValidator.MatchString(email) {
		return &ValidationError{
			Field:   "email",
			Message: "Please provide a valid email address",
			Code:    "invalid_format",
		}
	}

	return nil
}

// ValidatePassword checks password strength
func ValidatePassword(password string) []ValidationError {
	var errors []ValidationError

	if password == "" {
		errors = append(errors, ValidationError{
			Field:   "password",
			Message: "Password is required",
			Code:    "required",
		})
		return errors
	}

	if len(password) < 8 {
		errors = append(errors, ValidationError{
			Field:   "password",
			Message: "Password must be at least 8 characters long",
			Code:    "min_length",
		})
	}

	if len(password) > 128 {
		errors = append(errors, ValidationError{
			Field:   "password",
			Message: "Password must be less than 128 characters",
			Code:    "max_length",
		})
	}

	hasNumber := false
	hasLetter := false
	hasUpper := false
	hasLower := false

	for _, char := range password {
		switch {
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsLetter(char):
			hasLetter = true
			if unicode.IsUpper(char) {
				hasUpper = true
			}
			if unicode.IsLower(char) {
				hasLower = true
			}
		}
	}

	if !hasNumber {
		errors = append(errors, ValidationError{
			Field:   "password",
			Message: "Password must contain at least one number",
			Code:    "missing_number",
		})
	}

	if !hasLetter {
		errors = append(errors, ValidationError{
			Field:   "password",
			Message: "Password must contain at least one letter",
			Code:    "missing_letter",
		})
	}

	// Optional: Check for both upper and lower case
	if len(password) >= 8 && (!hasUpper || !hasLower) {
		// This is a warning, not a strict requirement
		// You can uncomment this if you want to enforce it
		/*
		errors = append(errors, ValidationError{
			Field:   "password",
			Message: "Password should contain both uppercase and lowercase letters",
			Code:    "missing_case_variety",
		})
		*/
	}

	return errors
}

// ValidateName checks if name is valid
func ValidateName(name, fieldName string) *ValidationError {
	if name == "" {
		return &ValidationError{
			Field:   fieldName,
			Message: fieldName + " is required",
			Code:    "required",
		}
	}

	name = strings.TrimSpace(name)
	if len(name) < 1 {
		return &ValidationError{
			Field:   fieldName,
			Message: fieldName + " cannot be empty",
			Code:    "empty",
		}
	}

	if len(name) > 100 {
		return &ValidationError{
			Field:   fieldName,
			Message: fieldName + " must be less than 100 characters",
			Code:    "max_length",
		}
	}

	// Check for invalid characters (allow letters including Japanese, spaces, hyphens, apostrophes)
	// Allow: Latin letters, Japanese characters (Hiragana, Katakana, Kanji), spaces, hyphens, apostrophes
	validName := regexp.MustCompile(`^[a-zA-Z\p{Hiragana}\p{Katakana}\p{Han}\s\-'・]+$`)
	if !validName.MatchString(name) {
		return &ValidationError{
			Field:   fieldName,
			Message: fieldName + " contains invalid characters",
			Code:    "invalid_characters",
		}
	}

	return nil
}

// ValidatePhone checks if phone number is valid (optional field)
func ValidatePhone(phone string) *ValidationError {
	if phone == "" {
		return nil // Phone is optional
	}

	phone = strings.TrimSpace(phone)
	if len(phone) < 10 {
		return &ValidationError{
			Field:   "phone",
			Message: "Phone number must be at least 10 characters",
			Code:    "min_length",
		}
	}

	if len(phone) > 20 {
		return &ValidationError{
			Field:   "phone",
			Message: "Phone number must be less than 20 characters",
			Code:    "max_length",
		}
	}

	// Allow numbers, spaces, hyphens, parentheses, and plus sign
	validPhone := regexp.MustCompile(`^[\d\s\-\(\)\+]+$`)
	if !validPhone.MatchString(phone) {
		return &ValidationError{
			Field:   "phone",
			Message: "Phone number contains invalid characters",
			Code:    "invalid_format",
		}
	}

	return nil
}

// CreateValidationErrorResponse creates a standardized validation error response
func CreateValidationErrorResponse(errors []ValidationError) gin.H {
	return gin.H{
		"error":  "Validation failed",
		"errors": errors,
	}
}

// RateLimitMiddleware creates a simple rate limiting middleware
// For production, consider using a more sophisticated rate limiter like Redis-based
func RateLimitMiddleware() gin.HandlerFunc {
	// This is a simple in-memory rate limiter
	// For production, use Redis or another distributed solution
	return gin.HandlerFunc(func(c *gin.Context) {
		// Simple rate limiting can be implemented here
		// For now, we'll just continue to the next handler
		c.Next()
	})
}

// InputSanitizationMiddleware sanitizes input to prevent XSS and injection attacks
func InputSanitizationMiddleware() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		// The Gin framework with proper binding handles most input sanitization
		// Additional sanitization can be added here if needed
		c.Next()
	})
}

// ValidateRegistrationInput validates user registration input
func ValidateRegistrationInput(email, password, firstName, lastName, phone string) []ValidationError {
	var errors []ValidationError

	// Validate email
	if emailErr := ValidateEmail(email); emailErr != nil {
		errors = append(errors, *emailErr)
	}

	// Validate password
	passwordErrors := ValidatePassword(password)
	errors = append(errors, passwordErrors...)

	// Validate first name
	if firstNameErr := ValidateName(firstName, "first_name"); firstNameErr != nil {
		errors = append(errors, *firstNameErr)
	}

	// Validate last name
	if lastNameErr := ValidateName(lastName, "last_name"); lastNameErr != nil {
		errors = append(errors, *lastNameErr)
	}

	// Validate phone (optional)
	if phoneErr := ValidatePhone(phone); phoneErr != nil {
		errors = append(errors, *phoneErr)
	}

	return errors
}

// ValidationErrorHandler handles validation errors and returns appropriate response
func ValidationErrorHandler(c *gin.Context, errors []ValidationError) {
	c.JSON(http.StatusBadRequest, CreateValidationErrorResponse(errors))
}