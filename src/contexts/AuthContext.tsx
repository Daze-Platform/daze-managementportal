import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  avatar?: string;
  role?: string;
  tenantId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userProfile: UserProfile | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const getDefaultProfile = (email: string): UserProfile => ({
  firstName: email.split('@')[0].split('.')[0] || 'User',
  lastName: email.split('@')[0].split('.')[1] || '',
  email,
  phone: '',
  timezone: 'America/Chicago',
  language: 'English',
  avatar: ''
});

const fetchProfile = async (userId: string, email: string): Promise<UserProfile> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      const names = (profile.full_name || '').split(' ');
      return {
        firstName: names[0] || email.split('@')[0],
        lastName: names.slice(1).join(' ') || '',
        email: profile.email || email,
        phone: '',
        timezone: 'America/Chicago',
        language: 'English',
        avatar: '',
      };
    }
  } catch (err) {
    console.warn('Could not fetch profile, using defaults:', err);
  }

  return getDefaultProfile(email);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = async (session: Session | null) => {
    if (session?.user?.email) {
      const email = session.user.email;
      const uid = session.user.id;
      setIsAuthenticated(true);
      setUserEmail(email);
      setUserId(uid);
      const profile = await fetchProfile(uid, email);
      setUserProfile(profile);
    } else {
      setIsAuthenticated(false);
      setUserEmail(null);
      setUserId(null);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (mounted) await applySession(data.session ?? null);
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        if (mounted) await applySession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await applySession(session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await applySession(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    userEmail,
    userId,
    userProfile,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
