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
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith('/editor') ||
    req.nextUrl.pathname.startsWith('/project');

  // Define routes that should redirect if authenticated
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login');

  // If on login page and has session, redirect to home
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If on protected route and no session, redirect to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
// Update matcher to only check specific routes
export const config = {
  matcher: ['/editor/:path*', '/project/:path*', '/login'],
};
