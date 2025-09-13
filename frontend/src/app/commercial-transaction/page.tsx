import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | HATAMO',
  description: 'HATAMOサービスの特定商取引法に基づく表記をご確認ください。',
};

export default function CommercialTransactionAct() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                特定商取引法に基づく表記
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                最終更新日：2024年9月13日
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  事業者の名称
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  HATAMO運営事務局
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  事業者の住所
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  〒100-0001<br />
                  東京都千代田区千代田1-1-1<br />
                  HATAMOビル10階
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  事業者の電話番号
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  03-1234-5678<br />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ※お問い合わせは原則としてメールにて承っております
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  事業者のメールアドレス
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  info@hatamo.com
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  運営統括責任者
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  代表取締役 山田太郎
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  販売価格
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="mb-4">各サービスの料金は以下の通りです：</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>スタンダードプラン：月額9,800円（税込）</li>
                    <li>プレミアムプラン：月額19,800円（税込）</li>
                    <li>エンタープライズプラン：月額49,800円（税込）</li>
                    <li>掲載手数料：成約時売上の10%（税込）</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    ※料金は予告なく変更される場合があります
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  代金の支払方法
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>クレジットカード決済（VISA、MasterCard、JCB、American Express、Diners Club）</li>
                    <li>銀行振込</li>
                    <li>コンビニ決済</li>
                    <li>ペイジー決済</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  代金の支払時期
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>クレジットカード決済：お申し込み時</li>
                    <li>銀行振込：お申し込み後7日以内</li>
                    <li>コンビニ決済：お申し込み後7日以内</li>
                    <li>ペイジー決済：お申し込み後7日以内</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  サービスの提供時期
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  お申し込み及び代金決済の確認後、即時サービス提供を開始いたします。<br />
                  ただし、審査が必要なサービスについては、審査完了後のサービス開始となります。
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  キャンセル・返金について
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="mb-4">以下の場合にキャンセル・返金を承ります：</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>サービス開始前のキャンセル：全額返金</li>
                    <li>サービス開始後のキャンセル：日割り計算にて返金</li>
                    <li>当社都合による解約：全額返金</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    ※返金手数料（振込手数料等）はお客様のご負担となります
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  解約方法
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="mb-4">以下の方法で解約をお申し込みください：</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>管理画面からの解約手続き</li>
                    <li>メール（info@hatamo.com）での解約申請</li>
                    <li>電話での解約申請</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    ※解約は月末締めとなり、翌月初日に解約処理が完了します
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  苦情・相談窓口
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <p className="mb-4">サービスに関するお問い合わせ・苦情は下記までご連絡ください：</p>
                  <div className="space-y-2">
                    <p><strong>メール：</strong> support@hatamo.com</p>
                    <p><strong>電話：</strong> 03-1234-5678（平日10:00-18:00）</p>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-sm">
                      <strong>消費者庁ホットライン</strong><br />
                      電話番号：188（いやや！）<br />
                      消費者トラブルについてお困りの場合は、消費者ホットラインにご相談ください。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  個人情報の取り扱い
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  個人情報の取り扱いについては、当社の<Link href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">プライバシーポリシー</Link>をご確認ください。
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  その他
                </h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>本表記の内容は、法令の改正等により予告なく変更する場合があります</li>
                    <li>本サービスの利用には、別途<Link href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">利用規約</Link>が適用されます</li>
                    <li>本表記に関してご不明な点がございましたら、お気軽にお問い合わせください</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}