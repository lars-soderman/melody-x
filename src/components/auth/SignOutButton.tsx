'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const supabase = createClientComponentClient();

      // Clear client-side session
      await supabase.auth.signOut();

      // Manually clear cookies from the browser
      document.cookie = 'sb-access-token=; Max-Age=0; path=/;';
      document.cookie = 'sb-refresh-token=; Max-Age=0; path=/;';
      document.cookie = 'sb-auth-token=; Max-Age=0; path=/;';

      // Force a full page reload to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="my-4 rounded bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
      disabled={isLoading}
      onClick={handleSignOut}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
