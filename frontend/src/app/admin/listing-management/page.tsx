'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { getAppRole } from '@/lib/config';

interface Business {
  id: number;
  companyName: string;
  category: string;
  description: string;
  isPublished: boolean;
  publishedDate?: string;
  applications: number;
  rating: number;
  reviewCount: number;
  location: string;
  minBudget: number;
  maxBudget: number;
  tags: string[];
  lastActivity: string;
}

export default function ListingManagementPage() {
  const role = getAppRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBusinesses, setSelectedBusinesses] = useState<number[]>([]);

  const mockBusinesses: Business[] = [
    {
      id: 1,
      companyName: '株式会社テックソリューション',
      category: 'IT・技術',
      description: 'AIを活用したビジネスソリューションの開発・提供',
      isPublished: true,
      publishedDate: '2024-01-10',
      applications: 23,
      rating: 4.8,
      reviewCount: 15,
      location: '東京都',
      minBudget: 500000,
      maxBudget: 2000000,
      tags: ['AI', 'システム開発', 'DX'],
      lastActivity: '2024-01-15',
    },
    {
      id: 2,
      companyName: '合同会社クリエイティブワークス',
      category: 'クリエイティブ',
      description: 'Webデザイン、グラフィックデザイン、ブランディング支援',
      isPublished: true,
      publishedDate: '2024-01-12',
      applications: 18,
      rating: 4.6,
      reviewCount: 12,
      location: '大阪府',
      minBudget: 200000,
      maxBudget: 800000,
      tags: ['Webデザイン', 'ブランディング', 'UI/UX'],
      lastActivity: '2024-01-14',
    },
    {
      id: 3,
      companyName: 'マーケティングプロ',
      category: 'マーケティング',
      description: 'デジタルマーケティング戦略立案・実行支援',
      isPublished: false,
      applications: 8,
      rating: 4.3,
      reviewCount: 7,
      location: '愛知県',
      minBudget: 300000,
      maxBudget: 1500000,
      tags: ['デジタルマーケティング', 'SNS運用', 'SEO'],
      lastActivity: '2024-01-13',
    },
    {
      id: 4,
      companyName: 'コンサルティングファーム東京',
      category: 'コンサルティング',
      description: '経営戦略、業務改善、組織開発のコンサルティング',
      isPublished: true,
      publishedDate: '2024-01-08',
      applications: 31,
      rating: 4.9,
      reviewCount: 22,
      location: '東京都',
      minBudget: 1000000,
      maxBudget: 5000000,
      tags: ['経営戦略', '業務改善', '組織開発'],
      lastActivity: '2024-01-15',
    },
    {
      id: 5,
      companyName: 'ファイナンシャルアドバイザーズ',
      category: '金融・財務',
      description: '財務コンサルティング、資金調達支援、M&Aアドバイザリー',
      isPublished: false,
      applications: 5,
      rating: 4.7,
      reviewCount: 8,
      location: '神奈川県',
      minBudget: 800000,
      maxBudget: 3000000,
      tags: ['財務', '資金調達', 'M&A'],
      lastActivity: '2024-01-11',
    },
  ];

  const categories = ['all', 'IT・技術', 'クリエイティブ', 'マーケティング', 'コンサルティング', '金融・財務'];

  const filteredBusinesses = mockBusinesses.filter(business => {
    const matchesSearch = business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || business.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && business.isPublished) ||
                         (statusFilter === 'unpublished' && !business.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleTogglePublish = (id: number) => {
    const business = mockBusinesses.find(b => b.id === id);
    if (business) {
      const action = business.isPublished ? '非公開' : '公開';
      alert(`${business.companyName} を${action}に設定しました`);
    }
  };

  const handleBulkAction = (action: 'publish' | 'unpublish') => {
    if (selectedBusinesses.length === 0) {
      alert('操作対象を選択してください');
      return;
    }
    const actionText = action === 'publish' ? '公開' : '非公開';
    alert(`選択した${selectedBusinesses.length}件の事業者を${actionText}に設定しました`);
    setSelectedBusinesses([]);
  };

  const handleSelectBusiness = (id: number) => {
    setSelectedBusinesses(prev => 
      prev.includes(id) 
        ? prev.filter(businessId => businessId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBusinesses.length === filteredBusinesses.length) {
      setSelectedBusinesses([]);
    } else {
      setSelectedBusinesses(filteredBusinesses.map(b => b.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Header role={role} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">掲載管理</h1>
          <p className="text-purple-700 mt-2">事業者リストの公開・非公開設定と掲載情報管理</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="企業名または説明で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '全てのカテゴリ' : category}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">全てのステータス</option>
              <option value="published">公開中</option>
              <option value="unpublished">非公開</option>
            </select>
          </div>

          {selectedBusinesses.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-700 font-medium">{selectedBusinesses.length}件選択中</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  theme="admin"
                  variant="success"
                  onClick={() => handleBulkAction('publish')}
                >
                  一括公開
                </Button>
                <Button
                  size="sm"
                  theme="admin"
                  variant="secondary"
                  onClick={() => handleBulkAction('unpublish')}
                >
                  一括非公開
                </Button>
              </div>
            </div>
          )}
        </div>

        <Card title={`事業者リスト (${filteredBusinesses.length}件)`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-100">
                  <th className="text-left py-3">
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="text-left py-3 text-purple-900 font-semibold">企業名</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">カテゴリ</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">申込数</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">評価</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">予算範囲</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">ステータス</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">最終活動</th>
                  <th className="text-left py-3 text-purple-900 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((business) => (
                  <tr key={business.id} className="border-b border-purple-50 hover:bg-purple-25">
                    <td className="py-4">
                      <input
                        type="checkbox"
                        checked={selectedBusinesses.includes(business.id)}
                        onChange={() => handleSelectBusiness(business.id)}
                        className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-gray-900">{business.companyName}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">{business.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {business.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {business.tags.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{business.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-700">{business.category}</td>
                    <td className="py-4 text-sm font-medium text-gray-900">{business.applications}件</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium text-gray-900 ml-1">{business.rating}</span>
                        <span className="text-sm text-gray-600 ml-1">({business.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-700">
                      {formatCurrency(business.minBudget)} - {formatCurrency(business.maxBudget)}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          business.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {business.isPublished ? '公開中' : '非公開'}
                        </span>
                        {business.isPublished && business.publishedDate && (
                          <span className="text-xs text-gray-500">
                            {business.publishedDate}から
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{business.lastActivity}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          theme="admin"
                          variant={business.isPublished ? "secondary" : "success"}
                          onClick={() => handleTogglePublish(business.id)}
                          className="text-xs"
                        >
                          {business.isPublished ? '非公開' : '公開'}
                        </Button>
                        <Button
                          size="sm"
                          theme="admin"
                          variant="secondary"
                          className="text-xs"
                        >
                          詳細
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="公開統計">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">公開中</span>
                <span className="text-2xl font-bold text-green-600">
                  {mockBusinesses.filter(b => b.isPublished).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">非公開</span>
                <span className="text-2xl font-bold text-gray-600">
                  {mockBusinesses.filter(b => !b.isPublished).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">総数</span>
                <span className="text-2xl font-bold text-purple-600">
                  {mockBusinesses.length}
                </span>
              </div>
            </div>
          </Card>

          <Card title="カテゴリ別分布">
            <div className="space-y-3">
              {categories.filter(c => c !== 'all').map(category => {
                const count = mockBusinesses.filter(b => b.category === category).length;
                const published = mockBusinesses.filter(b => b.category === category && b.isPublished).length;
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{category}</span>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{count}</span>
                      <span className="text-gray-500 ml-1">({published}公開)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="活動状況">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">今週活動</span>
                <span className="text-2xl font-bold text-blue-600">
                  {mockBusinesses.filter(b => new Date(b.lastActivity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">平均評価</span>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-xl font-bold text-gray-900 ml-1">
                    {(mockBusinesses.reduce((sum, b) => sum + b.rating, 0) / mockBusinesses.length).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">総申込数</span>
                <span className="text-2xl font-bold text-purple-600">
                  {mockBusinesses.reduce((sum, b) => sum + b.applications, 0)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}