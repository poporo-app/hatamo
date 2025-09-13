import { apiClient } from './client';

export interface BusinessRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  firstNameKana?: string;
  lastNameKana?: string;
  phone?: string;
  businessName: string;
  businessNameKana?: string;
  businessType: 'corporation' | 'limited' | 'partnership' | 'individual' | 'npo' | 'other';
  description?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  acceptTerms: boolean;
}

export interface BusinessLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface BusinessUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  first_name_kana?: string;
  last_name_kana?: string;
  phone?: string;
  role: string;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: number;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  first_name_kana?: string;
  last_name_kana?: string;
  phone?: string;
  business_name: string;
  business_name_kana?: string;
  business_type: string;
  description?: string;
  website?: string;
  address?: string;
  postal_code?: string;
  is_verified: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessRegisterResponse {
  message: string;
  user: BusinessUser;
  business: Business;
}

export interface BusinessLoginResponse {
  message: string;
  token: string;
  refresh_token: string;
  user: BusinessUser;
  business: Business;
}

export const businessApi = {
  register: async (data: BusinessRegisterRequest): Promise<BusinessRegisterResponse> => {
    const response = await apiClient.post<BusinessRegisterResponse>('/business/register', data);
    return response.data;
  },

  login: async (data: BusinessLoginRequest): Promise<BusinessLoginResponse> => {
    const response = await apiClient.post<BusinessLoginResponse>('/business/login', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string; user: BusinessUser; business: Business }> => {
    return await apiClient.get<{ message: string; user: BusinessUser; business: Business }>(`/business/verify-email?token=${token}`);
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/business/resend-verification', { email });
    return response.data;
  },
};