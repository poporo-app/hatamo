# Technology Stack

## Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI based)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Payment**: Stripe (stripe-js, react-stripe-js)
- **Real-time**: Socket.io Client
- **Development**: Turbopack

## Backend (Node.js + Express)
- **Runtime**: Node.js 18
- **Framework**: Express.js v5
- **Language**: TypeScript
- **ORM**: Prisma v6
- **Database**: MySQL 8.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Real-time**: Socket.io
- **Payment**: Stripe API
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Admin Backend
- Same stack as main backend but separate service
- No Socket.io integration
- Focused on administrative APIs

## Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx Alpine
- **Database Admin**: Adminer
- **Cache**: Redis 7 Alpine
- **Development**: Concurrently for running multiple services