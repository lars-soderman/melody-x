'use client';

import { User } from '@supabase/supabase-js';
import { SignOutButton } from './auth/SignOutButton';
import { ProjectListWrapper } from './projects/ProjectListWrapper';

interface ClientHomeWrapperProps {
  user: User | null;
}

export function ClientHomeWrapper({ user }: ClientHomeWrapperProps) {
  return (
    <div className="mb-6 flex flex-col justify-start space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-4">
          <a
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            href="/local-projects"
          >
            View Local Projects
          </a>
          {user ? (
            <SignOutButton />
          ) : (
            <a
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              href="/login"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
      {user ? (
        <ProjectListWrapper userId={user.id} />
      ) : (
        <div className="text-center">
          <p className="text-gray-500">Sign in to view your projects</p>
        </div>
      )}
    </div>
  );
}
