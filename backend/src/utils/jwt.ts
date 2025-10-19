import jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

/**
 * JWT Utility Functions
 *
 * Handles JWT token generation and verification for authentication
 */

export interface JWTPayload {
  userId: string;
  email: string;
  userType: UserType;
  emailVerified: boolean;
}

export interface DecodedToken extends JWTPayload {
  iat: number;
  exp: number;
}

/**
 * Generate JWT token for authenticated user
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // This should never happen if envValidator ran at startup
    console.error('CRITICAL ERROR: JWT_SECRET is missing at runtime!');
    throw new Error(
      'JWT_SECRET is not defined in environment variables. ' +
      'Please add JWT_SECRET to your .env file and restart the server.'
    );
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string): DecodedToken => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // This should never happen if envValidator ran at startup
    console.error('CRITICAL ERROR: JWT_SECRET is missing at runtime!');
    throw new Error(
      'JWT_SECRET is not defined in environment variables. ' +
      'Please add JWT_SECRET to your .env file and restart the server.'
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('トークンの有効期限が切れています');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('無効なトークンです');
    }
    throw error;
  }
};
