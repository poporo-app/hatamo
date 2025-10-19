"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSponsorSchema = exports.registerClientSchema = exports.verifyInviteCodeSchema = void 0;
const zod_1 = require("zod");
/**
 * Validation schema for invite code verification
 */
exports.verifyInviteCodeSchema = zod_1.z.object({
    code: zod_1.z
        .string({ message: '招待コードは文字列である必要があります' })
        .trim()
        .min(1, { message: '招待コードを入力してください' }),
});
/**
 * Validation schema for CLIENT registration
 */
exports.registerClientSchema = zod_1.z.object({
    inviteCodeId: zod_1.z.string().uuid({ message: '招待コードIDが無効です' }),
    firstName: zod_1.z
        .string({ message: '名は文字列である必要があります' })
        .trim()
        .min(1, { message: '名を入力してください' })
        .max(50, { message: '名は50文字以内で入力してください' }),
    lastName: zod_1.z
        .string({ message: '姓は文字列である必要があります' })
        .trim()
        .min(1, { message: '姓を入力してください' })
        .max(50, { message: '姓は50文字以内で入力してください' }),
    email: zod_1.z
        .string({ message: 'メールアドレスは文字列である必要があります' })
        .trim()
        .email({ message: '有効なメールアドレスを入力してください' })
        .toLowerCase(),
    password: zod_1.z
        .string({ message: 'パスワードは文字列である必要があります' })
        .min(8, { message: 'パスワードは8文字以上である必要があります' })
        .max(100, { message: 'パスワードは100文字以内で入力してください' })
        .regex(/[A-Za-z]/, { message: 'パスワードには少なくとも1つの英字が必要です' })
        .regex(/[0-9]/, { message: 'パスワードには少なくとも1つの数字が必要です' }),
});
/**
 * Validation schema for SPONSOR registration
 */
exports.registerSponsorSchema = zod_1.z.object({
    inviteCodeId: zod_1.z.string().uuid({ message: '招待コードIDが無効です' }),
    businessName: zod_1.z
        .string({ message: '屋号は文字列である必要があります' })
        .trim()
        .min(1, { message: '屋号を入力してください' })
        .max(100, { message: '屋号は100文字以内で入力してください' }),
    firstName: zod_1.z
        .string({ message: '担当者名(名)は文字列である必要があります' })
        .trim()
        .min(1, { message: '担当者名(名)を入力してください' })
        .max(50, { message: '担当者名(名)は50文字以内で入力してください' }),
    lastName: zod_1.z
        .string({ message: '担当者名(姓)は文字列である必要があります' })
        .trim()
        .min(1, { message: '担当者名(姓)を入力してください' })
        .max(50, { message: '担当者名(姓)は50文字以内で入力してください' }),
    email: zod_1.z
        .string({ message: 'メールアドレスは文字列である必要があります' })
        .trim()
        .email({ message: '有効なメールアドレスを入力してください' })
        .toLowerCase(),
    password: zod_1.z
        .string({ message: 'パスワードは文字列である必要があります' })
        .min(8, { message: 'パスワードは8文字以上である必要があります' })
        .max(100, { message: 'パスワードは100文字以内で入力してください' })
        .regex(/[A-Za-z]/, { message: 'パスワードには少なくとも1つの英字が必要です' })
        .regex(/[0-9]/, { message: 'パスワードには少なくとも1つの数字が必要です' }),
    businessDescription: zod_1.z
        .string()
        .trim()
        .max(1000, { message: '事業内容は1000文字以内で入力してください' })
        .optional(),
});
