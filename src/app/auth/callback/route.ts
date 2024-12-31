import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log('🔍 Auth callback started');

  try {
    const code = requestUrl.searchParams.get('code');
    const cookieStore = cookies();

    if (!code) {
      console.error('❌ No code in callback');
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
      console.error('❌ Session error:', error || 'No session created');
      return NextResponse.redirect(
        new URL('/?error=auth_failed', requestUrl.origin)
      );
    }

    console.log('✅ Session created:', {
      id: session.user.id,
      email: session.user.email,
      metadata: session.user.user_metadata,
    });

    console.log('🕒 Auth timing:', {
      start: new Date().toISOString(),
      userId: session.user.id,
    });

    try {
      // Create response with redirect first
      const response = NextResponse.redirect(new URL('/', requestUrl.origin));

      // Let Supabase handle the cookie setting
      await supabase.auth.setSession(session);

      // Then try to create/update the user
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
      console.log('✅ User creation completed:', {
        end: new Date().toISOString(),
        userId: session.user.id,
      });
      return response;
    } catch (error) {
      console.error('❌ Database error:', {
        name: (error as Error).name,
        message: (error as Error).message,
        code: (error as unknown as { code: string }).code,
      });
      return NextResponse.redirect(
        new URL('/?error=user_creation_failed', requestUrl.origin)
      );
    }
  } catch (error) {
    console.error('❌ Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/?error=auth_failed', requestUrl.origin)
    );
  }
}
