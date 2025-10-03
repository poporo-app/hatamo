# Database Models and Relationships

## Core Models

### User
- Represents all users (clients, sponsors, admins)
- Fields: id, email, passwordHash, userType, name, profileImage, timestamps
- Relations: services (for sponsors), bookings, messages, conversations, reviews

### Service
- Services offered by sponsors
- Fields: id, sponsorId, title, description, category, price, feeRate, isActive, imageUrl, timestamps
- Relations: sponsor (User), bookings, reviews

### Booking
- Service bookings/transactions
- Fields: id, serviceId, clientId, sponsorId, status, totalPrice, feeAmount, paymentIntentId, timestamps
- Status: PENDING, ACCEPTED, PAID, IN_PROGRESS, COMPLETED, CANCELLED, REFUNDED
- Relations: service, client (User), sponsor (User), review

### Conversation
- Chat conversations between users
- Fields: id, clientId, sponsorId, lastMessageAt, timestamps
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
- CLIENT: Service consumer
- SPONSOR: Service provider
- ADMIN: Platform administrator

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
4. Conversation -> Message: One-to-many
5. Booking -> Review: One-to-one (one review per booking)
6. InviteCode -> User: One-to-one (each code used once)