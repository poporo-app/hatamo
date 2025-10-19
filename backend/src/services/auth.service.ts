import prisma from '../utils/prisma';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors';
import { InviteCodeVerificationData, UserRegistrationData } from '../types';
import { InviteCodeStatus, UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { emailService } from './email.service';

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
  console.log(`[DEBUG] Verifying invite code: ${code}`);

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

  console.log(`[DEBUG] Found invite code:`, JSON.stringify(inviteCode, null, 2));

  // Check if invite code exists
  if (!inviteCode) {
    console.log(`[DEBUG] Code not found`);
    throw new NotFoundError('招待コードが見つかりません');
  }

  console.log(`[DEBUG] Checking status: ${inviteCode.status} === ${InviteCodeStatus.ACTIVE}`);
  // Check if status is ACTIVE
  if (inviteCode.status !== InviteCodeStatus.ACTIVE) {
    console.log(`[DEBUG] Status check failed`);
    throw new BadRequestError('この招待コードは無効です');
  }

  console.log(`[DEBUG] Checking usedBy: ${inviteCode.usedBy}`);
  // Check if already used
  if (inviteCode.usedBy !== null) {
    console.log(`[DEBUG] Already used check failed`);
    throw new BadRequestError('この招待コードは既に使用されています');
  }

  // Check if expired (only if expiresAt is set)
  if (inviteCode.expiresAt) {
    const now = new Date();
    console.log(`[DEBUG] Checking expiry: ${inviteCode.expiresAt} < ${now}`);
    if (inviteCode.expiresAt < now) {
      console.log(`[DEBUG] Expiry check failed`);
      throw new BadRequestError('招待コードの有効期限が切れています');
    }
  }

  console.log(`[DEBUG] All checks passed`);
  // Return verification data
  return {
    userType: inviteCode.userType,
    inviteCodeId: inviteCode.id,
  };
};

/**
 * Register a new CLIENT user
 * @param inviteCodeId - The invite code ID used for registration
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param email - User's email address
 * @param password - User's password (plain text, will be hashed)
 * @returns User registration data
 * @throws NotFoundError if invite code doesn't exist
 * @throws BadRequestError if invite code is invalid or wrong user type
 * @throws ConflictError if email already exists
 */
export const registerClient = async (
  inviteCodeId: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<UserRegistrationData> => {
  // Use Prisma transaction for data consistency
  return await prisma.$transaction(async (tx) => {
    // 1. Verify invite code exists and is valid
    const inviteCode = await tx.inviteCode.findUnique({
      where: { id: inviteCodeId },
      select: {
        id: true,
        userType: true,
        status: true,
        expiresAt: true,
        usedBy: true,
      },
    });

    if (!inviteCode) {
      throw new NotFoundError('招待コードが見つかりません');
    }

    if (inviteCode.status !== InviteCodeStatus.ACTIVE) {
      throw new BadRequestError('この招待コードは無効です');
    }

    if (inviteCode.usedBy !== null) {
      throw new BadRequestError('この招待コードは既に使用されています');
    }

    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      throw new BadRequestError('招待コードの有効期限が切れています');
    }

    if (inviteCode.userType !== UserType.CLIENT) {
      throw new BadRequestError('この招待コードはCLIENT用ではありません');
    }

    // 2. Check if email already exists
    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('このメールアドレスは既に登録されています');
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user
    const fullName = `${lastName} ${firstName}`;
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        userType: UserType.CLIENT,
        name: fullName,
        emailVerified: false,
      },
    });

    // 5. Update invite code
    await tx.inviteCode.update({
      where: { id: inviteCodeId },
      data: {
        usedBy: user.id,
        usedAt: new Date(),
        status: InviteCodeStatus.USED,
      },
    });

    // 6. Generate email verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    await tx.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // 7. Send verification email
    await emailService.sendVerificationEmail(email, token);

    // 8. Return registration data
    return {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      message: '登録が完了しました。確認メールを送信しましたので、メールアドレスを確認してください。',
    };
  });
};

/**
 * Register a new SPONSOR user
 * @param inviteCodeId - The invite code ID used for registration
 * @param businessName - Business/shop name
 * @param firstName - Contact person's first name
 * @param lastName - Contact person's last name
 * @param email - User's email address
 * @param password - User's password (plain text, will be hashed)
 * @param businessDescription - Optional business description
 * @returns User registration data
 * @throws NotFoundError if invite code doesn't exist
 * @throws BadRequestError if invite code is invalid or wrong user type
 * @throws ConflictError if email already exists
 */
export const registerSponsor = async (
  inviteCodeId: string,
  businessName: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  businessDescription?: string
): Promise<UserRegistrationData> => {
  // Use Prisma transaction for data consistency
  return await prisma.$transaction(async (tx) => {
    // 1. Verify invite code exists and is valid
    const inviteCode = await tx.inviteCode.findUnique({
      where: { id: inviteCodeId },
      select: {
        id: true,
        userType: true,
        status: true,
        expiresAt: true,
        usedBy: true,
      },
    });

    if (!inviteCode) {
      throw new NotFoundError('招待コードが見つかりません');
    }

    if (inviteCode.status !== InviteCodeStatus.ACTIVE) {
      throw new BadRequestError('この招待コードは無効です');
    }

    if (inviteCode.usedBy !== null) {
      throw new BadRequestError('この招待コードは既に使用されています');
    }

    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      throw new BadRequestError('招待コードの有効期限が切れています');
    }

    if (inviteCode.userType !== UserType.SPONSOR) {
      throw new BadRequestError('この招待コードはSPONSOR用ではありません');
    }

    // 2. Check if email already exists
    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('このメールアドレスは既に登録されています');
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user
    // For SPONSOR, we use businessName as the primary name and store contact person separately
    // Note: Current schema only has 'name' field, so we'll use businessName for now
    // TODO: Consider adding separate fields for businessName and contactPerson in future schema updates
    const fullContactName = `${lastName} ${firstName}`;
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        userType: UserType.SPONSOR,
        name: businessName, // Using businessName as the main name for SPONSOR
        emailVerified: false,
      },
    });

    // 5. Update invite code
    await tx.inviteCode.update({
      where: { id: inviteCodeId },
      data: {
        usedBy: user.id,
        usedAt: new Date(),
        status: InviteCodeStatus.USED,
      },
    });

    // 6. Generate email verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    await tx.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // 7. Send verification email
    await emailService.sendVerificationEmail(email, token);
    console.log(`[SPONSOR REGISTRATION] Business: ${businessName}, Contact: ${fullContactName}, Description: ${businessDescription || 'N/A'}`);

    // 8. Return registration data
    return {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      message: '登録が完了しました。確認メールを送信しましたので、メールアドレスを確認してください。',
    };
  });
};

/**
 * Verify email address using verification token
 * @param token - Email verification token
 * @returns JWT token for automatic login and user data
 * @throws NotFoundError if token doesn't exist
 * @throws BadRequestError if token is expired or already used
 */
export const verifyEmail = async (
  token: string
): Promise<{ jwtToken: string; userId: string; email: string; userType: UserType }> => {
  // Use Prisma transaction for data consistency
  return await prisma.$transaction(async (tx) => {
    // 1. Find email verification token
    const verificationToken = await tx.emailVerificationToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            userType: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!verificationToken) {
      throw new NotFoundError('無効な確認トークンです');
    }

    // 2. Check if token is expired (24 hours)
    const now = new Date();
    if (verificationToken.expiresAt < now) {
      throw new BadRequestError('確認トークンの有効期限が切れています');
    }

    // 3. Check if token is already used
    if (verificationToken.usedAt !== null) {
      throw new BadRequestError('この確認トークンは既に使用されています');
    }

    // 4. Update user's emailVerified to true
    await tx.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
      },
    });

    // 5. Mark token as used
    await tx.emailVerificationToken.update({
      where: { token },
      data: {
        usedAt: now,
      },
    });

    // 6. Generate JWT token for automatic login
    const { generateToken } = await import('../utils/jwt');
    const jwtToken = generateToken({
      userId: verificationToken.user.id,
      email: verificationToken.user.email,
      userType: verificationToken.user.userType,
      emailVerified: true,
    });

    console.log(`[EMAIL VERIFICATION] Email verified for user: ${verificationToken.user.email}`);

    // 7. Return JWT token and user data
    return {
      jwtToken,
      userId: verificationToken.user.id,
      email: verificationToken.user.email,
      userType: verificationToken.user.userType,
    };
  });
};
