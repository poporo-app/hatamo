'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import { getBusinessById } from '@/lib/mockBusinessData';
import { Business } from '@/types/business';
import { getAppRole } from '@/lib/config';

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const role = getAppRole();

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const foundBusiness = getBusinessById(id);
      setBusiness(foundBusiness || null);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header role={role} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-800 h-96 rounded-2xl mb-8"></div>
            <div className="bg-gray-800 h-8 rounded mb-4"></div>
            <div className="bg-gray-800 h-4 rounded mb-2"></div>
            <div className="bg-gray-800 h-4 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header role={role} />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl text-gray-600 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">サービスが見つかりません</h1>
          <p className="text-gray-400 mb-8">指定されたサービスは存在しないか、削除された可能性があります。</p>
          <Link href="/businesses">
            <Button theme={role}>サービス一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: Business['price']) => {
    if (price.max) {
      return `¥${price.min.toLocaleString()}〜¥${price.max.toLocaleString()}/${price.unit}`;
    }
    return `¥${price.min.toLocaleString()}/${price.unit}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header role={role} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">トップ</Link>
            <span>›</span>
            <Link href="/businesses" className="hover:text-white transition-colors">サービス一覧</Link>
            <span>›</span>
            <span className="text-white">{business.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-br from-gray-700 to-gray-600 h-96 flex items-center justify-center">
                <span className="text-6xl text-gray-400">📸</span>
              </div>
              {business.images.length > 1 && (
                <div className="p-4 flex space-x-2">
                  {business.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-lg border-2 ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-600'
                      } bg-gray-700 flex items-center justify-center`}
                    >
                      <span className="text-gray-400">📷</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Service Description */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">サービス詳細</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {business.description}
              </p>
              
              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">特徴・メリット</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {business.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio */}
            {business.portfolio && business.portfolio.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">実績・ポートフォリオ</h2>
                <div className="space-y-4">
                  {business.portfolio.map((item, index) => (
                    <div key={index} className="border border-gray-600 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">レビュー・評価</h2>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(business.rating)}
                </div>
                <span className="text-2xl font-bold text-white">{business.rating}</span>
                <span className="text-gray-400">({business.reviewCount}件のレビュー)</span>
              </div>
              
              {/* Sample Reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: "山田様",
                    rating: 5,
                    comment: "非常に満足のいく結果でした。プロフェッショナルな対応で、期待以上の成果を得ることができました。",
                    date: "2024年2月"
                  },
                  {
                    name: "鈴木様", 
                    rating: 4,
                    comment: "丁寧な説明と迅速な対応に感謝しています。また機会があればお願いしたいと思います。",
                    date: "2024年1月"
                  }
                ].map((review, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{review.name}</span>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 sticky top-8">
              <div className="mb-4">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                  {business.category}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-4">{business.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(business.rating)}
                </div>
                <span className="text-gray-400">({business.reviewCount})</span>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  {formatPrice(business.price)}
                </div>
                <p className="text-gray-400 text-sm">基本料金</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-gray-400">提供者：</span>
                  <span className="text-white font-medium">{business.provider.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">経験：</span>
                  <span className="text-white">{business.provider.experience}</span>
                </div>
                <div>
                  <span className="text-gray-400">対応地域：</span>
                  <span className="text-white">{business.location}</span>
                </div>
                <div>
                  <span className="text-gray-400">対応時間：</span>
                  <span className="text-white">{business.availability}</span>
                </div>
              </div>

              {business.provider.certification && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-2">資格・認定</h4>
                  <div className="space-y-1">
                    {business.provider.certification.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <span className="text-green-400">🏆</span>
                        <span className="text-gray-300 text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link href={`/apply/${business.id}`}>
                  <Button 
                    fullWidth 
                    size="lg" 
                    theme={role}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    申し込む
                  </Button>
                </Link>
                <Button 
                  variant="secondary" 
                  fullWidth
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  お気に入り
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  メッセージ
                </Button>
              </div>
            </div>

            {/* Related Services */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">関連サービス</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">📷</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">関連サービス {i}</h4>
                      <p className="text-gray-400 text-xs">¥10,000〜</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}