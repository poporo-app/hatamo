'use client';

import { useEffect, useState } from 'react';
import UserRegisterPage from '../(auth)/user-register/page';
import BusinessRegisterPage from '../business/(auth)/business-register/page';

export default function RegisterPage() {
  const [viewType, setViewType] = useState<'user' | 'business' | null>(null);

  useEffect(() => {
    // ポート番号またはドメインに基づいて視点を判定
    const port = window.location.port;
    const hostname = window.location.hostname;
    
    // 開発環境でのポート判定
    if (port === '3001' || (!port && hostname.includes('user'))) {
      setViewType('user');
    } else if (port === '3002' || (!port && hostname.includes('business'))) {
      setViewType('business');
    } else {
      // デフォルトはユーザー視点
      setViewType('user');
    }
  }, []);

  if (viewType === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 視点に応じて適切な登録ページを表示
  return viewType === 'business' ? <BusinessRegisterPage /> : <UserRegisterPage />;
}