import { NextResponse } from 'next/server';
import { getProducts, getCategories } from '@/lib/data-repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const featured = searchParams.get('featured') === 'true';
  const search = searchParams.get('search') || undefined;
  const sortBy = (searchParams.get('sortBy') as any) || 'newest';

  try {
    const products = await getProducts({
      category,
      status: 'published',
      featured: featured ? true : undefined,
      search,
      sortBy,
    });
    const categories = await getCategories();
    return NextResponse.json({ products, categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
