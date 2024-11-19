'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function LoginForm() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}
      <button
        className="rounded bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
        onClick={handleLogin}
      >
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
}
