'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleRegistrationSuccess = (message: string) => {
    setAlertMessage({ type: 'success', message });
    
    // Redirect to registration complete page after a short delay
    setTimeout(() => {
      router.push('/registration-complete');
    }, 2000);
  };

  const handleRegistrationError = (error: string) => {
    setAlertMessage({ type: 'error', message: error });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl text-white">📝</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          アカウント作成
        </h1>
        <p className="text-gray-400">
          HATAMOでプロフェッショナルと繋がりませんか
        </p>
      </div>

      {/* Alert Messages */}
      {alertMessage && (
        <div className={`mb-6 p-4 rounded-lg border ${
          alertMessage.type === 'success'
            ? 'bg-green-900/50 border-green-400 text-green-100'
            : 'bg-red-900/50 border-red-400 text-red-100'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {alertMessage.type === 'success' ? '✅' : '❌'}
            </span>
            <p className="text-sm">{alertMessage.message}</p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <RegisterForm
          onSuccess={handleRegistrationSuccess}
          onError={handleRegistrationError}
        />
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

      {/* Social Registration */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200">
          <div className="w-5 h-5 mr-3 bg-white rounded-full flex items-center justify-center">
            <span className="text-xs">G</span>
          </div>
          Googleで登録
        </button>
        
        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200">
          <div className="w-5 h-5 mr-3 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">f</span>
          </div>
          Facebookで登録
        </button>
      </div>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          既にアカウントをお持ちですか？{' '}
          <Link 
            href="/login" 
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            ログイン
          </Link>
        </p>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          アカウント作成により、
          <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
            利用規約
          </Link>
          および
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
            プライバシーポリシー
          </Link>
          に同意したものとみなします
        </p>
      </div>
    </div>
  );
}