-- Update businesses table for complete business registration
ALTER TABLE businesses
ADD COLUMN company_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN location VARCHAR(255) DEFAULT NULL,
ADD COLUMN phone VARCHAR(20) DEFAULT NULL,
ADD COLUMN representative_name VARCHAR(255) DEFAULT NULL,
ADD COLUMN capital INT DEFAULT NULL,
ADD COLUMN categories JSON DEFAULT NULL,
ADD COLUMN registration_status ENUM('pending', 'document_upload', 'under_review', 'approved', 'rejected') DEFAULT 'pending',
ADD COLUMN documents JSON DEFAULT NULL;

-- Add indexes for better performance
CREATE INDEX idx_businesses_registration_status ON businesses(registration_status);