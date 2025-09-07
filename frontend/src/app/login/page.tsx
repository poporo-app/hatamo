'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would handle authentication
      console.log('Login attempt:', { email, password, rememberMe });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="user" />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Form Card */}
          <Card className="bg-white shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">ログイン</h1>
              <p className="text-gray-600">HATAMOアカウントでログイン</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="パスワードを入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  パスワードを忘れた方
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isLoading}
                className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">または</span>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <span className="mr-2">🔍</span>
                Googleでログイン
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <span className="mr-2">📘</span>
                Facebookでログイン
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <span className="mr-2">🐦</span>
                Twitterでログイン
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                アカウントをお持ちでない方は{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  新規登録
                </Link>
              </p>
            </div>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                HATAMOをご利用いただくメリット
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• 厳選されたプロフェッショナルとのマッチング</li>
                <li>• 安心の決済システム</li>
                <li>• 24時間サポート体制</li>
                <li>• トラブル時の返金保証</li>
              </ul>
            </div>
          </div>

          {/* Help Links */}
          <div className="mt-6 text-center">
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/help" className="text-gray-500 hover:text-gray-700">
                ヘルプ
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700">
                利用規約
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}