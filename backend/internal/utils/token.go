package utils

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/google/uuid"
)

const (
	// TokenLength defines the length of verification tokens in bytes
	TokenLength = 32
	// TokenExpiration defines how long verification tokens are valid
	TokenExpiration = 24 * time.Hour
)

// GenerateSecureToken generates a cryptographically secure random token
func GenerateSecureToken() (string, error) {
	bytes := make([]byte, TokenLength)
	if _, err := rand.Read(bytes); err != nil {
		return "", fmt.Errorf("failed to generate random token: %w", err)
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

// GenerateUUID generates a new UUID v4
func GenerateUUID() string {
	return uuid.New().String()
}

// SecureCompare performs a constant-time comparison of two strings
// This prevents timing attacks when comparing tokens
func SecureCompare(a, b string) bool {
	return subtle.ConstantTimeCompare([]byte(a), []byte(b)) == 1
}

// IsTokenExpired checks if a token creation time has exceeded the expiration duration
func IsTokenExpired(createdAt time.Time) bool {
	return time.Since(createdAt) > TokenExpiration
}

// TokenInfo holds information about a verification token
type TokenInfo struct {
	Token     string
	ExpiresAt time.Time
	CreatedAt time.Time
}

// NewTokenInfo creates a new token with expiration information
func NewTokenInfo() (*TokenInfo, error) {
	token, err := GenerateSecureToken()
	if err != nil {
		return nil, err
	}

	now := time.Now()
	return &TokenInfo{
		Token:     token,
		CreatedAt: now,
		ExpiresAt: now.Add(TokenExpiration),
	}, nil
}

// IsValid checks if the token is still valid (not expired)
func (ti *TokenInfo) IsValid() bool {
	return time.Now().Before(ti.ExpiresAt)
}

// TimeUntilExpiration returns the duration until the token expires
func (ti *TokenInfo) TimeUntilExpiration() time.Duration {
	return time.Until(ti.ExpiresAt)
}