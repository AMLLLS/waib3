"use client";

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('adminToken'));
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la connexion');
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error('Token manquant dans la réponse');
      }

      Cookies.set('adminToken', data.token, { 
        expires: 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });

      await new Promise<void>((resolve) => {
        setIsAuthenticated(true);
        setTimeout(resolve, 100);
      });

      window.location.href = '/admin';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('adminToken');
    router.replace('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 