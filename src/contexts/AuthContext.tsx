'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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
      logout();
    }
  }, []);

  const logout = () => {
    document.cookie = 'access_token=; path=/; max-age=0';
    localStorage.clear();
    setUser(null);
    router.push('/login');
  };

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
