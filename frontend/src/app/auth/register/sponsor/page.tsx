'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SponsorRegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteCode = searchParams.get('code') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    profileImage: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isRobot, setIsRobot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルサイズチェック (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ファイルサイズは5MB以下にしてください');
        return;
      }
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!formData.name.trim()) {
      setError('お名前を入力してください');
      return;
    }
    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      setError('パスワードが一致しません');
      return;
    }
    if (!agreeTerms) {
      setError('利用規約に同意してください');
      return;
    }
    if (!agreePrivacy) {
      setError('プライバシーポリシーに同意してください');
      return;
    }
    if (!isRobot) {
      setError('「私はロボットではありません」にチェックを入れてください');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API連携実装
      console.log('登録データ:', { ...formData, inviteCode, userType: 'SPONSOR' });

      // 登録完了ページへリダイレクト
      router.push(`/auth/register/complete?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError('登録に失敗しました');
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
              招待コード: <span className="font-normal">{inviteCode}</span> ✓
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* お名前 */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                お名前
                <span className="text-red-800">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="山田 太郎"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* メールアドレス */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                メールアドレス
                <span className="text-red-800">*</span>
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
              <label htmlFor="password" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                パスワード
                <span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8文字以上で入力してください"
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

            {/* パスワード（確認用） */}
            <div className="space-y-2">
              <label htmlFor="passwordConfirm" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                パスワード（確認用）
                <span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="パスワードを再入力してください"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
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
            </div>

            {/* プロフィール画像（任意） */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#314158]">
                プロフィール画像（任意）
              </label>
              <label
                htmlFor="profileImage"
                className="inline-flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <svg className="w-4 h-4 text-[#45556c]" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" d="M8 2v12M2 8h12" />
                </svg>
                <span className="text-sm text-[#45556c]">画像を選択</span>
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              {formData.profileImage && (
                <p className="text-xs text-[#62748e] mt-1">
                  選択中: {formData.profileImage.name}
                </p>
              )}
              <p className="text-xs text-[#62748e]">
                JPG, PNG, GIF（最大5MB）
              </p>
            </div>

            {/* 利用規約・プライバシーポリシー同意 */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
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
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
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
            </div>

            {/* reCAPTCHA風 */}
            <div className="bg-slate-50 border-2 border-[#cad5e2] rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRobot}
                  onChange={(e) => setIsRobot(e.target.checked)}
                  className="w-6 h-6 border-2 border-[#cad5e2] rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-[#314158]">
                  私はロボットではありません
                </span>
              </label>
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
