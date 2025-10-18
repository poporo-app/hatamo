'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// 統計データ
const STATS = [
  {
    id: 'revenue',
    label: '今月の売上',
    value: '¥2,450,000',
    change: '+12.5%',
    changeType: 'increase' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" d="M12 2v20M7 7h10M7 12h10M7 17h10" />
      </svg>
    ),
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'new-bookings',
    label: '新規申込',
    value: '8件',
    change: '+3件',
    changeType: 'increase' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'in-progress',
    label: '進行中',
    value: '12件',
    detail: '納期順守率 95%',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
    ),
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'completed',
    label: '完了率',
    value: '98%',
    detail: '顧客満足度 4.9',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];

// マイサービスデータ
const MY_SERVICES = [
  {
    id: '1',
    title: 'Webサイト制作',
    category: 'IT開発',
    price: 500000,
    bookings: 24,
    rating: 4.9,
    status: 'active',
    image: '/placeholder-service.jpg',
  },
  {
    id: '2',
    title: 'UI/UXデザイン',
    category: 'IT開発',
    price: 350000,
    bookings: 18,
    rating: 4.8,
    status: 'active',
    image: '/placeholder-service.jpg',
  },
  {
    id: '3',
    title: 'SEOコンサルティング',
    category: 'マーケティング',
    price: 250000,
    bookings: 32,
    rating: 5.0,
    status: 'active',
    image: '/placeholder-service.jpg',
  },
  {
    id: '4',
    title: 'ロゴデザイン',
    category: 'IT開発',
    price: 150000,
    bookings: 41,
    rating: 4.7,
    status: 'active',
    image: '/placeholder-service.jpg',
  },
  {
    id: '5',
    title: 'LP制作',
    category: 'IT開発',
    price: 400000,
    bookings: 15,
    rating: 4.9,
    status: 'active',
    image: '/placeholder-service.jpg',
  },
  {
    id: '6',
    title: '広告運用代行',
    category: 'マーケティング',
    price: 800000,
    bookings: 9,
    rating: 4.8,
    status: 'active',
    image: '/placeholder-service.jpg',
  },
];

// 最近の申込データ
const RECENT_BOOKINGS = [
  {
    id: '1',
    clientName: '山田太郎',
    service: 'Webサイト制作',
    status: '進行中',
    statusVariant: 'progress' as const,
    date: '2024/10/12',
    amount: 500000,
    progress: 65,
  },
  {
    id: '2',
    clientName: '佐藤花子',
    service: 'SEOコンサルティング',
    status: '承認待ち',
    statusVariant: 'pending' as const,
    date: '2024/10/11',
    amount: 250000,
    progress: 0,
  },
  {
    id: '3',
    clientName: '田中一郎',
    service: 'UI/UXデザイン',
    status: '決済済み',
    statusVariant: 'info' as const,
    date: '2024/10/10',
    amount: 350000,
    progress: 15,
  },
  {
    id: '4',
    clientName: '鈴木美咲',
    service: 'ロゴデザイン',
    status: '完了',
    statusVariant: 'completed' as const,
    date: '2024/10/09',
    amount: 150000,
    progress: 100,
  },
  {
    id: '5',
    clientName: '高橋健太',
    service: '広告運用代行',
    status: '進行中',
    statusVariant: 'progress' as const,
    date: '2024/10/08',
    amount: 800000,
    progress: 45,
  },
];

// 売上グラフデータ
const REVENUE_DATA = [
  { month: '6月', amount: 1800000 },
  { month: '7月', amount: 2100000 },
  { month: '8月', amount: 1950000 },
  { month: '9月', amount: 2300000 },
  { month: '10月', amount: 2450000 },
];

// カテゴリ別売上データ
const CATEGORY_REVENUE = [
  { category: 'IT開発', amount: 4500000, percentage: 42, color: '#3b82f6' },
  { category: 'マーケティング', amount: 3200000, percentage: 30, color: '#10b981' },
  { category: 'コンサル', amount: 2000000, percentage: 19, color: '#f59e0b' },
  { category: 'その他', amount: 1000000, percentage: 9, color: '#8b5cf6' },
];

export default function SponsorDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // グラフの最大値を計算
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.amount));

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
              <span className="text-base text-[#0f172b]">田中</span>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-[1199px] mx-auto px-8">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 h-[50px] text-base border-b-2 transition-colors ${
                activeTab === 'dashboard'
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
            </button>
            <Link href="/sponsor/services" className="flex items-center gap-2 px-4 h-[50px] text-base border-b-2 border-transparent text-[#45556c] hover:text-[#0f172b] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" d="M2 5h12M2 9h12M2 13h12" />
              </svg>
              サービス
            </Link>
            <Link href="/sponsor/bookings" className="flex items-center gap-2 px-4 h-[50px] text-base border-b-2 border-transparent text-[#45556c] hover:text-[#0f172b] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M6 2v12M2 6h12M2 10h12" />
              </svg>
              申込
            </Link>
            <button className="flex items-center gap-2 px-4 h-[50px] text-base border-b-2 border-transparent text-[#45556c] hover:text-[#0f172b] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" d="M2 3l6 4 6-4M2 3v10h12V3" />
              </svg>
              メッセージ
            </button>
            <button className="flex items-center gap-2 px-4 h-[50px] text-base border-b-2 border-transparent text-[#45556c] hover:text-[#0f172b] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
              プロフィール
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* ダッシュボードタイトル */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-[#0f172b] mb-3">ダッシュボード</h1>
          <p className="text-base text-[#45556c]">サービス提供状況と売上の概要</p>
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
              {stat.change && (
                <p className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} <span className="text-[#62748e]">前月比</span>
                </p>
              )}
              {stat.detail && (
                <p className="text-sm text-[#62748e]">{stat.detail}</p>
              )}
            </div>
          ))}
        </div>

        {/* マイサービス一覧 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#0f172b]">マイサービス</h2>
            <Link href="/sponsor/services" className="text-sm text-[#62748e] hover:text-[#0f172b] flex items-center gap-2">
              すべて見る
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {MY_SERVICES.map((service) => (
                <Link key={service.id} href={`/sponsor/services/${service.id}`} className="group">
                  <div className="relative h-[160px] bg-slate-200 rounded-lg mb-4 overflow-hidden">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      サービス画像
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="inline-block text-xs text-[#62748e] bg-slate-100 px-2 py-1 rounded">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-[#0f172b] mb-2 group-hover:text-blue-500">
                    {service.title}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-medium text-[#0f172b]">
                      ¥{service.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" />
                      </svg>
                      <span className="text-sm text-[#314158]">{service.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#62748e]">{service.bookings}件の申込</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* 最近の申込 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#0f172b]">最近の申込</h2>
              <Link href="/sponsor/bookings" className="text-sm text-[#62748e] hover:text-[#0f172b] flex items-center gap-2">
                すべて見る
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {RECENT_BOOKINGS.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-[#0f172b]">{booking.clientName}</p>
                        <Badge variant={booking.statusVariant}>{booking.status}</Badge>
                      </div>
                      <p className="text-xs text-[#62748e] mb-1">{booking.service}</p>
                      <p className="text-xs text-[#62748e]">{booking.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#0f172b] mb-1">
                        ¥{booking.amount.toLocaleString()}
                      </p>
                      {booking.progress > 0 && (
                        <p className="text-xs text-[#62748e]">{booking.progress}%完了</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 売上推移 */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-6 border-b border-slate-200">
              <h2 className="text-xl font-medium text-[#0f172b]">売上推移</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {REVENUE_DATA.map((data, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#62748e]">{data.month}</span>
                      <span className="text-sm font-medium text-[#0f172b]">
                        ¥{(data.amount / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(data.amount / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium mb-2">新しいサービスを追加しませんか？</h2>
              <p className="text-blue-100">より多くの顧客にリーチして、売上を拡大しましょう</p>
            </div>
            <Link
              href="/sponsor/services/new"
              className="flex items-center gap-2 h-12 px-6 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 5v10M5 10h10" />
              </svg>
              サービスを追加
            </Link>
          </div>
        </div>

        {/* グラフセクション */}
        <div className="grid grid-cols-2 gap-6">
          {/* 月別売上推移（棒グラフ） */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-6 border-b border-slate-200">
              <h2 className="text-xl font-medium text-[#0f172b]">月別売上推移</h2>
              <p className="text-sm text-[#62748e] mt-1">過去5ヶ月の売上データ</p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between gap-4 h-[280px]">
                {REVENUE_DATA.map((data, index) => {
                  const heightPercentage = (data.amount / maxRevenue) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                      <div className="relative w-full flex items-end justify-center h-[220px]">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 relative group"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            ¥{(data.amount / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-[#0f172b]">{data.month}</p>
                        <p className="text-xs text-[#62748e] mt-1">
                          ¥{(data.amount / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* カテゴリ別売上（円グラフ） */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-6 border-b border-slate-200">
              <h2 className="text-xl font-medium text-[#0f172b]">カテゴリ別売上</h2>
              <p className="text-sm text-[#62748e] mt-1">今月の売上構成</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-8">
                {/* ドーナツチャート */}
                <div className="relative w-[200px] h-[200px]">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90" suppressHydrationWarning>
                    {(() => {
                      let currentAngle = 0;
                      return CATEGORY_REVENUE.map((category, index) => {
                        const angle = (category.percentage / 100) * 360;
                        const radius = 80;
                        const innerRadius = 55;
                        const centerX = 100;
                        const centerY = 100;

                        // 外側の円弧
                        const startAngleRad = (currentAngle * Math.PI) / 180;
                        const endAngleRad = ((currentAngle + angle) * Math.PI) / 180;

                        const x1 = Number((centerX + radius * Math.cos(startAngleRad)).toFixed(2));
                        const y1 = Number((centerY + radius * Math.sin(startAngleRad)).toFixed(2));
                        const x2 = Number((centerX + radius * Math.cos(endAngleRad)).toFixed(2));
                        const y2 = Number((centerY + radius * Math.sin(endAngleRad)).toFixed(2));

                        const x3 = Number((centerX + innerRadius * Math.cos(endAngleRad)).toFixed(2));
                        const y3 = Number((centerY + innerRadius * Math.sin(endAngleRad)).toFixed(2));
                        const x4 = Number((centerX + innerRadius * Math.cos(startAngleRad)).toFixed(2));
                        const y4 = Number((centerY + innerRadius * Math.sin(startAngleRad)).toFixed(2));

                        const largeArcFlag = angle > 180 ? 1 : 0;

                        const pathData = [
                          `M ${x1} ${y1}`,
                          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `L ${x3} ${y3}`,
                          `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                          'Z',
                        ].join(' ');

                        currentAngle += angle;

                        return (
                          <path
                            key={index}
                            d={pathData}
                            fill={category.color}
                            className="transition-opacity hover:opacity-80"
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-medium text-[#0f172b]">総売上</p>
                    <p className="text-sm text-[#62748e] mt-1">¥10.7M</p>
                  </div>
                </div>

                {/* 凡例 */}
                <div className="flex-1 space-y-3">
                  {CATEGORY_REVENUE.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm text-[#0f172b]">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#0f172b]">
                          {category.percentage}%
                        </p>
                        <p className="text-xs text-[#62748e]">
                          ¥{(category.amount / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
