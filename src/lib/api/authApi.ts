import api from './axiosConfig';
import { ApiResponse, LoginRequest, RegisterRequest, LoginResponse } from '../../types';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  /**
   * Register new company
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/register-company', data);
    return response.data;
  },

  /**
   * Get current user
   */
  me: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
