'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

    // If not authenticated, redirect to login
    if (error.message === 'Not authenticated') {
      router.push('/login');
    }
  }, [error, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg border bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-xl">Something went wrong!</h2>
        <button
          className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={reset}
        >
          Try again
        </button>
        <button
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          onClick={() => router.push('/')}
        >
          Go home
        </button>
      </div>
    </div>
  );
}
