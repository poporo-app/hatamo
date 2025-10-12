'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }
    if (!formData.password) {
      setError('パスワードを入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API連携実装
      console.log('ログインデータ:', { ...formData, rememberMe });

      // 仮実装：ログイン成功として処理
      // 本来はAPIからユーザータイプを取得してリダイレクト先を決定
      await new Promise(resolve => setTimeout(resolve, 1000)); // 仮の遅延

      // router.push('/dashboard'); // ダッシュボードへリダイレクト
      alert('ログインに成功しました（現在はフロントエンドのみの実装です）');
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。');
    } finally {
      setIsLoading(false);
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

          {/* タイトル・サブタイトル */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-[#0f172b] mb-2">
              ログイン
            </h1>
            <p className="text-base text-[#45556c]">
              HATAMOへようこそ
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#314158]">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@hatamo.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* パスワード */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#314158]">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
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
            </div>

            {/* ログイン状態を保持 & パスワードをお忘れですか？ */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-slate-200 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-[#45556c]">
                  ログイン状態を保持
                </span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
                パスワードをお忘れですか？
              </Link>
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
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

          {/* 新規登録リンク */}
          <p className="text-base text-center text-[#45556c]">
            アカウントをお持ちでない方は{' '}
            <Link href="/auth/register/invite-code" className="text-blue-500 font-medium hover:underline">
              新規登録
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
