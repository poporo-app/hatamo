# HATAMOマッチングサービス データベース設計

## テーブル一覧

### 1. users (ユーザー)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password_hash (VARCHAR(255), NOT NULL)
- first_name (VARCHAR(100), NOT NULL)
- last_name (VARCHAR(100), NOT NULL)
- phone (VARCHAR(20))
- role (ENUM('user', 'sponsor', 'admin'), DEFAULT 'user')
- email_verified_at (TIMESTAMP, NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
- deleted_at (TIMESTAMP, NULL)
```

### 2. sponsors (スポンサー/事業者)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- user_id (BIGINT UNSIGNED, FOREIGN KEY -> users.id)
- company_name (VARCHAR(255), NOT NULL)
- company_type (VARCHAR(50))
- business_number (VARCHAR(50))
- representative_name (VARCHAR(255))
- address (TEXT)
- description (TEXT)
- website_url (VARCHAR(255))
- approval_status (ENUM('pending', 'approved', 'rejected', 'suspended'), DEFAULT 'pending')
- approved_at (TIMESTAMP, NULL)
- monthly_fee (DECIMAL(10,2), DEFAULT 0)
- stripe_customer_id (VARCHAR(255))
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
- deleted_at (TIMESTAMP, NULL)
```

### 3. services (サービス)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- sponsor_id (BIGINT UNSIGNED, FOREIGN KEY -> sponsors.id)
- title (VARCHAR(255), NOT NULL)
- category (VARCHAR(100), NOT NULL)
- description (TEXT)
- price_min (DECIMAL(10,2))
- price_max (DECIMAL(10,2))
- delivery_days (INT)
- is_active (BOOLEAN, DEFAULT true)
- view_count (INT, DEFAULT 0)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
- deleted_at (TIMESTAMP, NULL)
```

### 4. service_packages (サービスパッケージ)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- service_id (BIGINT UNSIGNED, FOREIGN KEY -> services.id)
- name (VARCHAR(255), NOT NULL)
- price (DECIMAL(10,2), NOT NULL)
- description (TEXT)
- delivery_days (INT)
- revision_count (INT)
- features (JSON)
- sort_order (INT, DEFAULT 0)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### 5. applications (申込)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- user_id (BIGINT UNSIGNED, FOREIGN KEY -> users.id)
- service_id (BIGINT UNSIGNED, FOREIGN KEY -> services.id)
- package_id (BIGINT UNSIGNED, FOREIGN KEY -> service_packages.id, NULL)
- sponsor_id (BIGINT UNSIGNED, FOREIGN KEY -> sponsors.id)
- status (ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'), DEFAULT 'pending')
- amount (DECIMAL(10,2), NOT NULL)
- payment_status (ENUM('pending', 'paid', 'refunded'), DEFAULT 'pending')
- stripe_payment_intent_id (VARCHAR(255))
- message (TEXT)
- completed_at (TIMESTAMP, NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### 6. messages (メッセージ)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- application_id (BIGINT UNSIGNED, FOREIGN KEY -> applications.id)
- sender_id (BIGINT UNSIGNED, FOREIGN KEY -> users.id)
- receiver_id (BIGINT UNSIGNED, FOREIGN KEY -> users.id)
- message (TEXT, NOT NULL)
- is_read (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

### 7. reviews (レビュー)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- application_id (BIGINT UNSIGNED, FOREIGN KEY -> applications.id, UNIQUE)
- service_id (BIGINT UNSIGNED, FOREIGN KEY -> services.id)
- user_id (BIGINT UNSIGNED, FOREIGN KEY -> users.id)
- rating (TINYINT, CHECK (rating >= 1 AND rating <= 5))
- comment (TEXT)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

### 8. sponsor_documents (スポンサー書類)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- sponsor_id (BIGINT UNSIGNED, FOREIGN KEY -> sponsors.id)
- document_type (VARCHAR(50), NOT NULL)
- file_name (VARCHAR(255), NOT NULL)
- file_path (VARCHAR(500), NOT NULL)
- file_size (INT)
- uploaded_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

### 9. payments (支払い履歴)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- application_id (BIGINT UNSIGNED, FOREIGN KEY -> applications.id, NULL)
- sponsor_id (BIGINT UNSIGNED, FOREIGN KEY -> sponsors.id, NULL)
- user_id (BIGINT UNSIGNED, FOREIGN KEY -> users.id)
- type (ENUM('service_payment', 'monthly_fee', 'refund'))
- amount (DECIMAL(10,2), NOT NULL)
- fee_amount (DECIMAL(10,2), DEFAULT 0)
- net_amount (DECIMAL(10,2), NOT NULL)
- stripe_charge_id (VARCHAR(255))
- status (ENUM('pending', 'completed', 'failed'), DEFAULT 'pending')
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

### 10. settlements (精算)
```sql
- id (BIGINT UNSIGNED, PRIMARY KEY, AUTO_INCREMENT)
- sponsor_id (BIGINT UNSIGNED, FOREIGN KEY -> sponsors.id)
- period_start (DATE, NOT NULL)
- period_end (DATE, NOT NULL)
- total_sales (DECIMAL(10,2), NOT NULL)
- platform_fee (DECIMAL(10,2), NOT NULL)
- transfer_amount (DECIMAL(10,2), NOT NULL)
- status (ENUM('pending', 'processing', 'completed'), DEFAULT 'pending')
- transferred_at (TIMESTAMP, NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

## インデックス設計

```sql
-- users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- sponsors
CREATE INDEX idx_sponsors_user_id ON sponsors(user_id);
CREATE INDEX idx_sponsors_approval_status ON sponsors(approval_status);

-- services
CREATE INDEX idx_services_sponsor_id ON services(sponsor_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);

-- applications
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_service_id ON applications(service_id);
CREATE INDEX idx_applications_sponsor_id ON applications(sponsor_id);
CREATE INDEX idx_applications_status ON applications(status);

-- messages
CREATE INDEX idx_messages_application_id ON messages(application_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);

-- reviews
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_sponsor_id ON payments(sponsor_id);
CREATE INDEX idx_payments_status ON payments(status);

-- settlements
CREATE INDEX idx_settlements_sponsor_id ON settlements(sponsor_id);
CREATE INDEX idx_settlements_period ON settlements(period_start, period_end);
```