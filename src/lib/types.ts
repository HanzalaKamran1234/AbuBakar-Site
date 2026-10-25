export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  category: string;
  images: string[];
  sizes: string[];
  features: string[];
  sku?: string;
  stock?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  status?: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  productCount?: number;
  createdAt?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: string;
  image?: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: InquiryItem[];
  totalAmount: number;
  status: 'pending' | 'contacted' | 'completed';
  message?: string;
  createdAt: string;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  announcementBar: string;
  heroSubtitle: string;
  currency: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}
