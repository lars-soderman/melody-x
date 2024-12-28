import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Define routes that require auth
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/editor');

  // If on protected route and no session, redirect to home with error
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('error', 'not_authenticated');
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/editor/:path*'],
};
