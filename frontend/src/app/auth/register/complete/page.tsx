'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      // TODO: API連携実装
      // メール再送信APIを呼び出す
      await new Promise(resolve => setTimeout(resolve, 1000)); // 仮の遅延
      setResendMessage('確認メールを再送信しました');
    } catch (err) {
      setResendMessage('メールの再送信に失敗しました');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(145.86deg, rgb(248, 250, 252) 0%, rgb(239, 246, 255) 50%, rgb(248, 250, 252) 100%)'
      }}
    >
      <div className="w-full max-w-[448px] px-4 py-8">
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

          {/* チェックマークアイコン */}
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 rounded-full w-[80px] h-[80px] flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
              </svg>
            </div>
          </div>

          {/* タイトル・サブタイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
              登録完了
            </h1>
            <p className="text-base text-[#45556c]">
              ご登録ありがとうございます
            </p>
          </div>

          {/* 確認メール送信通知（青色のボックス） */}
          <div className="bg-blue-100 rounded-lg px-4 py-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-800 mt-0.5" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" d="M2 4h16v12H2z" />
                <path stroke="currentColor" strokeWidth="1.5" d="M2 4l8 6 8-6" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 mb-1">
                  確認メールを送信しました
                </p>
                <p className="text-sm font-medium text-blue-800">
                  {email || 'example@hatamo.com'}
                </p>
              </div>
            </div>
          </div>

          {/* 次のステップ（グレーのボックス） */}
          <div className="bg-slate-50 rounded-lg px-4 py-4 mb-4">
            <h3 className="text-sm text-[#0f172b] mb-3">
              次のステップ
            </h3>
            <ol className="space-y-2">
              <li className="flex gap-2 text-sm">
                <span className="text-blue-500">1.</span>
                <span className="text-[#45556c]">メールボックスをご確認ください</span>
              </li>
              <li className="flex gap-2 text-sm">
                <span className="text-blue-500">2.</span>
                <span className="text-[#45556c]">メール内の確認リンクをクリックしてください</span>
              </li>
              <li className="flex gap-2 text-sm">
                <span className="text-blue-500">3.</span>
                <span className="text-[#45556c]">メールアドレスの確認後、ログインできます</span>
              </li>
            </ol>
          </div>

          {/* メールが届かない場合（黄色のボックス） */}
          <div className="bg-amber-100 rounded-lg px-4 py-4 mb-6">
            <p className="text-sm font-medium text-amber-800 mb-1">
              メールが届かない場合：
            </p>
            <p className="text-sm text-amber-800">
              迷惑メールフォルダをご確認ください。それでも届かない場合は、下のボタンから再送信してください。
            </p>
          </div>

          {/* 再送信メッセージ */}
          {resendMessage && (
            <div className={`rounded-lg px-4 py-3 mb-4 ${
              resendMessage.includes('失敗')
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              <p className={`text-sm ${
                resendMessage.includes('失敗') ? 'text-red-800' : 'text-green-800'
              }`}>
                {resendMessage}
              </p>
            </div>
          )}

          {/* 確認メールを再送信ボタン */}
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full h-12 bg-slate-50 border border-[#cad5e2] text-[#314158] text-sm font-medium rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M13 8a5 5 0 01-9.9 1M3 8a5 5 0 019.9-1M3 11V8H6M13 5V8h-3" />
            </svg>
            {isResending ? '送信中...' : '確認メールを再送信'}
          </button>

          {/* または区切り線 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-[#62748e]">または</span>
            </div>
          </div>

          {/* ログイン画面に戻るボタン */}
          <Link
            href="/auth/login"
            className="block w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            ログイン画面に戻る
          </Link>
        </div>

        {/* フッターコピーライト */}
        <p className="text-sm text-center text-[#62748e] mt-8">
          © 2025 HATAMO. All rights reserved.
        </p>
      </div>
    </div>
  );
}
