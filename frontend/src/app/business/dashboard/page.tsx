import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function BusinessDashboard() {
  const stats = [
    { label: '今月の申込数', value: '24', change: '+12%' },
    { label: '今月の売上', value: '¥480,000', change: '+8%' },
    { label: 'メッセージ', value: '5', change: '未読' },
    { label: '承認待ち', value: '3', change: '件' },
  ];

  const recentApplications = [
    { id: 1, service: 'コンサルティングサービス', customer: '田中様', date: '2024/01/15', status: '承認待ち' },
    { id: 2, service: 'Webデザイン', customer: '佐藤様', date: '2024/01/14', status: '進行中' },
    { id: 3, service: 'マーケティング支援', customer: '鈴木様', date: '2024/01/13', status: '完了' },
  ];

  return (
    <>
      <Header role="business" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">事業者ダッシュボード</h1>
          <p className="text-gray-600 mt-2">ビジネスの状況を一目で確認</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className={`text-sm mt-2 ${stat.change.includes('+') ? 'text-green-600' : 'text-gray-500'}`}>
                {stat.change}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="最近の申込">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">サービス</th>
                    <th className="text-left py-2">顧客</th>
                    <th className="text-left py-2">日付</th>
                    <th className="text-left py-2">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b">
                      <td className="py-3">{app.service}</td>
                      <td className="py-3">{app.customer}</td>
                      <td className="py-3">{app.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          app.status === '承認待ち' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === '進行中' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/business/applications" className="text-green-600 hover:underline text-sm mt-4 inline-block">
              すべての申込を見る →
            </Link>
          </Card>

          <Card title="クイックアクション">
            <div className="space-y-3">
              <Link href="/business/services/new" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <div className="font-medium text-green-900">新しいサービスを追加</div>
                <div className="text-sm text-green-700">サービスを追加して収益を増やしましょう</div>
              </Link>
              <Link href="/business/messages" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <div className="font-medium text-green-900">メッセージを確認</div>
                <div className="text-sm text-green-700">5件の未読メッセージがあります</div>
              </Link>
              <Link href="/business/profile" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <div className="font-medium text-green-900">プロフィールを編集</div>
                <div className="text-sm text-green-700">プロフィールを充実させて信頼性を高めましょう</div>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}