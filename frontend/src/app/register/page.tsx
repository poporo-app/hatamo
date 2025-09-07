'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'individual' | 'business';
  companyName: string;
  phone: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'individual',
    companyName: '',
    phone: '',
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = '姓を入力してください';
    if (!formData.lastName.trim()) newErrors.lastName = '名を入力してください';
    if (!formData.email.trim()) newErrors.email = 'メールアドレスを入力してください';
    if (!formData.password) newErrors.password = 'パスワードを入力してください';
    if (formData.password.length < 8) newErrors.password = 'パスワードは8文字以上で入力してください';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    if (formData.userType === 'business' && !formData.companyName.trim()) {
      newErrors.companyName = '会社名を入力してください';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '利用規約に同意してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Mock registration process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would handle registration
      console.log('Registration attempt:', formData);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="user" />
      
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Registration Form Card */}
          <Card className="bg-white shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">アカウント作成</h1>
              <p className="text-gray-600">HATAMOで新しい可能性を見つけましょう</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  登録タイプ *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'individual')}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      formData.userType === 'individual'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">個人</div>
                    <div className="text-sm text-gray-500">サービスを利用したい方</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'business')}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      formData.userType === 'business'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">法人</div>
                    <div className="text-sm text-gray-500">企業・団体での利用</div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓 *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="山田"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    名 *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="太郎"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Company Name (if business) */}
              {formData.userType === 'business' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    会社名・団体名 *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="株式会社サンプル"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="090-1234-5678"
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    パスワード *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="8文字以上"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    パスワード確認 *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="パスワードを再入力"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Agreement Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 ${
                      errors.agreeToTerms ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      利用規約
                    </Link>
                    および
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      プライバシーポリシー
                    </Link>
                    に同意します *
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-xs text-red-500 ml-6">{errors.agreeToTerms}</p>
                )}
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    お得な情報やキャンペーンのメール配信を受け取る（任意）
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isLoading}
                className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {isLoading ? 'アカウント作成中...' : 'アカウントを作成'}
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

            {/* Social Registration Options */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <span className="mr-2">🔍</span>
                Googleで登録
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <span className="mr-2">📘</span>
                Facebookで登録
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                既にアカウントをお持ちの方は{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  ログイン
                </Link>
              </p>
            </div>
          </Card>

          {/* Security Info */}
          <div className="mt-8">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                <span className="mr-2">🔒</span>
                安心・安全なサービス
              </h3>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• SSL暗号化によりデータを保護</li>
                <li>• 個人情報の適切な管理</li>
                <li>• 24時間セキュリティ監視</li>
                <li>• GDPR・個人情報保護法準拠</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}