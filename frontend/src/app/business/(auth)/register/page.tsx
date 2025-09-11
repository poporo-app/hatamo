'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { CreateUserRequest } from '@/types/auth';

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateUserRequest & { businessName?: string; businessType?: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    phone: '',
    acceptTerms: false,
    businessName: '',
    businessType: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName) {
      newErrors.businessName = '事業者名は必須です';
    }

    if (!formData.businessType) {
      newErrors.businessType = '事業形態を選択してください';
    }

    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認は必須です';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName) {
      newErrors.lastName = '姓は必須です';
    }

    if (!formData.firstName) {
      newErrors.firstName = '名は必須です';
    }

    if (!formData.lastNameKana) {
      newErrors.lastNameKana = 'セイは必須です';
    }

    if (!formData.firstNameKana) {
      newErrors.firstNameKana = 'メイは必須です';
    }

    if (!formData.phone) {
      newErrors.phone = '電話番号は必須です';
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = '有効な電話番号を入力してください';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = '利用規約への同意が必要です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      handleNextStep();
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Update to use business-specific registration endpoint
      const response = await authApi.register(formData);
      
      // Redirect to verification notice page
      router.push('/business/register/verify-email');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({
          general: error.response?.data?.message || '登録に失敗しました'
        });
      }
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
          事業者新規登録
        </h1>
        <p className="text-green-200">
          HATAMOで新しいビジネスチャンスを
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
          }`}>
            1
          </div>
          <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-600'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
          }`}>
            2
          </div>
        </div>
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

      {/* Registration Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">
                ステップ 1: 事業情報
              </h2>

              {/* Business Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  事業者名 *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleFieldChange('businessName', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.businessName 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                  }`}
                  placeholder="株式会社HATAMO"
                  disabled={isLoading}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.businessName}
                  </p>
                )}
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  事業形態 *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleFieldChange('businessType', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.businessType 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">選択してください</option>
                  <option value="corporation">株式会社</option>
                  <option value="limited">有限会社</option>
                  <option value="partnership">合同会社</option>
                  <option value="individual">個人事業主</option>
                  <option value="npo">NPO法人</option>
                  <option value="other">その他</option>
                </select>
                {errors.businessType && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.businessType}
                  </p>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
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
                    placeholder="8文字以上で入力"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  パスワード確認 *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.confirmPassword 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                    }`}
                    placeholder="パスワードを再入力"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                次へ進む
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-semibold text-white mb-4">
                ステップ 2: 代表者情報
              </h2>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    姓 *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.lastName 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                    }`}
                    placeholder="山田"
                    disabled={isLoading}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    名 *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.firstName 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                    }`}
                    placeholder="太郎"
                    disabled={isLoading}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>

              {/* Kana Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    セイ *
                  </label>
                  <input
                    type="text"
                    value={formData.lastNameKana}
                    onChange={(e) => handleFieldChange('lastNameKana', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.lastNameKana 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                    }`}
                    placeholder="ヤマダ"
                    disabled={isLoading}
                  />
                  {errors.lastNameKana && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.lastNameKana}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    メイ *
                  </label>
                  <input
                    type="text"
                    value={formData.firstNameKana}
                    onChange={(e) => handleFieldChange('firstNameKana', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.firstNameKana 
                        ? 'border-red-400 focus:ring-red-400' 
                        : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                    }`}
                    placeholder="タロウ"
                    disabled={isLoading}
                  />
                  {errors.firstNameKana && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.firstNameKana}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  電話番号 *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.phone 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-gray-600 focus:ring-green-400 focus:border-green-400'
                  }`}
                  placeholder="090-1234-5678"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleFieldChange('acceptTerms', e.target.checked)}
                    className="h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    <Link href="/terms" className="text-green-400 hover:text-green-300">利用規約</Link>および
                    <Link href="/privacy" className="text-green-400 hover:text-green-300">プライバシーポリシー</Link>に同意します *
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.acceptTerms}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      登録中...
                    </div>
                  ) : (
                    '登録する'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-300 text-sm">
          既にアカウントをお持ちの方は{' '}
          <Link 
            href="/business/login" 
            className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
          >
            ログイン
          </Link>
        </p>
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