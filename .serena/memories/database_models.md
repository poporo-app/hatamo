# Database Models and Relationships

## Core Models

### User
- Represents all users (clients, sponsors, admins)
- Fields: id, email, passwordHash, userType, name, profileImage, timestamps
- **UserType説明:**
  - CLIENT: サービス利用のみ可能
  - SPONSOR: サービス提供**と利用**の両方が可能（重要！）
  - ADMIN: 管理機能のみ
- Relations: services (for sponsors), bookings, messages, conversations, reviews

### Service
- Services offered by sponsors
- Fields: id, sponsorId, title, description, category, price, feeRate, isActive, imageUrl, timestamps
- Relations: sponsor (User), bookings, reviews
- **注意**: SPONSORのみがサービスを提供可能

### Booking
- Service bookings/transactions
- Fields: id, serviceId, clientId, sponsorId, status, totalPrice, feeAmount, paymentIntentId, timestamps
- **clientId**: サービス利用者（CLIENTまたはSPONSORが利用者として振る舞う場合）
- **sponsorId**: サービス提供者（必ずSPONSOR）
- Status: PENDING, ACCEPTED, PAID, IN_PROGRESS, COMPLETED, CANCELLED, REFUNDED
- Relations: service, client (User), sponsor (User), review
- **重要**: SPONSORが他のサービスを利用する際は、clientIdとして記録される

### Conversation
- Chat conversations between users
- Fields: id, clientId, sponsorId, lastMessageAt, timestamps
- **clientId**: サービス利用者（CLIENTまたはSPONSORが利用者として振る舞う場合）
- **sponsorId**: サービス提供者（必ずSPONSOR）
- Unique constraint on [clientId, sponsorId]
- Relations: client (User), sponsor (User), messages

### Message
- Individual messages in conversations
- Fields: id, conversationId, senderId, content, isRead, createdAt
- Relations: conversation, sender (User)

### Review
- Service reviews from clients
- Fields: id, bookingId, serviceId, clientId, sponsorId, rating, comment, createdAt
- One-to-one with booking
- Relations: booking, service, client (User), sponsor (User)

### InviteCode
- Invitation codes for user registration
- Fields: id, code, userType, usedBy, createdAt, usedAt
- Unique constraint on code and usedBy
- Relations: user (who used the code)

## Enums

### UserType
- CLIENT: サービス利用のみ可能
- SPONSOR: サービス提供と利用の両方が可能
- ADMIN: プラットフォーム管理者

### ServiceCategory
- IT_DEVELOPMENT
- CONSULTING
- MARKETING
- LIFESTYLE
- INVESTMENT

### FeeRate
- RATE_20: 20% commission
- RATE_30: 30% commission
- RATE_40: 40% commission
- RATE_50: 50% commission
(Plus 5% platform fee added on top)

### BookingStatus
- PENDING: Initial state
- ACCEPTED: Sponsor accepted
- PAID: Payment completed
- IN_PROGRESS: Service being delivered
- COMPLETED: Service finished
- CANCELLED: Booking cancelled
- REFUNDED: Payment refunded

## Key Relationships
1. User -> Service: One-to-many (sponsors offer multiple services)
2. Service -> Booking: One-to-many (service can have multiple bookings)
3. User -> Booking: One-to-many (both as client and sponsor)
   - **重要**: SPONSORは clientBookings と sponsorBookings の両方を持ち得る
4. Conversation -> Message: One-to-many
5. Booking -> Review: One-to-one (one review per booking)
6. InviteCode -> User: One-to-one (each code used once)

## ビジネスロジック上の重要な注意点
1. **SPONSORの二重の役割**:
   - SPONSORは自分のサービスを提供する際は `sponsorId` として振る舞う
   - SPONSORが他のサービスを利用する際は `clientId` として振る舞う
   - 同一のSPONSORユーザーが clientBookings と sponsorBookings の両方を持ち得る

2. **制約事項**:
   - SPONSORは自分自身のサービスには申し込めない（ビジネスロジックで制御）
   - CLIENTはサービスを提供できない（services リレーションは空）

3. **データベース設計の意図**:
   - clientId/sponsorId は「その取引における役割」を表す
   - User.userType は「そのユーザーが持つ権限」を表す
   - この設計により、スキーマ変更なしでSPONSORの両方の役割を実現