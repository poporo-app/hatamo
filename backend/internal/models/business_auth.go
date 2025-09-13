package models

import (
	"time"
)

// BusinessAuth represents business authentication credentials
type BusinessAuth struct {
	ID                        uint64     `json:"id" gorm:"primaryKey;autoIncrement"`
	Email                     string     `json:"email" gorm:"uniqueIndex;not null;size:255"`
	PasswordHash              string     `json:"-" gorm:"not null;size:255"`
	SponsorID                 uint64     `json:"sponsor_id" gorm:"uniqueIndex;not null"`
	Sponsor                   Sponsor    `json:"sponsor" gorm:"foreignKey:SponsorID"`
	IsVerified                bool       `json:"is_verified" gorm:"default:false"`
	VerificationToken         *string    `json:"-" gorm:"size:255"`
	VerificationTokenExpiresAt *time.Time `json:"-"`
	ResetToken                *string    `json:"-" gorm:"size:255"`
	ResetTokenExpiresAt       *time.Time `json:"-"`
	LastLoginAt               *time.Time `json:"last_login_at"`
	CreatedAt                 time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt                 time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt                 *time.Time `json:"deleted_at" gorm:"index"`
}

// TableName specifies the table name for BusinessAuth
func (BusinessAuth) TableName() string {
	return "business_auth"
}

// IsEmailVerified checks if email is verified
func (b *BusinessAuth) IsEmailVerified() bool {
	return b.IsVerified
}

// BusinessAuthResponse represents the business auth response
type BusinessAuthResponse struct {
	ID          uint64     `json:"id"`
	Email       string     `json:"email"`
	SponsorID   uint64     `json:"sponsor_id"`
	IsVerified  bool       `json:"is_verified"`
	LastLoginAt *time.Time `json:"last_login_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// ToResponse converts BusinessAuth to BusinessAuthResponse
func (b *BusinessAuth) ToResponse() BusinessAuthResponse {
	return BusinessAuthResponse{
		ID:          b.ID,
		Email:       b.Email,
		SponsorID:   b.SponsorID,
		IsVerified:  b.IsVerified,
		LastLoginAt: b.LastLoginAt,
		CreatedAt:   b.CreatedAt,
		UpdatedAt:   b.UpdatedAt,
	}
}