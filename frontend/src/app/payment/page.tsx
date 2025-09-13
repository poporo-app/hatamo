'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import { getBusinessById } from '@/lib/mockBusinessData';
import { Business, BusinessApplication } from '@/types/business';
import { getAppRole } from '@/lib/config';

export default function PaymentPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<BusinessApplication | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToCancellationPolicy, setAgreedToCancellationPolicy] = useState(false);
  const role = getAppRole();

  useEffect(() => {
    const storedData = sessionStorage.getItem('applicationData');
    if (storedData) {
      const data = JSON.parse(storedData) as BusinessApplication;
      setApplicationData(data);
      
      const foundBusiness = getBusinessById(data.businessId);
      setBusiness(foundBusiness || null);
    } else {
      // No application data, redirect to businesses page
      router.push('/businesses');
    }
  }, [router]);

  const formatPrice = (price: Business['price']) => {
    if (price.max) {
      return `¥${price.min.toLocaleString()}〜¥${price.max.toLocaleString()}/${price.unit}`;
    }
    return `¥${price.min.toLocaleString()}/${price.unit}`;
  };

  const calculateTotal = () => {
    if (!business) return 0;
    // For demo purposes, use the minimum price
    const basePrice = business.price.min;
    const tax = Math.floor(basePrice * 0.1);
    return basePrice + tax;
  };

  const handleCardInputChange = (field: keyof typeof cardData, value: string) => {
    let formattedValue = value;
    
    // Format card number
    if (field === 'number') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    }
    
    // Format expiry date
    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    }
    
    // Format CVV
    if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (selectedPaymentMethod === 'card') {
      if (!cardData.number.replace(/\s/g, '')) {
        newErrors.number = 'カード番号を入力してください';
      } else if (cardData.number.replace(/\s/g, '').length < 13) {
        newErrors.number = '有効なカード番号を入力してください';
      }
      
      if (!cardData.expiry) {
        newErrors.expiry = '有効期限を入力してください';
      } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
        newErrors.expiry = '有効期限をMM/YY形式で入力してください';
      }
      
      if (!cardData.cvv) {
        newErrors.cvv = 'セキュリティコードを入力してください';
      } else if (cardData.cvv.length < 3) {
        newErrors.cvv = '有効なセキュリティコードを入力してください';
      }
      
      if (!cardData.name.trim()) {
        newErrors.name = 'カード名義人を入力してください';
      }
    }
    
    // Validate cancellation policy agreement
    if (!agreedToCancellationPolicy) {
      newErrors.cancellationPolicy = 'キャンセル・返金ポリシーへの同意が必要です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear application data
      sessionStorage.removeItem('applicationData');
      
      // Redirect to completion page
      router.push('/complete');
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ general: '決済処理中にエラーが発生しました。もう一度お試しください。' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!applicationData || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header role={role} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-800 h-8 rounded mb-4"></div>
            <div className="bg-gray-800 h-96 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header role={role} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">トップ</Link>
            <span>›</span>
            <Link href="/businesses" className="hover:text-white transition-colors">サービス一覧</Link>
            <span>›</span>
            <Link href={`/business/${business.id}`} className="hover:text-white transition-colors">{business.name}</Link>
            <span>›</span>
            <Link href={`/apply/${business.id}`} className="hover:text-white transition-colors">申し込み</Link>
            <span>›</span>
            <span className="text-white">決済</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h1 className="text-3xl font-bold text-white mb-6">決済情報</h1>
              
              {/* Payment Method Selection */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">お支払い方法</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'card', name: 'クレジットカード', icon: '💳' },
                    { id: 'bank', name: '銀行振込', icon: '🏦' },
                    { id: 'paypay', name: 'PayPay', icon: '📱' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="text-white font-medium">{method.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Credit Card Form */}
              {selectedPaymentMethod === 'card' && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">カード情報</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        カード番号 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => handleCardInputChange('number', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                          errors.number ? 'border-red-500' : 'border-gray-600'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.number && (
                        <p className="text-red-400 text-sm mt-1">{errors.number}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          有効期限 <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                            errors.expiry ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiry && (
                          <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 font-medium mb-2">
                          セキュリティコード <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                            errors.cvv ? 'border-red-500' : 'border-gray-600'
                          } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        カード名義人 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                          errors.name ? 'border-red-500' : 'border-gray-600'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="YAMADA TARO"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Bank Transfer Instructions */}
              {selectedPaymentMethod === 'bank' && (
                <section className="mb-8">
                  <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-6">
                    <h3 className="text-yellow-400 font-semibold mb-3">🏦 銀行振込について</h3>
                    <div className="text-gray-300 space-y-2">
                      <p>申し込み完了後、振込先情報をメールでお送りします。</p>
                      <p>お振込み確認後、サービス提供者との連絡を開始いたします。</p>
                      <p>振込手数料はお客様負担となります。</p>
                    </div>
                  </div>
                </section>
              )}

              {/* PayPay Instructions */}
              {selectedPaymentMethod === 'paypay' && (
                <section className="mb-8">
                  <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-6">
                    <h3 className="text-red-400 font-semibold mb-3">📱 PayPay決済について</h3>
                    <div className="text-gray-300 space-y-2">
                      <p>申し込み完了後、PayPay決済用のQRコードをお送りします。</p>
                      <p>PayPayアプリでQRコードを読み取ってお支払いください。</p>
                      <p>決済完了後、自動的にサービス開始となります。</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <p className="text-red-400">{errors.general}</p>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-6 mb-8">
                <h3 className="text-green-400 font-semibold mb-3">🔒 セキュリティについて</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>• すべての決済情報は SSL により暗号化されて送信されます</p>
                  <p>• カード情報は保存されません</p>
                  <p>• Stripe を使用した安全な決済システムを採用</p>
                </div>
              </div>

              {/* Cancellation and Refund Policy */}
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">キャンセル・返金ポリシー</h3>
                <div className="text-gray-300 text-sm space-y-3 mb-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">キャンセルについて</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>サービス開始前：全額返金</li>
                      <li>サービス開始後：提供者との直接交渉により决定</li>
                      <li>サービス完了後：キャンセル不可</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">返金手数料</h4>
                    <p>返金手数料（銀行振込手数料等）はお客様のご負担となります。</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">返金処理期間</h4>
                    <p>返金申請から７～１４営業日以内に処理いたします。</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="cancellationPolicy"
                    checked={agreedToCancellationPolicy}
                    onChange={(e) => {
                      setAgreedToCancellationPolicy(e.target.checked);
                      if (errors.cancellationPolicy) {
                        setErrors(prev => ({ ...prev, cancellationPolicy: '' }));
                      }
                    }}
                    className="w-5 h-5 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <label htmlFor="cancellationPolicy" className="text-gray-300">
                      <Link href="/commercial-transaction" className="text-blue-400 hover:text-blue-300 underline">
                        キャンセル・返金ポリシー
                      </Link>
                      に同意します <span className="text-red-400">*</span>
                    </label>
                    {errors.cancellationPolicy && (
                      <p className="text-red-400 text-sm mt-1">{errors.cancellationPolicy}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Button */
              <div className="flex justify-center">
                <Button
                  onClick={handlePayment}
                  size="lg"
                  disabled={isProcessing || !agreedToCancellationPolicy}
                  theme={role}
                  className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>決済処理中...</span>
                    </div>
                  ) : (
                    `¥${calculateTotal().toLocaleString()} を支払う`
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-4">注文内容</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-gray-400">📸</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{business.name}</h4>
                    <p className="text-gray-400 text-sm">{business.provider.name}</p>
                    <p className="text-gray-400 text-sm">{business.category}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-white font-semibold mb-2">申し込み情報</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">お名前:</span>
                      <span className="text-white">{applicationData.userInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">サービス:</span>
                      <span className="text-white">{applicationData.serviceDetails.type || '基本プラン'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">予算:</span>
                      <span className="text-white">¥{applicationData.serviceDetails.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">サービス料金</span>
                      <span className="text-white">¥{business.price.min.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">プラットフォーム手数料</span>
                      <span className="text-white">¥0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">消費税 (10%)</span>
                      <span className="text-white">¥{Math.floor(business.price.min * 0.1).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold text-lg">合計金額</span>
                    <span className="text-white text-2xl font-bold">¥{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/10 rounded-lg border border-blue-600/20">
                <h4 className="text-blue-400 font-semibold mb-2">📞 サポート</h4>
                <p className="text-gray-300 text-sm">
                  お困りの際は24時間サポートまでお気軽にお問い合わせください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}