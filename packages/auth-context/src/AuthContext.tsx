// AuthContext.tsx
import { User } from '@bmb-inc/types';
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { AuthCheckingScreen } from './components/AuthCheckingScreen';

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
  baseUrl: string;
  redirectUrl?: string;
  children: React.ReactNode;
}

// NOTE: export it as a named export
export const AuthProvider: React.FC<AuthProviderProps> = ({ baseUrl, redirectUrl, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/whoami`, { credentials: 'include' });
      if (!response.ok) return null;
      const data: User = await response.json();
      setUser(data ?? null);
      return data ?? null;
    } catch {
      return null;
    }
  }, [baseUrl]);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/logout-v2`, { credentials: 'include' });
      if (!response.ok) return;
      await response.json();
    } finally {
      setUser(null);
    }
  }, [baseUrl]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await fetchCurrentUser();
      if (!isMounted) return;
      if (!data) {
        window.location.href = redirectUrl ?? baseUrl;
        return;
      }
      setLoading(false);
    })();
    return () => { isMounted = false; };
  }, [fetchCurrentUser, redirectUrl]);

  const isUserAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, fetchCurrentUser, logout, isUserAuthenticated }}>
      {loading ? <AuthCheckingScreen /> : children}
    </AuthContext.Provider>
  );
};

const fetchCurrentUserForTest = async (baseUrl: string, requestHeaders?: HeadersInit) => {
    try {
      const headersToUse: HeadersInit = {
        ...(requestHeaders || {}),
      };
      const response = await fetch(`${baseUrl}/api/auth/whoami`, { credentials: 'include', headers: headersToUse });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        // eslint-disable-next-line no-console
        console.error(`[auth-context] whoami failed`, { status: response.status, statusText: response.statusText, body: text });
        return null;
      }
      const data: User = await response.json();
      return data ?? null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[auth-context] whoami error', err);
      return null;
    }
};

// If you want, you can also export these:
export { AuthCheckingScreen, fetchCurrentUserForTest };