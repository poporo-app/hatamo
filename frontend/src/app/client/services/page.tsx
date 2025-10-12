'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ダミーデータ
const DUMMY_SERVICES = [
  {
    id: '1',
    title: 'Webアプリケーション開発サービス',
    category: 'IT開発',
    price: 500000,
    originalPrice: 600000,
    rating: 4.9,
    reviews: 128,
    badge: '人気',
    image: '/placeholder-service.jpg'
  },
  {
    id: '2',
    title: '経営戦略コンサルティング',
    category: 'コンサル',
    price: 800000,
    rating: 5,
    reviews: 89,
    badge: '新着',
    image: '/placeholder-service.jpg'
  },
  {
    id: '3',
    title: 'SNSマーケティング戦略設計',
    category: 'マーケティング',
    price: 300000,
    originalPrice: 400000,
    rating: 4.8,
    reviews: 215,
    badge: '人気',
    image: '/placeholder-service.jpg'
  },
  {
    id: '4',
    title: 'パーソナルトレーニング（3ヶ月）',
    category: 'くらし',
    price: 150000,
    rating: 4.7,
    reviews: 342,
    image: '/placeholder-service.jpg'
  },
  {
    id: '5',
    title: '資産運用コンサルティング',
    category: '投資',
    price: 200000,
    rating: 4.9,
    reviews: 156,
    badge: '新着',
    image: '/placeholder-service.jpg'
  },
  {
    id: '6',
    title: 'UI/UXデザイン制作',
    category: 'IT開発',
    price: 450000,
    originalPrice: 550000,
    rating: 4.8,
    reviews: 198,
    badge: '人気',
    image: '/placeholder-service.jpg'
  },
];

const CATEGORIES = ['IT開発', 'くらし', 'コンサル', 'マーケティング', '投資'];

export default function ClientServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1199px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* ロゴ */}
          <div className="relative w-[42px] h-10">
            <Image
              src="/hatamo-logo.png"
              alt="HATAMO"
              fill
              className="object-contain"
            />
          </div>

          {/* 検索バー */}
          <div className="flex-1 max-w-[672px] mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="サービスを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[46px] pl-10 pr-4 border border-[#cad5e2] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-[13px] w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
              </svg>
            </div>
          </div>

          {/* アイコン */}
          <div className="flex items-center gap-3">
            {/* ユーザーアイコン */}
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" />
              </svg>
            </button>
            {/* ブリーフケースアイコン */}
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20">
                <rect x="2" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M6 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-[1199px] mx-auto px-8 py-6 flex gap-8">
        {/* サイドバー（フィルター） */}
        <aside className="w-80 shrink-0">
          <div className="bg-white rounded-lg p-6 sticky top-24">
            {/* フィルターヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#0f172b]">フィルター</h3>
              <button
                onClick={() => setSelectedCategories([])}
                className="text-sm text-blue-500 hover:underline"
              >
                リセット
              </button>
            </div>

            {/* カテゴリー */}
            <div className="mb-6">
              <h4 className="text-base font-medium text-[#0f172b] mb-4">カテゴリー</h4>
              <div className="space-y-3">
                {CATEGORIES.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 border-slate-300 rounded"
                    />
                    <span className="text-sm text-[#314158]">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 価格帯 */}
            <div className="mb-6">
              <h4 className="text-base font-medium text-[#0f172b] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" d="M8 1v14M12 4H7a3 3 0 000 6h2a3 3 0 010 6H4" />
                </svg>
                価格帯
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#314158] mb-2 block">最小: ¥0</label>
                  <input type="range" min="0" max="2000000" className="w-full" />
                </div>
                <div>
                  <label className="text-sm text-[#314158] mb-2 block">最大: ¥2,000,000</label>
                  <input type="range" min="0" max="2000000" className="w-full" />
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-3 text-sm text-[#314158]">
                  ¥0 - ¥2,000,000
                </div>
              </div>
            </div>

            {/* 評価 */}
            <div>
              <h4 className="text-base font-medium text-[#0f172b] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
                </svg>
                評価
              </h4>
              <div className="space-y-3">
                {[5, 4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="rating" className="w-4 h-4" />
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
                        </svg>
                      ))}
                      <span className="text-sm text-[#314158]">以上</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* サービス一覧 */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-[#0f172b]">サービス一覧</h2>
              <p className="text-sm text-[#62748e] mt-1">
                {DUMMY_SERVICES.length}件 / 全{DUMMY_SERVICES.length}件のサービス
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-[42px] px-4 border border-[#cad5e2] rounded-lg text-sm"
            >
              <option value="recommended">おすすめ順</option>
              <option value="price-low">価格が安い順</option>
              <option value="price-high">価格が高い順</option>
              <option value="rating">評価が高い順</option>
            </select>
          </div>

          {/* サービスカードグリッド */}
          <div className="grid grid-cols-2 gap-6">
            {DUMMY_SERVICES.map(service => (
              <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* 画像 */}
                <div className="relative h-64 bg-slate-200">
                  {service.badge && (
                    <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-3 py-1 rounded">
                      {service.badge}
                    </span>
                  )}
                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-slate-50">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeWidth="1.5" d="M10 3.5c-3.5-2-7 .5-7 4 0 4.5 7 9 7 9s7-4.5 7-9c0-3.5-3.5-6-7-4z" />
                    </svg>
                  </button>
                </div>

                {/* コンテンツ */}
                <div className="p-4">
                  <p className="text-xs text-[#62748e] mb-2">{service.category}</p>
                  <h3 className="text-base font-medium text-[#0f172b] mb-3 line-clamp-2">
                    {service.title}
                  </h3>

                  {/* 評価 */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-[#314158]">
                      {service.rating} ({service.reviews})
                    </span>
                  </div>

                  {/* 価格 */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-medium text-[#0f172b]">
                      ¥{service.price.toLocaleString()}
                    </span>
                    {service.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ¥{service.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* 詳細ボタン */}
                  <Link
                    href={`/client/services/${service.id}`}
                    className="w-full h-11 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    詳細
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 3l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

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
                <li><Link href="#" className="hover:text-white">お得な情報</Link></li>
                <li><Link href="#" className="hover:text-white">よくある質問</Link></li>
                <li><Link href="#" className="hover:text-white">ブログ</Link></li>
              </ul>
            </div>

            {/* サポート */}
            <div>
              <h3 className="text-base font-medium mb-4">サポート</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="#" className="hover:text-white">ヘルプセンター</Link></li>
                <li><Link href="#" className="hover:text-white">お問い合わせ</Link></li>
                <li><Link href="#" className="hover:text-white">返金ポリシー</Link></li>
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
          <div className="border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">
              © 2025 HATAMO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
