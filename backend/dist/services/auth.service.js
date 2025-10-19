"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.registerSponsor = exports.registerClient = exports.verifyInviteCode = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("./email.service");
/**
 * Verify an invite code
 * @param code - The invite code to verify
 * @returns Invite code verification data (userType, inviteCodeId)
 * @throws NotFoundError if code doesn't exist
 * @throws BadRequestError if code is invalid, expired, or already used
 */
const verifyInviteCode = async (code) => {
    // Find the invite code in the database
    const inviteCode = await prisma_1.default.inviteCode.findUnique({
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
        throw new errors_1.NotFoundError('招待コードが見つかりません');
    }
    // Check if status is ACTIVE
    if (inviteCode.status !== client_1.InviteCodeStatus.ACTIVE) {
        throw new errors_1.BadRequestError('この招待コードは無効です');
    }
    // Check if already used
    if (inviteCode.usedBy !== null) {
        throw new errors_1.BadRequestError('この招待コードは既に使用されています');
    }
    // Check if expired (only if expiresAt is set)
    if (inviteCode.expiresAt) {
        const now = new Date();
        if (inviteCode.expiresAt < now) {
            throw new errors_1.BadRequestError('招待コードの有効期限が切れています');
        }
    }
    // Return verification data
    return {
        userType: inviteCode.userType,
        inviteCodeId: inviteCode.id,
    };
};
exports.verifyInviteCode = verifyInviteCode;
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
const registerClient = async (inviteCodeId, firstName, lastName, email, password) => {
    // Use Prisma transaction for data consistency
    return await prisma_1.default.$transaction(async (tx) => {
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
            throw new errors_1.NotFoundError('招待コードが見つかりません');
        }
        if (inviteCode.status !== client_1.InviteCodeStatus.ACTIVE) {
            throw new errors_1.BadRequestError('この招待コードは無効です');
        }
        if (inviteCode.usedBy !== null) {
            throw new errors_1.BadRequestError('この招待コードは既に使用されています');
        }
        if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
            throw new errors_1.BadRequestError('招待コードの有効期限が切れています');
        }
        if (inviteCode.userType !== client_1.UserType.CLIENT) {
            throw new errors_1.BadRequestError('この招待コードはCLIENT用ではありません');
        }
        // 2. Check if email already exists
        const existingUser = await tx.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('このメールアドレスは既に登録されています');
        }
        // 3. Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // 4. Create user
        const fullName = `${lastName} ${firstName}`;
        const user = await tx.user.create({
            data: {
                email,
                passwordHash,
                userType: client_1.UserType.CLIENT,
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
                status: client_1.InviteCodeStatus.USED,
            },
        });
        // 6. Generate email verification token
        const token = crypto_1.default.randomBytes(32).toString('hex');
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
        await email_service_1.emailService.sendVerificationEmail(email, token);
        // 8. Return registration data
        return {
            userId: user.id,
            email: user.email,
            userType: user.userType,
            message: '登録が完了しました。確認メールを送信しましたので、メールアドレスを確認してください。',
        };
    });
};
exports.registerClient = registerClient;
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
const registerSponsor = async (inviteCodeId, businessName, firstName, lastName, email, password, businessDescription) => {
    // Use Prisma transaction for data consistency
    return await prisma_1.default.$transaction(async (tx) => {
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
            throw new errors_1.NotFoundError('招待コードが見つかりません');
        }
        if (inviteCode.status !== client_1.InviteCodeStatus.ACTIVE) {
            throw new errors_1.BadRequestError('この招待コードは無効です');
        }
        if (inviteCode.usedBy !== null) {
            throw new errors_1.BadRequestError('この招待コードは既に使用されています');
        }
        if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
            throw new errors_1.BadRequestError('招待コードの有効期限が切れています');
        }
        if (inviteCode.userType !== client_1.UserType.SPONSOR) {
            throw new errors_1.BadRequestError('この招待コードはSPONSOR用ではありません');
        }
        // 2. Check if email already exists
        const existingUser = await tx.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('このメールアドレスは既に登録されています');
        }
        // 3. Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // 4. Create user
        // For SPONSOR, we use businessName as the primary name and store contact person separately
        // Note: Current schema only has 'name' field, so we'll use businessName for now
        // TODO: Consider adding separate fields for businessName and contactPerson in future schema updates
        const fullContactName = `${lastName} ${firstName}`;
        const user = await tx.user.create({
            data: {
                email,
                passwordHash,
                userType: client_1.UserType.SPONSOR,
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
                status: client_1.InviteCodeStatus.USED,
            },
        });
        // 6. Generate email verification token
        const token = crypto_1.default.randomBytes(32).toString('hex');
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
        await email_service_1.emailService.sendVerificationEmail(email, token);
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
exports.registerSponsor = registerSponsor;
/**
 * Verify email address using verification token
 * @param token - Email verification token
 * @returns JWT token for automatic login and user data
 * @throws NotFoundError if token doesn't exist
 * @throws BadRequestError if token is expired or already used
 */
const verifyEmail = async (token) => {
    // Use Prisma transaction for data consistency
    return await prisma_1.default.$transaction(async (tx) => {
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
            throw new errors_1.NotFoundError('無効な確認トークンです');
        }
        // 2. Check if token is expired (24 hours)
        const now = new Date();
        if (verificationToken.expiresAt < now) {
            throw new errors_1.BadRequestError('確認トークンの有効期限が切れています');
        }
        // 3. Check if token is already used
        if (verificationToken.usedAt !== null) {
            throw new errors_1.BadRequestError('この確認トークンは既に使用されています');
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
        const { generateToken } = await Promise.resolve().then(() => __importStar(require('../utils/jwt')));
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
exports.verifyEmail = verifyEmail;
