import { z } from 'zod';

/**
 * Validation schema for invite code verification
 */
export const verifyInviteCodeSchema = z.object({
  code: z
    .string({ message: '招待コードは文字列である必要があります' })
    .trim()
    .min(1, { message: '招待コードを入力してください' }),
});

export type VerifyInviteCodeInput = z.infer<typeof verifyInviteCodeSchema>;

/**
 * Validation schema for CLIENT registration
 */
export const registerClientSchema = z.object({
  inviteCodeId: z.string().uuid({ message: '招待コードIDが無効です' }),
  firstName: z
    .string({ message: '名は文字列である必要があります' })
    .trim()
    .min(1, { message: '名を入力してください' })
    .max(50, { message: '名は50文字以内で入力してください' }),
  lastName: z
    .string({ message: '姓は文字列である必要があります' })
    .trim()
    .min(1, { message: '姓を入力してください' })
    .max(50, { message: '姓は50文字以内で入力してください' }),
  email: z
    .string({ message: 'メールアドレスは文字列である必要があります' })
    .trim()
    .email({ message: '有効なメールアドレスを入力してください' })
    .toLowerCase(),
  password: z
    .string({ message: 'パスワードは文字列である必要があります' })
    .min(8, { message: 'パスワードは8文字以上である必要があります' })
    .max(100, { message: 'パスワードは100文字以内で入力してください' })
    .regex(/[A-Za-z]/, { message: 'パスワードには少なくとも1つの英字が必要です' })
    .regex(/[0-9]/, { message: 'パスワードには少なくとも1つの数字が必要です' }),
});

export type RegisterClientInput = z.infer<typeof registerClientSchema>;

/**
 * Validation schema for SPONSOR registration
 */
export const registerSponsorSchema = z.object({
  inviteCodeId: z.string().uuid({ message: '招待コードIDが無効です' }),
  businessName: z
    .string({ message: '屋号は文字列である必要があります' })
    .trim()
    .min(1, { message: '屋号を入力してください' })
    .max(100, { message: '屋号は100文字以内で入力してください' }),
  firstName: z
    .string({ message: '担当者名(名)は文字列である必要があります' })
    .trim()
    .min(1, { message: '担当者名(名)を入力してください' })
    .max(50, { message: '担当者名(名)は50文字以内で入力してください' }),
  lastName: z
    .string({ message: '担当者名(姓)は文字列である必要があります' })
    .trim()
    .min(1, { message: '担当者名(姓)を入力してください' })
    .max(50, { message: '担当者名(姓)は50文字以内で入力してください' }),
  email: z
    .string({ message: 'メールアドレスは文字列である必要があります' })
    .trim()
    .email({ message: '有効なメールアドレスを入力してください' })
    .toLowerCase(),
  password: z
    .string({ message: 'パスワードは文字列である必要があります' })
    .min(8, { message: 'パスワードは8文字以上である必要があります' })
    .max(100, { message: 'パスワードは100文字以内で入力してください' })
    .regex(/[A-Za-z]/, { message: 'パスワードには少なくとも1つの英字が必要です' })
    .regex(/[0-9]/, { message: 'パスワードには少なくとも1つの数字が必要です' }),
  businessDescription: z
    .string()
    .trim()
    .max(1000, { message: '事業内容は1000文字以内で入力してください' })
    .optional(),
});

export type RegisterSponsorInput = z.infer<typeof registerSponsorSchema>;
