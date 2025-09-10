import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('API Request:', {
    url,
    method: options.method || 'GET',
    body: options.body
  });
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log('API Response:', {
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error || data.message || 'An error occurred',
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(0, 'Network error occurred');
  }
}

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    // Convert camelCase to snake_case for backend API
    const requestData = {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      first_name_kana: data.firstNameKana || '',
      last_name_kana: data.lastNameKana || '',
      phone: '' // Phone field is optional in backend
    };
    
    return apiRequest<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    return apiRequest<VerifyEmailResponse>(`/api/v1/auth/verify-email?token=${data.token}`, {
      method: 'GET',
    });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (
    data: ResendVerificationRequest
  ): Promise<ResendVerificationResponse> => {
    return apiRequest<ResendVerificationResponse>('/api/v1/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    // Clear local storage / cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },
};

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isValid: boolean;
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('パスワードは8文字以上で入力してください');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('小文字を含めてください');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('大文字を含めてください');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('数字を含めてください');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('記号を含めてください');
  }

  return {
    score,
    feedback,
    isValid: score >= 4,
  };
}

/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Name validation (Japanese and English)
 */
export function validateName(name: string): boolean {
  // Allow Japanese characters, English letters, and some common symbols
  const nameRegex = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBFA-Za-z\s\-']+$/;
  return nameRegex.test(name) && name.trim().length >= 1;
}