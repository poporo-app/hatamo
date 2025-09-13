'use client';

import { useEffect, useState } from 'react';
import UserAuthLayout from '../(auth)/layout';
import BusinessAuthLayout from '../business/(auth)/layout';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-100"></div>
      </div>
    );
  }

  // 視点に応じて適切なレイアウトを適用
  return viewType === 'business' ? (
    <BusinessAuthLayout>{children}</BusinessAuthLayout>
  ) : (
    <UserAuthLayout>{children}</UserAuthLayout>
  );
}