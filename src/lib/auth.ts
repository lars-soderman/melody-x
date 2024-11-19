import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getUser(redirectToLogin = true) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
        return redirect('/login');
      }
      return null;
    }

    return session.user;
  } catch (error) {
    if (!(error instanceof Error && error.message === 'NEXT_REDIRECT')) {
      console.error('Unexpected error in getUser:', error);
    }

    if (redirectToLogin) {
      return redirect('/login');
    }
    return null;
  }
}
