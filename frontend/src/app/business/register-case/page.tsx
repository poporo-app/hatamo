'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import { useState } from 'react';
import Link from 'next/link';

interface ServiceForm {
  title: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  targetCustomer: string;
  deliverables: string;
  duration: string;
  durationType: 'days' | 'weeks' | 'months';
  pricing: {
    type: 'fixed' | 'hourly' | 'monthly' | 'project';
    amount: string;
    unit: string;
    options: Array<{
      name: string;
      price: string;
      description: string;
    }>;
  };
  requirements: string;
  terms: string;
  images: File[];
  tags: string[];
}

export default function RegisterCase() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ServiceForm>({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    features: [''],
    targetCustomer: '',
    deliverables: '',
    duration: '',
    durationType: 'days',
    pricing: {
      type: 'fixed',
      amount: '',
      unit: '円',
      options: [{ name: '', price: '', description: '' }]
    },
    requirements: '',
    terms: '',
    images: [],
    tags: []
  });

  const totalSteps = 4;

  const categories = [
    {
      name: 'IT・システム開発',
      subcategories: ['Webサイト制作', 'アプリ開発', 'システム構築', 'データベース設計', 'セキュリティ対策']
    },
    {
      name: 'デザイン・クリエイティブ',
      subcategories: ['ロゴ・ブランディング', 'Webデザイン', 'グラフィックデザイン', '動画制作', '写真撮影']
    },
    {
      name: 'マーケティング・広告',
      subcategories: ['SNSマーケティング', 'SEO対策', 'リスティング広告', 'コンテンツマーケティング', 'ブランド戦略']
    },
    {
      name: 'コンサルティング',
      subcategories: ['経営コンサルティング', 'IT戦略', '人事・組織', '財務・会計', '法務・コンプライアンス']
    },
    {
      name: '業務支援・アウトソーシング',
      subcategories: ['経理・会計', '人事労務', 'カスタマーサポート', 'データ入力', '翻訳・通訳']
    },
    {
      name: 'その他',
      subcategories: ['教育・研修', '建設・施工', '製造・加工', '物流・配送', 'その他サービス']
    }
  ];

  const pricingTypes = [
    { value: 'fixed', label: '固定料金', description: '決まった金額でサービスを提供' },
    { value: 'hourly', label: '時間制', description: '時間単位での料金設定' },
    { value: 'monthly', label: '月額制', description: '継続的なサービス提供' },
    { value: 'project', label: 'プロジェクト制', description: 'プロジェクト規模に応じた料金' }
  ];

  const handleInputChange = (field: string, value: any) => {
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

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handlePricingOptionChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        options: prev.pricing.options.map((option, i) => 
          i === index ? { ...option, [field]: value } : option
        )
      }
    }));
  };

  const addPricingOption = () => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        options: [...prev.pricing.options, { name: '', price: '', description: '' }]
      }
    }));
  };

  const removePricingOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        options: prev.pricing.options.filter((_, i) => i !== index)
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: API送信処理
    console.log('Service data:', formData);
    alert('案件が正常に登録されました！');
    window.location.href = '/business/dashboard';
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              i + 1 === currentStep 
                ? 'bg-green-600 text-white' 
                : i + 1 < currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {i + 1 < currentStep ? '✓' : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-16 h-1 ${
                i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-4 text-sm text-gray-600">
        ステップ {currentStep} / {totalSteps}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card title="基本情報">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サービス名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="例：企業向けWebサイト制作サービス"
            maxLength={100}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.title.length}/100文字
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                handleInputChange('category', e.target.value);
                handleInputChange('subcategory', ''); // Reset subcategory
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">選択してください</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サブカテゴリ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={!formData.category}
            >
              <option value="">選択してください</option>
              {formData.category && categories
                .find(cat => cat.name === formData.category)
                ?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サービス概要 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="どのようなサービスか、具体的に説明してください"
            maxLength={1000}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {formData.description.length}/1000文字
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サービスの特徴・強み
          </label>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={`特徴 ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              + 特徴を追加
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            対象となるお客様
          </label>
          <textarea
            value={formData.targetCustomer}
            onChange={(e) => handleInputChange('targetCustomer', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="例：売上50億円以下の中小企業、スタートアップ企業など"
          />
        </div>
      </div>
    </Card>
  );

  const renderStep2 = () => (
    <Card title="サービス詳細">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            提供内容・成果物 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.deliverables}
            onChange={(e) => handleInputChange('deliverables', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="具体的に何を提供するか、どのような成果物があるかを記載してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            実施期間 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="期間"
              min="1"
            />
            <select
              value={formData.durationType}
              onChange={(e) => handleInputChange('durationType', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="days">日</option>
              <option value="weeks">週間</option>
              <option value="months">ヶ月</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            前提条件・要件
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) => handleInputChange('requirements', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="サービス提供にあたって必要な条件、お客様にご準備いただくものなど"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            利用規約・注意事項
          </label>
          <textarea
            value={formData.terms}
            onChange={(e) => handleInputChange('terms', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="キャンセル規定、知的財産権、責任範囲など"
          />
        </div>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card title="料金設定">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            料金体系 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingTypes.map((type) => (
              <label key={type.value} className="flex flex-col p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="pricingType"
                    value={type.value}
                    checked={formData.pricing.type === type.value}
                    onChange={(e) => handleInputChange('pricing.type', e.target.value)}
                    className="mr-3 h-4 w-4 text-green-600"
                  />
                  <span className="text-sm font-medium">{type.label}</span>
                </div>
                <span className="text-xs text-gray-500">{type.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            基本料金 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.pricing.amount}
              onChange={(e) => handleInputChange('pricing.amount', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="金額"
              min="0"
            />
            <select
              value={formData.pricing.unit}
              onChange={(e) => handleInputChange('pricing.unit', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="円">円</option>
              <option value="円/時間">円/時間</option>
              <option value="円/月">円/月</option>
              <option value="円/件">円/件</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            オプション料金
          </label>
          <div className="space-y-4">
            {formData.pricing.options.map((option, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => handlePricingOptionChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="オプション名"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={option.price}
                    onChange={(e) => handlePricingOptionChange(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="追加料金"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={option.description}
                    onChange={(e) => handlePricingOptionChange(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="説明"
                  />
                  {formData.pricing.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePricingOption(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addPricingOption}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              + オプションを追加
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">料金設定のポイント</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 競合他社の料金を参考に適正価格を設定しましょう</li>
            <li>• 品質に見合った価格設定で信頼性を保ちましょう</li>
            <li>• オプション料金で柔軟性を持たせると受注しやすくなります</li>
            <li>• 料金の根拠を明確にしてお客様に説明できるようにしましょう</li>
          </ul>
        </div>
      </div>
    </Card>
  );

  const renderStep4 = () => (
    <Card title="画像・タグ設定">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サービス画像
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <div className="space-y-2">
              <div className="text-gray-500">
                <span className="text-3xl">🖼️</span>
              </div>
              <div>
                <label htmlFor="serviceImages" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-700 font-medium">画像を選択</span>
                  <input
                    id="serviceImages"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFormData(prev => ({
                          ...prev,
                          images: Array.from(e.target.files!)
                        }));
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-500"> またはドラッグ&ドロップ</span>
              </div>
              <div className="text-xs text-gray-500">
                JPG、PNG、GIF（最大5枚、1枚10MBまで）
              </div>
              {formData.images.length > 0 && (
                <div className="text-sm text-green-600">
                  ✓ {formData.images.length}枚の画像が選択されています
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索タグ
          </label>
          <div className="space-y-2">
            <input
              type="text"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value && !formData.tags.includes(value)) {
                    setFormData(prev => ({
                      ...prev,
                      tags: [...prev.tags, value]
                    }));
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="タグを入力してEnterキーを押してください"
            />
            <div className="text-xs text-gray-500">
              お客様がサービスを検索しやすくなるキーワードを設定してください
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index)
                        }));
                      }}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4">プレビュー</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-semibold text-lg text-gray-800">
                {formData.title || 'サービス名'}
              </h5>
              <span className="text-green-600 font-bold">
                {formData.pricing.amount ? `${Number(formData.pricing.amount).toLocaleString()}${formData.pricing.unit}` : '料金未設定'}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {formData.category && formData.subcategory && `${formData.category} > ${formData.subcategory}`}
            </div>
            <p className="text-gray-700 text-sm">
              {formData.description || 'サービス概要が入ります'}
            </p>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {formData.tags.slice(0, 5).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header role="business" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">案件登録</h1>
          <p className="text-gray-600">新しいサービスを登録して、お客様からの依頼を受け付けましょう</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  前へ
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <Link
                href="/business/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                下書き保存
              </Link>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  次へ
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  案件を登録する
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}