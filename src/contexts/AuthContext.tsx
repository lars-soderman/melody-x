'use client';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isInitialized: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
  serverSession: Session | null;
};

export function AuthProvider({ children, serverSession }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(serverSession?.user ?? null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize with server session if available
        if (serverSession?.user) {
          setUser(serverSession.user);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // Otherwise check client-side session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          console.log('Auth state changed:', session?.user?.email);
          setUser(session?.user ?? null);
        });

        setIsInitialized(true);
        setIsLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [serverSession]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isInitialized,
        user,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
