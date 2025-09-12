package models

import (
	"time"
)

// BusinessType represents the type of business entity
type BusinessType string

const (
	BusinessTypeCorporation BusinessType = "corporation"
	BusinessTypeLimited     BusinessType = "limited"
	BusinessTypePartnership BusinessType = "partnership"
	BusinessTypeIndividual  BusinessType = "individual"
	BusinessTypeNPO         BusinessType = "npo"
	BusinessTypeOther       BusinessType = "other"
)

// Business represents a business entity (事業者)
type Business struct {
	ID               uint64       `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID           uint64       `json:"user_id" gorm:"uniqueIndex;not null"`
	User             User         `json:"user" gorm:"foreignKey:UserID"`
	BusinessName     string       `json:"business_name" gorm:"not null;size:255"`
	BusinessNameKana string       `json:"business_name_kana" gorm:"size:255"`
	BusinessType     BusinessType `json:"business_type" gorm:"type:enum('corporation','limited','partnership','individual','npo','other');not null"`
	Description      string       `json:"description" gorm:"type:text"`
	Website          string       `json:"website" gorm:"size:255"`
	Address          string       `json:"address" gorm:"size:500"`
	PostalCode       string       `json:"postal_code" gorm:"size:10"`
	IsVerified       bool         `json:"is_verified" gorm:"default:false"`
	VerifiedAt       *time.Time   `json:"verified_at"`
	CreatedAt        time.Time    `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt        time.Time    `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt        *time.Time   `json:"deleted_at" gorm:"index"`
}

// CreateBusinessRequest represents the request to create a business account
type CreateBusinessRequest struct {
	Email            string       `json:"email" binding:"required,email"`
	Password         string       `json:"password" binding:"required,min=8"`
	ConfirmPassword  string       `json:"confirmPassword" binding:"required"`
	FirstName        string       `json:"firstName" binding:"required"`
	LastName         string       `json:"lastName" binding:"required"`
	FirstNameKana    string       `json:"firstNameKana"`
	LastNameKana     string       `json:"lastNameKana"`
	Phone            string       `json:"phone"`
	BusinessName     string       `json:"businessName" binding:"required"`
	BusinessNameKana string       `json:"businessNameKana"`
	BusinessType     BusinessType `json:"businessType" binding:"required"`
	Description      string       `json:"description"`
	Website          string       `json:"website"`
	Address          string       `json:"address"`
	PostalCode       string       `json:"postalCode"`
	AcceptTerms      bool         `json:"acceptTerms" binding:"required"`
}

// BusinessResponse represents the business response
type BusinessResponse struct {
	ID               uint64       `json:"id"`
	UserID           uint64       `json:"user_id"`
	Email            string       `json:"email"`
	FirstName        string       `json:"first_name"`
	LastName         string       `json:"last_name"`
	FirstNameKana    string       `json:"first_name_kana"`
	LastNameKana     string       `json:"last_name_kana"`
	Phone            *string      `json:"phone"`
	BusinessName     string       `json:"business_name"`
	BusinessNameKana string       `json:"business_name_kana"`
	BusinessType     BusinessType `json:"business_type"`
	Description      string       `json:"description"`
	Website          string       `json:"website"`
	Address          string       `json:"address"`
	PostalCode       string       `json:"postal_code"`
	IsVerified       bool         `json:"is_verified"`
	VerifiedAt       *time.Time   `json:"verified_at"`
	CreatedAt        time.Time    `json:"created_at"`
	UpdatedAt        time.Time    `json:"updated_at"`
}

// ToResponse converts Business to BusinessResponse
func (b *Business) ToResponse() BusinessResponse {
	return BusinessResponse{
		ID:               b.ID,
		UserID:           b.UserID,
		Email:            b.User.Email,
		FirstName:        b.User.FirstName,
		LastName:         b.User.LastName,
		FirstNameKana:    b.User.FirstNameKana,
		LastNameKana:     b.User.LastNameKana,
		Phone:            b.User.Phone,
		BusinessName:     b.BusinessName,
		BusinessNameKana: b.BusinessNameKana,
		BusinessType:     b.BusinessType,
		Description:      b.Description,
		Website:          b.Website,
		Address:          b.Address,
		PostalCode:       b.PostalCode,
		IsVerified:       b.IsVerified,
		VerifiedAt:       b.VerifiedAt,
		CreatedAt:        b.CreatedAt,
		UpdatedAt:        b.UpdatedAt,
	}
}