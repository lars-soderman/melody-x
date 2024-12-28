import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function getUser(redirectToLogin = true) {
  try {
    const supabase = createServerClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log('Session check:', {
      hasSession: !!session,
      error: error?.message,
      userId: session?.user?.id,
    });

    if (!session?.user) {
      if (redirectToLogin) {
        return redirect('/');
      }
      return null;
    }

    return session.user;
  } catch (error) {
    if (!(error instanceof Error && error.message === 'NEXT_REDIRECT')) {
      console.error('Unexpected error in getUser:', error);
    }

    if (redirectToLogin) {
      return redirect('/');
    }
    return null;
  }
}
