import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header role="user" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-lg p-12 text-center">
            <h1 className="text-4xl font-bold mb-4">異次元コミュニティ HATAMO</h1>
            <p className="text-xl mb-8">信頼できるプロフェッショナルとのマッチングサービス</p>
            <div className="flex gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" theme="user">サービスを探す</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg" theme="user">新規登録</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">人気のサービス</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <div className="mb-4">
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">サービス名 {i}</h3>
                  <p className="text-gray-600 mb-2">プロフェッショナルなサービスを提供します</p>
                  <p className="text-2xl font-bold text-blue-600">¥10,000〜</p>
                </div>
                <Link href={`/service/${i}`}>
                  <Button fullWidth theme="user">詳細を見る</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">カテゴリから探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['ビジネス', 'IT・技術', 'クリエイティブ', 'コンサルティング', '教育', 'ライフスタイル', '健康・美容', 'その他'].map((category) => (
              <Link key={category} href={`/category/${category}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-700">{category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}