'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Link from 'next/link';
import { useState } from 'react';

interface Application {
  id: number;
  service: string;
  customer: string;
  customerEmail: string;
  date: string;
  status: '新着' | '対応中' | '見積提出' | '契約中' | '完了' | 'キャンセル';
  amount?: number;
  priority: '高' | '中' | '低';
}

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  date: string;
  isRead: boolean;
  type: 'email' | 'line' | 'system';
}

interface SalesData {
  month: string;
  revenue: number;
  cases: number;
  commission: number;
}

export default function BusinessDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'applications' | 'messages' | 'sales'>('overview');

  const stats = [
    { 
      label: '今月の申込数', 
      value: '28', 
      change: '+12%', 
      trend: 'up',
      description: '先月比較'
    },
    { 
      label: '今月の売上', 
      value: '¥1,240,000', 
      change: '+18%', 
      trend: 'up',
      description: '手数料差引前'
    },
    { 
      label: '未読メッセージ', 
      value: '7', 
      change: '3件新着', 
      trend: 'neutral',
      description: 'メール・LINE含む'
    },
    { 
      label: '対応待ち案件', 
      value: '5', 
      change: '2件緊急', 
      trend: 'attention',
      description: '見積・返信待ち'
    },
  ];

  const applications: Application[] = [
    { 
      id: 1, 
      service: 'ECサイト構築', 
      customer: '田中商事', 
      customerEmail: 'tanaka@example.com',
      date: '2024/01/18', 
      status: '新着',
      amount: 500000,
      priority: '高'
    },
    { 
      id: 2, 
      service: 'Webデザイン', 
      customer: '佐藤企画', 
      customerEmail: 'sato@example.com',
      date: '2024/01/17', 
      status: '対応中',
      amount: 150000,
      priority: '中'
    },
    { 
      id: 3, 
      service: 'マーケティング戦略', 
      customer: '鈴木マーケティング', 
      customerEmail: 'suzuki@example.com',
      date: '2024/01/16', 
      status: '見積提出',
      amount: 300000,
      priority: '中'
    },
    { 
      id: 4, 
      service: 'システム保守', 
      customer: '山田システム', 
      customerEmail: 'yamada@example.com',
      date: '2024/01/15', 
      status: '契約中',
      amount: 80000,
      priority: '低'
    },
    { 
      id: 5, 
      service: 'ブランディング', 
      customer: '高橋ブランズ', 
      customerEmail: 'takahashi@example.com',
      date: '2024/01/14', 
      status: '完了',
      amount: 250000,
      priority: '低'
    },
  ];

  const messages: Message[] = [
    {
      id: 1,
      from: '田中商事 田中様',
      subject: 'ECサイト構築について詳細確認',
      preview: '提案いただいたECサイトの機能について、いくつか確認したい点があります...',
      date: '2024/01/18 14:30',
      isRead: false,
      type: 'email'
    },
    {
      id: 2,
      from: 'HATAMO運営',
      subject: '月次売上レポートのお知らせ',
      preview: '1月の売上実績をまとめたレポートをお送りします...',
      date: '2024/01/18 10:00',
      isRead: false,
      type: 'system'
    },
    {
      id: 3,
      from: '佐藤企画 佐藤様',
      subject: 'Webデザイン進捗確認',
      preview: 'お世話になります。デザインの初稿を確認いたしました...',
      date: '2024/01/17 16:45',
      isRead: true,
      type: 'line'
    },
    {
      id: 4,
      from: '鈴木マーケティング 鈴木様',
      subject: '見積書の件について',
      preview: 'ご提案いただいた見積書を拝見し、検討させていただいております...',
      date: '2024/01/17 11:20',
      isRead: false,
      type: 'email'
    },
  ];

  const salesData: SalesData[] = [
    { month: '2024/01', revenue: 1240000, cases: 28, commission: 74400 },
    { month: '2023/12', revenue: 1050000, cases: 25, commission: 63000 },
    { month: '2023/11', revenue: 890000, cases: 22, commission: 53400 },
    { month: '2023/10', revenue: 1150000, cases: 26, commission: 69000 },
    { month: '2023/09', revenue: 980000, cases: 21, commission: 58800 },
    { month: '2023/08', revenue: 1380000, cases: 31, commission: 82800 },
  ];

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case '新着':
        return 'bg-red-100 text-red-800 border-red-200';
      case '対応中':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '見積提出':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '契約中':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '完了':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'キャンセル':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Application['priority']) => {
    switch (priority) {
      case '高':
        return 'bg-red-500';
      case '中':
        return 'bg-yellow-500';
      case '低':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMessageTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'line':
        return '💬';
      case 'system':
        return '🔔';
      default:
        return '📬';
    }
  };

  const renderOverview = () => (
    <>
      {/* メイン統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className={`text-sm flex items-center ${
                  stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'attention' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {stat.trend === 'up' && '↗️ '}
                  {stat.trend === 'attention' && '⚠️ '}
                  {stat.change}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* クイックアクション */}
      <Card title="クイックアクション" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/business/register-case" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition group">
            <div className="text-2xl mr-3">➕</div>
            <div>
              <div className="font-medium text-green-900 group-hover:text-green-800">新しい案件登録</div>
              <div className="text-xs text-green-700">サービスを追加</div>
            </div>
          </Link>
          
          <button 
            onClick={() => setSelectedTab('messages')}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition group"
          >
            <div className="text-2xl mr-3 relative">
              💬
              {messages.filter(m => !m.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messages.filter(m => !m.isRead).length}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium text-blue-900 group-hover:text-blue-800">メッセージ確認</div>
              <div className="text-xs text-blue-700">{messages.filter(m => !m.isRead).length}件未読</div>
            </div>
          </button>

          <button 
            onClick={() => setSelectedTab('applications')}
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition group"
          >
            <div className="text-2xl mr-3">📋</div>
            <div>
              <div className="font-medium text-yellow-900 group-hover:text-yellow-800">申込管理</div>
              <div className="text-xs text-yellow-700">{applications.filter(a => a.status === '新着' || a.status === '対応中').length}件要対応</div>
            </div>
          </button>

          <button 
            onClick={() => setSelectedTab('sales')}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition group"
          >
            <div className="text-2xl mr-3">📊</div>
            <div>
              <div className="font-medium text-purple-900 group-hover:text-purple-800">売上明細</div>
              <div className="text-xs text-purple-700">今月¥{stats[1].value.replace('¥', '').replace(',', '')}</div>
            </div>
          </button>
        </div>
      </Card>

      {/* 最近の活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="最新の申込状況">
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(app.priority)}`}></div>
                  <div>
                    <div className="font-medium text-gray-800">{app.service}</div>
                    <div className="text-sm text-gray-600">{app.customer}</div>
                    <div className="text-xs text-gray-500">{app.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </div>
                  {app.amount && (
                    <div className="text-sm text-gray-600 mt-1">
                      ¥{app.amount.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setSelectedTab('applications')}
            className="text-green-600 hover:text-green-700 font-medium text-sm mt-4 inline-block"
          >
            すべての申込を見る →
          </button>
        </Card>

        <Card title="重要な通知">
          <div className="space-y-3">
            {messages.slice(0, 4).map((message) => (
              <div key={message.id} className={`p-3 rounded-lg border transition cursor-pointer ${
                message.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
              } hover:shadow-sm`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    <span className="text-lg">{getMessageTypeIcon(message.type)}</span>
                    <div className="flex-1">
                      <div className={`font-medium ${message.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {message.from}
                      </div>
                      <div className={`text-sm ${message.isRead ? 'text-gray-600' : 'text-gray-800'} mb-1`}>
                        {message.subject}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {message.preview}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {message.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setSelectedTab('messages')}
            className="text-green-600 hover:text-green-700 font-medium text-sm mt-4 inline-block"
          >
            すべてのメッセージを見る →
          </button>
        </Card>
      </div>
    </>
  );

  const renderApplications = () => (
    <Card title="申込一覧">
      <div className="mb-4 flex flex-wrap gap-2">
        {(['新着', '対応中', '見積提出', '契約中', '完了', 'キャンセル'] as const).map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded-full text-xs border transition ${getStatusColor(status)} hover:opacity-80`}
          >
            {status} ({applications.filter(app => app.status === status).length})
          </button>
        ))}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2">優先度</th>
              <th className="text-left py-3 px-2">サービス</th>
              <th className="text-left py-3 px-2">顧客</th>
              <th className="text-left py-3 px-2">金額</th>
              <th className="text-left py-3 px-2">日付</th>
              <th className="text-left py-3 px-2">ステータス</th>
              <th className="text-left py-3 px-2">アクション</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(app.priority)}`}></div>
                </td>
                <td className="py-3 px-2 font-medium">{app.service}</td>
                <td className="py-3 px-2">
                  <div>{app.customer}</div>
                  <div className="text-xs text-gray-500">{app.customerEmail}</div>
                </td>
                <td className="py-3 px-2">
                  {app.amount ? `¥${app.amount.toLocaleString()}` : '-'}
                </td>
                <td className="py-3 px-2 text-sm">{app.date}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">詳細</button>
                    {app.status === '新着' && (
                      <button className="text-green-600 hover:text-green-800 text-sm">対応</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderMessages = () => (
    <Card title="メッセージ一覧">
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`p-4 rounded-lg border transition cursor-pointer ${
            message.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
          } hover:shadow-sm`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-2xl">{getMessageTypeIcon(message.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`font-medium ${message.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {message.from}
                    </div>
                    {!message.isRead && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                    )}
                  </div>
                  <div className={`text-sm ${message.isRead ? 'text-gray-600' : 'text-gray-800'} mb-2`}>
                    {message.subject}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {message.preview}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                {message.date}
              </div>
            </div>
            <div className="flex justify-end mt-3 space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">返信</button>
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                {message.isRead ? '未読にする' : '既読にする'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderSales = () => (
    <div className="space-y-6">
      <Card title="売上サマリー">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">今月売上</div>
            <div className="text-2xl font-bold text-green-800">¥1,240,000</div>
            <div className="text-xs text-green-600">手数料差引前</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">手数料</div>
            <div className="text-2xl font-bold text-blue-800">¥74,400</div>
            <div className="text-xs text-blue-600">6%適用</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 mb-1">手取り金額</div>
            <div className="text-2xl font-bold text-purple-800">¥1,165,600</div>
            <div className="text-xs text-purple-600">振込予定額</div>
          </div>
        </div>
      </Card>

      <Card title="月次売上明細">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">月</th>
                <th className="text-right py-3">売上高</th>
                <th className="text-right py-3">成約件数</th>
                <th className="text-right py-3">手数料</th>
                <th className="text-right py-3">手取り金額</th>
                <th className="text-center py-3">明細</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((data, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{data.month}</td>
                  <td className="py-3 text-right font-medium">¥{data.revenue.toLocaleString()}</td>
                  <td className="py-3 text-right">{data.cases}件</td>
                  <td className="py-3 text-right text-red-600">-¥{data.commission.toLocaleString()}</td>
                  <td className="py-3 text-right font-bold text-green-600">
                    ¥{(data.revenue - data.commission).toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">詳細</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">振込スケジュール</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• 売上確定：月末締め</div>
            <div>• 振込日：翌月25日（銀行営業日）</div>
            <div>• 最低振込額：¥1,000以上</div>
            <div>• 振込手数料：当社負担</div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="business" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">事業者ダッシュボード</h1>
          <p className="text-gray-600 mt-2">ビジネスの状況を一目で確認・管理</p>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'ダッシュボード', icon: '📊' },
                { key: 'applications', label: '案件一覧', icon: '📋' },
                { key: 'messages', label: 'メッセージ', icon: '💬' },
                { key: 'sales', label: '売上明細', icon: '💰' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.key === 'messages' && messages.filter(m => !m.isRead).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {messages.filter(m => !m.isRead).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* タブコンテンツ */}
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'applications' && renderApplications()}
        {selectedTab === 'messages' && renderMessages()}
        {selectedTab === 'sales' && renderSales()}
      </main>

      <Footer />
    </div>
  );
}