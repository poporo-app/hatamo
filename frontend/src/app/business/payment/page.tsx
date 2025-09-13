'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import { useState } from 'react';
import Link from 'next/link';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  isRecommended?: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: {
    cases: number;
    applications: number;
    support: string;
  };
  isPopular?: boolean;
}

export default function BusinessPayment() {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      zipCode: '',
      prefecture: '',
      city: '',
      address: '',
      building: ''
    }
  });

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'ベーシック',
      description: '個人事業主向け',
      price: billingCycle === 'monthly' ? 2980 : 29800,
      features: [
        '案件登録 3件まで',
        '月間申込受付 10件まで',
        '基本的なメッセージ機能',
        'オンラインサポート',
        '手数料 8%'
      ],
      limits: {
        cases: 3,
        applications: 10,
        support: 'オンライン'
      }
    },
    {
      id: 'standard',
      name: 'スタンダード',
      description: '中小企業向け',
      price: billingCycle === 'monthly' ? 9800 : 98000,
      features: [
        '案件登録 20件まで',
        '月間申込受付 100件まで',
        '高度なメッセージ機能',
        '電話・チャットサポート',
        '売上分析レポート',
        '手数料 6%'
      ],
      limits: {
        cases: 20,
        applications: 100,
        support: '電話・チャット'
      },
      isPopular: true
    },
    {
      id: 'premium',
      name: 'プレミアム',
      description: '大企業向け',
      price: billingCycle === 'monthly' ? 29800 : 298000,
      features: [
        '案件登録 無制限',
        '月間申込受付 無制限',
        '全機能利用可能',
        '専属アカウントマネージャー',
        'カスタム分析レポート',
        'API連携',
        '手数料 4%'
      ],
      limits: {
        cases: -1, // unlimited
        applications: -1, // unlimited
        support: '専属マネージャー'
      }
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: 'クレジットカード（Stripe）',
      description: 'Visa、MasterCard、JCB、American Express',
      icon: '💳',
      isRecommended: true
    },
    {
      id: 'alphanote',
      name: '銀行振込（アルファノート）',
      description: '請求書発行、月末締め翌月払い',
      icon: '🏦'
    }
  ];

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const currentPlan = plans.find(plan => plan.id === selectedPlan);
  const currentPaymentMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after first 2 digits
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
  };

  const calculateDiscount = () => {
    if (billingCycle === 'annual') {
      return currentPlan ? Math.round(currentPlan.price * 12 * 0.2) : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (!currentPlan) return 0;
    if (billingCycle === 'monthly') {
      return currentPlan.price;
    } else {
      return currentPlan.price - calculateDiscount();
    }
  };

  const handleSubmit = () => {
    if (selectedPaymentMethod === 'stripe') {
      // Stripe決済処理
      console.log('Stripe payment:', { selectedPlan, formData, billingCycle });
      alert('決済が完了しました！サービスをご利用いただけます。');
    } else {
      // アルファノート請求書発行
      console.log('Alphanote billing:', { selectedPlan, billingCycle });
      alert('請求書を発行いたします。メールでお送りしますので確認をお願いします。');
    }
    window.location.href = '/business/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="business" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">月額プラン登録</h1>
          <p className="text-gray-600">事業規模に合わせて最適なプランをお選びください</p>
        </div>

        {/* 料金体系切り替え */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              月額払い
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'annual'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              年額払い
              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                20%割引
              </span>
            </button>
          </div>
        </div>

        {/* プラン選択 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? 'border-green-500 shadow-xl'
                  : 'border-gray-200 hover:border-green-300'
              } ${plan.isPopular ? 'ring-2 ring-green-400' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    おすすめ
                  </span>
                </div>
              )}
              
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ¥{plan.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {billingCycle === 'monthly' ? '/ 月' : '/ 年'}
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-xs text-green-600 mt-1">
                      月額換算: ¥{Math.round(plan.price / 12).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-center">
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPlan === plan.id ? '選択中' : 'このプランを選択'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 決済方法選択 */}
          <div className="lg:col-span-2">
            <Card title="決済方法">
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-4 h-4 w-4 text-green-600"
                    />
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800">{method.name}</span>
                          {method.isRecommended && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              推奨
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Stripe決済フォーム */}
              {selectedPaymentMethod === 'stripe' && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800">クレジットカード情報</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カード番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        if (formatted.replace(/\s/g, '').length <= 16) {
                          handleInputChange('cardNumber', formatted);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        有効期限 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          if (formatted.replace(/\D/g, '').length <= 4) {
                            handleInputChange('expiryDate', formatted);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            handleInputChange('cvv', value);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カード名義 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="TARO YAMADA"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-4">請求先住所</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          郵便番号
                        </label>
                        <input
                          type="text"
                          value={formData.billingAddress.zipCode}
                          onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          都道府県
                        </label>
                        <select
                          value={formData.billingAddress.prefecture}
                          onChange={(e) => handleInputChange('billingAddress.prefecture', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">選択してください</option>
                          {prefectures.map((pref) => (
                            <option key={pref} value={pref}>{pref}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          市区町村
                        </label>
                        <input
                          type="text"
                          value={formData.billingAddress.city}
                          onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="渋谷区"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          番地
                        </label>
                        <input
                          type="text"
                          value={formData.billingAddress.address}
                          onChange={(e) => handleInputChange('billingAddress.address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="1-2-3"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          建物名・部屋番号
                        </label>
                        <input
                          type="text"
                          value={formData.billingAddress.building}
                          onChange={(e) => handleInputChange('billingAddress.building', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="○○ビル 5F"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* アルファノート請求書 */}
              {selectedPaymentMethod === 'alphanote' && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">銀行振込について</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 請求書を事業者登録のメールアドレスに送付いたします</li>
                      <li>• 支払い期限は月末締め翌月末払いとなります</li>
                      <li>• 振込手数料はお客様負担となります</li>
                      <li>• 入金確認後、サービスが有効になります</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* 注文内容確認 */}
          <div>
            <Card title="注文内容">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">選択プラン</h4>
                  <div className="text-lg font-bold text-green-600">{currentPlan?.name}</div>
                  <div className="text-sm text-gray-600">{currentPlan?.description}</div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">
                      {billingCycle === 'monthly' ? '月額料金' : '年額料金'}
                    </span>
                    <span className="font-medium">
                      ¥{currentPlan?.price.toLocaleString()}
                    </span>
                  </div>

                  {billingCycle === 'annual' && calculateDiscount() > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>年額割引（20%OFF）</span>
                      <span>-¥{calculateDiscount().toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>合計</span>
                      <span className="text-green-600">¥{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-sm text-yellow-800">
                    <div className="font-medium mb-1">注意事項</div>
                    <ul className="space-y-1">
                      <li>• 契約は自動更新されます</li>
                      <li>• 解約は月末まで有効です</li>
                      <li>• プラン変更は即座に反映されます</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {selectedPaymentMethod === 'stripe' ? '決済を実行する' : '請求書を発行する'}
                </button>

                <div className="text-center">
                  <Link
                    href="/business/dashboard"
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    後で設定する
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-8 text-center">
          <div className="bg-gray-100 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl mr-2">🔒</span>
              <h4 className="font-medium text-gray-800">セキュリティ</h4>
            </div>
            <p className="text-sm text-gray-600">
              お客様の決済情報は、業界標準のSSL暗号化技術により安全に保護されます。
              クレジットカード情報は当社サーバーには保存されず、Stripe社の安全なサーバーで管理されます。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}