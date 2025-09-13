'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BusinessRegistrationData, 
  BusinessRegistrationErrors,
  BUSINESS_CATEGORIES 
} from '@/types/business-registration';

interface BusinessRegistrationFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function BusinessRegistrationForm({ 
  onSuccess, 
  onError 
}: BusinessRegistrationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessRegistrationData>({
    companyName: '',
    email: '',
    location: '',
    phone: '',
    categories: [],
    representativeName: '',
    capital: undefined
  });

  const [errors, setErrors] = useState<BusinessRegistrationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleFieldChange = (field: keyof BusinessRegistrationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof BusinessRegistrationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCategoryChange = (categoryValue: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryValue)
        ? prev.categories.filter(c => c !== categoryValue)
        : [...prev.categories, categoryValue]
    }));
    
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors: BusinessRegistrationErrors = { ...errors };

    switch (field) {
      case 'companyName':
        if (!formData.companyName) {
          newErrors.companyName = '企業名は必須です';
        } else if (formData.companyName.length < 2) {
          newErrors.companyName = '企業名は2文字以上で入力してください';
        } else {
          delete newErrors.companyName;
        }
        break;

      case 'email':
        if (!formData.email) {
          newErrors.email = 'メールアドレスは必須です';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = '有効なメールアドレスを入力してください';
        } else {
          delete newErrors.email;
        }
        break;

      case 'location':
        if (!formData.location) {
          newErrors.location = '所在地は必須です';
        } else if (formData.location.length < 5) {
          newErrors.location = '所在地を正しく入力してください';
        } else {
          delete newErrors.location;
        }
        break;

      case 'phone':
        if (!formData.phone) {
          newErrors.phone = '電話番号は必須です';
        } else if (!/^[\d-]+$/.test(formData.phone) || formData.phone.length < 10) {
          newErrors.phone = '有効な電話番号を入力してください';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'representativeName':
        if (!formData.representativeName) {
          newErrors.representativeName = '代表者名は必須です';
        } else if (formData.representativeName.length < 2) {
          newErrors.representativeName = '代表者名を正しく入力してください';
        } else {
          delete newErrors.representativeName;
        }
        break;

      case 'categories':
        if (formData.categories.length === 0) {
          newErrors.categories = 'カテゴリを少なくとも1つ選択してください';
        } else {
          delete newErrors.categories;
        }
        break;

      case 'capital':
        if (formData.capital && formData.capital < 0) {
          newErrors.capital = '資本金は0以上の数値を入力してください';
        } else {
          delete newErrors.capital;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateAllFields = (): boolean => {
    const newErrors: BusinessRegistrationErrors = {};

    if (!formData.companyName) {
      newErrors.companyName = '企業名は必須です';
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = '企業名は2文字以上で入力してください';
    }

    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.location) {
      newErrors.location = '所在地は必須です';
    } else if (formData.location.length < 5) {
      newErrors.location = '所在地を正しく入力してください';
    }

    if (!formData.phone) {
      newErrors.phone = '電話番号は必須です';
    } else if (!/^[\d-]+$/.test(formData.phone) || formData.phone.length < 10) {
      newErrors.phone = '有効な電話番号を入力してください';
    }

    if (!formData.representativeName) {
      newErrors.representativeName = '代表者名は必須です';
    } else if (formData.representativeName.length < 2) {
      newErrors.representativeName = '代表者名を正しく入力してください';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'カテゴリを少なくとも1つ選択してください';
    }

    if (formData.capital && formData.capital < 0) {
      newErrors.capital = '資本金は0以上の数値を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store data in sessionStorage for the next step
      sessionStorage.setItem('businessRegistration', JSON.stringify(formData));
      
      if (onSuccess) {
        onSuccess('企業情報が正常に保存されました');
      }
      
      // Navigate to document upload page
      router.push('/business/register/documents');
    } catch (error: any) {
      if (onError) {
        onError(error.message || '登録に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          事業者情報登録
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              企業名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleFieldChange('companyName', e.target.value)}
              onBlur={() => handleFieldBlur('companyName')}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.companyName 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-700 focus:ring-purple-400 focus:border-transparent'
              }`}
              placeholder="株式会社HATAMO"
              disabled={isLoading}
            />
            {errors.companyName && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.companyName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              メールアドレス <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-700 focus:ring-purple-400 focus:border-transparent'
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

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              所在地 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              onBlur={() => handleFieldBlur('location')}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.location 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-700 focus:ring-purple-400 focus:border-transparent'
              }`}
              placeholder="東京都渋谷区..."
              disabled={isLoading}
            />
            {errors.location && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.location}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              連絡先電話番号 <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.phone 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-700 focus:ring-purple-400 focus:border-transparent'
              }`}
              placeholder="03-1234-5678"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Representative Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              代表者名 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.representativeName}
              onChange={(e) => handleFieldChange('representativeName', e.target.value)}
              onBlur={() => handleFieldBlur('representativeName')}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.representativeName 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-700 focus:ring-purple-400 focus:border-transparent'
              }`}
              placeholder="山田 太郎"
              disabled={isLoading}
            />
            {errors.representativeName && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.representativeName}
              </p>
            )}
          </div>

          {/* Capital */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              資本金（万円）
            </label>
            <input
              type="number"
              value={formData.capital || ''}
              onChange={(e) => handleFieldChange('capital', e.target.value ? parseInt(e.target.value) : undefined)}
              onBlur={() => handleFieldBlur('capital')}
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.capital 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-gray-700 focus:ring-purple-400 focus:border-transparent'
              }`}
              placeholder="1000"
              disabled={isLoading}
            />
            {errors.capital && (
              <p className="text-sm text-red-400 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.capital}
              </p>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              カテゴリ <span className="text-red-400">*</span>
              <span className="text-xs text-gray-500 ml-2">（複数選択可）</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BUSINESS_CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    value={category.value}
                    checked={formData.categories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    disabled={isLoading}
                    className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">{category.label}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm text-red-400 flex items-center mt-2">
                <span className="mr-1">⚠️</span>
                {errors.categories}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  保存中...
                </div>
              ) : (
                '次へ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}