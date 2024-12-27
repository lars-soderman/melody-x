'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { User } from '@supabase/supabase-js';
import { ProjectListWrapper } from './projects/ProjectListWrapper';

interface ClientHomeWrapperProps {
  user: User | null;
}

export function ClientHomeWrapper({ user }: ClientHomeWrapperProps) {
  const t = useTranslations();

  return (
    <div>
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
