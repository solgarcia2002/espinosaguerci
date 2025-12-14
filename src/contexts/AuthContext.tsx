'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const jwt_decode = require('jwt-decode') as <T>(token: string) => T;

interface DecodedUser {
  name?: string;
  email: string;
  [key: string]: any;
}

interface AuthContextProps {
  user: DecodedUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    try {
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'access_token=; path=/; max-age=0';
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('cognito_token');
        localStorage.removeItem('token');
        localStorage.clear();
      }
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error durante logout:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [router]);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      try {
        const decoded = jwt_decode<DecodedUser>(token);
        setUser(decoded);
      } catch (e) {
        console.error('Token inválido', e);
        logout();
      }
    } else {
      setUser(null);
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match?.[1] ?? null;
}

export const useAuth = () => useContext(AuthContext);
