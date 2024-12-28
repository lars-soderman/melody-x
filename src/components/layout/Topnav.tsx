'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/useTranslations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton } from '../auth/SignInButton';
import { SignOutButton } from '../auth/SignOutButton';

export function Topnav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const t = useTranslations();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/editor');
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="flex h-24 w-screen items-center justify-between border-b bg-white p-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1 className="text-xl">Melodikrysstvå</h1>
        </Link>

        <nav className="flex gap-2">
          {user && (
            <Link
              href="/"
              className={`rounded-lg p-2 transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              {t.project.myProjects}
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">{user.email}</p>
            <SignOutButton />
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    </header>
  );
}
