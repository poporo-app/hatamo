'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { searchBusinesses, businessCategories } from '@/lib/mockBusinessData';
import { Business } from '@/types/business';
import { getAppRole } from '@/lib/config';

export default function BusinessesPage() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const role = getAppRole();

  useEffect(() => {
    // Set initial category from URL parameter
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const results = searchBusinesses(searchQuery, selectedCategory);
      setBusinesses(results);
      setIsLoading(false);
    }, 300);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            プロフェッショナルサービス
          </h1>
          <p className="text-xl text-gray-300">
            信頼できる専門家があなたの課題を解決します
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="サービス名、キーワードで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  {businessCategories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'すべてのカテゴリ' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300">
            {isLoading ? '検索中...' : `${businesses.length}件のサービスが見つかりました`}
          </p>
          <select className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 text-sm">
            <option>おすすめ順</option>
            <option>評価順</option>
            <option>価格の安い順</option>
            <option>価格の高い順</option>
          </select>
        </div>

        {/* Business Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-600 mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              該当するサービスが見つかりませんでした
            </h3>
            <p className="text-gray-400">
              検索条件を変更してお試しください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="bg-gray-800/70 backdrop-blur-sm border-gray-700 hover:bg-gray-800/90 transition-all duration-300 group">
                <div className="space-y-4">
                  {/* Service Image Placeholder */}
                  <div className="bg-gradient-to-br from-gray-700 to-gray-600 h-48 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-4xl text-gray-400">📸</span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                      {business.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(business.rating)}
                      <span className="text-gray-400 text-sm ml-2">
                        ({business.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {business.description}
                    </p>
                    
                    {/* Provider Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm">👤</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{business.provider.name}</p>
                        <p className="text-gray-400 text-xs">経験 {business.provider.experience}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {business.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {formatPrice(business.price)}
                        </p>
                      </div>
                      <Link href={`/business/${business.id}`}>
                        <Button 
                          size="sm" 
                          theme={role}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          詳細を見る
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {businesses.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              さらに表示
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}