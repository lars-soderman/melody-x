export const dynamic = 'force-dynamic';

import { ProjectListWrapper } from '@/components/projects/ProjectListWrapper';
import { getUser } from '@/lib/auth';

export default async function Home() {
  const user = await getUser();

  return (
    <div className="p-6">
      <ProjectListWrapper userId={user?.id ?? ''} />
    </div>
  );
}
