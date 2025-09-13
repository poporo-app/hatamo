'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { getAppRole } from '@/lib/config';

interface Application {
  id: number;
  applicationDate: string;
  userInfo: {
    name: string;
    email: string;
    company?: string;
    phone: string;
  };
  businessInfo: {
    id: number;
    name: string;
    category: string;
  };
  projectDetails: {
    title: string;
    description: string;
    budget: number;
    timeline: string;
    requirements: string[];
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  lastUpdate: string;
  matchingDate?: string;
  completionDate?: string;
  amount?: number;
  fee?: number;
}

export default function ApplicationManagementPage() {
  const role = getAppRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const mockApplications: Application[] = [
    {
      id: 1001,
      applicationDate: '2024-01-15',
      userInfo: {
        name: '田中 一郎',
        email: 'tanaka@example.com',
        company: '株式会社サンプル',
        phone: '03-1234-5678',
      },
      businessInfo: {
        id: 1,
        name: '株式会社テックソリューション',
        category: 'IT・技術',
      },
      projectDetails: {
        title: '社内業務システムの開発',
        description: '従業員管理と勤怠管理を統合したWebシステムの開発をお願いしたいです。',
        budget: 1500000,
        timeline: '3ヶ月',
        requirements: ['Webアプリケーション', 'データベース設計', 'セキュリティ対策', 'レスポンシブデザイン'],
      },
      status: 'in_progress',
      lastUpdate: '2024-01-15',
      matchingDate: '2024-01-16',
      amount: 1500000,
      fee: 150000,
    },
    {
      id: 1002,
      applicationDate: '2024-01-14',
      userInfo: {
        name: '佐藤 花子',
        email: 'sato@startup.co.jp',
        company: 'スタートアップ株式会社',
        phone: '06-9876-5432',
      },
      businessInfo: {
        id: 2,
        name: '合同会社クリエイティブワークス',
        category: 'クリエイティブ',
      },
      projectDetails: {
        title: 'ブランドリニューアルプロジェクト',
        description: '会社のロゴ、名刺、Webサイトのデザインを一新したいと考えています。',
        budget: 800000,
        timeline: '2ヶ月',
        requirements: ['ロゴデザイン', 'Webサイトデザイン', '印刷物デザイン', 'ブランドガイドライン'],
      },
      status: 'completed',
      lastUpdate: '2024-01-14',
      matchingDate: '2024-01-15',
      completionDate: '2024-01-14',
      amount: 800000,
      fee: 80000,
    },
    {
      id: 1003,
      applicationDate: '2024-01-13',
      userInfo: {
        name: '山田 太郎',
        email: 'yamada@retail.com',
        phone: '052-111-2222',
      },
      businessInfo: {
        id: 4,
        name: 'コンサルティングファーム東京',
        category: 'コンサルティング',
      },
      projectDetails: {
        title: '店舗運営効率化コンサルティング',
        description: '小売店チェーンの店舗運営を効率化し、売上向上を図りたいです。',
        budget: 2500000,
        timeline: '4ヶ月',
        requirements: ['現状分析', '改善提案', '実装支援', '効果測定'],
      },
      status: 'pending',
      lastUpdate: '2024-01-13',
    },
    {
      id: 1004,
      applicationDate: '2024-01-12',
      userInfo: {
        name: '鈴木 次郎',
        email: 'suzuki@manufacturing.jp',
        company: '製造業株式会社',
        phone: '045-333-4444',
      },
      businessInfo: {
        id: 3,
        name: 'マーケティングプロ',
        category: 'マーケティング',
      },
      projectDetails: {
        title: 'デジタルマーケティング戦略立案',
        description: 'BtoB製造業向けのデジタルマーケティング戦略を立案・実行してほしいです。',
        budget: 1200000,
        timeline: '6ヶ月',
        requirements: ['市場調査', 'ペルソナ設定', 'コンテンツ戦略', 'Web集客'],
      },
      status: 'accepted',
      lastUpdate: '2024-01-12',
      matchingDate: '2024-01-13',
    },
    {
      id: 1005,
      applicationDate: '2024-01-11',
      userInfo: {
        name: '高橋 美咲',
        email: 'takahashi@service.co.jp',
        company: 'サービス業株式会社',
        phone: '092-555-6666',
      },
      businessInfo: {
        id: 5,
        name: 'ファイナンシャルアドバイザーズ',
        category: '金融・財務',
      },
      projectDetails: {
        title: '資金調達アドバイザリー',
        description: '事業拡大のための資金調達について相談したいです。',
        budget: 1800000,
        timeline: '3ヶ月',
        requirements: ['資金計画策定', '投資家紹介', '事業計画ブラッシュアップ', '交渉支援'],
      },
      status: 'cancelled',
      lastUpdate: '2024-01-11',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査中';
      case 'accepted':
        return '承認済み';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      case 'rejected':
        return '却下';
      default:
        return status;
    }
  };

  const businesses = [...new Set(mockApplications.map(app => app.businessInfo.name))];

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.projectDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.businessInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesBusiness = businessFilter === 'all' || app.businessInfo.name === businessFilter;
    return matchesSearch && matchesStatus && matchesBusiness;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStats = () => {
    const stats = {
      total: mockApplications.length,
      pending: mockApplications.filter(app => app.status === 'pending').length,
      inProgress: mockApplications.filter(app => app.status === 'in_progress').length,
      completed: mockApplications.filter(app => app.status === 'completed').length,
      totalAmount: mockApplications
        .filter(app => app.amount)
        .reduce((sum, app) => sum + (app.amount || 0), 0),
      totalFee: mockApplications
        .filter(app => app.fee)
        .reduce((sum, app) => sum + (app.fee || 0), 0),
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <>
      <Header role={role} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">申込管理</h1>
          <p className="text-purple-700 mt-2">利用者申込一覧とステータス確認・管理</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-sm text-purple-600 mb-1">総申込数</div>
            <div className="text-2xl font-bold text-purple-900">{stats.total}</div>
            <div className="text-sm text-gray-500 mt-2">全期間</div>
          </Card>
          <Card>
            <div className="text-sm text-purple-600 mb-1">審査中</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-500 mt-2">要対応</div>
          </Card>
          <Card>
            <div className="text-sm text-purple-600 mb-1">進行中</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-500 mt-2">プロジェクト実行中</div>
          </Card>
          <Card>
            <div className="text-sm text-purple-600 mb-1">取引総額</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-sm text-gray-500 mt-2">手数料: {formatCurrency(stats.totalFee)}</div>
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="申込者名、プロジェクト名、事業者名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">全てのステータス</option>
            <option value="pending">審査中</option>
            <option value="accepted">承認済み</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
            <option value="rejected">却下</option>
          </select>
          <select
            value={businessFilter}
            onChange={(e) => setBusinessFilter(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">全ての事業者</option>
            {businesses.map(business => (
              <option key={business} value={business}>{business}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title={`申込一覧 (${filteredApplications.length}件)`}>
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-4 border border-purple-100 rounded-lg hover:border-purple-300 transition cursor-pointer"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{application.projectDetails.title}</h4>
                        <p className="text-sm text-gray-600">申込ID: {application.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">申込者:</span>
                        <span className="ml-2 font-medium">{application.userInfo.name}</span>
                        {application.userInfo.company && (
                          <span className="ml-1 text-gray-500">({application.userInfo.company})</span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500">事業者:</span>
                        <span className="ml-2 font-medium">{application.businessInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">予算:</span>
                        <span className="ml-2 font-medium text-green-600">{formatCurrency(application.projectDetails.budget)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">期間:</span>
                        <span className="ml-2 font-medium">{application.projectDetails.timeline}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      申込日: {application.applicationDate} | 最終更新: {application.lastUpdate}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedApplication ? (
              <Card title="申込詳細">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">プロジェクト情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">タイトル:</span> {selectedApplication.projectDetails.title}</div>
                      <div><span className="font-medium">説明:</span></div>
                      <div className="text-gray-700 p-2 bg-gray-50 rounded">{selectedApplication.projectDetails.description}</div>
                      <div><span className="font-medium">予算:</span> {formatCurrency(selectedApplication.projectDetails.budget)}</div>
                      <div><span className="font-medium">期間:</span> {selectedApplication.projectDetails.timeline}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">要件</h4>
                    <ul className="space-y-1">
                      {selectedApplication.projectDetails.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">申込者情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">氏名:</span> {selectedApplication.userInfo.name}</div>
                      <div><span className="font-medium">メール:</span> {selectedApplication.userInfo.email}</div>
                      <div><span className="font-medium">電話:</span> {selectedApplication.userInfo.phone}</div>
                      {selectedApplication.userInfo.company && (
                        <div><span className="font-medium">会社:</span> {selectedApplication.userInfo.company}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">事業者情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">事業者名:</span> {selectedApplication.businessInfo.name}</div>
                      <div><span className="font-medium">カテゴリ:</span> {selectedApplication.businessInfo.category}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">ステータス情報</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">現在のステータス:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                          {getStatusText(selectedApplication.status)}
                        </span>
                      </div>
                      <div><span className="font-medium">申込日:</span> {selectedApplication.applicationDate}</div>
                      {selectedApplication.matchingDate && (
                        <div><span className="font-medium">マッチング日:</span> {selectedApplication.matchingDate}</div>
                      )}
                      {selectedApplication.completionDate && (
                        <div><span className="font-medium">完了日:</span> {selectedApplication.completionDate}</div>
                      )}
                      {selectedApplication.amount && (
                        <div>
                          <div><span className="font-medium">取引額:</span> {formatCurrency(selectedApplication.amount)}</div>
                          <div><span className="font-medium">手数料:</span> {formatCurrency(selectedApplication.fee || 0)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      fullWidth
                      theme="admin"
                      variant="primary"
                      size="sm"
                    >
                      詳細管理画面
                    </Button>
                    <Button
                      fullWidth
                      theme="admin"
                      variant="secondary"
                      size="sm"
                    >
                      メッセージ履歴
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card title="申込詳細">
                <div className="text-center text-gray-500 py-8">
                  申込を選択してください
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}