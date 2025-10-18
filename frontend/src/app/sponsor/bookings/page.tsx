'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SponsorLayout } from '@/components/sponsor/SponsorLayout';

// 統計データ
const STATS = [
  {
    id: 'all',
    label: '全申込',
    value: '12件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" d="M9 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'pending',
    label: '承認待ち',
    value: '3件',
    badge: '要対応',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'in-progress',
    label: '進行中',
    value: '5件',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'completed',
    label: '完了',
    value: '3件',
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

// 申込データ
const BOOKINGS = [
  {
    id: '1',
    service: 'Webサイト制作',
    clientName: '渡辺真理子',
    clientInitial: '渡',
    status: '承認待ち',
    statusVariant: 'pending' as const,
    amount: 50000,
    receivedAmount: 32500,
    date: '10/03',
    actions: ['approve', 'reject', 'detail'],
  },
  {
    id: '2',
    service: 'Webサイト制作',
    clientName: '中村さくら',
    clientInitial: '中',
    status: '承認待ち',
    statusVariant: 'pending' as const,
    amount: 50000,
    receivedAmount: 32500,
    date: '10/02',
    actions: ['approve', 'reject', 'detail'],
  },
  {
    id: '3',
    service: 'Webサイト制作',
    clientName: '佐藤花子',
    clientInitial: '佐',
    status: '承認待ち',
    statusVariant: 'pending' as const,
    amount: 50000,
    receivedAmount: 32500,
    date: '10/01',
    actions: ['approve', 'reject', 'detail'],
  },
  {
    id: '4',
    service: 'SEOコンサル',
    clientName: '山田一郎',
    clientInitial: '山',
    status: '進行中',
    statusVariant: 'progress' as const,
    amount: 30000,
    receivedAmount: 22500,
    date: '09/28',
    actions: ['complete', 'detail', 'message'],
  },
  {
    id: '5',
    service: 'ロゴデザイン',
    clientName: '鈴木次郎',
    clientInitial: '鈴',
    status: '決済済み',
    statusVariant: 'info' as const,
    amount: 20000,
    receivedAmount: 11000,
    date: '09/25',
    actions: ['start', 'detail', 'message'],
  },
  {
    id: '6',
    service: 'LP制作',
    clientName: '加藤美優',
    clientInitial: '加',
    status: '進行中',
    statusVariant: 'progress' as const,
    amount: 40000,
    receivedAmount: 26000,
    date: '09/22',
    actions: ['complete', 'detail', 'message'],
  },
  {
    id: '7',
    service: 'LP制作',
    clientName: '田中太郎',
    clientInitial: '田',
    status: '完了',
    statusVariant: 'completed' as const,
    amount: 40000,
    receivedAmount: 26000,
    date: '09/20',
    actions: ['detail', 'review'],
  },
  {
    id: '8',
    service: 'SEOコンサル',
    clientName: '高橋健一',
    clientInitial: '高',
    status: '承認済み',
    statusVariant: 'info' as const,
    amount: 30000,
    receivedAmount: 22500,
    date: '09/18',
    actions: ['detail', 'message', 'cancel'],
  },
  {
    id: '9',
    service: '広告運用代行',
    clientName: '伊藤美咲',
    clientInitial: '伊',
    status: '進行中',
    statusVariant: 'progress' as const,
    amount: 80000,
    receivedAmount: 36000,
    date: '09/15',
    actions: ['complete', 'detail', 'message'],
  },
  {
    id: '10',
    service: 'ロゴデザイン',
    clientName: '小林拓也',
    clientInitial: '小',
    status: '完了',
    statusVariant: 'completed' as const,
    amount: 20000,
    receivedAmount: 11000,
    date: '09/10',
    actions: ['detail', 'review'],
  },
];

// アクションボタンラベル
const ACTION_LABELS = {
  approve: '承認',
  reject: '拒否',
  detail: '詳細',
  complete: '完了',
  message: 'メッセージ',
  start: '作業開始',
  review: 'レビュー確認',
  cancel: 'キャンセル',
};

export default function SponsorBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SponsorLayout>
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-[#0f172b]">申込管理</h1>
          <div className="mt-3 w-20 h-1 bg-blue-500 rounded-full"></div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {STATS.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-9">
                <div className={`w-12 h-9 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.iconColor}`}>
                  {stat.icon}
                </div>
                {stat.badge && (
                  <Badge variant="warning" className="h-[22px]">
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#62748e] mb-5">{stat.label}</p>
              <p className="text-2xl font-medium text-[#0f172b]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 検索・フィルターセクション */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <div className="space-y-4">
            {/* 検索バー */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 20 20">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12.5 12.5l4 4" />
              </svg>
              <Input
                type="text"
                placeholder="クライアント名・サービス名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 bg-white border-slate-200"
              />
            </div>

            {/* フィルター */}
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-9 justify-between min-w-[180px]">
                <span className="text-sm">すべて</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                </svg>
              </Button>
              <Button variant="outline" className="h-9 justify-between min-w-[200px]">
                <span className="text-sm">すべてのサービス</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                </svg>
              </Button>
              <Button variant="outline" className="h-9 justify-between min-w-[200px]">
                <span className="text-sm">申込日（新しい順）</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* 申込テーブル */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-6 py-3 text-base font-medium text-[#0f172b]">サービス</th>
                  <th className="text-left px-6 py-3 text-base font-medium text-[#0f172b]">クライアント</th>
                  <th className="text-left px-6 py-3 text-base font-medium text-[#0f172b]">ステータス</th>
                  <th className="text-left px-6 py-3 text-base font-medium text-[#0f172b]">金額/受取額</th>
                  <th className="text-left px-6 py-3 text-base font-medium text-[#0f172b]">申込日</th>
                  <th className="text-center px-6 py-3 text-base font-medium text-[#0f172b]">アクション</th>
                </tr>
              </thead>
              <tbody>
                {BOOKINGS.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-6 text-base text-[#0f172b]">{booking.service}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {booking.clientInitial}
                        </div>
                        <span className="text-base text-[#0f172b]">{booking.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <Badge variant={booking.statusVariant} className="h-[22px]">
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-base font-medium text-[#0f172b]">¥{booking.amount.toLocaleString()}</p>
                        <p className="text-sm text-[#62748e]">↓¥{booking.receivedAmount.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-base text-[#0f172b]">{booking.date}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {booking.actions.map((action) => {
                          const label = ACTION_LABELS[action as keyof typeof ACTION_LABELS];

                          if (action === 'detail') {
                            return (
                              <Link key={action} href={`/sponsor/bookings/${booking.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-sm"
                                >
                                  {label}
                                </Button>
                              </Link>
                            );
                          }

                          return (
                            <Button
                              key={action}
                              variant={action === 'approve' ? 'default' : 'outline'}
                              size="sm"
                              className="h-8 text-sm"
                            >
                              {label}
                            </Button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          <div className="flex items-center justify-between px-6 py-6 border-t border-slate-200">
            <p className="text-sm text-[#62748e]">12件中 1～10件を表示</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                前へ
              </Button>
              <Button variant="default" size="sm" className="h-8 min-w-[30px]">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 min-w-[30px]">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                次へ
              </Button>
            </div>
          </div>
        </div>
      </main>
    </SponsorLayout>
  );
}
