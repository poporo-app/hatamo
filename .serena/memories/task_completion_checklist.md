# Task Completion Checklist

## After Writing Code

### 1. TypeScript Compilation Check
```bash
# For backend services
cd backend && npm run build
cd admin-backend && npm run build

# For frontend (automatic with Next.js dev server)
cd frontend && npm run build
```

### 2. Linting
```bash
# Frontend has ESLint configured
cd frontend && npm run lint

# Backend services don't have linting configured yet
# Consider adding ESLint configuration for backend
```

### 3. Database Changes
If you modified Prisma schema:
```bash
# Generate migration
cd backend && npx prisma migrate dev --name descriptive_name

# Update Prisma client
cd backend && npx prisma generate

# Verify with Prisma Studio
npm run db:studio
```

### 4. Environment Variables
- Check if new environment variables were added
- Update `.env.example` files with new variables
- Document any new required configuration in README

### 5. Testing Services
```bash
# Test all services are running
npm run dev

# Check health endpoints
curl http://localhost:5000/health
curl http://localhost:5001/health

# Check frontend is accessible
open http://localhost:3000
```

### 6. Docker Validation (if Docker files changed)
```bash
# Build Docker images
npm run docker:build

# Test Docker Compose setup
npm run docker:up
npm run docker:logs
```

## Before Committing

### Pre-commit Checklist
- [ ] TypeScript compiles without errors
- [ ] No ESLint errors (frontend)
- [ ] Database migrations are created and tested
- [ ] Environment variables are documented
- [ ] Services start successfully
- [ ] Health checks pass
- [ ] No hardcoded secrets or credentials
- [ ] README updated if needed

### Common Issues to Check
1. **Import paths**: Ensure all imports resolve correctly
2. **Async/await**: Check for unhandled promise rejections
3. **Type safety**: No implicit any types
4. **Environment variables**: All required vars have defaults or error handling
5. **Database queries**: Prisma queries are properly typed
6. **API endpoints**: Return appropriate status codes
7. **Error handling**: Try-catch blocks where needed

## Testing Recommendations (Not Yet Implemented)
Consider adding:
- Jest for unit testing
- Supertest for API testing
- React Testing Library for component testing
- Playwright for E2E testing

## Documentation Updates
Update when:
- New API endpoints are added
- Database schema changes
- New environment variables added
- Development workflow changes
- Dependencies are added/updated