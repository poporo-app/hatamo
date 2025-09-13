'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { getAppRole } from '@/lib/config';

interface Settlement {
  id: number;
  businessInfo: {
    id: number;
    name: string;
    bankAccount: {
      bankName: string;
      branchName: string;
      accountType: string;
      accountNumber: string;
      accountHolder: string;
    };
  };
  period: {
    start: string;
    end: string;
  };
  transactions: Transaction[];
  summary: {
    totalAmount: number;
    platformFee: number;
    taxAmount: number;
    netAmount: number;
    transactionCount: number;
  };
  status: 'pending' | 'calculated' | 'approved' | 'transferred' | 'completed';
  createdDate: string;
  approvedDate?: string;
  transferDate?: string;
  invoiceGenerated: boolean;
}

interface Transaction {
  id: number;
  projectTitle: string;
  clientName: string;
  amount: number;
  completionDate: string;
  applicationId: number;
}

export default function SettlementPage() {
  const role = getAppRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('current');
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const mockSettlements: Settlement[] = [
    {
      id: 2024001,
      businessInfo: {
        id: 1,
        name: '株式会社テックソリューション',
        bankAccount: {
          bankName: 'みずほ銀行',
          branchName: '渋谷支店',
          accountType: '普通',
          accountNumber: '1234567',
          accountHolder: 'カ)テックソリューション',
        },
      },
      period: {
        start: '2024-01-01',
        end: '2024-01-31',
      },
      transactions: [
        {
          id: 1,
          projectTitle: '社内業務システムの開発',
          clientName: '田中 一郎',
          amount: 1500000,
          completionDate: '2024-01-15',
          applicationId: 1001,
        },
        {
          id: 2,
          projectTitle: 'ECサイト構築',
          clientName: '佐藤商事株式会社',
          amount: 2200000,
          completionDate: '2024-01-28',
          applicationId: 1006,
        },
      ],
      summary: {
        totalAmount: 3700000,
        platformFee: 370000,
        taxAmount: 37000,
        netAmount: 3293000,
        transactionCount: 2,
      },
      status: 'pending',
      createdDate: '2024-02-01',
      invoiceGenerated: true,
    },
    {
      id: 2024002,
      businessInfo: {
        id: 2,
        name: '合同会社クリエイティブワークス',
        bankAccount: {
          bankName: 'りそな銀行',
          branchName: '本町支店',
          accountType: '普通',
          accountNumber: '9876543',
          accountHolder: 'ゴウ)クリエイティブワークス',
        },
      },
      period: {
        start: '2024-01-01',
        end: '2024-01-31',
      },
      transactions: [
        {
          id: 3,
          projectTitle: 'ブランドリニューアルプロジェクト',
          clientName: '佐藤 花子',
          amount: 800000,
          completionDate: '2024-01-20',
          applicationId: 1002,
        },
      ],
      summary: {
        totalAmount: 800000,
        platformFee: 80000,
        taxAmount: 8000,
        netAmount: 712000,
        transactionCount: 1,
      },
      status: 'approved',
      createdDate: '2024-02-01',
      approvedDate: '2024-02-03',
      invoiceGenerated: true,
    },
    {
      id: 2024003,
      businessInfo: {
        id: 4,
        name: 'コンサルティングファーム東京',
        bankAccount: {
          bankName: '三菱UFJ銀行',
          branchName: '丸の内支店',
          accountType: '普通',
          accountNumber: '5555555',
          accountHolder: 'カ)コンサルティングファームトウキョウ',
        },
      },
      period: {
        start: '2023-12-01',
        end: '2023-12-31',
      },
      transactions: [
        {
          id: 4,
          projectTitle: '店舗運営効率化コンサルティング',
          clientName: '山田 太郎',
          amount: 2500000,
          completionDate: '2023-12-25',
          applicationId: 1003,
        },
        {
          id: 5,
          projectTitle: '新規事業戦略立案',
          clientName: '鈴木物産株式会社',
          amount: 1800000,
          completionDate: '2023-12-20',
          applicationId: 1007,
        },
      ],
      summary: {
        totalAmount: 4300000,
        platformFee: 430000,
        taxAmount: 43000,
        netAmount: 3827000,
        transactionCount: 2,
      },
      status: 'completed',
      createdDate: '2024-01-01',
      approvedDate: '2024-01-03',
      transferDate: '2024-01-05',
      invoiceGenerated: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'calculated':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'transferred':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '計算待ち';
      case 'calculated':
        return '計算完了';
      case 'approved':
        return '承認済み';
      case 'transferred':
        return '振込処理中';
      case 'completed':
        return '完了';
      default:
        return status;
    }
  };

  const filteredSettlements = mockSettlements.filter(settlement => {
    const matchesSearch = settlement.businessInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    const matchesPeriod = periodFilter === 'all' || 
                         (periodFilter === 'current' && settlement.period.end >= '2024-01-01') ||
                         (periodFilter === 'previous' && settlement.period.end < '2024-01-01');
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleApproveSettlement = (id: number) => {
    alert(`精算ID ${id} を承認しました`);
  };

  const handleGenerateInvoice = (id: number) => {
    alert(`精算ID ${id} の明細PDFを生成しました`);
  };

  const handleInitiateTransfer = (id: number) => {
    alert(`精算ID ${id} の振込処理を開始しました`);
  };

  const getTotalStats = () => {
    return {
      pendingCount: mockSettlements.filter(s => s.status === 'pending').length,
      totalAmount: mockSettlements.reduce((sum, s) => sum + s.summary.totalAmount, 0),
      totalFee: mockSettlements.reduce((sum, s) => sum + s.summary.platformFee, 0),
      totalNet: mockSettlements.reduce((sum, s) => sum + s.summary.netAmount, 0),
    };
  };

  const stats = getTotalStats();

  return (
    <>
      <Header role={role} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">精算管理</h1>
          <p className="text-purple-700 mt-2">手数料控除後の振込額自動計算と明細PDF生成</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-sm text-purple-600 mb-1">処理待ち</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</div>
            <div className="text-sm text-gray-500 mt-2">要対応</div>
          </Card>
          <Card>
            <div className="text-sm text-purple-600 mb-1">総取引額</div>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalAmount)}</div>
            <div className="text-sm text-gray-500 mt-2">全期間</div>
          </Card>
          <Card>
            <div className="text-sm text-purple-600 mb-1">総手数料</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalFee)}</div>
            <div className="text-sm text-gray-500 mt-2">プラットフォーム収益</div>
          </Card>
          <Card>
            <div className="text-sm text-purple-600 mb-1">総振込額</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalNet)}</div>
            <div className="text-sm text-gray-500 mt-2">事業者受取額</div>
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="事業者名で検索..."
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
            <option value="pending">計算待ち</option>
            <option value="calculated">計算完了</option>
            <option value="approved">承認済み</option>
            <option value="transferred">振込処理中</option>
            <option value="completed">完了</option>
          </select>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">全期間</option>
            <option value="current">2024年</option>
            <option value="previous">2023年以前</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title={`精算一覧 (${filteredSettlements.length}件)`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-100">
                      <th className="text-left py-3 text-purple-900 font-semibold">精算ID</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">事業者</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">期間</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">取引数</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">取引額</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">振込額</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">ステータス</th>
                      <th className="text-left py-3 text-purple-900 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSettlements.map((settlement) => (
                      <tr 
                        key={settlement.id} 
                        className="border-b border-purple-50 hover:bg-purple-25 cursor-pointer"
                        onClick={() => setSelectedSettlement(settlement)}
                      >
                        <td className="py-4 text-sm font-medium text-gray-900">{settlement.id}</td>
                        <td className="py-4 text-sm text-gray-700">{settlement.businessInfo.name}</td>
                        <td className="py-4 text-sm text-gray-700">
                          {settlement.period.start} ～ {settlement.period.end}
                        </td>
                        <td className="py-4 text-sm text-gray-700">{settlement.summary.transactionCount}件</td>
                        <td className="py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(settlement.summary.totalAmount)}
                        </td>
                        <td className="py-4 text-sm font-medium text-green-600">
                          {formatCurrency(settlement.summary.netAmount)}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                            {getStatusText(settlement.status)}
                          </span>
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            theme="admin"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSettlement(settlement);
                            }}
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
            {selectedSettlement ? (
              <Card title="精算詳細">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">基本情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">精算ID:</span> {selectedSettlement.id}</div>
                      <div><span className="font-medium">事業者:</span> {selectedSettlement.businessInfo.name}</div>
                      <div><span className="font-medium">対象期間:</span> {selectedSettlement.period.start} ～ {selectedSettlement.period.end}</div>
                      <div><span className="font-medium">作成日:</span> {selectedSettlement.createdDate}</div>
                      {selectedSettlement.approvedDate && (
                        <div><span className="font-medium">承認日:</span> {selectedSettlement.approvedDate}</div>
                      )}
                      {selectedSettlement.transferDate && (
                        <div><span className="font-medium">振込日:</span> {selectedSettlement.transferDate}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">金額詳細</h4>
                    <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span>取引総額:</span>
                        <span className="font-medium">{formatCurrency(selectedSettlement.summary.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>プラットフォーム手数料(10%):</span>
                        <span className="font-medium">-{formatCurrency(selectedSettlement.summary.platformFee)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>消費税(10%):</span>
                        <span className="font-medium">-{formatCurrency(selectedSettlement.summary.taxAmount)}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-bold text-green-600">
                        <span>振込額:</span>
                        <span>{formatCurrency(selectedSettlement.summary.netAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">振込先口座</h4>
                    <div className="space-y-1 text-sm bg-blue-50 p-3 rounded">
                      <div>{selectedSettlement.businessInfo.bankAccount.bankName} {selectedSettlement.businessInfo.bankAccount.branchName}</div>
                      <div>{selectedSettlement.businessInfo.bankAccount.accountType} {selectedSettlement.businessInfo.bankAccount.accountNumber}</div>
                      <div>{selectedSettlement.businessInfo.bankAccount.accountHolder}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">取引一覧</h4>
                    <div className="space-y-2">
                      {selectedSettlement.transactions.map((transaction) => (
                        <div key={transaction.id} className="text-sm border border-gray-200 rounded p-2">
                          <div className="font-medium">{transaction.projectTitle}</div>
                          <div className="text-gray-600">クライアント: {transaction.clientName}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">完了日: {transaction.completionDate}</span>
                            <span className="font-medium text-green-600">{formatCurrency(transaction.amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    {selectedSettlement.status === 'pending' && (
                      <Button
                        fullWidth
                        theme="admin"
                        variant="success"
                        onClick={() => handleApproveSettlement(selectedSettlement.id)}
                      >
                        精算を承認
                      </Button>
                    )}
                    {selectedSettlement.status === 'approved' && (
                      <Button
                        fullWidth
                        theme="admin"
                        variant="primary"
                        onClick={() => handleInitiateTransfer(selectedSettlement.id)}
                      >
                        振込処理開始
                      </Button>
                    )}
                    <Button
                      fullWidth
                      theme="admin"
                      variant="secondary"
                      onClick={() => handleGenerateInvoice(selectedSettlement.id)}
                      disabled={!selectedSettlement.invoiceGenerated}
                    >
                      明細PDF生成
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card title="精算詳細">
                <div className="text-center text-gray-500 py-8">
                  精算を選択してください
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