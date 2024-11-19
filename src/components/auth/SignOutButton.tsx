'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function SignOutButton() {
  const handleSignOut = async () => {
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
    }
  };

  return (
    <button
      className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
