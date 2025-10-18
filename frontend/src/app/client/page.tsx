'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientLayout } from '@/components/client/ClientLayout';

// ダッシュボード用ダミーデータ
const STATS = [
  {
    id: 'in-progress',
    label: '進行中',
    value: '3件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    id: 'completed',
    label: '完了',
    value: '12件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    id: 'messages',
    label: 'メッセージ',
    value: '5件未読',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    id: 'favorites',
    label: 'お気に入り',
    value: '8件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" d="M12 6c-3.5-2-7 .5-7 4 0 4.5 7 9 7 9s7-4.5 7-9c0-3.5-3.5-6-7-4z" />
      </svg>
    ),
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
  },
];

// サービス管理用ダミーデータ
const SERVICE_STATS = [
  {
    id: 'all',
    label: '全サービス',
    value: '12件',
    badge: '要対応',
    badgeVariant: 'warning' as const,
    detail: 'アクティブ: 6件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
    bgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  {
    id: 'progress',
    label: '進行中',
    value: '6件',
    detail: '作業進行中',
    detailColor: 'text-green-600',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    id: 'completed',
    label: '完了',
    value: '4件',
    detail: '満足度: 4.9',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  {
    id: 'payment',
    label: '総支払額',
    value: '¥380,000',
    detail: '今月の実績',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" d="M12 6v12M9 9h6M9 15h6" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
];

type ServiceAction = 'detail' | 'contact' | 'review' | 'payment' | 'cancel';

const SERVICES = [
  {
    id: '1',
    name: 'Webサイト制作',
    category: 'IT開発',
    partner: '田中太郎',
    rating: 4.8,
    status: '進行中',
    statusVariant: 'progress' as const,
    progress: 65,
    dueDate: '10/15',
    amount: 50000,
    image: '/placeholder-service.jpg',
    actions: ['detail', 'contact'] as ServiceAction[],
  },
  {
    id: '2',
    name: 'SEOコンサル',
    category: 'マーケティング',
    partner: '佐藤花子',
    rating: 5.0,
    status: '完了',
    statusVariant: 'completed' as const,
    progress: null,
    dueDate: null,
    amount: 30000,
    image: '/placeholder-service.jpg',
    actions: ['detail', 'review'] as ServiceAction[],
  },
  {
    id: '3',
    name: 'ロゴデザイン',
    category: 'IT開発',
    partner: '山田一郎',
    rating: 4.5,
    status: '承認待ち',
    statusVariant: 'pending' as const,
    progress: null,
    dueDate: '10/10',
    amount: 20000,
    image: '/placeholder-service.jpg',
    actions: ['detail', 'payment'] as ServiceAction[],
  },
  {
    id: '4',
    name: 'LP制作',
    category: 'IT開発',
    partner: '鈴木次郎',
    rating: 4.9,
    status: '申込中',
    statusVariant: 'warning' as const,
    progress: null,
    dueDate: null,
    amount: 40000,
    image: '/placeholder-service.jpg',
    actions: ['detail', 'cancel'] as ServiceAction[],
  },
  {
    id: '5',
    name: '広告運用代行',
    category: 'マーケティング',
    partner: '伊藤美咲',
    rating: 4.7,
    status: '決済済み',
    statusVariant: 'info' as const,
    progress: null,
    dueDate: '10/30',
    amount: 80000,
    image: '/placeholder-service.jpg',
    actions: ['detail', 'contact'] as ServiceAction[],
  },
  {
    id: '6',
    name: '動画編集',
    category: 'IT開発',
    partner: '高橋健一',
    rating: 4.6,
    status: 'キャンセル',
    statusVariant: 'default' as const,
    progress: null,
    dueDate: null,
    amount: 35000,
    image: '/placeholder-service.jpg',
    actions: ['detail'] as ServiceAction[],
  },
  {
    id: '7',
    name: '経営コンサル',
    category: 'コンサル',
    partner: '中村明美',
    rating: 4.9,
    status: '完了',
    statusVariant: 'completed' as const,
    progress: null,
    dueDate: null,
    amount: 100000,
    image: '/placeholder-service.jpg',
    actions: ['detail'] as ServiceAction[],
  },
  {
    id: '8',
    name: 'SNS運用',
    category: 'マーケティング',
    partner: '小林裕子',
    rating: 4.4,
    status: '進行中',
    statusVariant: 'progress' as const,
    progress: 45,
    dueDate: '10/20',
    amount: 25000,
    image: '/placeholder-service.jpg',
    actions: ['detail', 'contact'] as ServiceAction[],
  },
  {
    id: '9',
    name: 'ブランディング戦略',
    category: 'マーケティング',
    partner: '加藤誠',
    rating: 4.8,
    status: '完了',
    statusVariant: 'completed' as const,
    progress: null,
    dueDate: null,
    amount: 60000,
    image: '/placeholder-service.jpg',
    actions: ['detail'] as ServiceAction[],
  },
  {
    id: '10',
    name: 'UI/UXデザイン',
    category: 'IT開発',
    partner: '吉田太一',
    rating: 4.7,
    status: '返金済み',
    statusVariant: 'default' as const,
    progress: null,
    dueDate: null,
    amount: 45000,
    image: '/placeholder-service.jpg',
    actions: ['detail'] as ServiceAction[],
  },
];

const RECENT_BOOKINGS = [
  {
    id: '1',
    service: 'Webサイト制作',
    sponsor: '田中太郎',
    status: '進行中',
    statusColor: 'bg-blue-100 text-blue-700',
    date: '2024/10/01',
    amount: '¥500,000',
  },
  {
    id: '2',
    service: 'SEOコンサル',
    sponsor: '佐藤花子',
    status: '支払済',
    statusColor: 'bg-green-100 text-green-700',
    date: '2024/09/28',
    amount: '¥250,000',
  },
  {
    id: '3',
    service: 'ロゴデザイン',
    sponsor: '山田一郎',
    status: '保留中',
    statusColor: 'bg-yellow-100 text-yellow-700',
    date: '2024/09/25',
    amount: '¥150,000',
  },
];

const RECOMMENDED_SERVICES = [
  {
    id: '1',
    title: 'UI/UXデザイン制作',
    price: '¥450,000',
    rating: 4.8,
    image: '/placeholder-service.jpg',
  },
  {
    id: '2',
    title: 'モバイルアプリ開発',
    price: '¥1,200,000',
    rating: 4.9,
    image: '/placeholder-service.jpg',
  },
];

const RECENTLY_VIEWED = [
  {
    id: '1',
    title: 'SNSマーケティング戦略',
    price: '¥300,000',
    rating: 4.8,
    image: '/placeholder-service.jpg',
  },
  {
    id: '2',
    title: '資産運用コンサルティング',
    price: '¥200,000',
    rating: 4.9,
    image: '/placeholder-service.jpg',
  },
  {
    id: '3',
    title: 'パーソナルトレーニング',
    price: '¥150,000',
    rating: 4.7,
    image: '/placeholder-service.jpg',
  },
];

const ACTIVITIES = [
  {
    id: '1',
    message: '田中太郎さんがメッセージを送信しました',
    time: '5分前',
  },
  {
    id: '2',
    message: '「Webサイト制作」の申込がスポンサーに承認されました',
    time: '1時間前',
  },
  {
    id: '3',
    message: '佐藤花子さんとのチャットが開始されました',
    time: '2時間前',
  },
  {
    id: '4',
    message: '「SEOコンサル」の決済が完了しました',
    time: '昨日',
  },
];

export default function ClientDashboardPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <ClientLayout>
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {activeTab === 'dashboard' ? (
          <>
            {/* ダッシュボードコンテンツ */}
            <div className="mb-8">
              <h1 className="text-4xl font-medium text-[#0f172b] mb-3">ダッシュボード</h1>
              <p className="text-base text-[#45556c]">あなたのサービス利用状況</p>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {STATS.map((stat) => (
                <div key={stat.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-10 ${stat.iconColor}`}>
                    {stat.icon}
                  </div>
                  <p className="text-sm text-[#62748e] mb-3">{stat.label}</p>
                  <p className="text-2xl font-medium text-[#0f172b] mb-4">{stat.value}</p>
                  <button className="text-sm text-[#62748e] hover:text-[#0f172b] flex items-center justify-center gap-2 w-full">
                    詳細
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* 最近の申込 */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-xl font-medium text-[#0f172b]">最近の申込</h2>
                <button className="text-sm text-[#62748e] hover:text-[#0f172b] flex items-center gap-2">
                  すべて見る
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#62748e]">サービス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#62748e]">スポンサー</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#62748e]">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#62748e]">日付</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#62748e]">金額</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#62748e]">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_BOOKINGS.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-5 text-sm text-[#0f172b]">{booking.service}</td>
                        <td className="px-6 py-5 text-sm text-[#314158]">{booking.sponsor}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex px-2 py-1 text-xs rounded ${booking.statusColor}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#314158]">{booking.date}</td>
                        <td className="px-6 py-5 text-sm text-[#0f172b] font-medium">{booking.amount}</td>
                        <td className="px-6 py-5">
                          <button className="text-sm text-[#62748e] hover:text-[#0f172b]">詳細</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* おすすめサービスと最近見たサービス */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* おすすめサービス */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-[#0f172b]">おすすめサービス</h2>
                  <button className="text-sm text-[#62748e] hover:text-[#0f172b] flex items-center gap-2">
                    もっと見る
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {RECOMMENDED_SERVICES.map((service) => (
                      <Link key={service.id} href={`/client/services/${service.id}`} className="group">
                        <div className="relative h-[137px] bg-slate-200 rounded-lg mb-3 overflow-hidden">
                          {/* Placeholder for image */}
                        </div>
                        <h3 className="text-sm font-medium text-[#0f172b] mb-2 group-hover:text-blue-500">
                          {service.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-[#0f172b]">{service.price}</span>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
                            </svg>
                            <span className="text-sm text-[#314158]">{service.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* 最近見たサービス */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-[#0f172b]">最近見たサービス</h2>
                  <button className="text-sm text-[#62748e] hover:text-[#0f172b] flex items-center gap-2">
                    もっと見る
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {RECENTLY_VIEWED.map((service) => (
                      <Link key={service.id} href={`/client/services/${service.id}`} className="group">
                        <div className="relative h-[157px] bg-slate-200 rounded-lg mb-2 overflow-hidden">
                          {/* Placeholder for image */}
                        </div>
                        <h3 className="text-xs font-medium text-[#0f172b] mb-2 group-hover:text-blue-500 line-clamp-2">
                          {service.title}
                        </h3>
                        <div className="mb-1">
                          <span className="text-xs text-[#0f172b]">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M6 1l1.5 3.5h3.5l-2.5 2 1.5 3.5-3.5-2-3.5 2 1.5-3.5-2.5-2h3.5z" />
                          </svg>
                          <span className="text-xs text-[#314158]">{service.rating}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* アクティビティ */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-6 border-b border-slate-200">
                <h2 className="text-2xl font-medium text-[#0f172b]">アクティビティ</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-[#0f172b] mb-1">{activity.message}</p>
                        <p className="text-xs text-[#62748e]">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* サービス管理コンテンツ */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-medium text-[#0f172b] mb-2">サービス管理</h1>
                <p className="text-base text-[#45556c]">申込したサービスの管理・確認</p>
              </div>
              <button className="flex items-center gap-2 h-8 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" d="M2 8h12M8 2v12" />
                </svg>
                エクスポート
              </button>
            </div>

            {/* 統計カード */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {SERVICE_STATS.map((stat) => (
                <div key={stat.id} className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-16">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.iconColor}`}>
                      {stat.icon}
                    </div>
                    {stat.badge && (
                      <Badge variant={stat.badgeVariant}>{stat.badge}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#45556c] mb-4">{stat.label}</p>
                  <p className="text-base text-[#0f172b] mb-7">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-[#45556c]" fill="currentColor" viewBox="0 0 12 12">
                      <circle cx="6" cy="6" r="5" />
                    </svg>
                    <p className={`text-xs ${stat.detailColor || 'text-[#45556c]'}`}>{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* タブフィルター */}
            <div className="bg-slate-100 rounded-xl p-1 inline-flex mb-6">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-4 h-7 text-sm font-medium rounded-lg transition-colors ${
                  serviceFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-900 hover:bg-white/50'
                }`}
              >
                すべて (12)
              </button>
              <button
                onClick={() => setServiceFilter('progress')}
                className={`px-4 h-7 text-sm font-medium rounded-lg transition-colors ${
                  serviceFilter === 'progress'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-900 hover:bg-white/50'
                }`}
              >
                進行中 (6)
              </button>
              <button
                onClick={() => setServiceFilter('completed')}
                className={`px-4 h-7 text-sm font-medium rounded-lg transition-colors ${
                  serviceFilter === 'completed'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-900 hover:bg-white/50'
                }`}
              >
                完了 (6)
              </button>
            </div>

            {/* 検索・フィルター */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
              <div className="mb-10">
                <div className="relative">
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                  </svg>
                  <Input
                    type="text"
                    placeholder="サービス名・パートナー名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 border-slate-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder="すべてのステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのステータス</SelectItem>
                    <SelectItem value="progress">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                    <SelectItem value="pending">承認待ち</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder="すべてのカテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのカテゴリ</SelectItem>
                    <SelectItem value="it">IT開発</SelectItem>
                    <SelectItem value="marketing">マーケティング</SelectItem>
                    <SelectItem value="consulting">コンサル</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 border-slate-200">
                    <SelectValue placeholder="申込日（新しい順）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">申込日（新しい順）</SelectItem>
                    <SelectItem value="oldest">申込日（古い順）</SelectItem>
                    <SelectItem value="amount-high">金額（高い順）</SelectItem>
                    <SelectItem value="amount-low">金額（安い順）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sm text-[#45556c] mb-4">12件のサービスが見つかりました</p>

            {/* サービステーブル */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">サービス</th>
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">パートナー</th>
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">ステータス</th>
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">進捗</th>
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">納期</th>
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">金額</th>
                      <th className="px-6 py-6 text-left text-base font-medium text-[#0f172b]">アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICES.map((service) => (
                      <tr key={service.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                            <div>
                              <p className="text-base text-[#0f172b] mb-1">{service.name}</p>
                              <p className="text-xs text-[#62748e]">{service.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-base text-[#0f172b] mb-1">{service.partner}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M6 1l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z" />
                                </svg>
                              ))}
                              <span className="text-xs text-[#62748e] ml-1">{service.rating}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={service.statusVariant}>{service.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          {service.progress ? (
                            <div>
                              <p className="text-xs text-[#62748e] mb-2">{service.progress}%</p>
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${service.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-[#62748e]">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {service.dueDate ? (
                            <div className="flex items-center gap-2 text-sm text-[#45556c]">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                                <path stroke="currentColor" strokeWidth="1.5" d="M8 4v4l2 2" />
                              </svg>
                              {service.dueDate}
                            </div>
                          ) : (
                            <span className="text-sm text-[#62748e]">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base text-[#0f172b]">¥{service.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {service.actions.includes('detail') && (
                              <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                                  <path stroke="currentColor" strokeWidth="1.5" d="M8 4v8M4 8h8" />
                                </svg>
                                詳細
                              </button>
                            )}
                            {service.actions.includes('contact') && (
                              <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                                  <path stroke="currentColor" strokeWidth="1.5" d="M2 3l6 4 6-4M2 3v10h12V3" />
                                </svg>
                                連絡
                              </button>
                            )}
                            {service.actions.includes('review') && (
                              <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                                  <path stroke="currentColor" strokeWidth="1.5" d="M8 2l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" />
                                </svg>
                                レビュー
                              </button>
                            )}
                            {service.actions.includes('payment') && (
                              <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                                  <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                  <path stroke="currentColor" strokeWidth="1.5" d="M2 6h12" />
                                </svg>
                                決済
                              </button>
                            )}
                            {service.actions.includes('cancel') && (
                              <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                                キャンセル
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ページネーション */}
              <div className="px-6 py-5 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-[#45556c]">12件中 1〜10件を表示</p>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10 12l-4-4 4-4" />
                    </svg>
                    前へ
                  </button>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-500 text-white text-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-900 text-sm hover:bg-slate-50">2</button>
                  </div>
                  <button className="flex items-center gap-1 h-8 px-3 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-50 transition-colors">
                    次へ
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* サポートカード */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 mt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path stroke="currentColor" strokeWidth="2" d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-[#0f172b] mb-2">サポートが必要ですか？</h3>
                  <p className="text-sm text-[#45556c] mb-4">サービスに関する質問やトラブルがある場合は、カスタマーサポートまでお問い合わせください。</p>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 h-8 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                        <path stroke="currentColor" strokeWidth="1.5" d="M8 6v4M8 11h.01" />
                      </svg>
                      ヘルプセンター
                    </button>
                    <button className="flex items-center gap-2 h-8 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 hover:bg-slate-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                        <path stroke="currentColor" strokeWidth="1.5" d="M2 3l6 4 6-4M2 3v10h12V3" />
                      </svg>
                      サポートに連絡
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </ClientLayout>
  );
}
