'use client';

import { useAuth } from '@/contexts/AuthContext';

export function AuthDebug() {
  const { user, isInitialized, isLoading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 rounded-lg border bg-white p-4 text-xs">
      <pre>
        {JSON.stringify(
          {
            isInitialized,
            isLoading,
            user: user ? { email: user.email } : null,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
