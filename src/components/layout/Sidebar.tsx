'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton } from '../auth/SignOutButton';

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/editor');
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white p-4">
      <h1 className="mb-8 text-xl">melody-x</h1>

      <nav className="flex-1 space-y-2">
        {user && (
          <Link
            href="/"
            className={`block rounded-lg p-2 transition-colors ${
              isActive('/') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            Server Projects
          </Link>
        )}
        <Link
          href="/local"
          className={`block rounded-lg p-2 transition-colors ${
            isActive('/local')
              ? 'bg-blue-50 text-blue-600'
              : 'hover:bg-gray-100'
          }`}
        >
          Local Projects
        </Link>
      </nav>

      <div className="border-t pt-4">
        {user ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{user.email}</p>
            <SignOutButton />
          </div>
        ) : (
          <Link
            className="block rounded bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600"
            href="/login"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
