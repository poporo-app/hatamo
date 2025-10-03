# HATAMO Project Overview

## Project Purpose
HATAMO is a closed-community member matching platform designed for service requests and provision within an existing community. It's an invitation-only platform with a fee-based business model.

## Main Features
- Service browsing and search by category
- Messaging between users and sponsors
- Stripe payment integration
- Review and rating system
- Manual matching by sponsors
- Real-time communication via Socket.io

## Architecture
- **Frontend**: User-facing Next.js application
- **Backend**: Main backend API for users and sponsors
- **Admin-backend**: Separate backend for administrative functions
- **Database**: MySQL 8.0 with Prisma ORM
- **Cache**: Redis for sessions and caching
- **Reverse Proxy**: Nginx for routing and load balancing

## Service Categories
- IT Development
- Consulting
- Marketing
- Lifestyle
- Investment

## Fee Structure
Sponsors can choose from 20%/30%/40%/50% commission rates plus 5% platform fee.