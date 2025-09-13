import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | HATAMO',
  description: 'HATAMOサービスのプライバシーポリシーをご確認ください。',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                プライバシーポリシー
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                最終更新日：2024年9月13日
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  1. 基本方針
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  HATAMO（以下「当社」）は、お客様の個人情報の重要性を認識し、個人情報を保護することが社会的責務であると考え、個人情報に関する法令を遵守し、当社で取扱う個人情報の取得、利用、管理を適正に行います。
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  本プライバシーポリシーでは、当社がどのような個人情報を取得し、どのように利用・共有するか、お客様がどのようにご自身の個人情報を管理できるかをご説明します。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  2. 個人情報の定義
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  本プライバシーポリシーにおいて、個人情報とは生存する個人に関する情報であって、氏名、生年月日、住所、電話番号、メールアドレス等によりその個人を識別できるもの、および他の情報と容易に照合することができ、それにより特定の個人を識別することができるものをいいます。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  3. 個人情報の取得
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  当社は、以下の場面で個人情報を取得することがあります：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>サービスへの会員登録時</li>
                  <li>お問い合わせやサポートへのご連絡時</li>
                  <li>キャンペーンやアンケートへのご参加時</li>
                  <li>サービスのご利用時</li>
                  <li>決済処理時</li>
                  <li>Cookie等の技術的手段による自動取得</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  4. 取得する個人情報の種類
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      4.1 お客様から直接ご提供いただく情報
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>氏名、メールアドレス、電話番号</li>
                      <li>住所、生年月日、性別</li>
                      <li>プロフィール写真、自己紹介文</li>
                      <li>職業、学歴、資格情報</li>
                      <li>クレジットカード情報等の決済情報</li>
                      <li>本人確認書類の情報</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      4.2 サービス利用時に自動取得される情報
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>IPアドレス、ブラウザ情報、OS情報</li>
                      <li>アクセス日時、参照URL</li>
                      <li>Cookie、端末識別子</li>
                      <li>位置情報（許可いただいた場合のみ）</li>
                      <li>利用履歴、行動履歴</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  5. 個人情報の利用目的
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  当社は、取得した個人情報を以下の目的で利用いたします：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>サービスの提供、運営、保守、改善</li>
                  <li>お客様からのお問い合わせ、サポート対応</li>
                  <li>利用料金の請求、決済処理</li>
                  <li>本人確認、年齢確認</li>
                  <li>利用規約違反の調査、対応</li>
                  <li>マーケティング、プロモーション活動</li>
                  <li>統計データの作成（個人を特定できない形式）</li>
                  <li>法令に基づく対応</li>
                  <li>その他、サービス提供に必要な業務</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  6. 個人情報の第三者提供
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>お客様の同意がある場合</li>
                  <li>法令に基づく場合</li>
                  <li>人の生命、身体または財産の保護のために必要がある場合</li>
                  <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                  <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  7. 個人情報の業務委託
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、利用目的の達成に必要な範囲内において、個人情報の取扱いの全部または一部を第三者に委託することがあります。この場合、当該第三者における個人情報の安全管理が図られるよう、適切な監督を行います。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  8. Cookieの使用について
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    当社のサービスでは、お客様により良いサービスを提供するため、Cookieを使用しています。Cookieとは、Webサイトがお客様のコンピュータのハードディスク上に置く小さなテキストファイルです。
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      8.1 Cookieの利用目的
                    </h3>
                    <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>ログイン状態の維持</li>
                      <li>お客様の設定やご選択の記憶</li>
                      <li>サービスの利用状況の分析</li>
                      <li>広告の最適化</li>
                      <li>セキュリティの確保</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    お客様はブラウザの設定により、Cookieの受け取りを拒否することができますが、その場合、サービスの一部機能がご利用いただけない場合があります。
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  9. 個人情報の安全管理
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  当社は、個人情報の漏洩、滅失、毀損の防止その他の個人情報の安全管理のために、以下の措置を講じています：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>組織的安全管理措置：個人情報保護規程の策定、責任者の設置</li>
                  <li>人的安全管理措置：従業員の教育・研修の実施</li>
                  <li>物理的安全管理措置：入退室管理、機器の盗難防止</li>
                  <li>技術的安全管理措置：アクセス権限の管理、不正アクセス対策</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  10. 個人情報の保存期間
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、個人情報を利用目的の達成に必要な期間のみ保存し、その後は適切に削除または匿名化いたします。ただし、法令により保存義務が定められている場合は、当該期間中保存いたします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  11. お客様の権利
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  お客様は、ご自身の個人情報について、以下の権利を有します：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>開示請求権：個人情報の利用目的、第三者提供等について開示を求める権利</li>
                  <li>訂正・追加・削除請求権：個人情報の内容が事実でない場合に、訂正等を求める権利</li>
                  <li>利用停止・消去請求権：個人情報が不適正に取り扱われている場合に、利用停止等を求める権利</li>
                  <li>第三者提供の停止請求権：個人情報が不適正に第三者提供されている場合に、停止を求める権利</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  これらの権利を行使される場合は、お問い合わせ窓口までご連絡ください。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  12. 未成年者の個人情報
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、18歳未満の方から個人情報を取得する場合、保護者の同意を得ることを原則としています。18歳未満の方が当社サービスをご利用される場合は、事前に保護者の方にご相談いただきますようお願いいたします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  13. プライバシーポリシーの変更
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、法令の改正や事業内容の変更等に伴い、本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当社Webサイトに掲載した時点で効力を生じるものとします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  14. お問い合わせ窓口
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    個人情報の取扱いに関するご質問、ご意見、苦情、各種請求については、以下の窓口までお問い合わせください：
                  </p>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>HATAMO 個人情報保護窓口</strong></p>
                    <p><strong>メールアドレス：</strong> privacy@hatamo.com</p>
                    <p><strong>電話番号：</strong> 03-1234-5678</p>
                    <p><strong>受付時間：</strong> 平日 10:00-18:00（土日祝日、年末年始を除く）</p>
                    <p><strong>住所：</strong> 〒100-0001 東京都千代田区千代田1-1-1 HATAMOビル10階</p>
                  </div>
                </div>
              </section>
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