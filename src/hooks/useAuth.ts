import { useState, useCallback } from 'react';
import { User } from '../types';
import { storage } from '../utils/helpers';

const AUTH_STORAGE_KEY = 'adnlrms_auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => 
    storage.get<User | null>(AUTH_STORAGE_KEY, null)
  );

  const login = useCallback((name: string, role: 'admin' | 'viewer'): boolean => {
    const newUser: User = { name, role };
    setUser(newUser);
    storage.set(AUTH_STORAGE_KEY, newUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.remove(AUTH_STORAGE_KEY);
  }, []);

  const isAdmin = user?.role === 'admin';

  return { user, login, logout, isAdmin };
};