# HATAMOマッチングサービス - セットアップ手順

**作成日**: 2025年9月21日
**バージョン**: v3.0
**更新**: 初期セットアップ手順の詳細化

---

## 技術スタック

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript, Prisma
- **Database**: MySQL 8.0 (Docker)
- **決済**: Stripe
- **リアルタイム通信**: Socket.io

---

## セットアップ手順

### 1. プロジェクト構造作成

```bash
mkdir hatamo-matching-service
cd hatamo-matching-service
mkdir -p frontend backend admin-backend database infrastructure docs
```

### 2. Frontend (Next.js 15) セットアップ

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 必要パッケージインストール
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install zustand
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install socket.io-client

# shadcn/ui セットアップ
npx shadcn-ui@latest init --defaults
npx shadcn-ui@latest add button input label card form select textarea

cd ..
```

### 3. Backend (Node.js + Express) セットアップ

```bash
# メインバックエンド（利用者・スポンサー用）
cd backend
npm init -y

# 依存関係インストール
npm install express cors helmet morgan
npm install jsonwebtoken bcryptjs joi
npm install prisma @prisma/client
npm install stripe socket.io dotenv uuid

# 開発依存関係
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/uuid
npm install -D nodemon ts-node

# TypeScript設定
npx tsc --init
npx prisma init

cd ..

# 管理者用バックエンド
cd admin-backend
npm init -y

# 依存関係インストール
npm install express cors helmet morgan
npm install jsonwebtoken bcryptjs joi
npm install prisma @prisma/client
npm install dotenv uuid

# 開発依存関係
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/uuid
npm install -D nodemon ts-node

# TypeScript設定
npx tsc --init

cd ..
```

### 4. Docker Compose (マルチサービス構成) 作成

プロジェクトルートに以下のファイルを作成：

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # データベース
  mysql:
    image: mysql:8.0
    container_name: hatamo_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: hatamo_db
      MYSQL_USER: hatamo_user
      MYSQL_PASSWORD: hatamo_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - hatamo_network
    restart: unless-stopped

  # Redis（セッション・キャッシュ用）
  redis:
    image: redis:7-alpine
    container_name: hatamo_redis
    ports:
      - "6379:6379"
    networks:
      - hatamo_network
    restart: unless-stopped

  # メインバックエンド（利用者・スポンサー用）
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hatamo_backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://hatamo_user:hatamo_password@mysql:3306/hatamo_db
      - JWT_SECRET=your-super-secret-jwt-key
      - FRONTEND_URL=http://localhost:3000
      - ADMIN_BACKEND_URL=http://admin-backend:5001
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - hatamo_network
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  # 管理者用バックエンド
  admin-backend:
    build:
      context: ./admin-backend
      dockerfile: Dockerfile
    container_name: hatamo_admin_backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://hatamo_user:hatamo_password@mysql:3306/hatamo_db
      - JWT_SECRET=your-admin-super-secret-jwt-key
      - ADMIN_FRONTEND_URL=http://localhost:3001
      - MAIN_BACKEND_URL=http://backend:5000
    volumes:
      - ./admin-backend:/app
      - /app/node_modules
    networks:
      - hatamo_network
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  # フロントエンド（利用者・スポンサー用）
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: hatamo_frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
      - NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    networks:
      - hatamo_network
    depends_on:
      - backend
    restart: unless-stopped

  # 管理者用フロントエンド（将来的に追加予定）
  # admin-frontend:
  #   build:
  #     context: ./admin-frontend
  #     dockerfile: Dockerfile.dev
  #   container_name: hatamo_admin_frontend
  #   ports:
  #     - "3001:3000"
  #   environment:
  #     - NEXT_PUBLIC_API_URL=http://localhost:5001/api
  #   volumes:
  #     - ./admin-frontend:/app
  #     - /app/node_modules
  #     - /app/.next
  #   networks:
  #     - hatamo_network
  #   depends_on:
  #     - admin-backend

  # データベース管理ツール
  adminer:
    image: adminer
    container_name: hatamo_adminer
    ports:
      - "8080:8080"
    networks:
      - hatamo_network
    depends_on:
      - mysql
    restart: unless-stopped

  # Nginx（リバースプロキシ・ロードバランサー）
  nginx:
    image: nginx:alpine
    container_name: hatamo_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
    networks:
      - hatamo_network
    depends_on:
      - frontend
      - backend
      - admin-backend
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  hatamo_network:
    driver: bridge
```

**nginx/nginx.conf:**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream admin_backend {
        server admin-backend:5001;
    }

    upstream frontend {
        server frontend:3000;
    }

    # メインサービス
    server {
        listen 80;
        server_name localhost hatamo.local;

        # フロントエンド
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # メインAPI
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Socket.io
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # 管理者サービス
    server {
        listen 80;
        server_name admin.hatamo.local admin.localhost;

        # 管理者API
        location /api/ {
            proxy_pass http://admin_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 管理者フロントエンド（将来的に追加）
        # location / {
        #     proxy_pass http://admin_frontend;
        #     proxy_set_header Host $host;
        #     proxy_set_header X-Real-IP $remote_addr;
        #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #     proxy_set_header X-Forwarded-Proto $scheme;
        # }
    }
}
```

### 5. 環境設定ファイル作成

**backend/.env.example:**

```env
DATABASE_URL="mysql://hatamo_user:hatamo_password@localhost:3306/hatamo_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
FRONTEND_URL="http://localhost:3000"
ADMIN_BACKEND_URL="http://localhost:5001"
PORT=5000
NODE_ENV="development"
```

**admin-backend/.env.example:**

```env
DATABASE_URL="mysql://hatamo_user:hatamo_password@localhost:3306/hatamo_db"
JWT_SECRET="your-admin-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
ADMIN_FRONTEND_URL="http://localhost:3001"
MAIN_BACKEND_URL="http://localhost:5000"
PORT=5001
NODE_ENV="development"
```

**frontend/.env.local.example:**

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

### 6. Prisma スキーマ設定

**backend/prisma/schema.prisma:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  emailVerified Boolean @default(false) @map("email_verified")
  userType     UserType @map("user_type") // CLIENT: 利用のみ, SPONSOR: 提供+利用, ADMIN: 管理
  name         String
  profileImage String?  @map("profile_image")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  usedInviteCode InviteCode? @relation("InviteCodeUser")
  createdInviteCodes InviteCode[] @relation("InviteCodeCreator")
  emailVerificationTokens EmailVerificationToken[]
  sentInviteEmails InviteEmailLog[]
  services       Service[] // SPONSORのみがサービスを提供可能
  clientBookings Booking[]   @relation("ClientBookings") // CLIENT or SPONSORが利用者として申し込んだBooking
  sponsorBookings Booking[]  @relation("SponsorBookings") // SPONSORが提供者として受けたBooking
  sentMessages   Message[]   @relation("SentMessages")
  clientConversations Conversation[] @relation("ClientConversations") // 利用者側としての会話
  sponsorConversations Conversation[] @relation("SponsorConversations") // 提供者側としての会話
  clientReviews Review[] @relation("ClientReviews") // 利用者として投稿したレビュー
  sponsorReviews Review[] @relation("SponsorReviews") // 提供者として受け取ったレビュー

  @@map("users")
}

model InviteCode {
  id        String           @id @default(uuid())
  code      String           @unique
  userType  UserType         @map("user_type")
  status    InviteCodeStatus @default(ACTIVE)
  expiresAt DateTime?        @map("expires_at")
  memo      String?          @db.VarChar(500)
  usedBy    String?          @map("used_by")
  usedAt    DateTime?        @map("used_at")
  createdBy String           @map("created_by")
  createdAt DateTime         @default(now()) @map("created_at")
  updatedAt DateTime         @updatedAt @map("updated_at")

  // Relations
  user         User?             @relation("InviteCodeUser", fields: [usedBy], references: [id])
  creator      User              @relation("InviteCodeCreator", fields: [createdBy], references: [id])
  emailLogs    InviteEmailLog[]

  @@index([usedBy])
  @@index([createdBy])
  @@index([status])
  @@map("invite_codes")
}

model EmailVerificationToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("email_verification_tokens")
}

model InviteEmailLog {
  id             String          @id @default(uuid())
  inviteCodeId   String          @map("invite_code_id")
  recipientEmail String          @map("recipient_email")
  recipientName  String?         @map("recipient_name")
  sentAt         DateTime        @map("sent_at")
  sentBy         String          @map("sent_by")
  status         EmailSendStatus
  errorMessage   String?         @map("error_message") @db.Text
  emailSubject   String          @map("email_subject")
  emailBody      String          @map("email_body") @db.Text
  createdAt      DateTime        @default(now()) @map("created_at")

  // Relations
  inviteCode InviteCode @relation(fields: [inviteCodeId], references: [id], onDelete: Cascade)
  sender     User       @relation(fields: [sentBy], references: [id])

  @@index([inviteCodeId])
  @@index([sentBy])
  @@map("invite_email_logs")
}

model Service {
  id           String   @id @default(uuid())
  sponsorId    String   @map("sponsor_id")
  title        String
  description  String   @db.Text
  category     ServiceCategory
  price        Decimal  @db.Decimal(10, 2)
  feeRate      FeeRate  @map("fee_rate")
  isActive     Boolean  @default(true) @map("is_active")
  imageUrl     String?  @map("image_url")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  sponsor      User      @relation(fields: [sponsorId], references: [id])
  bookings     Booking[]
  reviews      Review[]

  @@index([sponsorId])
  @@index([category])
  @@map("services")
}

model Booking {
  id           String   @id @default(uuid())
  serviceId    String   @map("service_id")
  clientId     String   @map("client_id") // サービス利用者（CLIENT or SPONSOR）
  sponsorId    String   @map("sponsor_id") // サービス提供者（必ずSPONSOR）
  status       BookingStatus @default(PENDING)
  totalPrice   Decimal  @db.Decimal(10, 2) @map("total_price")
  feeAmount    Decimal  @db.Decimal(10, 2) @map("fee_amount")
  paymentIntentId String? @map("payment_intent_id")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  completedAt  DateTime? @map("completed_at")

  // Relations
  service      Service  @relation(fields: [serviceId], references: [id])
  client       User     @relation("ClientBookings", fields: [clientId], references: [id])
  sponsor      User     @relation("SponsorBookings", fields: [sponsorId], references: [id])
  review       Review?

  @@index([serviceId])
  @@index([clientId])
  @@index([sponsorId])
  @@index([status])
  @@map("bookings")
}

model Conversation {
  id           String   @id @default(uuid())
  clientId     String   @map("client_id") // サービス利用者（CLIENT or SPONSOR）
  sponsorId    String   @map("sponsor_id") // サービス提供者（必ずSPONSOR）
  lastMessageAt DateTime? @map("last_message_at")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  client       User      @relation("ClientConversations", fields: [clientId], references: [id])
  sponsor      User      @relation("SponsorConversations", fields: [sponsorId], references: [id])
  messages     Message[]

  @@unique([clientId, sponsorId])
  @@index([clientId])
  @@index([sponsorId])
  @@map("conversations")
}

model Message {
  id           String   @id @default(uuid())
  conversationId String @map("conversation_id")
  senderId     String   @map("sender_id")
  content      String   @db.Text
  isRead       Boolean  @default(false) @map("is_read")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  conversation Conversation @relation(fields: [conversationId], references: [id])
  sender       User         @relation("SentMessages", fields: [senderId], references: [id])

  @@index([conversationId])
  @@index([senderId])
  @@map("messages")
}

model Review {
  id           String   @id @default(uuid())
  bookingId    String   @unique @map("booking_id")
  serviceId    String   @map("service_id")
  clientId     String   @map("client_id")
  sponsorId    String   @map("sponsor_id")
  rating       Int
  comment      String?  @db.Text
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  booking      Booking  @relation(fields: [bookingId], references: [id])
  service      Service  @relation(fields: [serviceId], references: [id])
  client       User     @relation("ClientReviews", fields: [clientId], references: [id])
  sponsor      User     @relation("SponsorReviews", fields: [sponsorId], references: [id])

  @@index([serviceId])
  @@index([clientId])
  @@index([sponsorId])
  @@map("reviews")
}

enum UserType {
  CLIENT  // サービス利用のみ可能
  SPONSOR // サービス提供と利用の両方が可能
  ADMIN   // 管理機能のみ
}

enum ServiceCategory {
  IT_DEVELOPMENT
  CONSULTING
  MARKETING
  LIFESTYLE
  INVESTMENT
}

enum FeeRate {
  RATE_20
  RATE_30
  RATE_40
  RATE_50
}

enum BookingStatus {
  PENDING
  ACCEPTED
  PAID
  IN_PROGRESS
  COMPLETED
  CANCELLED
  REFUNDED
}

enum InviteCodeStatus {
  ACTIVE
  USED
  EXPIRED
  DISABLED
}

enum EmailSendStatus {
  SUCCESS
  FAILED
}
```

### 7. Backend基本構成ファイル作成

**backend/src/app.ts:**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_BACKEND_URL || "http://localhost:5001"
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'main-backend',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Main Backend Server running on port ${PORT}`);
});

export { app, io };
```

**admin-backend/src/app.ts:**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
    process.env.MAIN_BACKEND_URL || "http://localhost:5000"
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'admin-backend',
    timestamp: new Date().toISOString()
  });
});

// Admin API routes will be added here
app.get('/api/admin/stats', (req, res) => {
  res.json({ message: 'Admin stats endpoint' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Admin Backend Server running on port ${PORT}`);
});

export { app };
```

### 8. Dockerfileの作成

**backend/Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

**admin-backend/Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]
```

**frontend/Dockerfile.dev:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 9. package.json scripts設定

プロジェクトルートに **package.json:**

```json
{
  "name": "hatamo-matching-service",
  "version": "1.0.0",
  "description": "HATAMO Matching Service Platform",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:admin\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "dev:admin": "cd admin-backend && npm run dev",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build",
    "docker:logs": "docker-compose logs -f",
    "db:up": "docker-compose up -d mysql redis",
    "db:down": "docker-compose stop mysql redis",
    "db:migrate": "cd backend && npx prisma migrate dev",
    "db:generate": "cd backend && npx prisma generate",
    "db:studio": "cd backend && npx prisma studio",
    "hosts:setup": "echo '127.0.0.1 hatamo.local admin.hatamo.local' | sudo tee -a /etc/hosts"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

**backend/package.json scripts追加:**

```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

**admin-backend/package.json scripts追加:**

```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

### 10. TypeScript設定

**backend/tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**admin-backend/tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 実行完了後の次ステップ

1. **環境変数設定**: `.env.example` をコピーして `.env` を作成
2. **hosts ファイル設定**: `npm run hosts:setup` を実行
3. **データベース起動**: `npm run db:up` でMySQLとRedisを起動
4. **データベースマイグレーション**: `npm run db:migrate` を実行
5. **開発サーバー起動**: `npm run dev` で全サービスを起動
6. **ドメインアクセス確認**:
   - メインサービス: http://hatamo.local または http://localhost:3000
   - 管理者API: http://admin.hatamo.local/api または http://localhost:5001/api
   - データベース管理: http://localhost:8080

---

**関連ドキュメント**:
- [プロジェクト概要](./01-project-overview.md)
- [機能要件](./02-feature-requirements.md)
- [招待コード仕様](./03-invite-code-specification.md)
- [技術要件](./04-technical-requirements.md)
- [開発計画](./05-development-plan.md)
