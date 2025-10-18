import { Request } from 'express';
import { UserType } from '@prisma/client';

// Extended Request type for authenticated routes
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    userType: UserType;
    emailVerified: boolean;
  };
}

// Standard API Response Types
export interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
}

// Invite Code Verification Response
export interface InviteCodeVerificationData {
  userType: UserType;
  inviteCodeId: string;
}
