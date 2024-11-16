import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef } from 'react';

export function useAuth() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes

  const resetSessionTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (auth.user) {
      timeoutRef.current = setTimeout(() => {
        auth.signOut();
        router.push('/login');
      }, TIMEOUT_DURATION);
    }
  }, [TIMEOUT_DURATION, auth, router]);

  useEffect(() => {
    if (!auth.user) return;

    // Reset timeout on any user activity
    const handleActivity = () => resetSessionTimeout();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    // Initial timeout set
    resetSessionTimeout();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [auth.user, resetSessionTimeout]);

  return {
    isLoading: auth.isLoading,
    user: auth.user,
    signIn: auth.signIn,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
  };
}
