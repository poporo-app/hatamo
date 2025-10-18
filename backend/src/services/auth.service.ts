import prisma from '../utils/prisma';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { InviteCodeVerificationData } from '../types';
import { InviteCodeStatus } from '@prisma/client';

/**
 * Verify an invite code
 * @param code - The invite code to verify
 * @returns Invite code verification data (userType, inviteCodeId)
 * @throws NotFoundError if code doesn't exist
 * @throws BadRequestError if code is invalid, expired, or already used
 */
export const verifyInviteCode = async (
  code: string
): Promise<InviteCodeVerificationData> => {
  // Find the invite code in the database
  const inviteCode = await prisma.inviteCode.findUnique({
    where: { code },
    select: {
      id: true,
      userType: true,
      status: true,
      expiresAt: true,
      usedBy: true,
    },
  });

  // Check if invite code exists
  if (!inviteCode) {
    throw new NotFoundError('招待コードが見つかりません');
  }

  // Check if status is ACTIVE
  if (inviteCode.status !== InviteCodeStatus.ACTIVE) {
    throw new BadRequestError('この招待コードは無効です');
  }

  // Check if already used
  if (inviteCode.usedBy !== null) {
    throw new BadRequestError('この招待コードは既に使用されています');
  }

  // Check if expired (only if expiresAt is set)
  if (inviteCode.expiresAt) {
    const now = new Date();
    if (inviteCode.expiresAt < now) {
      throw new BadRequestError('招待コードの有効期限が切れています');
    }
  }

  // Return verification data
  return {
    userType: inviteCode.userType,
    inviteCodeId: inviteCode.id,
  };
};
