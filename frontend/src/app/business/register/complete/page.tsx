'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RegistrationCompletePage() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-600 rounded-full mb-6 animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            申請完了！
          </h1>
          <p className="text-xl text-gray-300">
            事業者登録の申請を受け付けました
          </p>
        </div>

        {/* Progress Indicator - All Complete */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <span className="ml-3 text-green-400 font-medium">企業情報</span>
            </div>
            <div className="flex-1 h-1 bg-green-600 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <span className="ml-3 text-green-400 font-medium">書類アップロード</span>
            </div>
            <div className="flex-1 h-1 bg-purple-600 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <span className="ml-3 text-white font-medium">審査中</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Status Card */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                現在のステータス
              </h2>
              <div className="flex items-center mb-4">
                <div className="animate-pulse mr-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="text-lg text-yellow-400 font-semibold">
                  運営審査中
                </span>
              </div>
              <p className="text-gray-300">
                提出いただいた書類を確認しております。審査には通常2〜3営業日かかります。
              </p>
            </div>

            {/* What's Next */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                今後の流れ
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-white">書類審査</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      提出いただいた書類を運営チームが確認します
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-white">審査結果通知</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      登録されたメールアドレスに審査結果をお送りします
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-white">サービス開始</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      審査通過後、案件登録と月額料金のお支払いでサービスを開始できます
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                お問い合わせ
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                審査状況の確認や、ご不明な点がございましたら、以下までお問い合わせください。
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">メール：</span>
                  <a href="mailto:business@hatamo.com" className="text-purple-400 hover:text-purple-300 ml-2">
                    business@hatamo.com
                  </a>
                </div>
                <div>
                  <span className="text-gray-500">電話：</span>
                  <span className="text-white ml-2">03-1234-5678</span>
                  <span className="text-gray-500 ml-2">（平日 10:00-18:00）</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/business/dashboard"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all text-center"
              >
                ダッシュボードへ
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 px-6 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                トップページへ戻る
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <p className="text-gray-400 mb-4">
            HATAMOは異次元コミュニティのビジネスマッチングを支援します
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-gray-300">
              利用規約
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300">
              プライバシーポリシー
            </Link>
            <Link href="/commercial-law" className="text-gray-500 hover:text-gray-300">
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}