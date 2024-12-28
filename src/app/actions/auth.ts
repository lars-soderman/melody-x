'use server';

import { createServerClient } from '@/lib/supabase-server';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createServerClient();

  await supabase.auth.signOut();

  // Clear all auth-related cookies
  const cookiesToClear = [
    'sb-access-token',
    'sb-refresh-token',
    'sb-auth-token',
  ];

  cookiesToClear.forEach((name) => {
    cookieStore.set(name, '', {
      expires: new Date(0),
      maxAge: 0,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function handleAuthStateChange(
  event: AuthChangeEvent,
  session: Session | null
) {
  const cookieStore = cookies();

  if (event === 'SIGNED_OUT') {
    // Clear auth cookies
    cookieStore.set('sb-auth-token', '', { maxAge: 0 });
    cookieStore.set('sb-refresh-token', '', { maxAge: 0 });
  } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
    if (session) {
      // Set auth cookies
      cookieStore.set('sb-auth-token', session.access_token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      if (session.refresh_token) {
        cookieStore.set('sb-refresh-token', session.refresh_token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }
  }
}
