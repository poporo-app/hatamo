ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255) NULL AFTER email_verified_at;
ALTER TABLE users ADD INDEX idx_users_email_verification_token (email_verification_token);