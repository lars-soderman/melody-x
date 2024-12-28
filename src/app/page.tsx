import { ClientHomeWrapper } from '@/components/ClientHomeWrapper';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getUser(false);

  return (
    <div className="flex flex-col space-y-8 p-4">
      <ClientHomeWrapper user={user} />
    </div>
  );
}
