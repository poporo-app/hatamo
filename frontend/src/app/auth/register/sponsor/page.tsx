'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';

// バリデーションスキーマ
const sponsorRegisterSchema = z.object({
  companyName: z.string().min(1, '屋号を入力してください'),
  contactLastName: z.string().min(1, '担当者の姓を入力してください'),
  contactFirstName: z.string().min(1, '担当者の名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  passwordConfirm: z.string(),
  businessDescription: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: '利用規約に同意してください',
  }),
  agreePrivacy: z.boolean().refine(val => val === true, {
    message: 'プライバシーポリシーに同意してください',
  }),
  isRobot: z.boolean().refine(val => val === true, {
    message: '「私はロボットではありません」にチェックを入れてください',
  }),
}).refine(data => data.password === data.passwordConfirm, {
  message: 'パスワードが一致しません',
  path: ['passwordConfirm'],
});

type SponsorRegisterFormData = z.infer<typeof sponsorRegisterSchema>;

function SponsorRegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteCodeId = searchParams.get('inviteCodeId') || '';

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SponsorRegisterFormData>({
    resolver: zodResolver(sponsorRegisterSchema),
    defaultValues: {
      companyName: '',
      contactLastName: '',
      contactFirstName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      businessDescription: '',
      agreeTerms: false,
      agreePrivacy: false,
      isRobot: false,
    },
  });

  // クライアントサイドマウント検知
  useEffect(() => {
    setMounted(true);
  }, []);

  // アクセス制御: 招待コード未検証の場合はリダイレクト
  useEffect(() => {
    if (mounted && !inviteCodeId) {
      router.push('/auth/register/invite-code');
    }
  }, [mounted, inviteCodeId, router]);

  const onSubmit = async (data: SponsorRegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/sponsor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCodeId: inviteCodeId,
          businessName: data.companyName,
          lastName: data.contactLastName,
          firstName: data.contactFirstName,
          email: data.email,
          password: data.password,
          businessDescription: data.businessDescription || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '登録に失敗しました');
      }

      // 登録完了ページへリダイレクト
      router.push(`/auth/register/complete?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('登録に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(145.86deg, rgb(248, 250, 252) 0%, rgb(239, 246, 255) 50%, rgb(248, 250, 252) 100%)'
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!inviteCodeId) {
    return null; // リダイレクト中
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(145.86deg, rgb(248, 250, 252) 0%, rgb(239, 246, 255) 50%, rgb(248, 250, 252) 100%)'
      }}
    >
      <div className="w-full max-w-[672px] px-4 py-8">
        <div className="bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-10 relative">
          {/* ロゴ */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[50px] h-[48px]">
              <Image
                src="/hatamo-logo.png"
                alt="HATAMO"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* タイトル・サブタイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
              新規登録
            </h1>
            <p className="text-base text-[#45556c]">
              基本情報を入力してください
            </p>
          </div>

          {/* 招待コード表示（緑色のボックス） */}
          <div className="bg-green-100 rounded-lg px-4 py-4 mb-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-green-800" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
              <path stroke="currentColor" strokeWidth="2" d="M6 10l3 3 5-5" />
            </svg>
            <p className="text-sm text-green-800">
              招待コード: <span className="font-normal">確認済み</span> ✓
            </p>
          </div>

          {/* 登録タイプ表示（青色のボックス） */}
          <div className="bg-blue-100 rounded-lg px-4 py-4 mb-6">
            <p className="text-sm text-blue-800">
              登録タイプ: <span className="font-medium">スポンサー（SPONSOR）</span>
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 屋号 */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                屋号（店舗名・企業名）
                <span className="text-red-800">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="株式会社〇〇"
                {...register('companyName')}
                className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.companyName && (
                <p className="text-xs text-red-600 mt-1">{errors.companyName.message}</p>
              )}
            </div>

            {/* 担当者名（姓・名） */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#314158] flex items-center gap-1">
                担当者名
                <span className="text-red-800">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="姓"
                    {...register('contactLastName')}
                    className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  {errors.contactLastName && (
                    <p className="text-xs text-red-600 mt-1">{errors.contactLastName.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="名"
                    {...register('contactFirstName')}
                    className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  {errors.contactFirstName && (
                    <p className="text-xs text-red-600 mt-1">{errors.contactFirstName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* メールアドレス */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                メールアドレス
                <span className="text-red-800">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@hatamo.com"
                {...register('email')}
                className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* パスワード */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                パスワード
                <span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8文字以上で入力してください"
                  {...register('password')}
                  className="w-full h-12 px-3 pr-10 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 2l12 12" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* パスワード（確認用） */}
            <div className="space-y-2">
              <label htmlFor="passwordConfirm" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                パスワード（確認用）
                <span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="パスワードを再入力してください"
                  {...register('passwordConfirm')}
                  className="w-full h-12 px-3 pr-10 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswordConfirm ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 2l12 12" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="text-xs text-red-600 mt-1">{errors.passwordConfirm.message}</p>
              )}
            </div>

            {/* 事業内容（任意） */}
            <div className="space-y-2">
              <label htmlFor="businessDescription" className="text-sm font-medium text-[#314158]">
                事業内容（任意）
              </label>
              <textarea
                id="businessDescription"
                placeholder="事業内容を入力してください"
                {...register('businessDescription')}
                rows={4}
                className="w-full px-3 py-2 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={isLoading}
              />
              {errors.businessDescription && (
                <p className="text-xs text-red-600 mt-1">{errors.businessDescription.message}</p>
              )}
            </div>

            {/* 利用規約・プライバシーポリシー同意 */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="mt-1 w-4 h-4 border-slate-200 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-[#314158]">
                  <Link href="/terms" className="text-blue-500 hover:underline">
                    利用規約
                  </Link>
                  に同意する
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-600">{errors.agreeTerms.message}</p>
              )}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreePrivacy')}
                  className="mt-1 w-4 h-4 border-slate-200 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-[#314158]">
                  <Link href="/privacy" className="text-blue-500 hover:underline">
                    プライバシーポリシー
                  </Link>
                  に同意する
                </span>
              </label>
              {errors.agreePrivacy && (
                <p className="text-xs text-red-600">{errors.agreePrivacy.message}</p>
              )}
            </div>

            {/* reCAPTCHA風 */}
            <div className="bg-slate-50 border-2 border-[#cad5e2] rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isRobot')}
                  className="w-6 h-6 border-2 border-[#cad5e2] rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-[#314158]">
                  私はロボットではありません
                </span>
              </label>
              {errors.isRobot && (
                <p className="text-xs text-red-600 mt-2">{errors.isRobot.message}</p>
              )}
            </div>

            {/* 登録ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '登録中...' : '登録する'}
            </button>
          </form>

          {/* または区切り線 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-[#62748e]">または</span>
            </div>
          </div>

          {/* ログインリンク */}
          <p className="text-base text-center text-[#45556c]">
            既にアカウントをお持ちの方は{' '}
            <Link href="/auth/login" className="text-blue-500 font-medium hover:underline">
              ログイン
            </Link>
          </p>
        </div>

        {/* フッターコピーライト */}
        <p className="text-sm text-center text-[#62748e] mt-8">
          © 2025 HATAMO. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function SponsorRegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SponsorRegisterForm />
    </Suspense>
  );
}
