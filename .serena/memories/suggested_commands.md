# Suggested Commands for HATAMO Development

## Development Commands

### Start Development Environment
```bash
# Install all dependencies (run once)
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd admin-backend && npm install && cd ..

# Start all services concurrently
npm run dev

# Or start individual services
npm run dev:frontend     # Frontend only (Next.js)
npm run dev:backend      # Main backend only
npm run dev:admin        # Admin backend only
```

### Database Commands
```bash
# Start database services (MySQL + Redis)
npm run db:up

# Stop database services
npm run db:down

# Run Prisma migrations
npm run db:migrate

# Generate Prisma client after schema changes
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Docker Commands
```bash
# Start all services with Docker
npm run docker:up

# Stop Docker services
npm run docker:down

# Build Docker images
npm run docker:build

# View Docker logs
npm run docker:logs
```

### Code Quality Commands
```bash
# Frontend linting
cd frontend && npm run lint

# Build frontend
cd frontend && npm run build

# Build backend TypeScript
cd backend && npm run build

# Build admin backend TypeScript
cd admin-backend && npm run build
```

### Environment Setup
```bash
# Copy environment files (run once)
cp backend/.env.example backend/.env
cp admin-backend/.env.example admin-backend/.env
cp frontend/.env.local.example frontend/.env.local

# Setup local hosts file (optional, for domain access)
npm run hosts:setup
```

### Git Commands (Darwin/macOS)
```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "message"

# View logs
git log --oneline -10
```

### System Commands (Darwin/macOS specific)
```bash
# List files with details
ls -la

# Find processes using a port
lsof -i :3000

# Kill a process
kill -9 <PID>

# Search in files (macOS grep)
grep -r "pattern" .

# Find files
find . -name "*.ts"
```

### Troubleshooting Ports
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :5001  # Admin backend
lsof -i :3306  # MySQL
lsof -i :6379  # Redis
```

## Important Notes
- Always ensure environment variables are set before running services
- Run database migrations after any Prisma schema changes
- Use `npm run dev` for concurrent development of all services
- Frontend uses Turbopack for faster builds
- TypeScript compilation is required for backend services