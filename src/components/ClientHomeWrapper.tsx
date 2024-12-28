'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { User } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { ProjectListWrapper } from './projects/ProjectListWrapper';

interface ClientHomeWrapperProps {
  user: User | null;
}

export function ClientHomeWrapper({ user }: ClientHomeWrapperProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // TODO: Add more error messages
  // not_authenticated
  const errorMessage = error === 'not_authenticated' ? t.auth.error : null;

  return (
    <div>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}
      {user ? (
        <ProjectListWrapper userId={user.id} />
      ) : (
        <div className="text-center">
          <p className="text-gray-500">{t.common.loginToViewProjects}</p>
        </div>
      )}
    </div>
  );
}
