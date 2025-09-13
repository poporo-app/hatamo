export interface BusinessRegistrationData {
  representativeName: string;
  location: string;
  phone: string;
  categories: string[];
  capital?: number;
}

export interface BusinessRegistrationErrors {
  representativeName?: string;
  location?: string;
  phone?: string;
  categories?: string;
  capital?: string;
}

export const BUSINESS_CATEGORIES = [
  { id: 'it', label: 'IT・テクノロジー', value: 'it' },
  { id: 'consulting', label: 'コンサルティング', value: 'consulting' },
  { id: 'marketing', label: 'マーケティング・広告', value: 'marketing' },
  { id: 'design', label: 'デザイン・クリエイティブ', value: 'design' },
  { id: 'education', label: '教育・研修', value: 'education' },
  { id: 'healthcare', label: '医療・ヘルスケア', value: 'healthcare' },
  { id: 'finance', label: '金融・保険', value: 'finance' },
  { id: 'realestate', label: '不動産', value: 'realestate' },
  { id: 'manufacturing', label: '製造業', value: 'manufacturing' },
  { id: 'retail', label: '小売・流通', value: 'retail' },
  { id: 'food', label: '飲食・フード', value: 'food' },
  { id: 'entertainment', label: 'エンターテインメント', value: 'entertainment' },
  { id: 'travel', label: '旅行・観光', value: 'travel' },
  { id: 'logistics', label: '物流・運輸', value: 'logistics' },
  { id: 'other', label: 'その他', value: 'other' }
] as const;

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number]['value'];

export interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadedAt: Date;
}

export interface BusinessRegistrationResponse {
  success: boolean;
  message: string;
  businessId?: string;
  nextStep?: 'document_upload' | 'review' | 'completed';
}