import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getProducts, saveProduct } from '@/lib/data-repository';

export async function GET(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const statusParam = searchParams.get('status') || 'all';
  const status = statusParam === 'published' || statusParam === 'draft' ? statusParam : 'all';
  const search = searchParams.get('search') || undefined;
  const sortBy = (searchParams.get('sortBy') as any) || 'newest';

  try {
    const products = await getProducts({ category, status, search, sortBy });
    return NextResponse.json({ products });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }
    if (body.price === undefined || isNaN(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json({ error: 'A valid product price is required.' }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ error: 'Please select a product category.' }, { status: 400 });
    }

    const saved = await saveProduct(body);
    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
