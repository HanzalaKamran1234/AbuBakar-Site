import { NextResponse } from 'next/server';
import { createSessionToken, validateAdminCredentials, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || !validateAdminCredentials(password)) {
      return NextResponse.json(
        { error: 'Invalid administrator credentials. Please check the password and try again.' },
        { status: 401 }
      );
    }

    const token = createSessionToken('admin');
    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failed: ' + err.message }, { status: 500 });
  }
}
