'use client';

import Link from 'next/link';

export default function BusinessVerifyEmailPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl text-white">✉️</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          メールをご確認ください
        </h1>
        <p className="text-green-200">
          事業者登録はもう少しで完了です
        </p>
      </div>

      {/* Success Message */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-green-600/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">📧</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            確認メールを送信しました
          </h2>
          
          <p className="text-gray-300 mb-6">
            ご登録いただいたメールアドレスに確認メールを送信しました。
            <br />
            メール内のリンクをクリックして、登録を完了してください。
          </p>

          <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4 mb-6">
            <h3 className="text-green-300 font-semibold mb-2">次のステップ</h3>
            <ol className="text-left text-green-200 space-y-2">
              <li>1. 受信トレイをご確認ください</li>
              <li>2. 「HATAMO 事業者登録」という件名のメールを開きます</li>
              <li>3. メール内の「メールアドレスを確認」ボタンをクリックします</li>
              <li>4. 登録が完了し、ログインページに移動します</li>
            </ol>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              <span className="font-semibold">⚠️ メールが届かない場合：</span>
              <br />
              迷惑メールフォルダをご確認ください。
              <br />
              数分待ってもメールが届かない場合は、再送信をお試しください。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              ログインページへ
            </Link>
            <button
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              確認メールを再送信
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          メールアドレスを間違えて登録した場合は、
          <Link href="/register" className="text-green-400 hover:text-green-300">
            もう一度登録
          </Link>
          してください。
        </p>
      </div>

      {/* Help Links */}
      <div className="mt-8 text-center">
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/business/help" className="text-gray-400 hover:text-gray-300 transition-colors">
            ヘルプ
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-gray-300 transition-colors">
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}