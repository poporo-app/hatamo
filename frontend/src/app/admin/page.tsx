import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { getAppRole } from '@/lib/config';

export default function AdminDashboard() {
  const role = getAppRole();
  const stats = [
    { label: '総スポンサー数', value: '156', change: '+5 今月' },
    { label: '審査待ち', value: '8', change: '要対応' },
    { label: '今月の取引額', value: '¥12,450,000', change: '+15%' },
    { label: '総利用者数', value: '3,248', change: '+128 今月' },
  ];

  const pendingApprovals = [
    { id: 1, company: '株式会社テックソリューション', type: 'IT・技術', date: '2024/01/15', status: '書類確認中' },
    { id: 2, company: '合同会社クリエイティブワークス', type: 'クリエイティブ', date: '2024/01/14', status: '審査中' },
    { id: 3, company: '個人事業主 山田太郎', type: 'コンサルティング', date: '2024/01/13', status: '追加書類待ち' },
  ];

  const recentTransactions = [
    { id: 1, sponsor: 'ABC株式会社', amount: '¥450,000', fee: '¥45,000', date: '2024/01/15' },
    { id: 2, sponsor: 'XYZコンサルティング', amount: '¥280,000', fee: '¥28,000', date: '2024/01/14' },
    { id: 3, sponsor: 'デザインスタジオ', amount: '¥180,000', fee: '¥18,000', date: '2024/01/13' },
  ];

  return (
    <>
      <Header role={role} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">管理者ダッシュボード</h1>
          <p className="text-gray-600 mt-2">システム全体の運営状況</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className={`text-sm mt-2 ${
                stat.change.includes('要対応') ? 'text-red-600 font-semibold' : 
                stat.change.includes('+') ? 'text-green-600' : 
                'text-gray-500'
              }`}>
                {stat.change}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="審査待ちスポンサー">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">企業名</th>
                    <th className="text-left py-2">カテゴリ</th>
                    <th className="text-left py-2">申請日</th>
                    <th className="text-left py-2">ステータス</th>
                    <th className="text-left py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((approval) => (
                    <tr key={approval.id} className="border-b">
                      <td className="py-3 text-sm">{approval.company}</td>
                      <td className="py-3 text-sm">{approval.type}</td>
                      <td className="py-3 text-sm">{approval.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          approval.status === '書類確認中' ? 'bg-blue-100 text-blue-800' :
                          approval.status === '審査中' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {approval.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link href={`/admin/sponsors/${approval.id}`} className="text-purple-600 hover:underline text-sm">
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/admin/sponsors" className="text-purple-600 hover:underline text-sm mt-4 inline-block">
              すべての審査を見る →
            </Link>
          </Card>

          <Card title="最近の取引">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">スポンサー</th>
                    <th className="text-left py-2">取引額</th>
                    <th className="text-left py-2">手数料</th>
                    <th className="text-left py-2">日付</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-3 text-sm">{transaction.sponsor}</td>
                      <td className="py-3 text-sm font-medium">{transaction.amount}</td>
                      <td className="py-3 text-sm text-green-600">{transaction.fee}</td>
                      <td className="py-3 text-sm">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/admin/settlements" className="text-purple-600 hover:underline text-sm mt-4 inline-block">
              精算管理へ →
            </Link>
          </Card>
        </div>

        <Card title="システム管理">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/sponsor-approval" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-150 transition shadow-sm border border-purple-200">
              <div className="text-lg font-semibold text-purple-900 mb-2">スポンサー審査</div>
              <div className="text-sm text-purple-700 mb-3">承認・否認・再申請依頼</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-600">審査待ち: 8件</span>
                <span className="text-purple-500">→</span>
              </div>
            </Link>
            <Link href="/admin/listing-management" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-150 transition shadow-sm border border-purple-200">
              <div className="text-lg font-semibold text-purple-900 mb-2">掲載管理</div>
              <div className="text-sm text-purple-700 mb-3">事業者リスト・公開設定</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-600">公開中: 156件</span>
                <span className="text-purple-500">→</span>
              </div>
            </Link>
            <Link href="/admin/application-management" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-150 transition shadow-sm border border-purple-200">
              <div className="text-lg font-semibold text-purple-900 mb-2">申込管理</div>
              <div className="text-sm text-purple-700 mb-3">利用者申込一覧・ステータス確認</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-600">今月: 89件</span>
                <span className="text-purple-500">→</span>
              </div>
            </Link>
            <Link href="/admin/settlement" className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-150 transition shadow-sm border border-purple-200">
              <div className="text-lg font-semibold text-purple-900 mb-2">精算管理</div>
              <div className="text-sm text-purple-700 mb-3">手数料控除後振込額計算・明細生成</div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-600">処理待ち: 12件</span>
                <span className="text-purple-500">→</span>
              </div>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </>
  );
}