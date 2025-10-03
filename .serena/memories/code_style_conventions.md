# Code Style and Conventions

## TypeScript Conventions

### General Rules
- Use TypeScript strict mode (enabled in all tsconfig.json files)
- Target ES2020 for backend services
- Use ESM imports/exports in frontend, CommonJS in backend
- Enable esModuleInterop for better compatibility

### Frontend (Next.js)
- Use App Router conventions (app directory)
- Components in `src/components/`
- Utilities in `src/lib/`
- Import alias: `@/*` maps to `src/*`
- Use `.tsx` for React components, `.ts` for utilities
- Follow Next.js 15 naming conventions for pages and layouts

### Backend Services
- Source files in `src/` directory
- Compiled output in `dist/` directory
- Use async/await over callbacks
- Express middleware pattern
- Environment variables via dotenv

## Naming Conventions

### Files and Directories
- **Frontend Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Frontend Pages**: kebab-case directories in app router
- **Backend Files**: kebab-case (e.g., `user-controller.ts`)
- **Database Models**: PascalCase in Prisma schema

### Variables and Functions
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for environment variables
- **Functions**: camelCase
- **Classes**: PascalCase
- **Interfaces/Types**: PascalCase with `I` or `T` prefix optional

## Database Conventions (Prisma)

### Schema Design
- Table names: snake_case plural (mapped with @@map)
- Column names: camelCase in model, snake_case in database (mapped with @map)
- Relations: explicit naming with @relation
- Indexes: Add for foreign keys and frequently queried fields

### Enums
- UPPER_SNAKE_CASE for enum values
- PascalCase for enum type names

Example:
```prisma
enum UserType {
  CLIENT
  SPONSOR
  ADMIN
}
```

## Component Structure (Frontend)

### shadcn/ui Components
- Located in `src/components/ui/`
- Follow shadcn/ui patterns with Radix UI primitives
- Use class-variance-authority for variants
- Tailwind CSS for styling

### Form Handling
- React Hook Form for form state
- Zod for validation schemas
- Type-safe form handling

## API Conventions

### REST Endpoints
- RESTful naming: `/api/resource` (plural)
- HTTP methods: GET, POST, PUT, DELETE
- JSON request/response bodies
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

### Error Handling
- Consistent error response format
- Use try-catch blocks
- Log errors with Morgan
- Return appropriate HTTP status codes

## Security Patterns
- JWT for authentication
- bcryptjs for password hashing
- Helmet for security headers
- CORS configuration for cross-origin requests
- Environment variables for sensitive data
- Never commit .env files

## Linting and Formatting
- ESLint configuration extends Next.js defaults
- TypeScript ESLint parser
- Core Web Vitals rules for frontend
- No explicit Prettier configuration (using defaults)