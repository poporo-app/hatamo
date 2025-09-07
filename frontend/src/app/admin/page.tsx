import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function AdminDashboard() {
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
      <Header role="admin" />
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/sponsors" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <div className="text-lg font-medium text-purple-900 mb-1">スポンサー管理</div>
              <div className="text-sm text-purple-700">審査・承認・停止処理</div>
            </Link>
            <Link href="/admin/listings" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <div className="text-lg font-medium text-purple-900 mb-1">掲載管理</div>
              <div className="text-sm text-purple-700">サービスの公開・非公開設定</div>
            </Link>
            <Link href="/admin/applications" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <div className="text-lg font-medium text-purple-900 mb-1">申込管理</div>
              <div className="text-sm text-purple-700">取引状況の確認</div>
            </Link>
            <Link href="/admin/settlements" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <div className="text-lg font-medium text-purple-900 mb-1">精算管理</div>
              <div className="text-sm text-purple-700">手数料計算・振込処理</div>
            </Link>
            <Link href="/admin/users" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <div className="text-lg font-medium text-purple-900 mb-1">利用者管理</div>
              <div className="text-sm text-purple-700">アカウント管理・サポート</div>
            </Link>
            <Link href="/admin/reports" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <div className="text-lg font-medium text-purple-900 mb-1">レポート</div>
              <div className="text-sm text-purple-700">統計・分析データ</div>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />
    </>
  );
}