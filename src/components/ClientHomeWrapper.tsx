'use client';

import { User } from '@supabase/supabase-js';
import { ProjectListWrapper } from './projects/ProjectListWrapper';

interface ClientHomeWrapperProps {
  user: User | null;
}

export function ClientHomeWrapper({ user }: ClientHomeWrapperProps) {
  return (
    <div className="p-6">
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
