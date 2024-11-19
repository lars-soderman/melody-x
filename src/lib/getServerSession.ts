import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getServerSession() {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Server - Session error:', error);
      return null;
    }

    console.log('✅ Server - Session check:', !!session);
    return session;
  } catch (error) {
    console.error('❌ Server - Unexpected error:', error);
    return null;
  }
}
