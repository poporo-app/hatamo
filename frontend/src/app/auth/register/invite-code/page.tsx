'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function InviteCodePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'CLIENT' | 'SPONSOR' | null>(null);

  const validateInviteCode = (code: string): boolean => {
    // 英数字8文字のバリデーション
    const regex = /^[A-Z0-9]{8}$/i;
    return regex.test(code);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // 自動的に大文字に変換、英数字のみ
    if (value.length <= 8) {
      setInviteCode(value);
      setError('');
      setUserType(null);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setUserType(null);

    // フロントエンドバリデーション
    if (!inviteCode) {
      setError('招待コードを入力してください');
      return;
    }

    if (!validateInviteCode(inviteCode)) {
      setError('招待コードは8文字の英数字で入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API連携実装
      // 現在はスタブ実装（テスト用）
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-invite-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inviteCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '招待コードの検証に失敗しました');
      }

      const data = await response.json();

      // ユーザータイプを設定
      setUserType(data.userType);

      // 検証成功後、ユーザータイプに応じた登録ページへリダイレクト
      setTimeout(() => {
        if (data.userType === 'CLIENT') {
          router.push(`/auth/register/client?code=${inviteCode}`);
        } else if (data.userType === 'SPONSOR') {
          router.push(`/auth/register/sponsor?code=${inviteCode}`);
        }
      }, 1000);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('招待コードが無効です');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleVerifyCode();
    }
  };

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

          {/* タイトル・サブタイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
              HATAMO 新規登録
            </h1>
            <p className="text-base text-[#45556c]">
              招待コードを入力してください
            </p>
          </div>

          {/* フォーム */}
          <div className="space-y-6">
            {/* 招待コード入力 */}
            <div className="space-y-2">
              <label htmlFor="inviteCode" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                招待コード
                <span className="text-red-800">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  id="inviteCode"
                  type="text"
                  placeholder="XXXXXX-XXXXXX"
                  value={inviteCode}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  maxLength={8}
                  className="flex-1 h-12 px-3 border border-[#cad5e2] rounded-md text-sm font-mono uppercase tracking-widest text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={isLoading || !inviteCode}
                  className="w-[76px] h-12 bg-blue-500 text-white text-sm font-medium rounded-md disabled:opacity-50 hover:bg-blue-600 transition-colors"
                >
                  {isLoading ? '...' : '確認'}
                </button>
              </div>
            </div>

            {/* 青い情報ボックス */}
            <div className="bg-blue-100 rounded-lg p-4 space-y-2">
              <h3 className="text-sm text-blue-800 font-normal">
                招待コードについて
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• 招待コードは運営がメールでお送りしたコードを使用して下さい</li>
                <li>• コードは大文字・小文字を区別しません</li>
              </ul>
            </div>
          </div>

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
