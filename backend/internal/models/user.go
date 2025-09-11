package models

import (
	"database/sql/driver"
	"time"
)

type UserRole string

const (
	UserRoleUser    UserRole = "user"
	UserRoleSponsor UserRole = "sponsor"
	UserRoleAdmin   UserRole = "admin"
)

func (ur *UserRole) Scan(value interface{}) error {
	if value == nil {
		*ur = UserRoleUser
		return nil
	}
	switch s := value.(type) {
	case string:
		*ur = UserRole(s)
	case []byte:
		*ur = UserRole(s)
	}
	return nil
}

func (ur UserRole) Value() (driver.Value, error) {
	return string(ur), nil
}

type User struct {
	ID                     uint64     `json:"id" gorm:"primaryKey;autoIncrement"`
	Email                  string     `json:"email" gorm:"uniqueIndex;not null;size:255"`
	PasswordHash           string     `json:"-" gorm:"not null;size:255"`
	FirstName              string     `json:"first_name" gorm:"not null;size:100"`
	LastName               string     `json:"last_name" gorm:"not null;size:100"`
	FirstNameKana          string     `json:"first_name_kana" gorm:"size:100"`
	LastNameKana           string     `json:"last_name_kana" gorm:"size:100"`
	Phone                  *string    `json:"phone" gorm:"size:20"`
	Role                   UserRole   `json:"role" gorm:"type:enum('user','sponsor','admin');default:'user'"`
	EmailVerifiedAt        *time.Time `json:"email_verified_at" gorm:"index"`
	EmailVerificationToken *string    `json:"-" gorm:"size:255;index"`
	LastLoginAt            *time.Time `json:"last_login_at"`
	CreatedAt              time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt              time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt              *time.Time `json:"deleted_at" gorm:"index"`
}

type CreateUserRequest struct {
	Email         string `json:"email" binding:"required,email"`
	Password      string `json:"password" binding:"required,min=8"`
	FirstName     string `json:"first_name" binding:"required,min=1,max=100"`
	LastName      string `json:"last_name" binding:"required,min=1,max=100"`
	FirstNameKana string `json:"first_name_kana" binding:"omitempty,max=100"`
	LastNameKana  string `json:"last_name_kana" binding:"omitempty,max=100"`
	Phone         string `json:"phone" binding:"omitempty,min=10,max=20"`
}

type UserResponse struct {
	ID              uint64     `json:"id"`
	Email           string     `json:"email"`
	FirstName       string     `json:"first_name"`
	LastName        string     `json:"last_name"`
	FirstNameKana   string     `json:"first_name_kana"`
	LastNameKana    string     `json:"last_name_kana"`
	Phone           *string    `json:"phone"`
	Role            UserRole   `json:"role"`
	EmailVerifiedAt *time.Time `json:"email_verified_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:              u.ID,
		Email:           u.Email,
		FirstName:       u.FirstName,
		LastName:        u.LastName,
		FirstNameKana:   u.FirstNameKana,
		LastNameKana:    u.LastNameKana,
		Phone:           u.Phone,
		Role:            u.Role,
		EmailVerifiedAt: u.EmailVerifiedAt,
		CreatedAt:       u.CreatedAt,
		UpdatedAt:       u.UpdatedAt,
	}
}

func (u *User) IsEmailVerified() bool {
	return u.EmailVerifiedAt != nil
}