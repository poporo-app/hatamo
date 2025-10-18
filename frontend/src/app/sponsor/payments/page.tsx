'use client';

import { useState } from 'react';
import { SponsorLayout } from '@/components/sponsor/SponsorLayout';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock data for payment history
const paymentData = [
  {
    id: '#BK-2024-001',
    date: '2024/10/03 10:15',
    service: 'Webサイト制作',
    client: '佐藤花子',
    totalAmount: 60000,
    commission: 17500,
    commissionRate: 33,
    status: '支払済',
    paymentId: 'pay_1234567890',
  },
  {
    id: '#BK-2024-002',
    date: '2024/09/28 15:30',
    service: 'SEOコンサル',
    client: '山田一郎',
    totalAmount: 30000,
    commission: 7500,
    commissionRate: 25,
    status: '決済完了',
    paymentId: 'pay_9876543210',
  },
  {
    id: '#BK-2024-003',
    date: '2024/09/25 09:45',
    service: 'ロゴデザイン',
    client: '鈴木太郎',
    totalAmount: 70000,
    commission: 9000,
    commissionRate: 45,
    status: '支払済',
    paymentId: 'pay_1122334455',
  },
  {
    id: '#BK-2024-004',
    date: '2024/09/20 14:20',
    service: 'LP制作',
    client: '田中太郎',
    totalAmount: 140000,
    commission: 14000,
    commissionRate: 33,
    status: '支払済',
    paymentId: 'pay_5443322211',
  },
  {
    id: '#BK-2024-005',
    date: '2024/09/15 11:00',
    service: '広告運用代行',
    client: '伊藤美咲',
    totalAmount: 90000,
    commission: 44000,
    commissionRate: 55,
    status: '決済完了',
    paymentId: 'pay_7890123456',
  },
  {
    id: '#BK-2024-006',
    date: '2024/09/10 16:45',
    service: 'Webサイト制作',
    client: '高橋健',
    totalAmount: 60000,
    commission: 17500,
    commissionRate: 33,
    status: '支払未完',
    paymentId: 'pay_0987654321',
  },
  {
    id: '#BK-2024-007',
    date: '2024/09/05 13:15',
    service: 'SEOコンサル',
    client: '小林桜',
    totalAmount: 30000,
    commission: 7500,
    commissionRate: 25,
    status: '支払済',
    paymentId: 'pay_1231231234',
  },
  {
    id: '#BK-2024-008',
    date: '2024/08/28 10:30',
    service: 'ロゴデザイン',
    client: '五郎美優',
    totalAmount: 70000,
    commission: 9000,
    commissionRate: 45,
    status: '支払済',
    paymentId: 'pay_4545454545',
  },
];

// Stats summary
const statsData = {
  totalPayments: 8,
  completedPayments: 5,
  totalRevenue: 270000,
  monthlyIncome: 161500,
  previousMonthIncome: 108340,
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('すべてのステータス');
  const [dateFilter, setDateFilter] = useState('決済日（新しい順）');

  // Calculate percentage change
  const incomeChangePercent = ((statsData.monthlyIncome - statsData.previousMonthIncome) / statsData.previousMonthIncome * 100).toFixed(0);

  return (
    <SponsorLayout>
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-[#0f172b] mb-8">決済履歴</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Payments Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" d="M4 8h12M4 12h12M6 4h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-1">総決済件数</p>
            <p className="text-2xl font-semibold text-[#0f172b]">{statsData.totalPayments}件</p>
          </div>

          {/* Completed Payments Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 10l2 2 4-4" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-1">支払完了</p>
            <p className="text-2xl font-semibold text-[#0f172b]">{statsData.completedPayments}件</p>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" d="M5 10l3 3 7-7M3 17h14a2 2 0 002-2V5a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-1">総売上</p>
            <p className="text-2xl font-semibold text-[#0f172b]">¥{statsData.totalRevenue.toLocaleString()}</p>
          </div>

          {/* Monthly Income Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeWidth="1.5" d="M10 3v14M3 10h14" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-1">純収収益</p>
            <p className="text-2xl font-semibold text-[#0f172b]">¥{statsData.monthlyIncome.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">
              予想計: ¥{statsData.previousMonthIncome.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="サービス名、クライアント名、決済ID、申込番号で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-slate-200"
              />
            </div>

            {/* Status Filter */}
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="すべてのステータス">すべてのステータス</SelectItem>
                  <SelectItem value="支払済">支払済</SelectItem>
                  <SelectItem value="決済完了">決済完了</SelectItem>
                  <SelectItem value="支払未完">支払未完</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="w-[200px]">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="並び替え" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="決済日（新しい順）">決済日（新しい順）</SelectItem>
                  <SelectItem value="決済日（古い順）">決済日（古い順）</SelectItem>
                  <SelectItem value="金額（高い順）">金額（高い順）</SelectItem>
                  <SelectItem value="金額（低い順）">金額（低い順）</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">決済日</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">申込番号</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">サービス</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">クライアント</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">全額/受取額</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">手数料</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">ステータス</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-600">決済ID</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((payment, index) => (
                  <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-900">{payment.date}</td>
                    <td className="py-4 px-6">
                      <button className="text-sm text-blue-500 hover:underline">{payment.id}</button>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-900">{payment.service}</td>
                    <td className="py-4 px-6 text-sm text-slate-900">{payment.client}</td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-900 font-medium">¥{payment.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-blue-500">
                        +手数料: ¥{payment.commission.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-900">¥{payment.commission.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">({payment.commissionRate}%)</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          payment.status === '支払済'
                            ? 'default'
                            : payment.status === '決済完了'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className={
                          payment.status === '支払済'
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border-0'
                            : payment.status === '決済完了'
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-0'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border-0'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">{payment.paymentId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              1-8件を表示（全8件中）
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-400 bg-slate-50 cursor-not-allowed"
              >
                前へ
              </button>
              <button className="px-3 py-1.5 text-sm border border-blue-500 bg-blue-500 text-white rounded-lg">
                1
              </button>
              <button
                disabled
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-400 bg-slate-50 cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      </main>
    </SponsorLayout>
  );
}
