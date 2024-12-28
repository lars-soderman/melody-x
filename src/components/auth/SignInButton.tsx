'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/useTranslations';
import { useState } from 'react';
import { GoogleLogo } from '../ui/icons/GoogleLogo';

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const t = useTranslations();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.url) window.location.href = result.url;
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="my-4 flex rounded bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
      disabled={isLoading}
      onClick={handleSignIn}
    >
      <GoogleLogo />
      {isLoading ? t.auth.signingIn : t.auth.signInWithGoogle}
    </button>
  );
}
