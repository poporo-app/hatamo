'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// ダミーデータ（拡張版）
const DUMMY_SERVICE_DETAILS = {
  '1': {
    id: '1',
    title: 'Webアプリケーション開発サービス',
    category: 'IT開発',
    badge: '人気',
    price: 500000,
    originalPrice: 600000,
    discount: 100000,
    rating: 4.9,
    reviews: 128,
    image: '/placeholder-service.jpg',
    description: 'このサービスは、お客様のビジネス課題を解決するための包括的なソリューションを提供します。 経験豊富な専門家チームが、お客様の目標達成をサポートいたします。',
    deliveryTime: '2〜4週間',
    features: [
      '初回コンサルティング（2時間）',
      '詳細分析レポート',
      '実装支援・サポート',
      '3ヶ月間のフォローアップ',
      '月次進捗レポート',
    ],
    process: [
      { step: 1, title: 'お申し込み', description: 'フォームからお申し込みください' },
      { step: 2, title: 'ヒアリング', description: '現状とご要望をお伺いします' },
      { step: 3, title: '提案', description: '最適なソリューションをご提案' },
      { step: 4, title: '実施', description: 'プロジェクトを開始します' },
      { step: 5, title: '完了', description: '成果物の納品とフォローアップ' },
    ],
  },
  '2': {
    id: '2',
    title: '経営戦略コンサルティング',
    category: 'コンサル',
    badge: '新着',
    price: 800000,
    rating: 5,
    reviews: 89,
    image: '/placeholder-service.jpg',
    description: 'このサービスは、お客様のビジネス課題を解決するための包括的なソリューションを提供します。 経験豊富な専門家チームが、お客様の目標達成をサポートいたします。',
    deliveryTime: '3〜6週間',
    features: [
      '初回コンサルティング（2時間）',
      '詳細分析レポート',
      '実装支援・サポート',
      '3ヶ月間のフォローアップ',
      '月次進捗レポート',
    ],
    process: [
      { step: 1, title: 'お申し込み', description: 'フォームからお申し込みください' },
      { step: 2, title: 'ヒアリング', description: '現状とご要望をお伺いします' },
      { step: 3, title: '提案', description: '最適なソリューションをご提案' },
      { step: 4, title: '実施', description: 'プロジェクトを開始します' },
      { step: 5, title: '完了', description: '成果物の納品とフォローアップ' },
    ],
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const service = DUMMY_SERVICE_DETAILS[serviceId as keyof typeof DUMMY_SERVICE_DETAILS];

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#0f172b] mb-4">サービスが見つかりません</h1>
          <Link href="/client/services" className="text-blue-500 hover:underline">
            サービス一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 戻るボタン */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1199px] mx-auto px-8 py-4">
          <button
            onClick={() => router.push('/client/services')}
            className="flex items-center gap-2 text-[#314158] hover:text-[#0f172b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 5l-7 7 7 7" />
            </svg>
            <span className="text-base">サービス一覧に戻る</span>
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-[1199px] mx-auto px-8 py-8 space-y-12">
        {/* サービス詳細ヘッダー（2カラム） */}
        <div className="grid grid-cols-2 gap-8">
          {/* 左側: 画像 */}
          <div className="bg-slate-200 rounded-2xl overflow-hidden h-[414px]">
            {/* プレースホルダー画像 */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-slate-400 text-lg">サービス画像</span>
            </div>
          </div>

          {/* 右側: サービス情報 */}
          <div className="space-y-6">
            {/* カテゴリーバッジ */}
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded">
                {service.category}
              </span>
              {service.badge && (
                <span className="border border-orange-500 text-orange-500 text-xs font-medium px-3 py-1 rounded">
                  {service.badge}
                </span>
              )}
            </div>

            {/* タイトルと評価 */}
            <div className="space-y-3">
              <h1 className="text-base font-normal text-[#0f172b]">{service.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 1l2.5 6.5h6.5l-5 4 2 6.5-6-4-6 4 2-6.5-5-4h6.5z" />
                  </svg>
                  <span className="text-base text-[#0f172b]">{service.rating}</span>
                </div>
                <span className="text-base text-[#45556c]">({service.reviews}件のレビュー)</span>
              </div>
            </div>

            {/* 価格ボックス */}
            <div className="bg-slate-100 rounded-xl p-6 space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-normal text-[#0f172b]">
                  ¥{service.price.toLocaleString()}
                </span>
                {service.originalPrice && (
                  <span className="text-lg text-[#62748e] line-through">
                    ¥{service.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {service.discount && (
                <p className="text-sm text-green-800">
                  ¥{service.discount.toLocaleString()}お得
                </p>
              )}
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/client/services/${serviceId}/apply`)}
                className="w-full h-12 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" d="M8 3v10M3 8h10" />
                </svg>
                依頼する
              </button>
              <button className="w-full h-12 bg-slate-50 border border-[#cad5e2] text-[#314158] text-sm font-medium rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path stroke="currentColor" strokeWidth="1.5" d="M8 2.5c-2.5-1.5-5 .5-5 3 0 3 5 6.5 5 6.5s5-3.5 5-6.5c0-2.5-2.5-4.5-5-3z" />
                </svg>
                ウィッシュリストに追加
              </button>
            </div>

            {/* 詳細情報 */}
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#314158]" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path stroke="currentColor" strokeWidth="1.5" d="M10 6v4l3 3" />
                </svg>
                <span className="text-base text-[#314158]">納期：{service.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#314158]" fill="none" viewBox="0 0 20 20">
                  <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path stroke="currentColor" strokeWidth="1.5" d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" />
                </svg>
                <span className="text-base text-[#314158]">専門家による対応</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#314158]" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeWidth="1.5" d="M10 1l2.5 6h6.5l-5 4 2 6-6-4-6 4 2-6-5-4h6.5z" />
                </svg>
                <span className="text-base text-[#314158]">満足度保証</span>
              </div>
            </div>
          </div>
        </div>

        {/* サービス概要セクション */}
        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          {/* サービス概要 */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-[#0f172b]">サービス概要</h2>
            <p className="text-base text-[#314158] leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* 含まれる内容 */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-[#0f172b]">含まれる内容</h3>
            <ul className="space-y-3">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 10l3 3 5-5" />
                  </svg>
                  <span className="text-base text-[#314158]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* サービスの流れ */}
          <div className="space-y-4">
            <h3 className="text-base font-normal text-[#0f172b]">サービスの流れ</h3>
            <div className="space-y-4">
              {service.process.map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-base">{step.step}</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-normal text-[#0f172b]">{step.title}</h4>
                    <p className="text-sm text-[#45556c]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA セクション */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-base font-normal text-[#0f172b]">このサービスが気になったら</p>
            <p className="text-sm text-[#45556c]">今すぐ依頼して専門家に相談しましょう</p>
          </div>
          <button
            onClick={() => router.push(`/client/services/${serviceId}/apply`)}
            className="h-12 px-6 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" strokeWidth="1.5" d="M8 3v10M3 8h10" />
            </svg>
            依頼する
          </button>
        </div>
      </div>
    </div>
  );
}
