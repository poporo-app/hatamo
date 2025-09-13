'use client';

import { useState } from 'react';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';
import Link from 'next/link';

export default function BusinessRegisterPage() {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSuccess = (message: string) => {
    setNotification({ type: 'success', message });
  };

  const handleError = (error: string) => {
    setNotification({ type: 'error', message: error });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HATAMOビジネスパートナー登録
          </h1>
          <p className="text-lg text-gray-300">
            異次元コミュニティのビジネスパートナーとして参加しましょう
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <span className="ml-3 text-white font-medium">企業情報</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
                2
              </div>
              <span className="ml-3 text-gray-400 font-medium">書類アップロード</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
                3
              </div>
              <span className="ml-3 text-gray-400 font-medium">審査</span>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-lg ${
            notification.type === 'success' 
              ? 'bg-green-900/50 border border-green-500 text-green-300'
              : 'bg-red-900/50 border border-red-500 text-red-300'
          }`}>
            <p className="flex items-center">
              <span className="mr-2">{notification.type === 'success' ? '✅' : '❌'}</span>
              {notification.message}
            </p>
          </div>
        )}

        {/* Registration Form */}
        <BusinessRegistrationForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Footer Links */}
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-gray-400 mb-4">
            すでにアカウントをお持ちの方は
            <Link href="/business/login" className="text-purple-400 hover:text-purple-300 ml-1">
              こちらからログイン
            </Link>
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-gray-300">
              利用規約
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300">
              プライバシーポリシー
            </Link>
            <Link href="/commercial-law" className="text-gray-500 hover:text-gray-300">
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}