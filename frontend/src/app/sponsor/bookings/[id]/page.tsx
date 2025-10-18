'use client';

import { useRouter, useParams } from 'next/navigation';
import { SponsorLayout } from '@/components/sponsor/SponsorLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

// モックデータ
const BOOKING_DETAIL = {
  id: '1',
  bookingNumber: '#BK-2024-001',
  service: {
    name: 'Webサイト制作',
    category: 'IT開発',
    image: '/service-placeholder.png',
    description: 'コーポレートサイト構築サービス。レスポンシブデザイン、SEO対策、CMS導入まで一貫してサポートします',
    basePrice: '¥50,000〜',
  },
  client: {
    name: '佐藤花子',
    initial: '佐',
    image: '/client-placeholder.png',
  },
  amount: 50000,
  fee: 17500,
  feeRate: 35,
  receivedAmount: 32500,
  status: '確認待ち',
  statusVariant: 'pending' as const,
  applicationDate: '2024/10/01 14:30',
  updatedDate: '2024/10/05 14:30',
  progressSteps: [
    { label: '申込中', date: '10/01', completed: true },
    { label: '承認', date: '10/02', completed: true },
    { label: '決済', date: '10/03', completed: true },
    { label: '進行中', date: '10/03', completed: true },
    { label: '確認待ち', date: '10/05', completed: true },
    { label: '完了', date: '-', completed: false },
  ],
  revisionRequest: {
    content: 'ヘッダーのロゴサイズを少し大きくしてほしいです。\nまた、フッターのリンク色を青に変更してください。',
    requester: '佐藤花子',
    requestDate: '2024/10/05 14:30',
  },
  timeline: [
    {
      id: '1',
      date: '2024/10/01 14:30',
      title: '申込を受け付けました',
      type: 'info',
    },
    {
      id: '2',
      date: '2024/10/02 16:45',
      title: 'スポンサーが申込を承認しました',
      message: 'メッセージ: 「ありがとうございます。お受けします」',
      type: 'success',
    },
    {
      id: '3',
      date: '2024/10/03 10:15',
      title: '決済が完了しました',
      message: '決済ID: pi_1234567890',
      type: 'success',
    },
    {
      id: '4',
      date: '2024/10/03 11:00',
      title: '作業を開始しました',
      type: 'info',
    },
    {
      id: '5',
      date: '2024/10/05 10:00',
      title: 'スポンサーが完了報告を行いました',
      message: 'メッセージ: 「作業が完了しました。ご確認をお願いします」',
      type: 'success',
    },
    {
      id: '6',
      date: '2024/10/05 14:30',
      title: '利用者から修正依頼がありました',
      message: 'メッセージ: 「ヘッダーのロゴサイズを少し大きくしてほしいです。また、フッターのリンク色を青に変更し',
      type: 'warning',
      isCurrent: true,
    },
  ],
  messages: [
    {
      id: '1',
      sender: '佐藤花子 (利用者)',
      content: '「Webサイト制作をお願いしたいです。よろしくお願いします。」',
      date: '10/01 14:30',
    },
    {
      id: '2',
      sender: '田中太郎 (スポンサー)',
      content: '「ありがとうございます。お受けします」',
      date: '10/02 16:45',
    },
    {
      id: '3',
      sender: '佐藤花子 (利用者)',
      content: '「承認ありがとうございます。よろしくお願いします」',
      date: '10/02 17:00',
    },
  ],
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();

  return (
    <SponsorLayout>
      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1199px] mx-auto px-8 py-4">
          {/* 戻るボタン */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-9 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
            </svg>
            戻る
          </Button>

          {/* パンくずリスト */}
          <nav className="flex items-center gap-2 text-sm text-[#62748e]">
            <a href="/sponsor" className="hover:text-[#0f172b]">ホーム</a>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 11l4-4-4-4" />
            </svg>
            <a href="/sponsor/bookings" className="hover:text-[#0f172b]">申込</a>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5 11l4-4-4-4" />
            </svg>
            <span className="text-[#0f172b] font-medium">{BOOKING_DETAIL.service.name}の申込</span>
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-[1199px] mx-auto px-8 py-8">
        {/* ページタイトル */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-[#0f172b]">申込詳細</h1>
          <div className="mt-3 w-20 h-1 bg-blue-500 rounded-full"></div>
        </div>

        {/* ステータス進行バー */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
          <h2 className="text-base font-medium text-[#0f172b] mb-8">ステータス進行バー</h2>

          <div className="relative">
            {/* 進行線 */}
            <div className="absolute top-[18px] left-[70px] right-[70px] h-0.5 bg-slate-200">
              <div className="h-full bg-blue-500" style={{ width: '83.33%' }}></div>
            </div>

            {/* ステップ */}
            <div className="grid grid-cols-6 gap-0">
              {BOOKING_DETAIL.progressSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center relative z-10">
                  {/* アイコン */}
                  <div className={`w-10 h-9 rounded-lg flex items-center justify-center mb-2 ${
                    step.completed
                      ? 'bg-blue-500'
                      : 'bg-slate-200'
                  }`}>
                    {step.completed ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 10l2 2 6-6" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    )}
                  </div>

                  {/* ラベル */}
                  <p className={`text-sm mb-2 ${
                    step.completed ? 'text-[#0f172b] font-medium' : 'text-[#62748e]'
                  }`}>
                    {step.label}
                  </p>

                  {/* 日付 */}
                  <p className="text-xs text-[#62748e]">{step.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="grid grid-cols-3 gap-6">
          {/* 左カラム (2/3) */}
          <div className="col-span-2 space-y-6">
            {/* 申込情報・アクション */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="grid grid-cols-2 gap-8">
                {/* 申込情報 */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-[#0f172b]">申込情報</h3>

                  <div>
                    <p className="text-sm text-[#62748e] mb-1">申込番号:</p>
                    <p className="text-lg text-[#0f172b]">{BOOKING_DETAIL.bookingNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-2">サービス:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                      <div>
                        <p className="text-lg font-medium text-[#0f172b]">{BOOKING_DETAIL.service.name}</p>
                        <p className="text-sm text-[#62748e]">{BOOKING_DETAIL.service.category}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-2">クライアント:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {BOOKING_DETAIL.client.initial}
                      </div>
                      <p className="text-lg text-[#0f172b]">{BOOKING_DETAIL.client.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-1">金額:</p>
                    <p className="text-lg text-[#0f172b]">¥{BOOKING_DETAIL.amount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-1">手数料:</p>
                    <p className="text-lg text-[#0f172b]">¥{BOOKING_DETAIL.fee.toLocaleString()} ({BOOKING_DETAIL.feeRate}%)</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-1">受取額（スポンサー）:</p>
                    <p className="text-lg text-[#0f172b]">¥{BOOKING_DETAIL.receivedAmount.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-2">ステータス:</p>
                    <Badge variant={BOOKING_DETAIL.statusVariant} className="h-[22px]">
                      {BOOKING_DETAIL.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-1">申込日:</p>
                    <p className="text-lg text-[#0f172b]">{BOOKING_DETAIL.applicationDate}</p>
                  </div>

                  <div>
                    <p className="text-sm text-[#62748e] mb-1">更新日:</p>
                    <p className="text-lg text-[#0f172b]">{BOOKING_DETAIL.updatedDate}</p>
                  </div>
                </div>

                {/* アクション */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-[#0f172b]">アクション</h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M8 5v3" />
                        <circle cx="8" cy="11" r="0.5" fill="currentColor" />
                      </svg>
                      <p className="text-sm text-[#0f172b]">利用者の承認待ちです</p>
                    </div>

                    <Button variant="default" className="w-full h-9">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 16 16">
                        <path stroke="currentColor" strokeWidth="1.5" d="M2 3l6 4 6-4M2 3v10h12V3" />
                      </svg>
                      メッセージを送る
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 修正依頼 */}
            {BOOKING_DETAIL.revisionRequest && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-10">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeWidth="2" d="M10 3l6 14H4l6-14z" />
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M10 9v3" />
                    <circle cx="10" cy="15" r="0.5" fill="currentColor" />
                  </svg>
                  <h3 className="text-xl text-[#0f172b]">利用者から修正依頼があります</h3>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg mb-6">
                  <p className="text-sm text-[#62748e] mb-4">修正依頼内容:</p>
                  <p className="text-base text-[#0f172b] whitespace-pre-wrap mb-4">
                    {BOOKING_DETAIL.revisionRequest.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-[#62748e]">
                    <span>依頼者: {BOOKING_DETAIL.revisionRequest.requester}</span>
                    <span>依頼日時: {BOOKING_DETAIL.revisionRequest.requestDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="default" className="h-9">修正対応完了</Button>
                  <Button variant="outline" className="h-9">メッセージで確認</Button>
                </div>
              </div>
            )}

            {/* アクティビティタイムライン */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-medium text-[#0f172b] mb-10">アクティビティタイムライン</h3>

              <div className="space-y-6">
                {BOOKING_DETAIL.timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    {/* アイコン */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.type === 'success' ? 'bg-green-100' :
                        item.type === 'warning' ? 'bg-amber-100' :
                        'bg-blue-100'
                      }`}>
                        <svg className={`w-4 h-4 ${
                          item.type === 'success' ? 'text-green-600' :
                          item.type === 'warning' ? 'text-amber-600' :
                          'text-blue-600'
                        }`} fill="none" viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="3" fill="currentColor" />
                        </svg>
                      </div>
                      {index < BOOKING_DETAIL.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-slate-200 mt-1"></div>
                      )}
                    </div>

                    {/* コンテンツ */}
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-[#62748e] mb-1">{item.date}</p>
                      <p className="text-lg text-[#0f172b] mb-1">{item.title}</p>
                      {item.message && (
                        <p className="text-sm text-[#62748e]">{item.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* サービス詳細 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[#0f172b]">サービス詳細</h3>
                <Button variant="outline" size="sm" className="h-8">
                  サービスページ
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
                  </svg>
                </Button>
              </div>

              <div className="flex gap-6">
                <div className="w-32 h-32 bg-slate-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-[#0f172b] mb-2">{BOOKING_DETAIL.service.name}</h4>
                  <div className="w-full h-px bg-slate-200 mb-3"></div>
                  <p className="text-sm text-[#62748e] mb-4">{BOOKING_DETAIL.service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[#62748e]">
                    <span>カテゴリ: {BOOKING_DETAIL.service.category}</span>
                    <span>基本料金: {BOOKING_DETAIL.service.basePrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ履歴 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[#0f172b]">メッセージ履歴</h3>
                <Button variant="outline" size="sm" className="h-8">すべて表示</Button>
              </div>

              <div className="space-y-6 mb-6">
                {BOOKING_DETAIL.messages.map((message) => (
                  <div key={message.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg text-[#0f172b]">{message.sender}</p>
                      <p className="text-xs text-[#62748e]">{message.date}</p>
                    </div>
                    <p className="text-sm text-[#62748e]">{message.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="メッセージ入力..."
                  className="flex-1 h-9"
                />
                <Button size="sm" className="h-9 w-10 p-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M14 2L7 9M14 2l-4 12-3-5-5-3 12-4z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* 右カラム (1/3) - 予約スペース */}
          <div className="space-y-6">
            {/* 将来的に追加情報を表示するエリア */}
          </div>
        </div>
      </main>
    </SponsorLayout>
  );
}
