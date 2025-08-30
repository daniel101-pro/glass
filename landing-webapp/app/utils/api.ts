// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// For debugging - log the API URL being used
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

// Types
export interface SignupData {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    tokenType: 'Bearer';
    expiresIn: string;
  };
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: any[];
}

// API Client Class
export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('glass_access_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('glass_access_token', token);
    }
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('glass_access_token');
    }
  }

  /**
   * Make HTTP request
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('🌐 Making API request to:', url);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📡 Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Request failed: ${endpoint}`, error);
      console.error('🔗 Full URL:', url);
      console.error('📋 Request options:', { ...options, headers });
      throw error;
    }
  }

  /**
   * Sign up a new user
   */
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.setToken(response.data.tokens.accessToken);
    }

    return response.data!;
  }

  /**
   * Login user
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.setToken(response.data.tokens.accessToken);
    }

    return response.data!;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse['user']> {
    const response = await this.request<AuthResponse['user']>('/auth/me');
    return response.data!;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ tokens: AuthResponse['tokens'] }> {
    const response = await this.request<{ tokens: AuthResponse['tokens'] }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.data) {
      this.setToken(response.data.tokens.accessToken);
    }

    return response.data!;
  }

  /**
   * Logout user
   */
  logout() {
    this.clearToken();
  }

  /**
   * Verify email with code
   */
  async verifyEmail(email: string, code: string): Promise<{ verified: boolean }> {
    const response = await this.request<{ verified: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    return response.data!;
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    return response.data!;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

