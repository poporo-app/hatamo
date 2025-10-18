'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceRegistrationModal } from '@/components/sponsor/ServiceRegistrationModal';
import { SponsorLayout } from '@/components/sponsor/SponsorLayout';

// 統計データ
const STATS = [
  {
    id: 'total',
    label: '全サービス',
    value: '8件',
    detail: '公開: 6件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
  },
  {
    id: 'published',
    label: '公開中',
    value: '6件',
    detail: '利用可能',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'unpublished',
    label: '非公開',
    value: '2件',
    detail: '下書き・停止中',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5M12 16h.01" />
      </svg>
    ),
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
  },
  {
    id: 'rating',
    label: '平均評価',
    value: '4.7',
    detail: '42件の申込',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3 7h7l-5.5 4.5 2 7-6.5-5-6.5 5 2-7L2 9h7z" />
      </svg>
    ),
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
];

// サービスデータ
const SERVICES = [
  {
    id: '1',
    title: 'Webサイト制作',
    category: 'IT開発',
    description: 'コーポレートサイト構築サービス。レスポンシブ対応、SEO最適化込み。',
    price: 50000,
    commissionRate: 35,
    bookings: 12,
    rating: 4.8,
    status: 'published',
    image: '/placeholder-service.jpg',
  },
  {
    id: '2',
    title: 'SEOコンサル',
    category: 'マーケティング',
    description: '検索順位改善支援サービス。キーワード戦略から実装まで。',
    price: 30000,
    commissionRate: 25,
    bookings: 8,
    rating: 4.5,
    status: 'published',
    image: '/placeholder-service.jpg',
  },
  {
    id: '3',
    title: 'ロゴデザイン',
    category: 'IT開発',
    description: '企業ブランドロゴ制作。複数案提示、修正回数無制限。',
    price: 20000,
    commissionRate: 45,
    bookings: 5,
    rating: 4.9,
    status: 'published',
    image: '/placeholder-service.jpg',
  },
  {
    id: '4',
    title: 'LP制作',
    category: 'IT開発',
    description: 'ランディングページ構築サービス。コンバージョン重視設計。',
    price: 40000,
    commissionRate: 35,
    bookings: 7,
    rating: 4.6,
    status: 'published',
    image: '/placeholder-service.jpg',
  },
  {
    id: '5',
    title: '広告運用代行',
    category: 'マーケティング',
    description: 'Google Ads運用サポート。月次レポート、改善提案付き。',
    price: 80000,
    commissionRate: 55,
    bookings: 10,
    rating: 4.7,
    status: 'published',
    image: '/placeholder-service.jpg',
  },
  {
    id: '6',
    title: '動画編集',
    category: 'IT開発',
    description: 'プロモーション動画制作。YouTube、SNS向け最適化。',
    price: 35000,
    commissionRate: 35,
    bookings: 0,
    rating: null,
    status: 'unpublished',
    image: '/placeholder-service.jpg',
  },
  {
    id: '7',
    title: '経営コンサル',
    category: 'コンサル',
    description: '事業戦略策定支援。市場分析から実行計画まで。',
    price: 100000,
    commissionRate: 55,
    bookings: 0,
    rating: null,
    status: 'unpublished',
    image: '/placeholder-service.jpg',
  },
  {
    id: '8',
    title: 'SNS運用',
    category: 'マーケティング',
    description: 'Instagram運用代行。投稿作成、エンゲージメント管理。',
    price: 25000,
    commissionRate: 25,
    bookings: 0,
    rating: null,
    status: 'published',
    image: '/placeholder-service.jpg',
  },
];

export default function SponsorServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceSubmit = (data: any) => {
    console.log('New service data:', data);
    // TODO: APIと連携してサービスを作成
    setIsModalOpen(false);
  };

  return (
    <SponsorLayout>
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* ページヘッダー */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-medium text-[#0f172b] mb-3">サービス管理</h1>
            <p className="text-base text-[#45556c]">提供中のサービスの確認・編集</p>
          </div>
          <Button
            className="h-9 px-4 bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8 3v10M3 8h10" />
            </svg>
            新規サービス作成
          </Button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {STATS.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-6 ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <p className="text-sm text-[#62748e] mb-3">{stat.label}</p>
              <p className="text-2xl font-medium text-[#0f172b] mb-2">{stat.value}</p>
              {stat.detail && (
                <p className="text-sm text-[#62748e]">{stat.detail}</p>
              )}
            </div>
          ))}
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
          {/* 検索バー */}
          <div className="relative mb-8">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12.5 12.5l5 5" />
            </svg>
            <Input
              type="text"
              placeholder="サービス名・説明で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-10 pr-4 w-full border-slate-200 text-sm"
            />
          </div>

          {/* フィルター */}
          <div className="grid grid-cols-3 gap-4">
            <button className="h-9 px-3 flex items-center justify-between bg-white border border-slate-200 rounded-lg text-sm text-[#0f172b] hover:bg-slate-50 transition-colors">
              <span>すべて</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
              </svg>
            </button>
            <button className="h-9 px-3 flex items-center justify-between bg-white border border-slate-200 rounded-lg text-sm text-[#0f172b] hover:bg-slate-50 transition-colors">
              <span>すべてのカテゴリ</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
              </svg>
            </button>
            <button className="h-9 px-3 flex items-center justify-between bg-white border border-slate-200 rounded-lg text-sm text-[#0f172b] hover:bg-slate-50 transition-colors">
              <span>更新日（新しい順）</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* 結果件数 */}
        <p className="text-sm text-[#62748e] mb-4">8件のサービスが見つかりました</p>

        {/* サービスカードグリッド */}
        <div className="grid grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-white rounded-xl overflow-hidden border border-slate-200">
              {/* サービス画像 */}
              <div className="relative h-48 bg-slate-200">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  サービス画像
                </div>
                {/* ステータスバッジ */}
                <Badge
                  className={`absolute top-3.5 right-4 ${
                    service.status === 'published'
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-500 text-white'
                  }`}
                >
                  {service.status === 'published' ? '公開中' : '非公開'}
                </Badge>
              </div>

              {/* サービス情報 */}
              <div className="p-6">
                {/* カテゴリ・タイトル */}
                <div className="mb-4">
                  <h3 className="text-base font-medium text-[#0f172b] mb-2">{service.title}</h3>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                    {service.category}
                  </Badge>
                </div>

                {/* 説明 */}
                <p className="text-sm text-[#62748e] mb-4 line-clamp-2">{service.description}</p>

                {/* 詳細情報 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#62748e]">価格</span>
                    <span className="text-[#0f172b] font-medium">¥{service.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#62748e]">手数料率</span>
                    <span className="text-[#0f172b] font-medium">{service.commissionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#62748e]">申込数</span>
                    <span className="text-[#0f172b] font-medium">{service.bookings}件</span>
                  </div>
                  {service.rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#62748e]">評価</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
                        </svg>
                        <span className="text-[#0f172b] font-medium">{service.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1 h-8 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 8s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" />
                    </svg>
                    プレビュー
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M2 14l8.5-8.5M14 5l-3-3M11 2h3v3M7 14h7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* サービス登録モーダル */}
      <ServiceRegistrationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleServiceSubmit}
      />
    </SponsorLayout>
  );
}
