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
  redirectUrl?: string;
  devMode?: boolean;
  children: React.ReactNode;
}

// NOTE: export it as a named export
export const AuthProvider: React.FC<AuthProviderProps> = ({ authUrl, redirectUrl, devMode, children }) => {
  const loginUrl = `${authUrl}/login-v2`;
  const whoamiUrl = `${authUrl}/whoami`;
  const logoutUrl = `${authUrl}/logout-v2`;
  const refreshUrl = `${authUrl}/refresh-token`;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const fetchOptions = devMode 
				? {headers: {'x-api-key': process.env.API_KEY || '12345'}}
				: { credentials: 'include' as RequestCredentials };
      const response = await fetch(whoamiUrl, fetchOptions);
      if (!response.ok) return null;
      const data: User = await response.json();
			return data ?? null;
    } catch {
      return null;
    }
	}, [whoamiUrl, devMode]);

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
    let isActive = true;
  
    (async () => {
      let data = await fetchCurrentUser();
      if (!isActive) return;
  
      // if not authenticated, try a silent refresh before redirecting
      if (!data && !devMode) {
        const resp = await fetch(refreshUrl, {  credentials: 'include' });
        if (resp.ok) {
          data = await fetchCurrentUser();
        }
      }
  
      if (!data) {
        window.location.href = `${loginUrl}?` + new URLSearchParams({ customRedirectUrl: redirectUrl ?? ''});
        return;
      }
  
      setUser(data);
      setLoading(false);
      
    })(); 
    return () => { isActive = false; };
  }, [fetchCurrentUser, loginUrl, devMode, refreshUrl]);

  const isUserAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, fetchCurrentUser, logout, isUserAuthenticated }}>
      {loading ? <AuthCheckingScreen /> : children}
    </AuthContext.Provider>
  );
};

export { AuthCheckingScreen };