import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  ApiData,
  LoginCredentials,
  RegistrationCredentials,
  LoginResponse,
  RegistrationResponse,
  User,
  UserRole,
  RoleChangeRequest,
  ApiError
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';
const CURRENT_USER_KEY = 'current_user';

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

export const apiService = {
  // Get API info
  async getApiInfo(): Promise<ApiData> {
    const response: AxiosResponse<ApiData> = await apiClient.get('/');
    return response.data;
  },

  // Test endpoint
  async testPost(data: any): Promise<any> {
    const response = await apiClient.post('/test/', data);
    return response.data;
  },

  // Register new user
  async register(credentials: RegistrationCredentials): Promise<RegistrationResponse> {
    try {
      const response: AxiosResponse<RegistrationResponse> = await apiClient.post('/auth/register/', {
        username: credentials.username,
        email: credentials.email,
        mobile: credentials.mobile,
        password: credentials.password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Login user with role-based authentication
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/login/', {
        userid: credentials.userid,
        password: credentials.password,
      });

      const loginResponse = response.data;

      // Store token and user info in localStorage if login is successful
      if (loginResponse.success && loginResponse.token && loginResponse.user) {
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loginResponse.user));
      }

      return loginResponse;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<{ users: User[] }> = await apiClient.get('/auth/users/');
      return response.data.users;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Change user role (admin only)
  async changeUserRole(request: RoleChangeRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/change-role/', {
        userId: request.userId,
        newRole: request.newRole,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Toggle user active status (admin only)
  async toggleUserStatus(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await apiClient.post('/auth/toggle-status/', {
        userId: userId,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user has admin role
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  },

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  },
};