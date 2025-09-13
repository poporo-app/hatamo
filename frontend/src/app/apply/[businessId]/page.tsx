'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/common/Button';
import ReCaptcha, { useReCaptcha } from '@/components/security/ReCaptcha';
import { getBusinessById } from '@/lib/mockBusinessData';
import { Business, BusinessApplication } from '@/types/business';
import { getAppRole } from '@/lib/config';

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BusinessApplication>({
    businessId: '',
    userInfo: {
      name: '',
      email: '',
      phone: '',
      message: ''
    },
    serviceDetails: {
      type: '',
      budget: 0,
      timeline: '',
      requirements: ''
    },
    agreedToTerms: false,
    privacyConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const { ref: recaptchaRef, reset: resetRecaptcha } = useReCaptcha();
  const role = getAppRole();

  useEffect(() => {
    const id = params.businessId as string;
    if (id) {
      const foundBusiness = getBusinessById(id);
      setBusiness(foundBusiness || null);
      setFormData(prev => ({ ...prev, businessId: id }));
      setLoading(false);
    }
  }, [params.businessId]);

  const handleInputChange = (
    section: 'userInfo' | 'serviceDetails',
    field: string,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const handleCheckboxChange = (field: 'agreedToTerms' | 'privacyConsent') => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.userInfo.name.trim()) {
      newErrors['userInfo.name'] = 'お名前は必須です';
    }
    if (!formData.userInfo.email.trim()) {
      newErrors['userInfo.email'] = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userInfo.email)) {
      newErrors['userInfo.email'] = '有効なメールアドレスを入力してください';
    }
    if (!formData.userInfo.phone.trim()) {
      newErrors['userInfo.phone'] = '電話番号は必須です';
    }
    if (!formData.serviceDetails.type.trim()) {
      newErrors['serviceDetails.type'] = 'サービス種別は必須です';
    }
    if (!formData.serviceDetails.budget || formData.serviceDetails.budget <= 0) {
      newErrors['serviceDetails.budget'] = '予算を入力してください';
    }
    if (!formData.serviceDetails.timeline.trim()) {
      newErrors['serviceDetails.timeline'] = '希望納期は必須です';
    }
    if (!formData.agreedToTerms) {
      newErrors['agreedToTerms'] = '利用規約への同意が必要です';
    }
    if (!formData.privacyConsent) {
      newErrors['privacyConsent'] = 'プライバシーポリシーへの同意が必要です';
    }
    if (!recaptchaToken) {
      newErrors['recaptcha'] = 'reCAPTCHA認証が必要です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && recaptchaToken;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store application data in sessionStorage for payment page
      const applicationWithRecaptcha = { ...formData, recaptchaToken };
      sessionStorage.setItem('applicationData', JSON.stringify(applicationWithRecaptcha));
      
      // Redirect to payment page
      router.push('/payment');
      
      // Reset reCAPTCHA after successful submission
      resetRecaptcha();
      setRecaptchaToken('');
    } catch (error) {
      console.error('Application submission failed:', error);
      // Reset reCAPTCHA on error
      resetRecaptcha();
      setRecaptchaToken('');
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header role={role} />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl text-gray-600 mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">サービスが見つかりません</h1>
          <Link href="/businesses">
            <Button theme={role}>サービス一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: Business['price']) => {
    if (price.max) {
      return `¥${price.min.toLocaleString()}〜¥${price.max.toLocaleString()}/${price.unit}`;
    }
    return `¥${price.min.toLocaleString()}/${price.unit}`;
  };

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
            <span className="text-white">申し込み</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h1 className="text-3xl font-bold text-white mb-6">サービス申し込み</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* User Information */}
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">お客様情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        お名前 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.userInfo.name}
                        onChange={(e) => handleInputChange('userInfo', 'name', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                          errors['userInfo.name'] ? 'border-red-500' : 'border-gray-600'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="山田 太郎"
                      />
                      {errors['userInfo.name'] && (
                        <p className="text-red-400 text-sm mt-1">{errors['userInfo.name']}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        メールアドレス <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.userInfo.email}
                        onChange={(e) => handleInputChange('userInfo', 'email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                          errors['userInfo.email'] ? 'border-red-500' : 'border-gray-600'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="example@email.com"
                      />
                      {errors['userInfo.email'] && (
                        <p className="text-red-400 text-sm mt-1">{errors['userInfo.email']}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-gray-300 font-medium mb-2">
                      電話番号 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.userInfo.phone}
                      onChange={(e) => handleInputChange('userInfo', 'phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                        errors['userInfo.phone'] ? 'border-red-500' : 'border-gray-600'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                      placeholder="090-1234-5678"
                    />
                    {errors['userInfo.phone'] && (
                      <p className="text-red-400 text-sm mt-1">{errors['userInfo.phone']}</p>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-gray-300 font-medium mb-2">
                      ご要望・メッセージ
                    </label>
                    <textarea
                      value={formData.userInfo.message}
                      onChange={(e) => handleInputChange('userInfo', 'message', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="その他のご要望やご質問があればお書きください"
                    />
                  </div>
                </section>

                {/* Service Details */}
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">サービス詳細</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        サービス種別 <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.serviceDetails.type}
                        onChange={(e) => handleInputChange('serviceDetails', 'type', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                          errors['serviceDetails.type'] ? 'border-red-500' : 'border-gray-600'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                      >
                        <option value="">選択してください</option>
                        <option value="basic">基本プラン</option>
                        <option value="standard">スタンダードプラン</option>
                        <option value="premium">プレミアムプラン</option>
                        <option value="custom">カスタムプラン</option>
                      </select>
                      {errors['serviceDetails.type'] && (
                        <p className="text-red-400 text-sm mt-1">{errors['serviceDetails.type']}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        ご予算 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.serviceDetails.budget}
                        onChange={(e) => handleInputChange('serviceDetails', 'budget', parseInt(e.target.value) || 0)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                          errors['serviceDetails.budget'] ? 'border-red-500' : 'border-gray-600'
                        } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="100000"
                        min="0"
                      />
                      {errors['serviceDetails.budget'] && (
                        <p className="text-red-400 text-sm mt-1">{errors['serviceDetails.budget']}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-gray-300 font-medium mb-2">
                      希望納期 <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.serviceDetails.timeline}
                      onChange={(e) => handleInputChange('serviceDetails', 'timeline', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white border ${
                        errors['serviceDetails.timeline'] ? 'border-red-500' : 'border-gray-600'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    >
                      <option value="">選択してください</option>
                      <option value="1week">1週間以内</option>
                      <option value="2weeks">2週間以内</option>
                      <option value="1month">1ヶ月以内</option>
                      <option value="2months">2ヶ月以内</option>
                      <option value="3months">3ヶ月以内</option>
                      <option value="negotiable">要相談</option>
                    </select>
                    {errors['serviceDetails.timeline'] && (
                      <p className="text-red-400 text-sm mt-1">{errors['serviceDetails.timeline']}</p>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-gray-300 font-medium mb-2">
                      詳細要件
                    </label>
                    <textarea
                      value={formData.serviceDetails.requirements}
                      onChange={(e) => handleInputChange('serviceDetails', 'requirements', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="プロジェクトの詳細な要件やご希望をお書きください"
                    />
                  </div>
                </section>

                {/* Terms and Conditions */}
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">同意事項</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreedToTerms}
                        onChange={() => handleCheckboxChange('agreedToTerms')}
                        className="w-5 h-5 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <label htmlFor="terms" className="text-gray-300">
                          <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                            利用規約
                          </Link>
                          に同意します <span className="text-red-400">*</span>
                        </label>
                        {errors['agreedToTerms'] && (
                          <p className="text-red-400 text-sm mt-1">{errors['agreedToTerms']}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={formData.privacyConsent}
                        onChange={() => handleCheckboxChange('privacyConsent')}
                        className="w-5 h-5 mt-1 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <label htmlFor="privacy" className="text-gray-300">
                          <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                            プライバシーポリシー
                          </Link>
                          に同意します <span className="text-red-400">*</span>
                        </label>
                        {errors['privacyConsent'] && (
                          <p className="text-red-400 text-sm mt-1">{errors['privacyConsent']}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* reCAPTCHA */}
                <section>
                  <div className="space-y-2">
                    <div ref={recaptchaRef}>
                      <ReCaptcha
                        onVerify={(token) => {
                          setRecaptchaToken(token);
                          // Clear reCAPTCHA error when verified
                          if (errors.recaptcha) {
                            setErrors(prev => ({ ...prev, recaptcha: '' }));
                          }
                        }}
                        onExpired={() => {
                          setRecaptchaToken('');
                          setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHAの有効期限が切れました。もう一度認証してください。' }));
                        }}
                        onError={() => {
                          setRecaptchaToken('');
                          setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA認証中にエラーが発生しました。' }));
                        }}
                        theme="dark"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.recaptcha && (
                      <p className="text-red-400 text-sm">{errors.recaptcha}</p>
                    )}
                  </div>
                </section>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !recaptchaToken}
                    theme={role}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                  >
                    {isSubmitting ? '処理中...' : '決済に進む'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-4">申し込み内容</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-gray-400">📸</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{business.name}</h4>
                    <p className="text-gray-400 text-sm">{business.provider.name}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < Math.floor(business.rating) ? 'text-yellow-400' : 'text-gray-600'}>
                          ★
                        </span>
                      ))}
                      <span className="text-gray-400 text-sm ml-1">({business.reviewCount})</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">基本料金</span>
                    <span className="text-white">{formatPrice(business.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">サービス手数料</span>
                    <span className="text-white">¥0</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">消費税</span>
                    <span className="text-white">別途</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">合計金額</span>
                    <span className="text-white text-xl font-bold">{formatPrice(business.price)}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">※最終的な料金は提供者との相談で決定されます</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/10 rounded-lg border border-blue-600/20">
                <h4 className="text-blue-400 font-semibold mb-2">🛡️ 安心保証</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 満足保証制度</li>
                  <li>• 24時間サポート対応</li>
                  <li>• 取引の安全性保証</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}