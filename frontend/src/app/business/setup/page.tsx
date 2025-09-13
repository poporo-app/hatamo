'use client';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Card from '@/components/common/Card';
import { useState } from 'react';
import Link from 'next/link';

export default function BusinessSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 基本情報
    companyName: '',
    companyType: 'corporation',
    representativeName: '',
    establishedDate: '',
    capitalAmount: '',
    employeeCount: '',
    
    // 連絡先情報
    zipCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: '',
    phoneNumber: '',
    email: '',
    website: '',
    
    // 事業情報
    businessDescription: '',
    serviceCategories: [] as string[],
    businessExperience: '',
    monthlyRevenue: '',
    
    // 書類アップロード
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
    insuranceCertificate: null as File | null,
    portfolioFiles: [] as File[],
  });

  const totalSteps = 4;

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const serviceCategories = [
    'コンサルティング', 'IT・システム開発', 'デザイン・クリエイティブ',
    'マーケティング・広告', '法務・会計', '人材・教育', '建設・施工',
    '製造・加工', '運輸・物流', '小売・卸売', '飲食・宿泊', 'その他'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleMultipleFileUpload = (field: string, files: FileList) => {
    setFormData(prev => ({ ...prev, [field]: Array.from(files) }));
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
    console.log('Form data:', formData);
    // 審査待ちページにリダイレクト
    window.location.href = '/business/approval-pending';
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
            会社名・事業者名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="株式会社○○○"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            法人格 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'corporation', label: '法人' },
              { value: 'individual', label: '個人事業主' }
            ].map((option) => (
              <label key={option.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="companyType"
                  value={option.value}
                  checked={formData.companyType === option.value}
                  onChange={(e) => handleInputChange('companyType', e.target.value)}
                  className="mr-3 h-4 w-4 text-green-600"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            代表者名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.representativeName}
            onChange={(e) => handleInputChange('representativeName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="田中 太郎"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              設立年月日
            </label>
            <input
              type="date"
              value={formData.establishedDate}
              onChange={(e) => handleInputChange('establishedDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              資本金
            </label>
            <input
              type="text"
              value={formData.capitalAmount}
              onChange={(e) => handleInputChange('capitalAmount', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="1,000万円"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            従業員数
          </label>
          <select
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">選択してください</option>
            <option value="1">1名（個人事業主）</option>
            <option value="2-5">2-5名</option>
            <option value="6-10">6-10名</option>
            <option value="11-50">11-50名</option>
            <option value="51-100">51-100名</option>
            <option value="101+">101名以上</option>
          </select>
        </div>
      </div>
    </Card>
  );

  const renderStep2 = () => (
    <Card title="連絡先情報">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              郵便番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              都道府県 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.prefecture}
              onChange={(e) => handleInputChange('prefecture', e.target.value)}
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
              市区町村 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="渋谷区"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            番地 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
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
            value={formData.building}
            onChange={(e) => handleInputChange('building', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="○○ビル 5F"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="03-1234-5678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="info@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webサイト
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="https://example.com"
          />
        </div>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card title="事業情報">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            事業内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="どのような事業を行っているか詳しく記載してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サービスカテゴリ <span className="text-red-500">*</span>
            <span className="text-sm text-gray-500 ml-2">（複数選択可）</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceCategories.map((category) => (
              <label key={category} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.serviceCategories.includes(category)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      serviceCategories: checked
                        ? [...prev.serviceCategories, category]
                        : prev.serviceCategories.filter(c => c !== category)
                    }));
                  }}
                  className="mr-3 h-4 w-4 text-green-600"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            事業経験年数 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.businessExperience}
            onChange={(e) => handleInputChange('businessExperience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">選択してください</option>
            <option value="0-1">1年未満</option>
            <option value="1-3">1-3年</option>
            <option value="3-5">3-5年</option>
            <option value="5-10">5-10年</option>
            <option value="10+">10年以上</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            月商規模
          </label>
          <select
            value={formData.monthlyRevenue}
            onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">選択してください</option>
            <option value="0-100">100万円未満</option>
            <option value="100-500">100-500万円</option>
            <option value="500-1000">500-1000万円</option>
            <option value="1000-5000">1000-5000万円</option>
            <option value="5000+">5000万円以上</option>
          </select>
        </div>
      </div>
    </Card>
  );

  const renderStep4 = () => (
    <Card title="必要書類のアップロード">
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-600">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                書類について
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>ファイル形式：PDF、JPG、PNG</li>
                  <li>ファイルサイズ：1ファイル最大10MB</li>
                  <li>必須書類は審査に必要です</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            事業許可証・営業許可証 <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <div className="space-y-2">
              <div className="text-gray-500">
                <span className="text-3xl">📄</span>
              </div>
              <div>
                <label htmlFor="businessLicense" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-700 font-medium">ファイルを選択</span>
                  <input
                    id="businessLicense"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('businessLicense', e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-500"> またはドラッグ&ドロップ</span>
              </div>
              {formData.businessLicense && (
                <div className="text-sm text-green-600">
                  ✓ {formData.businessLicense.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            納税証明書 <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <div className="space-y-2">
              <div className="text-gray-500">
                <span className="text-3xl">📄</span>
              </div>
              <div>
                <label htmlFor="taxCertificate" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-700 font-medium">ファイルを選択</span>
                  <input
                    id="taxCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('taxCertificate', e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-500"> またはドラッグ&ドロップ</span>
              </div>
              {formData.taxCertificate && (
                <div className="text-sm text-green-600">
                  ✓ {formData.taxCertificate.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            賠償責任保険証書
            <span className="text-sm text-gray-500 ml-2">（推奨）</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <div className="space-y-2">
              <div className="text-gray-500">
                <span className="text-3xl">📄</span>
              </div>
              <div>
                <label htmlFor="insuranceCertificate" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-700 font-medium">ファイルを選択</span>
                  <input
                    id="insuranceCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('insuranceCertificate', e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-500"> またはドラッグ&ドロップ</span>
              </div>
              {formData.insuranceCertificate && (
                <div className="text-sm text-green-600">
                  ✓ {formData.insuranceCertificate.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            実績・ポートフォリオ
            <span className="text-sm text-gray-500 ml-2">（複数選択可、推奨）</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <div className="space-y-2">
              <div className="text-gray-500">
                <span className="text-3xl">📁</span>
              </div>
              <div>
                <label htmlFor="portfolioFiles" className="cursor-pointer">
                  <span className="text-green-600 hover:text-green-700 font-medium">ファイルを選択</span>
                  <input
                    id="portfolioFiles"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleMultipleFileUpload('portfolioFiles', e.target.files)}
                    className="hidden"
                  />
                </label>
                <span className="text-gray-500"> またはドラッグ&ドロップ</span>
              </div>
              {formData.portfolioFiles.length > 0 && (
                <div className="text-sm text-green-600">
                  ✓ {formData.portfolioFiles.length}件のファイルが選択されています
                </div>
              )}
            </div>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">事業者登録</h1>
          <p className="text-gray-600">事業情報を入力して審査にお申し込みください</p>
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
                後で入力する
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
                  審査に申し込む
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