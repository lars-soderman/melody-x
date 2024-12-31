import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const cookieStore = cookies();

    if (!code) {
      console.error('No code in callback');
      return NextResponse.redirect(
        new URL('/?error=auth_failed', requestUrl.origin)
      );
    }

    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    });

    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !session) {
      console.error('Session error:', error || 'No session created');
      return NextResponse.redirect(
        new URL('/?error=auth_failed', requestUrl.origin)
      );
    }

    console.log('🔍 Auth callback - creating/updating user:', {
      id: session.user.id,
      email: session.user.email,
    });

    try {
      const user = await prisma.user.upsert({
        where: { id: session.user.id },
        update: {
          rawUserMetaData: session.user.user_metadata,
        },
        create: {
          id: session.user.id,
          email: session.user.email!,
          rawUserMetaData: session.user.user_metadata || {},
        },
      });

      if (!user) {
        console.error('❌ User creation failed - no user returned');
        return NextResponse.redirect(
          new URL('/?error=user_creation_failed', requestUrl.origin)
        );
      }

      console.log('✅ User upserted:', user);
    } catch (error) {
      console.error('❌ Error upserting user:', error);
      return NextResponse.redirect(
        new URL('/?error=user_creation_failed', requestUrl.origin)
      );
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', requestUrl.origin));

    // Let Supabase handle the cookie setting
    await supabase.auth.setSession(session);

    console.log('Callback successful - session set');
    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
