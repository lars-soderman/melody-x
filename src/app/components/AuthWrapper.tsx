'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isInitialized, isLoading } = useAuth();

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
