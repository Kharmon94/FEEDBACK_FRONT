import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../../services/api';
import type { User } from '../../types';

interface AuthContextType {
  user: User | null;
  session: { access_token?: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, businessName?: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) {
      console.warn('VITE_API_URL is not set; auth will fail.');
    }
    api.getCurrentUser().then((u) => {
      setUser(u);
      setSession(api.getToken() ? { access_token: api.getToken() ?? undefined } : null);
      setLoading(false);
    });
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    businessName?: string
  ): Promise<{ error: unknown }> => {
    try {
      await api.signUp({ email, password, name, business_name: businessName });
      const u = await api.getCurrentUser();
      setUser(u);
      setSession({ access_token: api.getToken() ?? undefined });
      return { error: null };
    } catch (e) {
      return { error: e };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: unknown }> => {
    try {
      await api.signIn(email, password);
      const u = await api.getCurrentUser();
      setUser(u);
      setSession({ access_token: api.getToken() ?? undefined });
      return { error: null };
    } catch (e) {
      return { error: e };
    }
  };

  const signOut = async () => {
    api.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
