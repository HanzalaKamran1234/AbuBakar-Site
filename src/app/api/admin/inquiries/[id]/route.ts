import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { updateInquiryStatus } from '@/lib/data-repository';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateInquiryStatus(id, body.status);
    return NextResponse.json({ success: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
