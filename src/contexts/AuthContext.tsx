'use client';
import { handleAuthStateChange, signOut as signOutAction } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

export type AuthContextType = {
  isInitialized: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<{ provider: string; url: string } | void>;
  signOut: () => Promise<void>;
  user: Session['user'] | null;
};

export const AuthContext = createContext<AuthContextType>({
  isInitialized: false,
  isLoading: true,
  signIn: async () => {},
  signInWithGoogle: async () => ({ provider: '', url: '' }),
  signOut: async () => {},
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    console.log('🔍 Auth: Initializing...');

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('🔍 Auth: Initial session check:', !!session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        setIsInitialized(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 Auth: State change:', event, !!session);
      await handleAuthStateChange(event, session);

      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      console.log('🔍 Auth: Cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isLoading,
        signIn,
        signInWithGoogle,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
