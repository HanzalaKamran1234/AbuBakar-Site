import { NextResponse } from 'next/server';
import { createInquiry } from '@/lib/data-repository';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.shippingAddress) {
      return NextResponse.json(
        { error: 'Please provide customer name, phone number, and delivery address.' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Order bag cannot be empty.' }, { status: 400 });
    }

    const inquiry = await createInquiry({
      customerName: body.customerName,
      customerEmail: body.customerEmail || 'not-provided@ab-shoes.com',
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      items: body.items,
      totalAmount: Number(body.totalAmount) || 0,
      message: body.message || '',
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
