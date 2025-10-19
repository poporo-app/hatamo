/**
 * Environment Variable Validator
 *
 * Validates that all required environment variables are set at server startup.
 * This prevents the server from starting with missing critical configuration.
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;

  // Server
  PORT?: string;
  NODE_ENV?: string;
  FRONTEND_URL: string;
  ADMIN_BACKEND_URL?: string;

  // Email
  ENABLE_EMAIL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;

  // Stripe (optional in development)
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

/**
 * Required environment variables that must be set
 */
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'FRONTEND_URL',
] as const;

/**
 * Optional environment variables with default values
 */
const OPTIONAL_ENV_VARS_WITH_DEFAULTS = {
  JWT_EXPIRES_IN: '7d',
  PORT: '5000',
  NODE_ENV: 'development',
  ENABLE_EMAIL: 'false',
  SMTP_PORT: '587',
  SMTP_SECURE: 'false',
  SMTP_FROM: 'HATAMO <noreply@hatamo.com>',
} as const;

/**
 * Validates environment variables and throws an error if required vars are missing
 * @throws {Error} If required environment variables are not set
 */
export function validateEnv(): void {
  const missingVars: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  // If any required variables are missing, throw a detailed error
  if (missingVars.length > 0) {
    const errorMessage = `
╔═══════════════════════════════════════════════════════════════════╗
║  ❌ ENVIRONMENT CONFIGURATION ERROR                               ║
╟───────────────────────────────────────────────────────────────────╢
║  Missing required environment variables:                          ║
║                                                                   ║
${missingVars.map(v => `║  - ${v.padEnd(61)}║`).join('\n')}
║                                                                   ║
║  Please add these variables to your .env file.                    ║
║  You can copy from .env.example and update the values.            ║
║                                                                   ║
║  Example:                                                         ║
║    cp .env.example .env                                           ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
    `.trim();

    throw new Error(errorMessage);
  }

  // Set default values for optional variables if not provided
  for (const [key, defaultValue] of Object.entries(OPTIONAL_ENV_VARS_WITH_DEFAULTS)) {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
    }
  }

  // Validate specific values
  validateJwtSecret();
  validateDatabaseUrl();

  console.log('✅ Environment variables validated successfully');
}

/**
 * Validates JWT_SECRET is not using the default insecure value in production
 */
function validateJwtSecret(): void {
  const jwtSecret = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (
    nodeEnv === 'production' &&
    jwtSecret === 'your-super-secret-jwt-key-change-this-in-production'
  ) {
    throw new Error(
      '⚠️  SECURITY WARNING: JWT_SECRET is using the default value in production. ' +
      'Please change it to a secure random string!'
    );
  }
}

/**
 * Validates DATABASE_URL format
 */
function validateDatabaseUrl(): void {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl?.startsWith('mysql://')) {
    throw new Error(
      '❌ DATABASE_URL must be a valid MySQL connection string (mysql://...)'
    );
  }
}

/**
 * Gets a typed environment configuration object
 */
export function getEnvConfig(): EnvConfig {
  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    ADMIN_BACKEND_URL: process.env.ADMIN_BACKEND_URL,
    ENABLE_EMAIL: process.env.ENABLE_EMAIL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };
}
