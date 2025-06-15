
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Oracle REST Data Services configuration
const ORACLE_BASE_URL = import.meta.env.VITE_ORACLE_ORDS_URL || 'https://your-oracle-db.adb.us-ashburn-1.oraclecloudapps.com/ords/zipfast';
const ORACLE_WORKSPACE = import.meta.env.VITE_ORACLE_WORKSPACE || 'zipfast';

interface OracleResponse<T = any> {
  items?: T[];
  data?: T;
  success: boolean;
  message?: string;
  count?: number;
}

interface OracleUser {
  user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  plan: 'free' | 'pro';
  credits: number;
  max_file_size: number;
  created_at: string;
  updated_at: string;
}

interface OracleSession {
  token: string;
  user: OracleUser;
  expires_at: string;
}

class OracleClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: ORACLE_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('oracle_auth_token');
    
    // Setup request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Setup response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.dispatchEvent(new CustomEvent('oracle:unauthorized'));
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async signUp(email: string, password: string, name: string): Promise<OracleResponse<OracleSession>> {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      name
    });
    
    if (response.data.success && response.data.data?.token) {
      this.setAuth(response.data.data.token);
    }
    
    return response.data;
  }

  async signIn(email: string, password: string): Promise<OracleResponse<OracleSession>> {
    const response = await this.client.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.success && response.data.data?.token) {
      this.setAuth(response.data.data.token);
    }
    
    return response.data;
  }

  async signInWithGoogle(): Promise<OracleResponse<{ redirect_url: string }>> {
    const response = await this.client.get('/auth/google');
    return response.data;
  }

  async signOut(): Promise<void> {
    try {
      if (this.token) {
        await this.client.post('/auth/logout');
      }
    } finally {
      this.clearAuth();
    }
  }

  async getCurrentSession(): Promise<OracleResponse<OracleUser> | null> {
    if (!this.token) return null;
    
    try {
      const response = await this.client.get('/auth/me');
      return response.data;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  // Profile methods
  async getUserProfile(userId: string): Promise<OracleResponse<OracleUser>> {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  async updateUserCredits(userId: string, credits: number): Promise<OracleResponse> {
    const response = await this.client.patch(`/users/${userId}/credits`, { credits });
    return response.data;
  }

  async updateUserProfile(userId: string, updates: Partial<OracleUser>): Promise<OracleResponse<OracleUser>> {
    const response = await this.client.patch(`/users/${userId}`, updates);
    return response.data;
  }

  // Compression history methods
  async getCompressionHistory(userId: string, limit = 50): Promise<OracleResponse<any[]>> {
    const response = await this.client.get(`/users/${userId}/compression-history?limit=${limit}`);
    return response.data;
  }

  async saveCompressionRecord(userId: string, record: any): Promise<OracleResponse> {
    const response = await this.client.post(`/users/${userId}/compression-history`, record);
    return response.data;
  }

  async deleteCompressionRecord(userId: string, recordId: string): Promise<OracleResponse> {
    const response = await this.client.delete(`/users/${userId}/compression-history/${recordId}`);
    return response.data;
  }

  async clearCompressionHistory(userId: string): Promise<OracleResponse> {
    const response = await this.client.delete(`/users/${userId}/compression-history`);
    return response.data;
  }

  // Subscription methods
  async getSubscription(userId: string): Promise<OracleResponse> {
    const response = await this.client.get(`/users/${userId}/subscription`);
    return response.data;
  }

  async createCheckoutSession(userId: string): Promise<OracleResponse<{ url: string }>> {
    const response = await this.client.post(`/users/${userId}/checkout`);
    return response.data;
  }

  async createPortalSession(userId: string): Promise<OracleResponse<{ url: string }>> {
    const response = await this.client.post(`/users/${userId}/portal`);
    return response.data;
  }

  // Generic query method for custom Oracle queries
  async query(endpoint: string, params?: any): Promise<OracleResponse> {
    const response = await this.client.get(endpoint, { params });
    return response.data;
  }

  async mutate(endpoint: string, data?: any, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'): Promise<OracleResponse> {
    const response = await this.client.request({
      method,
      url: endpoint,
      data
    });
    return response.data;
  }

  // Auth state management
  private setAuth(token: string): void {
    this.token = token;
    localStorage.setItem('oracle_auth_token', token);
  }

  private clearAuth(): void {
    this.token = null;
    localStorage.removeItem('oracle_auth_token');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create singleton instance
export const oracleClient = new OracleClient();

// Export types
export type { OracleResponse, OracleUser, OracleSession };
