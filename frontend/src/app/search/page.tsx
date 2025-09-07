'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';

// Mock search results
const mockSearchResults = [
  {
    id: 1,
    title: 'Webサイト制作・リニューアル',
    category: 'IT・技術',
    price: '50,000',
    rating: 4.8,
    reviews: 25,
    provider: '田中デザイン事務所',
    description: 'プロフェッショナルなWebサイト制作からリニューアルまで対応。レスポンシブデザイン、SEO対策も含めた総合的なサポートを提供します。',
    tags: ['WordPress', 'HTML/CSS', 'JavaScript', 'SEO']
  },
  {
    id: 2,
    title: 'モバイルアプリ開発',
    category: 'IT・技術',
    price: '150,000',
    rating: 4.9,
    reviews: 12,
    provider: 'モバイルソリューションズ',
    description: 'iOS・Android対応のモバイルアプリ開発。企画から開発、リリースまでワンストップでサポート。',
    tags: ['iOS', 'Android', 'React Native', 'Flutter']
  },
  {
    id: 3,
    title: 'UI/UXデザイン',
    category: 'クリエイティブ',
    price: '40,000',
    rating: 4.7,
    reviews: 33,
    provider: 'デザインラボ',
    description: 'ユーザー体験を重視したUI/UXデザイン。使いやすさと美しさを両立したデザインを制作します。',
    tags: ['Figma', 'Adobe XD', 'Sketch', 'プロトタイピング']
  }
];

const popularSearches = [
  'Webサイト制作',
  'ロゴデザイン',
  'マーケティング',
  'コンサルティング',
  'アプリ開発',
  'ライティング',
  '動画編集',
  'SEO対策'
];

const categories = [
  'IT・技術',
  'ビジネス',
  'コンサルティング',
  'クリエイティブ',
  '教育',
  'ライフスタイル',
  '健康・美容',
  'その他'
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header role="user" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">サービス検索</h1>
          <p className="text-gray-600">あなたにぴったりのプロフェッショナルサービスを見つけましょう</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <div className="space-y-6">
            {/* Main Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                キーワード検索
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="サービス名、キーワードで検索"
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button onClick={handleSearch} size="md">
                  検索
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべてのカテゴリ</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  価格帯
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべての価格帯</option>
                  <option value="0-30000">〜30,000円</option>
                  <option value="30000-100000">30,000円〜100,000円</option>
                  <option value="100000-500000">100,000円〜500,000円</option>
                  <option value="500000+">500,000円〜</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  評価
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべての評価</option>
                  <option value="4.5">4.5以上</option>
                  <option value="4.0">4.0以上</option>
                  <option value="3.5">3.5以上</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {!hasSearched ? (
          /* Popular Searches and Categories - Show when no search performed */
          <div className="space-y-8">
            {/* Popular Searches */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">人気の検索キーワード</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handlePopularSearch(search)}
                    className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Categories */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">カテゴリから探す</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="mb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-blue-600 text-xl">📁</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900">{category}</h3>
                    <p className="text-sm text-gray-500 mt-1">100+ サービス</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                検索結果: {searchQuery ? `"${searchQuery}"` : 'すべて'}
              </h2>
              <p className="text-gray-600">{mockSearchResults.length}件の結果</p>
            </div>

            <div className="space-y-6">
              {mockSearchResults.map((result) => (
                <Card key={result.id} className="bg-white hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image placeholder */}
                    <div className="md:w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-sm">サービス画像</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="mb-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {result.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{result.description}</p>
                          <p className="text-gray-500 text-sm mb-2">提供者: {result.provider}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">¥{result.price}〜</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm font-medium text-gray-900 ml-1">{result.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({result.reviews}件)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {result.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/service/${result.id}`}>
                          <Button>詳細を見る</Button>
                        </Link>
                        <Button variant="secondary">お気に入り</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="secondary" size="lg">
                さらに表示
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}