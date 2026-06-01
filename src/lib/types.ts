export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Sneakers' | 'Formal' | 'Casual' | 'Limited';
  images: string[];
  sizes: string[];
  features: string[];
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}
