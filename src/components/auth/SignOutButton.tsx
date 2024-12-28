'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();

      // Clear all cookies
      const cookiesToClear = [
        'sb-access-token',
        'sb-refresh-token',
        'sb-auth-token',
        'supabase-auth-token',
      ];

      cookiesToClear.forEach((name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });

      // Force a full page reload to clear all state
      window.location.href = '/';
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
      {isLoading ? t.auth.signingOut : t.auth.signOut}
    </button>
  );
}
