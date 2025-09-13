'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
}

export default function DocumentUploadPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: 'business_license',
      name: '事業許可証',
      description: '事業を行うための正式な許可証',
      required: true,
      uploaded: false
    },
    {
      id: 'company_registration',
      name: '法人登記簿謄本',
      description: '3ヶ月以内に発行されたもの',
      required: true,
      uploaded: false
    },
    {
      id: 'tax_certificate',
      name: '納税証明書',
      description: '直近の納税証明書',
      required: true,
      uploaded: false
    },
    {
      id: 'bank_account',
      name: '口座情報確認書類',
      description: '振込先口座の確認書類',
      required: true,
      uploaded: false
    },
    {
      id: 'company_profile',
      name: '会社案内資料',
      description: '会社概要やサービス内容が分かる資料',
      required: false,
      uploaded: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    // Get business registration data from sessionStorage
    const data = sessionStorage.getItem('businessRegistration');
    if (data) {
      setBusinessData(JSON.parse(data));
    } else {
      // If no data, redirect back to registration
      router.push('/business/register');
    }
  }, [router]);

  const handleFileSelect = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, uploaded: true, fileName: file.name }
          : doc
      ));
    }
  };

  const handleRemoveFile = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, uploaded: false, fileName: undefined }
        : doc
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required documents are uploaded
    const missingRequired = documents.filter(doc => doc.required && !doc.uploaded);
    if (missingRequired.length > 0) {
      alert('必須書類をすべてアップロードしてください');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear sessionStorage
      sessionStorage.removeItem('businessRegistration');
      
      // Navigate to completion/review page
      router.push('/business/register/complete');
    } catch (error) {
      alert('送信中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            必要書類のアップロード
          </h1>
          <p className="text-lg text-gray-300">
            審査に必要な書類をアップロードしてください
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <span className="ml-3 text-green-400 font-medium">企業情報</span>
            </div>
            <div className="flex-1 h-1 bg-purple-600 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="ml-3 text-white font-medium">書類アップロード</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 mx-4"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold">
                3
              </div>
              <span className="ml-3 text-gray-400 font-medium">審査</span>
            </div>
          </div>
        </div>

        {/* Business Info Summary */}
        {businessData && (
          <div className="max-w-3xl mx-auto mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">登録企業情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">企業名：</span>
                <span className="text-white ml-2">{businessData.companyName}</span>
              </div>
              <div>
                <span className="text-gray-400">代表者：</span>
                <span className="text-white ml-2">{businessData.representativeName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Document Upload Form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className={`p-6 rounded-lg border ${
                    doc.uploaded 
                      ? 'bg-green-900/20 border-green-600' 
                      : 'bg-gray-900 border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        {doc.name}
                        {doc.required && (
                          <span className="ml-2 text-xs bg-red-600 text-white px-2 py-1 rounded">
                            必須
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{doc.description}</p>
                      
                      {doc.uploaded && doc.fileName && (
                        <div className="mt-3 flex items-center">
                          <span className="text-green-400 text-sm">
                            📎 {doc.fileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(doc.id)}
                            className="ml-3 text-red-400 hover:text-red-300 text-sm"
                          >
                            削除
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {!doc.uploaded ? (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileSelect(doc.id, e)}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            disabled={isLoading}
                          />
                          <span className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                            📤 アップロード
                          </span>
                        </label>
                      ) : (
                        <div className="text-green-400">
                          ✅ 完了
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* File Format Notice */}
            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-300">
                📌 対応ファイル形式：PDF, JPG, PNG, DOC, DOCX（各ファイル最大10MB）
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex space-x-4">
              <Link
                href="/business/register"
                className="flex-1 py-3 px-6 border border-gray-600 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                戻る
              </Link>
              <button
                type="submit"
                disabled={isLoading || documents.filter(d => d.required && !d.uploaded).length > 0}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading || documents.filter(d => d.required && !d.uploaded).length > 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    送信中...
                  </div>
                ) : (
                  '審査を申請する'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-gray-300">
              利用規約
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300">
              プライバシーポリシー
            </Link>
            <Link href="/commercial-law" className="text-gray-500 hover:text-gray-300">
              特定商取引法に基づく表記
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}