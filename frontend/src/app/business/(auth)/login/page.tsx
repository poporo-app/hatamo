'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { LoginRequest } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function BusinessLoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
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
      // TODO: Update to use business-specific login endpoint
      const response = await authApi.login(formData);
      
      // Store token and user data using auth context
      if (response.token && response.user) {
        if (formData.rememberMe) {
          localStorage.setItem('business_auth_token', response.token);
          localStorage.setItem('business_refresh_token', response.refresh_token || '');
          localStorage.setItem('business_user_data', JSON.stringify(response.user));
        } else {
          sessionStorage.setItem('business_auth_token', response.token);
          sessionStorage.setItem('business_refresh_token', response.refresh_token || '');
          sessionStorage.setItem('business_user_data', JSON.stringify(response.user));
        }
        
        // Update auth context
        authLogin(response.token, response.refresh_token || '', response.user);
        
        // Redirect to business dashboard
        router.push('/business');
      }
    } catch (error: any) {
      // Don't log to console to prevent error display in bottom left
      setErrors({
        general: 'メールアドレスまたはパスワードが違います'
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
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl text-white">🏢</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          事業者ログイン
        </h1>
        <p className="text-green-200">
          HATAMO事業者アカウントでログイン
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
                  : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
              }`}
              placeholder="business@example.com"
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
                    : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
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
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-gray-800"
              />
              <span className="ml-2 text-sm text-gray-300">ログイン状態を保持</span>
            </label>
            <Link href="/business/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors">
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
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900'
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
            <span className="px-4 bg-green-900 text-gray-400">初めての方はこちら</span>
          </div>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-gray-300 text-sm mb-4">
          HATAMO事業者として収益を得ませんか？
        </p>
        <Link 
          href="/business/register" 
          className="inline-block w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          事業者として新規登録
        </Link>
      </div>

      {/* Benefits Section */}
      <div className="mt-8">
        <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-100 mb-3">
            HATAMO事業者のメリット
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-green-200">
            <div className="flex items-center">
              <span className="mr-2">💰</span>
              安定した収益機会
            </div>
            <div className="flex items-center">
              <span className="mr-2">📊</span>
              売上管理ツール完備
            </div>
            <div className="flex items-center">
              <span className="mr-2">🎯</span>
              ターゲット顧客への直接アプローチ
            </div>
            <div className="flex items-center">
              <span className="mr-2">🛡️</span>
              安心の決済システム
            </div>
          </div>
        </div>
      </div>

      {/* Help Links */}
      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/business/help" className="text-gray-400 hover:text-gray-300 transition-colors">
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