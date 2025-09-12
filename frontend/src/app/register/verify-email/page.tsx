'use client';

import { useEffect, useState } from 'react';
import UserVerifyEmailPage from '../../(auth)/register/verify-email/page';
import BusinessVerifyEmailPage from '../../business/(auth)/register/verify-email/page';

export default function VerifyEmailPage() {
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

  // 視点に応じて適切な確認ページを表示
  return viewType === 'business' ? <BusinessVerifyEmailPage /> : <UserVerifyEmailPage />;
}