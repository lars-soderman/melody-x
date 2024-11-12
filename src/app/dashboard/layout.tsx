'use client';

import { AuthButton } from '@/app/components/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/');
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold">Melody X Maker</h1>
        <AuthButton />
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
