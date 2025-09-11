'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api/auth';
import { LoginRequest, FormErrors } from '@/types/auth';

interface LoginFormProps {
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFieldChange = (field: keyof LoginRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
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
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      
      // Store JWT token
      if (response.token) {
        if (formData.rememberMe) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('refresh_token', response.refresh_token || '');
        } else {
          sessionStorage.setItem('auth_token', response.token);
          sessionStorage.setItem('refresh_token', response.refresh_token || '');
        }
        
        // Store user data
        if (response.user) {
          const storage = formData.rememberMe ? localStorage : sessionStorage;
          storage.setItem('user_data', JSON.stringify(response.user));
        }
      }
      
      onSuccess(response.message || 'ログインに成功しました');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      
    } catch (error: any) {
      // Check if it's an authentication error
      if (error.status === 401) {
        setErrors({ general: 'メールアドレスまたはパスワードが違います' });
      } else if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
        // Handle validation errors
        const serverErrors: FormErrors = {};
        error.data.errors.forEach((err: any) => {
          const fieldMap: { [key: string]: keyof FormErrors } = {
            'email': 'email',
            'password': 'password',
          };
          
          const frontendField = fieldMap[err.field];
          if (frontendField) {
            serverErrors[frontendField] = err.message;
          }
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: error.message || 'ログインに失敗しました。もう一度お試しください。' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-900/50 border border-red-400 text-red-100 px-4 py-3 rounded-lg">
            <p className="text-sm">{errors.general}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            メールアドレス
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
            autoComplete="email"
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
            パスワード
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
              autoComplete="current-password"
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
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-300">ログイン状態を保持</span>
          </label>
          
          <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            パスワードを忘れた方
          </a>
        </div>

        {/* Submit Button */}
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
  );
}