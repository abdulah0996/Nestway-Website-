import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAdminProfile, loginAdmin } from '../services/adminApi.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem('nestway_token')));

  useEffect(() => {
    const token = localStorage.getItem('nestway_token');
    if (!token) return;
    getAdminProfile()
      .then((profile) => {
        if (profile.accountType !== 'admin') throw new Error('Administrator access required');
        setUser(profile);
      })
      .catch(() => localStorage.removeItem('nestway_token'))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(credentials) {
    const data = await loginAdmin(credentials);
    if (data.user?.accountType !== 'admin') throw new Error('This account does not have administrator access');
    localStorage.setItem('nestway_token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('nestway_token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, isLoading, login, logout, isAuthenticated: Boolean(user) }), [user, isLoading]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}
