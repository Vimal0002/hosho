'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('electrominds_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email, name) => {
    const userData = {
      email,
      name,
      loginTime: new Date().toISOString(),
      isLoggedIn: true
    };
    setUser(userData);
    localStorage.setItem('electrominds_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('electrominds_user');
  };

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
