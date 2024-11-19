'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function ProtectedRoute({ children, redirectTo = '/login' }: Props) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
      router.push(redirectTo);
    }
  }, [isInitialized, isLoading, user, router, redirectTo]);

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : null;
}
