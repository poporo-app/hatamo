import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約 | HATAMO',
  description: 'HATAMOサービスの利用規約をご確認ください。',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                利用規約
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                最終更新日：2024年9月13日
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第1条（本規約の適用）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  本利用規約（以下「本規約」）は、HATAMO（以下「当社」）が提供するHATAMOサービス（以下「本サービス」）の利用条件を定めるものです。
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  本サービスをご利用いただくユーザー（以下「利用者」）には、本規約に従ってサービスをご利用いただきます。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第2条（利用登録）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  本サービスにおいて利用登録を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって利用登録が完了します。
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、利用登録申請者について、以下の事由があると判断した場合、利用登録を承認しないことがあります：
                </p>
                <ul className="list-disc pl-6 mt-4 text-gray-700 dark:text-gray-300">
                  <li className="mb-2">利用登録申請に際して虚偽の事項を届け出た場合</li>
                  <li className="mb-2">本規約に違反したことがある者からの申請である場合</li>
                  <li className="mb-2">未成年者である場合</li>
                  <li className="mb-2">その他、当社が利用登録を相当でないと判断した場合</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第3条（禁止事項）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  利用者は、本サービスの利用にあたり、以下の行為をしてはなりません：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li className="mb-2">法令または公序良俗に違反する行為</li>
                  <li className="mb-2">犯罪行為に関連する行為</li>
                  <li className="mb-2">本サービスの内容等、本サービスに含まれる著作権、商標権その他の知的財産権を侵害する行為</li>
                  <li className="mb-2">当社、ほかの利用者、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                  <li className="mb-2">本サービスによって得られた情報を商業的に利用する行為</li>
                  <li className="mb-2">当社のサービスの運営を妨害するおそれのある行為</li>
                  <li className="mb-2">不正アクセスをし、またはこれを試みる行為</li>
                  <li className="mb-2">他の利用者に関する個人情報等を収集または蓄積する行為</li>
                  <li className="mb-2">不正な目的を持って本サービスを利用する行為</li>
                  <li className="mb-2">本サービスの他の利用者またはその他の第三者に不利益、損害、不快感を与える行為</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第4条（本サービスの提供の停止等）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li className="mb-2">本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                  <li className="mb-2">地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                  <li className="mb-2">コンピュータまたは通信回線等が事故により停止した場合</li>
                  <li className="mb-2">その他、当社が本サービスの提供が困難と判断した場合</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第5条（著作権）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  利用者は、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の許諾を得た文章、画像や映像等の情報に関してのみ、本サービスを利用し、投稿ないしアップロードすることができるものとします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第6条（利用制限および登録抹消）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、利用者が以下のいずれかに該当する場合には、事前の通知なく、投稿データを削除し、利用者に対して本サービスの全部もしくは一部の利用を制限しまたは利用者としての登録を抹消することができるものとします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第7条（保証の否認および免責事項）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、本サービスに起因して利用者に生じたあらゆる損害について一切の責任を負いません。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第8条（サービス内容の変更等）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、利用者に通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによって利用者に生じた損害について一切の責任を負いません。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第9条（利用規約の変更）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該利用者は変更後の規約に同意したものとみなします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第10条（個人情報の取扱い）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
                  第11条（準拠法・裁判管轄）
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
                </p>
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