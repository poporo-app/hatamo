package models

import (
	"database/sql/driver"
	"time"
)

// ApprovalStatus represents the approval status of a sponsor
type ApprovalStatus string

const (
	ApprovalStatusPending   ApprovalStatus = "pending"
	ApprovalStatusApproved  ApprovalStatus = "approved"
	ApprovalStatusRejected  ApprovalStatus = "rejected"
	ApprovalStatusSuspended ApprovalStatus = "suspended"
)

// Scan implements the Scanner interface for ApprovalStatus
func (s *ApprovalStatus) Scan(value interface{}) error {
	if value == nil {
		*s = ApprovalStatusPending
		return nil
	}
	if sv, ok := value.([]byte); ok {
		*s = ApprovalStatus(sv)
	} else if sv, ok := value.(string); ok {
		*s = ApprovalStatus(sv)
	}
	return nil
}

// Value implements the driver Valuer interface for ApprovalStatus
func (s ApprovalStatus) Value() (driver.Value, error) {
	return string(s), nil
}

// Sponsor represents a sponsor/business entity
type Sponsor struct {
	ID                 uint64         `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID             uint64         `json:"user_id" gorm:"not null"`
	User               User           `json:"user" gorm:"foreignKey:UserID"`
	CompanyName        string         `json:"company_name" gorm:"not null;size:255"`
	CompanyType        string         `json:"company_type" gorm:"size:50"`
	BusinessNumber     string         `json:"business_number" gorm:"size:50"`
	RepresentativeName string         `json:"representative_name" gorm:"size:255"`
	Address            string         `json:"address" gorm:"type:text"`
	Description        string         `json:"description" gorm:"type:text"`
	WebsiteURL         string         `json:"website_url" gorm:"size:255"`
	ApprovalStatus     ApprovalStatus `json:"approval_status" gorm:"type:enum('pending','approved','rejected','suspended');default:'pending'"`
	ApprovedAt         *time.Time     `json:"approved_at"`
	MonthlyFee         float64        `json:"monthly_fee" gorm:"type:decimal(10,2);default:0"`
	StripeCustomerID   string         `json:"stripe_customer_id" gorm:"size:255"`
	CreatedAt          time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt          time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt          *time.Time     `json:"deleted_at" gorm:"index"`
}

// TableName specifies the table name for Sponsor
func (Sponsor) TableName() string {
	return "sponsors"
}

// SponsorResponse represents the sponsor response
type SponsorResponse struct {
	ID                 uint64         `json:"id"`
	UserID             uint64         `json:"user_id"`
	CompanyName        string         `json:"company_name"`
	CompanyType        string         `json:"company_type"`
	BusinessNumber     string         `json:"business_number"`
	RepresentativeName string         `json:"representative_name"`
	Address            string         `json:"address"`
	Description        string         `json:"description"`
	WebsiteURL         string         `json:"website_url"`
	ApprovalStatus     ApprovalStatus `json:"approval_status"`
	ApprovedAt         *time.Time     `json:"approved_at"`
	MonthlyFee         float64        `json:"monthly_fee"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
}

// ToResponse converts Sponsor to SponsorResponse
func (s *Sponsor) ToResponse() SponsorResponse {
	return SponsorResponse{
		ID:                 s.ID,
		UserID:             s.UserID,
		CompanyName:        s.CompanyName,
		CompanyType:        s.CompanyType,
		BusinessNumber:     s.BusinessNumber,
		RepresentativeName: s.RepresentativeName,
		Address:            s.Address,
		Description:        s.Description,
		WebsiteURL:         s.WebsiteURL,
		ApprovalStatus:     s.ApprovalStatus,
		ApprovedAt:         s.ApprovedAt,
		MonthlyFee:         s.MonthlyFee,
		CreatedAt:          s.CreatedAt,
		UpdatedAt:          s.UpdatedAt,
	}
}