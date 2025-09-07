import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';

// Mock service data
const mockServices = [
  {
    id: 1,
    title: 'Webサイト制作・リニューアル',
    category: 'IT・技術',
    price: '50,000',
    rating: 4.8,
    reviews: 25,
    provider: '田中デザイン事務所',
    description: 'プロフェッショナルなWebサイト制作からリニューアルまで対応',
    image: 'web-design'
  },
  {
    id: 2,
    title: 'ビジネスコンサルティング',
    category: 'コンサルティング',
    price: '80,000',
    rating: 4.9,
    reviews: 18,
    provider: '山田コンサルティング',
    description: '経営戦略から業務改善まで包括的にサポート',
    image: 'consulting'
  },
  {
    id: 3,
    title: 'ロゴ・ブランドデザイン',
    category: 'クリエイティブ',
    price: '30,000',
    rating: 4.7,
    reviews: 42,
    provider: 'クリエイティブスタジオABC',
    description: 'ブランドの価値を最大化するロゴ・デザイン制作',
    image: 'logo-design'
  },
  {
    id: 4,
    title: 'プログラミング教育',
    category: '教育',
    price: '15,000',
    rating: 4.6,
    reviews: 33,
    provider: 'テックアカデミー講師',
    description: '初心者から上級者まで対応のプログラミング指導',
    image: 'programming'
  },
  {
    id: 5,
    title: 'マーケティング戦略立案',
    category: 'ビジネス',
    price: '100,000',
    rating: 4.9,
    reviews: 15,
    provider: 'マーケティングプロ',
    description: 'データドリブンなマーケティング戦略の立案・実行',
    image: 'marketing'
  },
  {
    id: 6,
    title: '写真撮影・動画制作',
    category: 'クリエイティブ',
    price: '25,000',
    rating: 4.8,
    reviews: 38,
    provider: 'フォトスタジオXYZ',
    description: 'プロフェッショナルな写真撮影と動画制作サービス',
    image: 'photography'
  },
];

const categories = [
  'すべて',
  'IT・技術',
  'ビジネス',
  'コンサルティング',
  'クリエイティブ',
  '教育',
  'ライフスタイル',
  '健康・美容'
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="user" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">サービス一覧</h1>
          <p className="text-gray-600">プロフェッショナルなサービスを見つけて、あなたのビジネスを成長させましょう</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">カテゴリで絞り込み</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === 'すべて'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                価格帯
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>すべて</option>
                <option>〜30,000円</option>
                <option>30,000円〜100,000円</option>
                <option>100,000円〜</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                評価
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>すべて</option>
                <option>4.5以上</option>
                <option>4.0以上</option>
                <option>3.5以上</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                並び順
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>おすすめ順</option>
                <option>価格が安い順</option>
                <option>価格が高い順</option>
                <option>評価が高い順</option>
                <option>レビューが多い順</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service) => (
            <Card key={service.id} className="bg-white hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {/* Mock image placeholder */}
                <div className="bg-gray-200 h-48 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">{service.image}</span>
                </div>
                
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <p className="text-gray-500 text-sm mb-2">提供者: {service.provider}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium text-gray-900 ml-1">{service.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({service.reviews}件)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-blue-600">¥{service.price}〜</p>
                </div>
              </div>
              
              <Link href={`/service/${service.id}`}>
                <Button fullWidth>詳細を見る</Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="secondary" size="lg">
            さらに表示
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}