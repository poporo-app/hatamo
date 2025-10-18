'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ダミーサービスデータ（親コンポーネントと同じ構造）
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
    description: 'このサービスは、お客様のビジネス課題を解決するための包括的なソリューションを提供します。',
    deliveryTime: '2〜4週間',
    fee: 175000, // 手数料 35%
    total: 675000, // 合計
    provider: {
      name: '田中太郎',
      rating: 4.9,
    },
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
    description: 'このサービスは、お客様のビジネス課題を解決するための包括的なソリューションを提供します。',
    deliveryTime: '3〜6週間',
    fee: 280000, // 手数料 35%
    total: 1080000, // 合計
    provider: {
      name: '佐藤花子',
      rating: 5.0,
    },
  },
};

export default function ServiceApplyPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const service = DUMMY_SERVICE_DETAILS[serviceId as keyof typeof DUMMY_SERVICE_DETAILS];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryDate: '',
    requirements: '',
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    commerce: false,
    cancellation: false,
  });

  const [isRobot, setIsRobot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAgreementChange = (name: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!formData.name.trim()) {
      setError('氏名を入力してください');
      return;
    }
    if (!formData.email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }
    if (!formData.deliveryDate) {
      setError('希望納期を選択してください');
      return;
    }
    if (!agreements.terms || !agreements.privacy || !agreements.commerce || !agreements.cancellation) {
      setError('すべての同意事項にチェックを入れてください');
      return;
    }
    if (!isRobot) {
      setError('「私はロボットではありません」にチェックを入れてください');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API連携実装
      console.log('申込データ:', { ...formData, serviceId, agreements });

      // 仮実装：申込完了として処理
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('見積もり依頼を送信しました（現在はフロントエンドのみの実装です）');
      router.push(`/client/services/${serviceId}`);
    } catch (err) {
      setError('申込に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1199px] mx-auto px-8 py-4">
          {/* 戻るボタン */}
          <button
            onClick={() => router.push(`/client/services/${serviceId}`)}
            className="flex items-center gap-2 text-[#314158] hover:text-[#0f172b] transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 5l-7 7 7 7" />
            </svg>
            <span className="text-base">戻る</span>
          </button>

          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-sm text-[#62748e] mb-4">
            <Link href="/client/services" className="hover:text-[#314158]">
              サービス一覧
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
            </svg>
            <Link href={`/client/services/${serviceId}`} className="hover:text-[#314158]">
              {service.title}
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
            </svg>
            <span className="text-[#0f172b]">申込</span>
          </nav>

          {/* プログレスステッパー */}
          <div className="flex items-center justify-center gap-4">
            {/* ステップ1: 申込情報 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="text-sm font-medium text-blue-500">申込情報</span>
              </div>
            </div>

            {/* 区切り線 */}
            <div className="w-16 h-0.5 bg-slate-200"></div>

            {/* ステップ2: 決済 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-[#62748e] flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm text-[#62748e]">決済</span>
              </div>
            </div>

            {/* 区切り線 */}
            <div className="w-16 h-0.5 bg-slate-200"></div>

            {/* ステップ3: 完了 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-[#62748e] flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm text-[#62748e]">完了</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-[1199px] mx-auto px-8 py-8">
        <div className="grid grid-cols-[1fr_357px] gap-8">
          {/* 左カラム: フォーム */}
          <div className="space-y-6">
            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 申込者情報 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-medium text-[#0f172b]">申込者情報</h2>

                {/* 氏名 */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                    氏名
                    <span className="text-red-800">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="山田 太郎"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>

                {/* メールアドレス */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                    メールアドレス
                    <span className="text-red-800">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@hatamo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>

                {/* 電話番号 */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-[#314158]">
                    電話番号
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="090-1234-5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* サービス詳細 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-medium text-[#0f172b]">サービス詳細</h2>

                {/* 希望納期 */}
                <div className="space-y-2">
                  <label htmlFor="deliveryDate" className="text-sm font-medium text-[#314158] flex items-center gap-1">
                    希望納期
                    <span className="text-red-800">*</span>
                  </label>
                  <input
                    id="deliveryDate"
                    name="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-[#cad5e2] rounded-md text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>

                {/* 要望・質問事項 */}
                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-medium text-[#314158]">
                    要望・質問事項
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    placeholder="サービスに関するご要望や質問事項をご記入ください"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-[#cad5e2] rounded-md text-sm text-slate-500 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-[#62748e] text-right">
                    {formData.requirements.length} / 1000
                  </p>
                </div>
              </div>

              {/* 同意事項 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-medium text-[#0f172b]">同意事項</h2>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.terms}
                      onChange={() => handleAgreementChange('terms')}
                      className="mt-1 w-4 h-4 border-slate-200 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-[#314158]">
                      <Link href="/terms" className="text-blue-500 hover:underline">
                        利用規約
                      </Link>
                      に同意する
                      <span className="text-red-800 ml-1">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.privacy}
                      onChange={() => handleAgreementChange('privacy')}
                      className="mt-1 w-4 h-4 border-slate-200 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-[#314158]">
                      <Link href="/privacy" className="text-blue-500 hover:underline">
                        プライバシーポリシー
                      </Link>
                      に同意する
                      <span className="text-red-800 ml-1">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.commerce}
                      onChange={() => handleAgreementChange('commerce')}
                      className="mt-1 w-4 h-4 border-slate-200 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-[#314158]">
                      <Link href="/commerce" className="text-blue-500 hover:underline">
                        特定商取引法表記
                      </Link>
                      に同意する
                      <span className="text-red-800 ml-1">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreements.cancellation}
                      onChange={() => handleAgreementChange('cancellation')}
                      className="mt-1 w-4 h-4 border-slate-200 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-[#314158]">
                      <Link href="/cancellation" className="text-blue-500 hover:underline">
                        キャンセルポリシー
                      </Link>
                      に同意する
                      <span className="text-red-800 ml-1">*</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* reCAPTCHA風 */}
              <div className="bg-slate-50 border-2 border-[#cad5e2] rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRobot}
                    onChange={(e) => setIsRobot(e.target.checked)}
                    className="w-6 h-6 border-2 border-[#cad5e2] rounded"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-[#314158]">
                    私はロボットではありません
                  </span>
                </label>
              </div>

              {/* ボタン */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push(`/client/services/${serviceId}`)}
                  className="h-12 px-6 bg-slate-50 border border-[#cad5e2] text-[#314158] text-sm font-medium rounded-md hover:bg-slate-100 transition-colors"
                  disabled={isLoading}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '送信中...' : '見積もりを依頼する'}
                </button>
              </div>
            </form>
          </div>

          {/* 右カラム: サービスサマリー */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 sticky top-8">
              <h3 className="text-lg font-medium text-[#0f172b]">サービス概要</h3>

              {/* サービス画像 */}
              <div className="bg-slate-200 rounded-lg h-[200px] flex items-center justify-center">
                <span className="text-slate-400">サービス画像</span>
              </div>

              {/* サービス情報 */}
              <div className="space-y-3">
                <h4 className="text-base font-normal text-[#0f172b]">{service.title}</h4>

                {/* 提供者情報 */}
                <div className="flex items-center gap-2 text-sm text-[#45556c]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path stroke="currentColor" strokeWidth="1.5" d="M3 14c0-2.761 2.239-5 5-5s5 2.239 5 5" />
                  </svg>
                  <span>{service.provider.name}</span>
                  <div className="flex items-center gap-1 ml-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1l2 5h5l-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3h5z" />
                    </svg>
                    <span>{service.provider.rating}</span>
                  </div>
                </div>
              </div>

              {/* 価格詳細 */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#45556c]">基本料金</span>
                  <span className="text-[#0f172b]">¥{service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#45556c]">手数料 (35%)</span>
                  <span className="text-[#0f172b]">¥{service.fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-base font-medium text-[#0f172b]">合計</span>
                  <span className="text-2xl font-medium text-[#0f172b]">
                    ¥{service.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* 決済へ進むボタン */}
              <button className="w-full h-12 bg-slate-100 text-[#62748e] text-sm font-medium rounded-md cursor-not-allowed">
                決済へ進む
              </button>
              <p className="text-xs text-[#62748e] text-center">
                ※見積もり依頼後、決済が可能になります
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
