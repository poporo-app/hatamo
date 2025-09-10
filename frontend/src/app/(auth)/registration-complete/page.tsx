'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';

export default function RegistrationCompletePage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setResendMessage({ type: 'error', text: 'メールアドレスを入力してください' });
      return;
    }

    setIsResending(true);
    setResendMessage(null);
    
    try {
      await authApi.resendVerification({ email });
      setResendMessage({
        type: 'success',
        text: '認証メールを再送信しました。メールをご確認ください。'
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      setResendMessage({
        type: 'error',
        text: error.message || '認証メールの再送信に失敗しました。'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl text-white">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            登録ありがとうございます！
          </h1>
          <p className="text-gray-300 text-lg">
            HATAMOへようこそ
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-100 mb-3">
            📋 次のステップ
          </h3>
          <ol className="text-blue-100 text-sm space-y-2">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>ご登録いただいたメールアドレスに認証メールをお送りしました</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>メール内の「メール認証」ボタンをクリックしてください</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>認証完了後、すべてのサービスをご利用いただけます</span>
            </li>
          </ol>
        </div>

        {/* Resend Email Section */}
        <div className="bg-gray-700/50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            メールが届かない場合
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            メールが届かない場合は、以下から認証メールを再送信できます：
          </p>
          
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="登録したメールアドレス"
            />
            
            {resendMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                resendMessage.type === 'success'
                  ? 'bg-green-900/50 border border-green-400 text-green-100'
                  : 'bg-red-900/50 border border-red-400 text-red-100'
              }`}>
                {resendMessage.text}
              </div>
            )}
            
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                isResending
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900'
              }`}
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  送信中...
                </div>
              ) : (
                '認証メールを再送信'
              )}
            </button>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <span className="text-yellow-400 mr-2 flex-shrink-0">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-100 mb-1">
                重要なお知らせ
              </h4>
              <ul className="text-yellow-100 text-sm space-y-1">
                <li>• メールが迷惑メールフォルダに入っていないかご確認ください</li>
                <li>• 認証メールは24時間以内にクリックしてください</li>
                <li>• ドメイン「@hatamo.com」からのメールを受信許可してください</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
          >
            ログインページへ
          </Link>
          
          <Link
            href="/"
            className="block w-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
          >
            ホームページへ戻る
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-4">
          ご不明な点がございましたら、お気軽にお問い合わせください
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
            よくある質問
          </Link>
          <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
            サポートに連絡
          </Link>
          <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
            利用規約
          </Link>
        </div>
      </div>
    </div>
  );
}