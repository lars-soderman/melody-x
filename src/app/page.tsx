export const dynamic = 'force-dynamic';

import { DemoEditor } from '@/components/grid/DemoEditor';
import { ProjectListWrapper } from '@/components/projects/ProjectListWrapper';
import { getUser } from '@/lib/auth';

export default async function Home() {
  const user = await getUser(false);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">melody-x</h1>
        <a
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          href="/login"
        >
          Sign in to get started
        </a>
        <DemoEditor />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProjectListWrapper userId={user.id} />
    </div>
  );
}
