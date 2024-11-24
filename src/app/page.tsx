import { ClientHomeWrapper } from '@/components/ClientHomeWrapper';
import { getUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const user = await getUser(false);
  const supabase = createServerClient();

  return (
    <div className="flex flex-col space-y-8 p-4">
      <ClientHomeWrapper user={user} />
    </div>
  );
}
