# Project Structure

```
hatamo/
├── frontend/              # Next.js user-facing application
│   ├── src/              # Source code
│   │   ├── app/         # App Router pages and layouts
│   │   ├── components/  # React components including shadcn/ui
│   │   └── lib/         # Utilities and configurations
│   ├── public/          # Static assets
│   └── Dockerfile.dev   # Development Docker configuration
│
├── backend/              # Main API backend (users & sponsors)
│   ├── src/             # TypeScript source code
│   │   └── app.ts      # Main application entry point
│   ├── prisma/          # Database schema and migrations
│   │   └── schema.prisma
│   ├── dist/            # Compiled JavaScript (generated)
│   └── Dockerfile       # Production Docker configuration
│
├── admin-backend/        # Administrative API backend
│   ├── src/            # TypeScript source code
│   │   └── app.ts     # Admin application entry point
│   ├── dist/           # Compiled JavaScript (generated)
│   └── Dockerfile      # Production Docker configuration
│
├── nginx/               # Nginx reverse proxy configuration
│   ├── nginx.conf      # Main Nginx configuration
│   └── conf.d/         # Additional configurations
│
├── database/            # Database-related files (empty for now)
├── infrastructure/      # Infrastructure configurations (empty for now)
├── docs/               # Documentation (empty for now)
│
├── docker-compose.yml   # Multi-service orchestration
├── package.json        # Root package with convenience scripts
├── README.md           # Project documentation
└── CLAUDE.md           # Detailed requirements and setup instructions
```

## Key Endpoints
- Frontend: http://localhost:3000
- Main API: http://localhost:5000
- Admin API: http://localhost:5001
- Database Admin: http://localhost:8080
- With hosts setup: http://hatamo.local, http://admin.hatamo.local