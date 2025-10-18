'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (path: string, tab?: string) => {
    if (tab) {
      // タブパラメータがある場合は、パスとタブの両方をチェック
      return pathname === path && searchParams.get('tab') === tab;
    }
    if (path === '/client') {
      // /clientの場合、パスが一致し、かつtabがnullまたは'dashboard'の場合にアクティブ
      const currentTab = searchParams.get('tab');
      return pathname === path && (!currentTab || currentTab === 'dashboard');
    }
    // その他のパスは単純にパスが一致するかチェック
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1199px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="relative w-[42px] h-10">
            <Image
              src="/hatamo-logo.png"
              alt="HATAMO"
              fill
              className="object-contain"
            />
          </Link>

          {/* 右側アイコン */}
          <div className="flex items-center gap-3">
            {/* 通知アイコン */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" d="M15 7a5 5 0 00-10 0c0 3-1 5-1 5h12s-1-2-1-5zM9 16h2" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>

            {/* メッセージアイコン */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" d="M3 6l7.89 5.26a2 2 0 002.22 0L17 6M5 16h10a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>

            {/* ユーザーメニュー */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 16 16">
                  <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  <path stroke="currentColor" strokeWidth="1.5" d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                </svg>
              </div>
              <span className="text-base text-[#0f172b]">山田</span>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-[1199px] mx-auto px-8">
          <div className="flex items-center gap-1">
            <Link
              href="/client"
              className={`flex items-center gap-2 px-4 h-[50px] text-base border-b-2 transition-colors ${
                isActive('/client')
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-[#45556c] hover:text-[#0f172b]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              ダッシュボード
            </Link>
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 h-[50px] text-base border-b-2 transition-colors ${
                isActive('/')
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-[#45556c] hover:text-[#0f172b]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" d="M2 5h12M2 9h12M2 13h12" />
              </svg>
              サービス管理
            </Link>
            <Link
              href="/client/messages"
              className={`flex items-center gap-2 px-4 h-[50px] text-base border-b-2 transition-colors ${
                isActive('/client/messages')
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-[#45556c] hover:text-[#0f172b]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" d="M2 3l6 4 6-4M2 3v10h12V3" />
              </svg>
              メッセージ
            </Link>
            <Link
              href="/client/profile"
              className={`flex items-center gap-2 px-4 h-[50px] text-base border-b-2 transition-colors ${
                isActive('/client/profile')
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-[#45556c] hover:text-[#0f172b]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
              プロフィール
            </Link>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      {children}

      {/* フッター */}
      <footer className="bg-[#0f172b] text-white mt-16">
        <div className="max-w-[1199px] mx-auto px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {/* ロゴ・説明 */}
            <div>
              <div className="relative w-[42px] h-10 mb-4">
                <Image
                  src="/hatamo-logo.png"
                  alt="HATAMO"
                  fill
                  className="object-contain"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
              </div>
              <p className="text-sm text-slate-300">
                プロフェッショナルなスキルとサービスを提供するマーケットプレイス
              </p>
            </div>

            {/* サービス */}
            <div>
              <h3 className="text-base font-medium mb-4">サービス</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="#" className="hover:text-white">HATAMOについて</Link></li>
                <li><Link href="#" className="hover:text-white">サービス一覧</Link></li>
                <li><Link href="#" className="hover:text-white">よくある質問</Link></li>
              </ul>
            </div>

            {/* サポート */}
            <div>
              <h3 className="text-base font-medium mb-4">サポート</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="#" className="hover:text-white">ヘルプセンター</Link></li>
                <li><Link href="#" className="hover:text-white">お問い合わせ</Link></li>
                <li><Link href="#" className="hover:text-white">プライバシーポリシー</Link></li>
                <li><Link href="#" className="hover:text-white">利用規約</Link></li>
              </ul>
            </div>

            {/* お問い合わせ */}
            <div>
              <h3 className="text-base font-medium mb-4">お問い合わせ</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" d="M8 8a3 3 0 100-6 3 3 0 000 6zM2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  </svg>
                  東京都渋谷区渋谷1-1-1
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" d="M2 3h12v10H2z" />
                  </svg>
                  03-1234-5678
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" d="M2 3l6 4 6-4M2 3v10h12V3" />
                  </svg>
                  support@hatamo.jp
                </li>
              </ul>
            </div>
          </div>

          {/* コピーライト */}
          <div className="border-t border-slate-700 pt-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              © 2025 HATAMO. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="#" className="hover:text-white">プライバシー</Link>
              <Link href="#" className="hover:text-white">利用規約</Link>
              <Link href="#" className="hover:text-white">Cookie</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
