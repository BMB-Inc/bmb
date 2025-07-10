import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@bmb-inc/types';
import { fetchCurrentUser } from '../services/authApi';
import { AuthCheckingScreen } from '../components/AuthCheckingScreen';

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchCurrentUser().then((data) => {
      if (!isMounted) return;
      if (!data) {
        // window.location.href = 'https://apps.bmbinc.com/api/auth/login-v2';
        return;
      }
      setUser(data);
      setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <AuthCheckingScreen />;
  }

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 