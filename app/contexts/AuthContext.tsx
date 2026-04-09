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
  logout: () => void;
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

const isValidTokenFormat = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    return payload && typeof payload === 'object';
  } catch {
    return false;
  }
};

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    let c = cookie;
    while (c.startsWith(' ')) c = c.substring(1);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
  }

  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('adminToken');

        if (!token || !isValidTokenFormat(token)) {
          setIsAuthenticated(false);
          return;
        }

        await authAPI.validate();
        setIsAuthenticated(true);
      } catch {
        deleteCookie('adminToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await authAPI.login(username, password);
      const token = data.token;

      if (!token || !isValidTokenFormat(token)) {
        return false;
      }

      setCookie('adminToken', token, 1);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    deleteCookie('adminToken');
    setIsAuthenticated(false);
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