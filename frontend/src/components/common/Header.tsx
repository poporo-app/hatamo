'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  role: 'user' | 'business' | 'admin';
}

export default function Header({ role }: HeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const getThemeClasses = () => {
    switch (role) {
      case 'user':
        return 'bg-blue-900'; // ブルー系（利用者）
      case 'business':
        return 'bg-green-900'; // グリーン系（事業者）
      case 'admin':
        return 'bg-purple-900'; // パープル系（管理者）
    }
  };
  
  const getTitle = () => {
    switch (role) {
      case 'user':
        return 'HATAMO マッチングサービス';
      case 'business':
        return 'HATAMO 事業者管理';
      case 'admin':
        return 'HATAMO 管理者ダッシュボード';
    }
  };

  const getNavItems = () => {
    switch (role) {
      case 'user':
        return [
          { href: '/', label: 'トップ' },
          { href: '/businesses', label: 'サービス一覧' },
          { href: '/search', label: '検索' },
          { href: '/mypage', label: 'マイページ' },
        ];
      case 'business':
        return [
          { href: '/business', label: 'ダッシュボード' },
          { href: '/business/applications', label: '案件一覧' },
          { href: '/business/messages', label: 'メッセージ' },
          { href: '/business/sales', label: '売上明細' },
          { href: '/business/profile', label: 'プロフィール' },
        ];
      case 'admin':
        return [
          { href: '/admin', label: 'ダッシュボード' },
          { href: '/admin/business', label: '事業者審査' },
          { href: '/admin/listings', label: '掲載管理' },
          { href: '/admin/applications', label: '申込管理' },
          { href: '/admin/settlements', label: '精算管理' },
        ];
    }
  };

  return (
    <header className={`${getThemeClasses()} text-white shadow-lg`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-wide">{getTitle()}</h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {getNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-gray-300 transition-colors ${
                  pathname === item.href ? 'text-blue-400' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Business Registration Link for business role */}
            {role === 'business' && !isAuthenticated && (
              <Link
                href="/business/register"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-2 rounded-md transition-all transform hover:scale-105 font-medium"
              >
                事業者登録
              </Link>
            )}
            
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-black bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md transition-colors"
                >
                  <span className="text-sm">👤</span>
                  <span>{user.lastName} {user.firstName}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/mypage"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      設定
                    </Link>
                    <hr className="border-gray-700 my-1" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href={role === 'business' ? '/business/business-login' : role === 'admin' ? '/admin/login' : '/login'}
                className="bg-black bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md transition-colors"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}