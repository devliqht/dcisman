import React, { useState, useEffect } from 'react';
import authService from '@/services/authService';
import { AuthContext } from './createAuthContext';
import type {
  AuthContextType,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  const register = async (
    userData: RegisterRequest
  ): Promise<AuthResponse> => {
    const newUser = await authService.register(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
