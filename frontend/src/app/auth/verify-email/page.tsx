'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const token = searchParams.get('token') || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !token) {
      if (mounted && !token) {
        setVerificationStatus('error');
        setErrorMessage('トークンが見つかりません');
        setIsVerifying(false);
      }
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'メール認証に失敗しました');
        }

        const responseData = await response.json();

        // 認証成功
        setVerificationStatus('success');

        // JWTトークンをCookieに保存（ブラウザが自動的に処理）
        // バックエンドが Set-Cookie ヘッダーで設定

        // 2秒後にトップページにリダイレクト
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (err) {
        setVerificationStatus('error');
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('メール認証に失敗しました');
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [mounted, token, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(145.86deg, rgb(248, 250, 252) 0%, rgb(239, 246, 255) 50%, rgb(248, 250, 252) 100%)'
      }}
    >
      <div className="w-full max-w-[448px] px-4">
        <div className="bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-10 relative">
          {/* ロゴ */}
          <div className="flex justify-center mb-10">
            <div className="relative w-[50px] h-[48px]">
              <Image
                src="/hatamo-logo.png"
                alt="HATAMO"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* ローディング中 */}
          {verificationStatus === 'loading' && (
            <>
              <div className="flex justify-center mb-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              </div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
                  メールアドレスを確認中...
                </h1>
                <p className="text-base text-[#45556c]">
                  しばらくお待ちください
                </p>
              </div>
            </>
          )}

          {/* 成功 */}
          {verificationStatus === 'success' && (
            <>
              <div className="flex justify-center mb-8">
                <div className="bg-green-100 rounded-full w-[80px] h-[80px] flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                  </svg>
                </div>
              </div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
                  メールアドレスの確認完了
                </h1>
                <p className="text-base text-[#45556c]">
                  ありがとうございます
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  メールアドレスの確認が完了しました。自動的にログインしてトップページに移動します。
                </p>
              </div>
            </>
          )}

          {/* エラー */}
          {verificationStatus === 'error' && (
            <>
              <div className="flex justify-center mb-8">
                <div className="bg-red-100 rounded-full w-[80px] h-[80px] flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                  </svg>
                </div>
              </div>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
                  メール認証に失敗しました
                </h1>
                <p className="text-base text-[#45556c]">
                  リンクが無効または期限切れです
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 mb-2">
                  エラーの詳細:
                </p>
                <p className="text-sm text-red-800">
                  {errorMessage || '不明なエラーが発生しました'}
                </p>
              </div>

              <div className="bg-amber-100 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-amber-800 mb-1">
                  考えられる原因:
                </p>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• 確認リンクの有効期限が切れています（24時間）</li>
                  <li>• 確認リンクが既に使用されています</li>
                  <li>• 確認リンクが正しくコピーされていません</li>
                </ul>
              </div>

              {/* または区切り線 */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-[#62748e]">次のステップ</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/auth/register/complete"
                  className="block w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  確認メールを再送信
                </Link>
                <Link
                  href="/auth/login"
                  className="block w-full h-12 bg-slate-50 border border-[#cad5e2] text-[#314158] text-sm font-medium rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center"
                >
                  ログイン画面に戻る
                </Link>
              </div>
            </>
          )}
        </div>

        {/* フッターコピーライト */}
        <p className="text-sm text-center text-[#62748e] mt-8">
          © 2025 HATAMO. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
