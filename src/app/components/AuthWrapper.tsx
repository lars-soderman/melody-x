'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
