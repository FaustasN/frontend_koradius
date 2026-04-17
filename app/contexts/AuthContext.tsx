'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback
} from 'react';
import { authAPI } from '../services/adminApiService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.validate();
        setIsAuthenticated(response.valid === true);
      } catch {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);

      if (!response.success) {
        setIsAuthenticated(false);
        return false;
      }

      if (response.token) {
        localStorage.setItem('adminToken', response.token);
      }

      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // net jei logout request nepavyko, lokaliai sesiją laikom baigta
    } finally {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout
    }),
    [isAuthenticated, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}