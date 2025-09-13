export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: {
    min: number;
    max?: number;
    unit: string;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  provider: {
    name: string;
    experience: string;
    certification?: string[];
  };
  location: string;
  availability: string;
  features: string[];
  portfolio?: {
    title: string;
    description: string;
    image: string;
  }[];
}

export interface BusinessApplication {
  businessId: string;
  userInfo: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  serviceDetails: {
    type: string;
    budget: number;
    timeline: string;
    requirements: string;
  };
  agreedToTerms: boolean;
  privacyConsent: boolean;
}