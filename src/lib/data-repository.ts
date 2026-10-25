import { Product, Category, Inquiry, StoreSettings } from './types';
import initialSeed from '../data/initial-data.json';
import { getSupabaseAdminClient, isSupabaseConfigured } from './supabase';
import fs from 'fs';
import path from 'path';

interface StorageState {
  products: Product[];
  categories: Category[];
  inquiries: Inquiry[];
  settings: StoreSettings;
}

// In-memory runtime cache for serverless & local development
const memoryState: StorageState = {
  products: [...(initialSeed.products as unknown as Product[])],
  categories: [...(initialSeed.categories as unknown as Category[])],
  inquiries: [...(initialSeed.inquiries as unknown as Inquiry[])],
  settings: { ...(initialSeed.settings as unknown as StoreSettings) },
};

const getLocalFilePath = (): string => {
  return path.join(process.cwd(), 'src', 'data', 'initial-data.json');
};

const persistLocalState = () => {
  try {
    const filePath = getLocalFilePath();
    if (fs.existsSync(path.dirname(filePath))) {
      fs.writeFileSync(filePath, JSON.stringify(memoryState, null, 2), 'utf-8');
    }
  } catch (err) {
    // In read-only serverless environments (e.g. Vercel without Supabase),
    // memoryState persists within the warm instance
    console.warn('Filesystem is read-only. Updates retained in active memory runtime:', err);
  }
};

// Helper to generate a URL slug
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================================================
// PRODUCTS
// ============================================================================

export async function getProducts(options?: {
  category?: string;
  status?: 'published' | 'draft' | 'all';
  featured?: boolean;
  search?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name';
}): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      let query = supabase.from('products').select('*');

      if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }
      if (options?.category && options.category !== 'All') {
        query = query.eq('category', options.category);
      }
      if (options?.featured) {
        query = query.eq('is_featured', true);
      }
      if (options?.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      if (options?.sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (options?.sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (options?.sortBy === 'name') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          shortDescription: item.short_description,
          price: Number(item.price),
          salePrice: item.sale_price ? Number(item.sale_price) : undefined,
          category: item.category,
          images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
          sizes: Array.isArray(item.sizes) ? item.sizes : JSON.parse(item.sizes || '[]'),
          features: Array.isArray(item.features) ? item.features : JSON.parse(item.features || '[]'),
          sku: item.sku,
          stock: item.stock,
          isFeatured: item.is_featured,
          isNew: item.is_new,
          onSale: item.on_sale,
          status: item.status,
          seoTitle: item.seo_title,
          seoDescription: item.seo_description,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      }
    } catch (err) {
      console.error('Supabase query failed, falling back to local store:', err);
    }
  }

  // Local fallback
  let list = [...memoryState.products];

  if (options?.status && options.status !== 'all') {
    list = list.filter((p) => p.status === options.status);
  }
  if (options?.category && options.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options?.featured) {
    list = list.filter((p) => p.isFeatured);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }

  if (options?.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (options?.sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  return list;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          shortDescription: data.short_description,
          price: Number(data.price),
          salePrice: data.sale_price ? Number(data.sale_price) : undefined,
          category: data.category,
          images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
          sizes: Array.isArray(data.sizes) ? data.sizes : JSON.parse(data.sizes || '[]'),
          features: Array.isArray(data.features) ? data.features : JSON.parse(data.features || '[]'),
          sku: data.sku,
          stock: data.stock,
          isFeatured: data.is_featured,
          isNew: data.is_new,
          onSale: data.on_sale,
          status: data.status,
          seoTitle: data.seo_title,
          seoDescription: data.seo_description,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.error('Supabase getProductById failed:', err);
    }
  }

  const found = memoryState.products.find((p) => p.id === id || p.slug === id);
  return found || null;
}

export async function saveProduct(data: Partial<Product> & { name: string; price: number; category: string }): Promise<Product> {
  const now = new Date().toISOString();
  const slug = data.slug?.trim() ? generateSlug(data.slug) : generateSlug(data.name);

  const productData: Product = {
    id: data.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    slug: slug,
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    price: Number(data.price),
    salePrice: data.salePrice ? Number(data.salePrice) : undefined,
    category: data.category || 'Sneakers',
    images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000'],
    sizes: data.sizes && data.sizes.length > 0 ? data.sizes : ['7', '8', '9', '10', '11', '12'],
    features: data.features && data.features.length > 0 ? data.features : ['Artisanal leather', 'Master handcrafted'],
    sku: data.sku || `AB-${Math.floor(1000 + Math.random() * 9000)}`,
    stock: data.stock !== undefined ? Number(data.stock) : 10,
    isFeatured: Boolean(data.isFeatured),
    isNew: Boolean(data.isNew),
    onSale: Boolean(data.onSale),
    status: data.status === 'draft' ? 'draft' : 'published',
    seoTitle: data.seoTitle || `${data.name} | AB SHOES`,
    seoDescription: data.seoDescription || data.shortDescription || data.description?.slice(0, 150) || '',
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const dbPayload = {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        short_description: productData.shortDescription,
        price: productData.price,
        sale_price: productData.salePrice,
        category: productData.category,
        images: productData.images,
        sizes: productData.sizes,
        features: productData.features,
        sku: productData.sku,
        stock: productData.stock,
        is_featured: productData.isFeatured,
        is_new: productData.isNew,
        on_sale: productData.onSale,
        status: productData.status,
        seo_title: productData.seoTitle,
        seo_description: productData.seoDescription,
        created_at: productData.createdAt,
        updated_at: productData.updatedAt,
      };

      const { error } = await supabase.from('products').upsert(dbPayload);
      if (error) {
        console.error('Supabase saveProduct error:', error);
      }
    } catch (err) {
      console.error('Supabase saveProduct exception:', err);
    }
  }

  // Update local memory & file
  const index = memoryState.products.findIndex((p) => p.id === productData.id);
  if (index >= 0) {
    memoryState.products[index] = productData;
  } else {
    memoryState.products.unshift(productData);
  }
  persistLocalState();

  return productData;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteProduct error:', err);
    }
  }

  const initialLen = memoryState.products.length;
  memoryState.products = memoryState.products.filter((p) => p.id !== id);
  persistLocalState();
  return memoryState.products.length < initialLen;
}

export async function duplicateProduct(id: string): Promise<Product | null> {
  const original = await getProductById(id);
  if (!original) return null;

  const duplicated: Product = {
    ...original,
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
    sku: `${original.sku || 'AB'}-COPY`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveProduct(duplicated);
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getCategories(): Promise<Category[]> {
  const products = await getProducts({ status: 'all' });
  const counts: Record<string, number> = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          imageUrl: item.image_url,
          displayOrder: item.display_order,
          productCount: counts[item.name] || 0,
          createdAt: item.created_at,
        }));
      }
    } catch (err) {
      console.error('Supabase getCategories error:', err);
    }
  }

  return memoryState.categories
    .map((c) => ({
      ...c,
      productCount: counts[c.name] || 0,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function saveCategory(data: Partial<Category> & { name: string }): Promise<Category> {
  const now = new Date().toISOString();
  const slug = data.slug?.trim() ? generateSlug(data.slug) : generateSlug(data.name);

  const categoryData: Category = {
    id: data.id || `cat-${Date.now()}`,
    name: data.name.trim(),
    slug: slug,
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    displayOrder: data.displayOrder ?? memoryState.categories.length + 1,
    createdAt: data.createdAt || now,
  };

  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('categories').upsert({
        id: categoryData.id,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        image_url: categoryData.imageUrl,
        display_order: categoryData.displayOrder,
      });
    } catch (err) {
      console.error('Supabase saveCategory error:', err);
    }
  }

  const index = memoryState.categories.findIndex((c) => c.id === categoryData.id);
  if (index >= 0) {
    memoryState.categories[index] = categoryData;
  } else {
    memoryState.categories.push(categoryData);
  }
  persistLocalState();

  return categoryData;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const cat = memoryState.categories.find((c) => c.id === id);
  if (!cat) return { success: false, error: 'Category not found.' };

  // Check if any products use this category
  const products = await getProducts({ status: 'all' });
  const inUse = products.some((p) => p.category.toLowerCase() === cat.name.toLowerCase());
  if (inUse) {
    return {
      success: false,
      error: `Cannot delete "${cat.name}" because products are currently assigned to it. Reassign those products first.`,
    };
  }

  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteCategory error:', err);
    }
  }

  memoryState.categories = memoryState.categories.filter((c) => c.id !== id);
  persistLocalState();
  return { success: true };
}

// ============================================================================
// INQUIRIES & ORDERS
// ============================================================================

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          customerName: item.customer_name,
          customerEmail: item.customer_email,
          customerPhone: item.customer_phone,
          shippingAddress: item.shipping_address,
          items: Array.isArray(item.items) ? item.items : JSON.parse(item.items || '[]'),
          totalAmount: Number(item.total_amount),
          status: item.status,
          message: item.message,
          createdAt: item.created_at,
        }));
      }
    } catch (err) {
      console.error('Supabase getInquiries error:', err);
    }
  }

  return [...memoryState.inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createInquiry(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Inquiry['items'];
  totalAmount: number;
  message?: string;
}): Promise<Inquiry> {
  const inquiry: Inquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    shippingAddress: data.shippingAddress,
    items: data.items,
    totalAmount: data.totalAmount,
    status: 'pending',
    message: data.message || '',
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('inquiries').insert({
        id: inquiry.id,
        customer_name: inquiry.customerName,
        customer_email: inquiry.customerEmail,
        customer_phone: inquiry.customerPhone,
        shipping_address: inquiry.shippingAddress,
        items: inquiry.items,
        total_amount: inquiry.totalAmount,
        status: inquiry.status,
        message: inquiry.message,
        created_at: inquiry.createdAt,
      });
    } catch (err) {
      console.error('Supabase createInquiry error:', err);
    }
  }

  memoryState.inquiries.unshift(inquiry);
  persistLocalState();
  return inquiry;
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.error('Supabase updateInquiryStatus error:', err);
    }
  }

  const inq = memoryState.inquiries.find((i) => i.id === id);
  if (inq) {
    inq.status = status;
    persistLocalState();
    return true;
  }
  return false;
}

// ============================================================================
// STORE SETTINGS
// ============================================================================

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 'default').single();
      if (!error && data) {
        return {
          brandName: data.brand_name || 'AB SHOES',
          tagline: data.tagline || 'Redefining Luxury Footwear',
          whatsappNumber: data.whatsapp_number || '923332498678',
          phone: data.phone || '+92 333 2498678',
          email: data.email || 'concierge@ab-shoes.com',
          address: data.address || 'Luxury Heights, Gulberg, Lahore, Pakistan',
          announcementBar: data.announcement_bar || '',
          heroSubtitle: data.hero_subtitle || '',
          currency: data.currency || 'Rs.',
        };
      }
    } catch (err) {
      console.error('Supabase getStoreSettings error:', err);
    }
  }

  return { ...memoryState.settings };
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const updated: StoreSettings = {
    ...memoryState.settings,
    ...settings,
  };

  const supabase = getSupabaseAdminClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('store_settings').upsert({
        id: 'default',
        brand_name: updated.brandName,
        tagline: updated.tagline,
        whatsapp_number: updated.whatsappNumber,
        phone: updated.phone,
        email: updated.email,
        address: updated.address,
        announcement_bar: updated.announcementBar,
        hero_subtitle: updated.heroSubtitle,
        currency: updated.currency,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Supabase updateStoreSettings error:', err);
    }
  }

  memoryState.settings = updated;
  persistLocalState();
  return updated;
}
