'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { LoginRequest } from '@/types/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFieldChange = (field: keyof LoginRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authApi.login(formData);
      
      // Store token and user data
      if (typeof window !== 'undefined') {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
      }

      // Redirect to dashboard or home page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'ログインに失敗しました。メールアドレスとパスワードをご確認ください。'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl text-white">🔐</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          ログイン
        </h1>
        <p className="text-gray-400">
          HATAMOアカウントでログイン
        </p>
      </div>

      {/* Alert Messages */}
      {errors.general && (
        <div className="mb-6 p-4 rounded-lg border bg-red-900/50 border-red-400 text-red-100">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            <p className="text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              メールアドレス *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-600 focus:ring-blue-400 focus:border-blue-400'
              }`}
              placeholder="example@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              パスワード *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-gray-600 focus:ring-blue-400 focus:border-blue-400'
                }`}
                placeholder="パスワードを入力"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleFieldChange('rememberMe', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-300">ログイン状態を保持</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              パスワードを忘れた方
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ログイン中...
              </div>
            ) : (
              'ログイン'
            )}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="my-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900 text-gray-400">または</span>
          </div>
        </div>
      </div>

      {/* Social Login Options */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200">
          <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
            <span className="text-xs">G</span>
          </div>
          Googleでログイン
        </button>
        
        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200">
          <div className="w-5 h-5 mr-3 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">f</span>
          </div>
          Facebookでログイン
        </button>

        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200">
          <div className="w-5 h-5 mr-3 bg-sky-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">𝕏</span>
          </div>
          Twitterでログイン
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          アカウントをお持ちでない方は{' '}
          <Link 
            href="/register" 
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            新規登録
          </Link>
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mt-8">
        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-100 mb-3">
            HATAMOをご利用いただくメリット
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-200">
            <div className="flex items-center">
              <span className="mr-2">✨</span>
              厳選されたプロフェッショナル
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔒</span>
              安心の決済システム
            </div>
            <div className="flex items-center">
              <span className="mr-2">🛡️</span>
              24時間サポート体制
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              トラブル時の返金保証
            </div>
          </div>
        </div>
      </div>

      {/* Help Links */}
      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/help" className="text-gray-400 hover:text-gray-300 transition-colors">
            ヘルプ
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-gray-300 transition-colors">
            利用規約
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-gray-300 transition-colors">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </div>
  );
}