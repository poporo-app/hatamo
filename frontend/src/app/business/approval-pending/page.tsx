'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import Link from 'next/link';

export default function ApprovalPending() {
  const submittedDate = '2024年1月15日 14:30';
  const expectedDays = '3-5営業日';

  const checklistItems = [
    {
      title: '基本情報の確認',
      description: '事業者情報、連絡先情報の確認',
      status: 'completed'
    },
    {
      title: '事業内容の審査',
      description: '提供サービス、事業経験の評価',
      status: 'completed'
    },
    {
      title: '必要書類の確認',
      description: '事業許可証、納税証明書等の確認',
      status: 'in_progress'
    },
    {
      title: '信用調査',
      description: '事業実績、信用情報の調査',
      status: 'pending'
    },
    {
      title: '最終審査',
      description: '総合的な審査・承認判定',
      status: 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-600 text-lg">✓</span>;
      case 'in_progress':
        return <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>;
      case 'pending':
        return <span className="text-gray-400 text-lg">○</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-green-300 bg-green-100';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="business" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <span className="text-3xl text-green-600">⏳</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">運営審査中</h1>
          <p className="text-lg text-gray-600">
            事業者登録の審査を行っております。今しばらくお待ちください。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="申請状況">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">申請日時</span>
                <span className="text-sm text-gray-900">{submittedDate}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">審査期間（目安）</span>
                <span className="text-sm text-gray-900">{expectedDays}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-700">現在のステータス</span>
                <span className="text-sm font-semibold text-green-800 bg-green-200 px-2 py-1 rounded">
                  審査中
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">審査結果の通知方法</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>登録いただいたメールアドレスに通知</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📱</span>
                  <span>システム内通知（ダッシュボード）</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="審査の流れ">
            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div key={index} className={`flex items-start p-4 border rounded-lg ${getStatusColor(item.status)}`}>
                  <div className="flex-shrink-0 mt-0.5 mr-3">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-medium text-gray-900 mb-1">{item.title}</h5>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="よくあるご質問">
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-800 mb-2">審査にはどのくらい時間がかかりますか？</h5>
                <p className="text-sm text-gray-600">
                  通常3-5営業日で完了いたします。書類に不備がある場合は追加でお時間をいただく場合があります。
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-800 mb-2">審査中に追加で書類が必要になることはありますか？</h5>
                <p className="text-sm text-gray-600">
                  はい。審査の過程で追加書類をお願いする場合があります。その際はメールでご連絡いたします。
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">審査状況を確認する方法はありますか？</h5>
                <p className="text-sm text-gray-600">
                  このページで最新の審査状況をご確認いただけます。また、進捗に変更がある際はメールでお知らせします。
                </p>
              </div>
            </div>
          </Card>

          <Card title="審査期間中にできること">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-2">プロフィールの準備</h5>
                <p className="text-sm text-green-700 mb-3">
                  審査通過後すぐにサービスを開始できるよう、事業者プロフィールを作成しておきましょう。
                </p>
                <Link
                  href="/business/profile/edit"
                  className="inline-block text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  プロフィール作成 →
                </Link>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">サービス内容の検討</h5>
                <p className="text-sm text-blue-700 mb-3">
                  どのようなサービスを提供するか、料金設定を事前に検討しておくことをお勧めします。
                </p>
                <Link
                  href="/business/services/guide"
                  className="inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  サービス設定ガイド →
                </Link>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-medium text-purple-800 mb-2">システムの使い方を学習</h5>
                <p className="text-sm text-purple-700 mb-3">
                  事業者向けの機能やツールの使い方を事前に確認できます。
                </p>
                <Link
                  href="/business/tutorial"
                  className="inline-block text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  チュートリアル →
                </Link>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-100 rounded-lg p-6">
            <h4 className="font-medium text-gray-800 mb-2">お困りの際は</h4>
            <p className="text-sm text-gray-600 mb-4">
              審査に関するご質問やお困りのことがございましたら、お気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                お問い合わせ
              </Link>
              <Link
                href="/business/dashboard"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}