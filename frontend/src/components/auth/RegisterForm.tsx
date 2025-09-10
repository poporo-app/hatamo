'use client';

import { useState, useEffect } from 'react';
import { authApi, validatePasswordStrength, validateEmail, validateName } from '@/lib/api/auth';
import { RegisterRequest, FormErrors } from '@/types/auth';

interface RegisterFormProps {
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

export default function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [], isValid: false });
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Real-time password strength validation
  useEffect(() => {
    if (formData.password) {
      const strength = validatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: [], isValid: false });
    }
  }, [formData.password]);

  const handleFieldChange = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set([...prev, field]));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (field) {
      case 'email':
        if (!formData.email) {
          newErrors.email = 'メールアドレスは必須です';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = '有効なメールアドレスを入力してください';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!formData.password) {
          newErrors.password = 'パスワードは必須です';
        } else if (!passwordStrength.isValid) {
          newErrors.password = 'パスワード強度が不十分です';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'パスワードの確認は必須です';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'パスワードが一致しません';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'firstName':
        if (!formData.firstName) {
          newErrors.firstName = '名前は必須です';
        } else if (!validateName(formData.firstName)) {
          newErrors.firstName = '有効な名前を入力してください';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!formData.lastName) {
          newErrors.lastName = '苗字は必須です';
        } else if (!validateName(formData.lastName)) {
          newErrors.lastName = '有効な苗字を入力してください';
        } else {
          delete newErrors.lastName;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateAllFields = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (!passwordStrength.isValid) {
      newErrors.password = 'パスワード強度が不十分です';
    }
    
    // Validate confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードの確認は必須です';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    
    // Validate firstName
    if (!formData.firstName) {
      newErrors.firstName = '名前は必須です';
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = '有効な名前を入力してください';
    }
    
    // Validate lastName
    if (!formData.lastName) {
      newErrors.lastName = '苗字は必須です';
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = '有効な苗字を入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && passwordStrength.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      onError('入力内容をご確認ください');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Submitting registration with data:', formData);
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      console.log('Registration successful:', response);
      onSuccess(response.message || '登録が完了しました。確認メールをお送りしましたので、メールをご確認ください。');
    } catch (error: any) {
      console.error('Registration error:', error);
      onError(error.message || '登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return 'weak';
      case 2:
        return 'fair';
      case 3:
        return 'good';
      case 4:
      case 5:
        return 'strong';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
            onBlur={() => handleFieldBlur('email')}
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

        {/* First Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            名前 *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            onBlur={() => handleFieldBlur('firstName')}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.firstName 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-gray-600 focus:ring-blue-400 focus:border-blue-400'
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

        {/* Last Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            苗字 *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            onBlur={() => handleFieldBlur('lastName')}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.lastName 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-gray-600 focus:ring-blue-400 focus:border-blue-400'
            }`}
            placeholder="田中"
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-400 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.lastName}
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
              onBlur={() => handleFieldBlur('password')}
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
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 capitalize">
                  {getPasswordStrengthText()}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && touchedFields.has('password') && (
                <ul className="text-xs text-gray-400 space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-1 text-yellow-400">•</span>
                      {feedback}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-red-400 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            パスワード確認 *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
              onBlur={() => handleFieldBlur('confirmPassword')}
              className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.confirmPassword 
                  ? 'border-red-400 focus:ring-red-400' 
                  : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? 'border-green-400 focus:ring-green-400'
                  : 'border-gray-600 focus:ring-blue-400 focus:border-blue-400'
              }`}
              placeholder="パスワードをもう一度入力"
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
          {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
            <p className="text-sm text-green-400 flex items-center">
              <span className="mr-1">✓</span>
              パスワードが一致しています
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-sm text-red-400 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !passwordStrength.isValid}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
            isLoading || !passwordStrength.isValid
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              登録中...
            </div>
          ) : (
            'アカウント登録'
          )}
        </button>
      </form>
    </div>
  );
}