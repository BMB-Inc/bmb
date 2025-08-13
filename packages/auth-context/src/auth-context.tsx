// AuthContext.tsx
import { User } from '@bmb-inc/types';
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { AuthCheckingScreen } from './components/auth-checking-screen';

export interface UserContextType {
  user: User | null;
  fetchCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  isUserAuthenticated: boolean;
}

export const AuthContext = createContext<UserContextType>({
  user: null,
  fetchCurrentUser: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
  isUserAuthenticated: false,
});

interface AuthProviderProps {
  authUrl: string;
  children: React.ReactNode;
}

// NOTE: export it as a named export
export const AuthProvider: React.FC<AuthProviderProps> = ({ authUrl, children }) => {
  const loginUrl = `${authUrl}/login-v2`;
  const whoamiUrl = `${authUrl}/whoami`;
  const logoutUrl = `${authUrl}/logout-v2`;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch(whoamiUrl, { credentials: 'include' });
      if (!response.ok) return null;
      const data: User = await response.json();
      setUser(data ?? null);
      return data ?? null;
    } catch {
      return null;
    }
  }, [whoamiUrl]);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(logoutUrl, { credentials: 'include' });
      if (!response.ok) return;
      await response.json();
    } finally {
      setUser(null);
    }
  }, [logoutUrl]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await fetchCurrentUser();
      if (!isMounted) return;
      if (!data) {
        window.location.href = loginUrl;
        return;
      }
      setLoading(false);
    })();
    return () => { isMounted = false; };
  }, [fetchCurrentUser, loginUrl]);

  const isUserAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, fetchCurrentUser, logout, isUserAuthenticated }}>
      {loading ? <AuthCheckingScreen /> : children}
    </AuthContext.Provider>
  );
};

export { AuthCheckingScreen };