ALTER TABLE users DROP INDEX idx_users_email_verification_token;
ALTER TABLE users DROP COLUMN email_verification_token;