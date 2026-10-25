import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getInquiries } from '@/lib/data-repository';

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ inquiries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
