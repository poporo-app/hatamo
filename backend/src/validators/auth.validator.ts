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
