'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const { user, signOut, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleAuth = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (user) {
      try {
        await signOut();
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }
  };

  return (
    <button
      className="rounded bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-200"
      onClick={handleAuth}
    >
      {user ? 'Sign Out' : 'Sign in with Google'}
    </button>
  );
}
