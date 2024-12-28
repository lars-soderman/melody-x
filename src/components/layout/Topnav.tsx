'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { SignInButton } from '../auth/SignInButton';
import { SignOutButton } from '../auth/SignOutButton';

export function Topnav() {
  const { user } = useAuth();

  return (
    <header className="flex h-24 w-screen items-center justify-between border-b bg-white p-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1 className="text-xl">Melodikrysstvå</h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              {user.user_metadata.full_name.split(' ')[0] || user?.email}
            </p>
            <SignOutButton />
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}
