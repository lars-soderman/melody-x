import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      await supabase.auth.exchangeCodeForSession(code);

      // Get the session to verify it worked
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Auth callback error:', error);
    }
  }

  // If anything fails, redirect to home
  return NextResponse.redirect(new URL('/', request.url));
}
