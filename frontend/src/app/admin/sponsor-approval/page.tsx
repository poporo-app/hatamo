'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { getAppRole } from '@/lib/config';

interface SponsorApplication {
  id: number;
  companyName: string;
  representativeName: string;
  email: string;
  businessType: string;
  category: string;
  applicationDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'resubmit_required';
  documents: {
    businessRegistration: boolean;
    taxDocument: boolean;
    bankAccount: boolean;
    identity: boolean;
  };
  description: string;
  capital: string;
  employees: string;
  establishedYear: string;
  website?: string;
  phone: string;
  address: string;
}

export default function SponsorApprovalPage() {
  const role = getAppRole();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<SponsorApplication | null>(null);

  const mockApplications: SponsorApplication[] = [
    {
      id: 1,
      companyName: '株式会社テックソリューション',
      representativeName: '田中 太郎',
      email: 'tanaka@techsolution.co.jp',
      businessType: '株式会社',
      category: 'IT・技術',
      applicationDate: '2024-01-15',
      status: 'pending',
      documents: {
        businessRegistration: true,
        taxDocument: true,
        bankAccount: true,
        identity: true,
      },
      description: 'AIを活用したビジネスソリューションの開発・提供を行っています。',
      capital: '1,000万円',
      employees: '25名',
      establishedYear: '2018年',
      website: 'https://techsolution.co.jp',
      phone: '03-1234-5678',
      address: '東京都渋谷区渋谷1-1-1',
    },
    {
      id: 2,
      companyName: '合同会社クリエイティブワークス',
      representativeName: '佐藤 花子',
      email: 'sato@creativeworks.jp',
      businessType: '合同会社',
      category: 'クリエイティブ',
      applicationDate: '2024-01-14',
      status: 'reviewing',
      documents: {
        businessRegistration: true,
        taxDocument: true,
        bankAccount: false,
        identity: true,
      },
      description: 'Webデザイン、グラフィックデザイン、ブランディング支援を行っています。',
      capital: '300万円',
      employees: '8名',
      establishedYear: '2020年',
      website: 'https://creativeworks.jp',
      phone: '06-9876-5432',
      address: '大阪府大阪市中央区本町2-2-2',
    },
    {
      id: 3,
      companyName: '個人事業主 山田コンサルティング',
      representativeName: '山田 次郎',
      email: 'yamada@consulting.com',
      businessType: '個人事業主',
      category: 'コンサルティング',
      applicationDate: '2024-01-13',
      status: 'resubmit_required',
      documents: {
        businessRegistration: false,
        taxDocument: true,
        bankAccount: true,
        identity: true,
      },
      description: '中小企業向け経営コンサルティングサービスを提供しています。',
      capital: '-',
      employees: '1名',
      establishedYear: '2019年',
      phone: '090-1111-2222',
      address: '愛知県名古屋市中区栄3-3-3',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'resubmit_required':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査待ち';
      case 'reviewing':
        return '審査中';
      case 'approved':
        return '承認済み';
      case 'rejected':
        return '否認';
      case 'resubmit_required':
        return '再申請依頼';
      default:
        return status;
    }
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.representativeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id: number) => {
    alert(`申請ID ${id} を承認しました`);
    setSelectedApplication(null);
  };

  const handleReject = (id: number) => {
    alert(`申請ID ${id} を否認しました`);
    setSelectedApplication(null);
  };

  const handleRequestResubmit = (id: number) => {
    alert(`申請ID ${id} に再申請を依頼しました`);
    setSelectedApplication(null);
  };

  return (
    <>
      <Header role={role} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">スポンサー審査</h1>
          <p className="text-purple-700 mt-2">スポンサー申請の審査・承認・否認処理</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="企業名または代表者名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">全てのステータス</option>
            <option value="pending">審査待ち</option>
            <option value="reviewing">審査中</option>
            <option value="resubmit_required">再申請依頼</option>
            <option value="approved">承認済み</option>
            <option value="rejected">否認</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title={`スポンサー申請一覧 (${filteredApplications.length}件)`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-100">
                      <th className="text-left py-3 text-purple-900 font-semibold">企業名</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">代表者</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">カテゴリ</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">申請日</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">ステータス</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b border-purple-50 hover:bg-purple-25">
                        <td className="py-4 text-sm font-medium text-gray-900">{application.companyName}</td>
                        <td className="py-4 text-sm text-gray-700">{application.representativeName}</td>
                        <td className="py-4 text-sm text-gray-700">{application.category}</td>
                        <td className="py-4 text-sm text-gray-700">{application.applicationDate}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            theme="admin"
                            onClick={() => setSelectedApplication(application)}
                            className="text-xs"
                          >
                            詳細
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedApplication ? (
              <Card title="申請詳細">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">基本情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">企業名:</span> {selectedApplication.companyName}</div>
                      <div><span className="font-medium">代表者:</span> {selectedApplication.representativeName}</div>
                      <div><span className="font-medium">事業形態:</span> {selectedApplication.businessType}</div>
                      <div><span className="font-medium">設立年:</span> {selectedApplication.establishedYear}</div>
                      <div><span className="font-medium">資本金:</span> {selectedApplication.capital}</div>
                      <div><span className="font-medium">従業員数:</span> {selectedApplication.employees}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">連絡先</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">メール:</span> {selectedApplication.email}</div>
                      <div><span className="font-medium">電話:</span> {selectedApplication.phone}</div>
                      <div><span className="font-medium">住所:</span> {selectedApplication.address}</div>
                      {selectedApplication.website && (
                        <div><span className="font-medium">Website:</span> <a href={selectedApplication.website} className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">{selectedApplication.website}</a></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">事業内容</h4>
                    <p className="text-sm text-gray-700">{selectedApplication.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">提出書類</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedApplication.documents).map(([key, submitted]) => {
                        const labels = {
                          businessRegistration: '登記簿謄本',
                          taxDocument: '納税証明書',
                          bankAccount: '口座確認書類',
                          identity: '代表者身分証明書',
                        };
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm">{labels[key as keyof typeof labels]}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${submitted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {submitted ? '提出済み' : '未提出'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedApplication.status === 'pending' || selectedApplication.status === 'reviewing' ? (
                    <div className="space-y-3 pt-4">
                      <Button
                        fullWidth
                        theme="admin"
                        variant="success"
                        onClick={() => handleApprove(selectedApplication.id)}
                      >
                        承認
                      </Button>
                      <Button
                        fullWidth
                        theme="admin"
                        variant="secondary"
                        onClick={() => handleRequestResubmit(selectedApplication.id)}
                      >
                        再申請依頼
                      </Button>
                      <Button
                        fullWidth
                        theme="admin"
                        variant="danger"
                        onClick={() => handleReject(selectedApplication.id)}
                      >
                        否認
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <div className={`px-4 py-3 rounded-lg text-center font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusText(selectedApplication.status)}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="申請詳細">
                <div className="text-center text-gray-500 py-8">
                  申請を選択してください
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