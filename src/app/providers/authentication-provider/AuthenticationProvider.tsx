'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/features/auth/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  checkAuthentication: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const checkAuthentication = () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  const login = (userData: User, token: string) => {
    // 1. Keep LocalStorage for your API Interceptors
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
    
    // 2. Set Cookie for Middleware
    
    document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Strict`;

    setUser(userData);
  
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // [NEW] Clear the cookie on logout
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};