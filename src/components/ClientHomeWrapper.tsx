'use client';

import { User } from '@supabase/supabase-js';
import { SignOutButton } from './auth/SignOutButton';
import { LocalProjectsList } from './LocalProjectsList';
import { ProjectListWrapper } from './projects/ProjectListWrapper';

interface ClientHomeWrapperProps {
  user: User | null;
}

export function ClientHomeWrapper({ user }: ClientHomeWrapperProps) {
  return (
    <div className="mb-6 flex flex-col justify-start space-y-8 p-6">
      {user ? (
        <>
          <div>
            <SignOutButton />
            <h2 className="mb-4 text-2xl font-bold">Projects on server</h2>
            <ProjectListWrapper userId={user.id} />
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Local projects</h2>
            <LocalProjectsList />
          </div>
        </>
      ) : (
        <LocalProjectsList />
      )}
    </div>
  );
}
