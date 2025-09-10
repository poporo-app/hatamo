'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('認証トークンが見つかりません。メール内のリンクをもう一度クリックしてください。');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  // Countdown timer for redirect
  useEffect(() => {
    if (status === 'success' && countdown === 0) {
      setCountdown(3);
    }
  }, [status]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && status === 'success') {
      // Redirect to login after countdown
      setTimeout(() => {
        router.push('/login');
      }, 500);
    }
  }, [countdown, status, router]);

  const verifyEmail = async (token: string) => {
    try {
      setStatus('loading');
      const response = await authApi.verifyEmail({ token });
      setStatus('success');
      setMessage(response.message || 'メールの認証が完了しました！');
    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage(error.message || 'メールの認証に失敗しました。');
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      alert('メールアドレスを入力してください');
      return;
    }

    setIsResending(true);
    
    try {
      await authApi.resendVerification({ email });
      alert('認証メールを再送信しました。メールをご確認ください。');
    } catch (error: any) {
      console.error('Resend error:', error);
      alert(error.message || '認証メールの再送信に失敗しました。');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              メール認証中...
            </h1>
            <p className="text-gray-400">
              しばらくお待ちください
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl text-white">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              認証完了！
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>
            
            <div className="bg-green-900/30 border border-green-400 rounded-lg p-4 mb-6">
              <p className="text-green-100 text-sm">
                {countdown > 0 ? (
                  <>
                    {countdown}秒後にログインページに自動的に移動します
                  </>
                ) : (
                  'ログインページに移動しています...'
                )}
              </p>
            </div>

            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              今すぐログイン
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl text-white">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              認証エラー
            </h1>
            <p className="text-gray-300 mb-8">{message}</p>

            {/* Resend Email Section */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                認証メールの再送信
              </h3>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  placeholder="メールアドレスを入力"
                />
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

            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
              >
                新規登録に戻る
              </Link>
              
              <Link
                href="/login"
                className="block w-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
              >
                ログインページに戻る
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        {renderContent()}
      </div>

      {/* Help Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm mb-4">
          問題が解決しない場合は、サポートチームまでお問い合わせください
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <Link href="/help" className="text-blue-400 hover:text-blue-300 transition-colors">
            ヘルプセンター
          </Link>
          <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}