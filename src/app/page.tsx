export const dynamic = 'force-dynamic';

import { LoginForm } from '@/components/auth/LoginForm';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { DemoEditorWrapper } from '@/components/grid/DemoEditorWrapper';
import { ProjectListWrapper } from '@/components/projects/ProjectListWrapper';
import { getUser } from '@/lib/auth';

export default async function Home() {
  const user = await getUser(false);

  if (!user) {
    return (
      <>
        <div className="mb-6 flex justify-start p-6">
          <LoginForm />
        </div>
        <div className="flex min-h-screen flex-col items-center justify-center p-6">
          <h1 className="mb-6 text-4xl text-gray-800">melody-x</h1>
          <DemoEditorWrapper />
        </div>
      </>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-end">
        <SignOutButton />
      </div>
      <ProjectListWrapper userId={user.id} />
    </div>
  );
}
