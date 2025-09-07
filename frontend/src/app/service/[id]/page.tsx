'use client';

import { useState, use } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface ServiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock service data - in a real app, this would be fetched based on the ID
const getServiceData = (id: string) => {
  const services = {
    '1': {
      id: '1',
      title: 'Webサイト制作・リニューアル',
      category: 'IT・技術',
      price: '50,000',
      rating: 4.8,
      reviewCount: 25,
      provider: {
        name: '田中デザイン事務所',
        avatar: 'avatar-1',
        rating: 4.9,
        totalReviews: 156,
        responseTime: '2時間以内',
        completionRate: '98%'
      },
      description: 'プロフェッショナルなWebサイト制作からリニューアルまで対応。お客様のビジネスに最適化されたWebサイトを制作し、売上向上をサポートします。',
      features: [
        'レスポンシブデザイン対応',
        'SEO基本設定込み',
        'CMS導入（WordPress等）',
        '無料メンテナンス（3ヶ月）',
        'SSL証明書設定',
        'Google Analytics設定'
      ],
      packages: [
        {
          name: 'ベーシック',
          price: '50,000',
          deliveryDays: 14,
          revisions: 2,
          features: ['5ページまで', 'レスポンシブデザイン', 'お問い合わせフォーム']
        },
        {
          name: 'スタンダード',
          price: '100,000',
          deliveryDays: 21,
          revisions: 3,
          features: ['10ページまで', 'CMS導入', 'SEO対策', 'Google Analytics設定']
        },
        {
          name: 'プレミアム',
          price: '200,000',
          deliveryDays: 30,
          revisions: 5,
          features: ['無制限ページ', 'カスタム機能', 'EC機能', '3ヶ月サポート']
        }
      ],
      portfolio: [
        { title: '企業サイト制作実績1', image: 'portfolio-1' },
        { title: '企業サイト制作実績2', image: 'portfolio-2' },
        { title: '企業サイト制作実績3', image: 'portfolio-3' },
        { title: 'ECサイト制作実績', image: 'portfolio-4' }
      ],
      reviews: [
        {
          id: 1,
          author: '佐藤様',
          rating: 5,
          date: '2024-01-15',
          comment: '非常に丁寧な対応で、期待以上のWebサイトを制作していただきました。レスポンシブデザインも完璧で、スマホでも見やすいサイトになりました。'
        },
        {
          id: 2,
          author: '山田様',
          rating: 4,
          date: '2024-01-10',
          comment: 'デザインのセンスが良く、ユーザビリティも考慮されたサイトを作成していただけました。納期も守っていただき、満足しています。'
        },
        {
          id: 3,
          author: '鈴木様',
          rating: 5,
          date: '2024-01-05',
          comment: 'SEO対策もしっかりしており、公開後すぐに検索順位が上がりました。アフターサポートも充実しており、安心してお任せできました。'
        }
      ]
    }
  };

  return services[id as keyof typeof services] || services['1'];
};

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolvedParams = use(params);
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  
  const service = getServiceData(resolvedParams.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="user" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <Card>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {service.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium text-gray-900 ml-1">{service.rating}</span>
                    <span className="text-gray-500 ml-1">({service.reviewCount}件のレビュー)</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">¥{service.price}〜</span>
                </div>
              </div>
              
              {/* Service Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">メイン画像</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 h-30 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-sm">画像{i}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700">{service.description}</p>
              </div>
            </Card>

            {/* Service Packages */}
            <Card title="プラン選択">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.packages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(index)}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">¥{pkg.price}</p>
                      <p className="text-sm text-gray-500">納期: {pkg.deliveryDays}日</p>
                      <p className="text-sm text-gray-500">修正: {pkg.revisions}回まで</p>
                    </div>
                    
                    <ul className="space-y-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            {/* Service Features */}
            <Card title="サービスの特徴">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Portfolio */}
            <Card title="制作実績">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.portfolio.map((item, index) => (
                  <div key={index} className="bg-gray-200 h-48 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">{item.title}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card title="レビュー">
              <div className="space-y-6">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        <div className="flex ml-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <Card title="提供者情報">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Avatar</span>
                </div>
                <h3 className="font-semibold text-gray-900">{service.provider.name}</h3>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium text-gray-900 ml-1">{service.provider.rating}</span>
                  <span className="text-gray-500 ml-1">({service.provider.totalReviews}件)</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">返信時間:</span>
                  <span className="text-gray-900">{service.provider.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">完了率:</span>
                  <span className="text-gray-900">{service.provider.completionRate}</span>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card>
              <div className="space-y-3">
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => setShowContactForm(true)}
                >
                  相談・見積もり依頼
                </Button>
                <Button variant="secondary" fullWidth>
                  お気に入りに追加
                </Button>
                <Button variant="secondary" fullWidth>
                  メッセージを送る
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 text-center">
                  ※実際の料金は要件により変動します
                </p>
              </div>
            </Card>

            {/* FAQ */}
            <Card title="よくある質問">
              <div className="space-y-3">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-900">
                    <span>修正は何回まで可能ですか？</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    選択されたプランに応じて修正回数が決まります。追加修正も可能です。
                  </p>
                </details>
                
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-900">
                    <span>納期の前倒しは可能ですか？</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    スケジュールによっては対応可能です。お気軽にご相談ください。
                  </p>
                </details>
                
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-sm font-medium text-gray-900">
                    <span>サポート期間はありますか？</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">
                    納品後3ヶ月間の無料サポートが含まれています。
                  </p>
                </details>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">相談・見積もり依頼</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ご相談内容 *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="プロジェクトの詳細や要件をお聞かせください"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" fullWidth>
                    送信する
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowContactForm(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}