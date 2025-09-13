'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import { getAppRole } from '@/lib/config';

export default function CompletePage() {
  const [mounted, setMounted] = useState(false);
  const role = getAppRole();

  useEffect(() => {
    setMounted(true);
    
    // Clear any remaining session data
    sessionStorage.removeItem('applicationData');
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header role={role} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-800 h-96 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header role={role} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Animation Area */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-8 animate-pulse">
              <span className="text-6xl text-white">✓</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              申し込みが完了しました！
            </h1>
            <p className="text-xl text-gray-300">
              ありがとうございます。サービス提供者からの連絡をお待ちください。
            </p>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Next Steps */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">📋</span>
                今後の流れ
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">確認メール送信</p>
                    <p className="text-gray-400 text-sm">申し込み内容の確認メールを送信いたします（5分以内）</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">事業者からの連絡</p>
                    <p className="text-gray-400 text-sm">24時間以内に事業者から詳細についてご連絡いたします</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">サービス開始</p>
                    <p className="text-gray-400 text-sm">詳細確認後、サービスを開始いたします</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">📞</span>
                お問い合わせ
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-white font-medium mb-2">HATAMO サポートセンター</p>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center">
                      <span className="mr-2">📧</span>
                      support@hatamo.com
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📱</span>
                      0120-000-000
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">🕐</span>
                      平日 9:00-18:00
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    緊急時は24時間対応いたします。お気軽にお問い合わせください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-2xl p-6 mb-8">
            <h3 className="text-yellow-400 font-semibold mb-3 flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              重要なお知らせ
            </h3>
            <div className="text-gray-300 space-y-2">
              <p>• 確認メールが届かない場合は、迷惑メールフォルダもご確認ください</p>
              <p>• サービス内容や料金に変更がある場合は、事前にご連絡いたします</p>
              <p>• キャンセル・変更をご希望の場合は、サポートセンターまでご連絡ください</p>
              <p>• 申し込み内容は「マイページ」からもご確認いただけます</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/businesses">
                <Button 
                  size="lg" 
                  theme={role}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  他のサービスを見る
                </Button>
              </Link>
              <Link href="/mypage">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white"
                >
                  マイページ
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white"
                >
                  トップページ
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-12 text-center">
            <h3 className="text-white font-semibold mb-4">HATAMOを友達に紹介しませんか？</h3>
            <div className="flex justify-center space-x-4">
              <button className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                📘
              </button>
              <button className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                🐦
              </button>
              <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                💬
              </button>
              <button className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                📧
              </button>
            </div>
          </div>

          {/* User Feedback */}
          <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-4 text-center">サービスの改善にご協力ください</h3>
            <p className="text-gray-300 text-center mb-6">
              より良いサービス提供のため、申し込み体験についてのフィードバックをお聞かせください。
            </p>
            <div className="text-center">
              <Button 
                variant="secondary"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                フィードバックを送信
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}