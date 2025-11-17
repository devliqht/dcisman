import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

const authService = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  updateProfile: async (data: { name?: string; idNumber?: string }): Promise<{
    id: number;
    username: string;
    email: string;
    role: string;
    name: string | null;
    idNumber: string | null;
    isActive: boolean;
    createdAt: string;
  }> => {
    const response = await api.put('/auth/profile', data);
    const currentUser = authService.getCurrentUser();
    if (currentUser && response.data) {
      const updatedUser = {
        ...currentUser,
        name: response.data.name,
        idNumber: response.data.idNumber,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  },
};

export default authService;
