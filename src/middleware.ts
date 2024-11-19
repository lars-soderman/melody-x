import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createRouteHandlerClient({
    cookies: () => cookies(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Log session state for debugging
  console.log('Middleware session state:', !!session);

  // Don't redirect for public routes
  const isPublicRoute =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/auth');

  if (!session && !isPublicRoute) {
    console.log('No session, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
