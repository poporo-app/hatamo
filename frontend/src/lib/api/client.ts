const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('auth_token') || 
           sessionStorage.getItem('auth_token') ||
           localStorage.getItem('business_auth_token') || 
           sessionStorage.getItem('business_auth_token');
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        localStorage.removeItem('business_auth_token');
        sessionStorage.removeItem('business_auth_token');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const token = this.getAuthToken();
    const url = this.buildURL(endpoint, config?.params);
    
    const response = await fetch(url, {
      ...config,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...config?.headers,
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<{ data: T }> {
    const token = this.getAuthToken();
    const url = this.buildURL(endpoint, config?.params);
    
    const response = await fetch(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return { data: result };
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<{ data: T }> {
    const token = this.getAuthToken();
    const url = this.buildURL(endpoint, config?.params);
    
    const response = await fetch(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return { data: result };
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<{ data: T }> {
    const token = this.getAuthToken();
    const url = this.buildURL(endpoint, config?.params);
    
    const response = await fetch(url, {
      ...config,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...config?.headers,
      },
    });

    const result = await this.handleResponse<T>(response);
    return { data: result };
  }
}

export const apiClient = new ApiClient(`${API_BASE_URL}/api/v1`);