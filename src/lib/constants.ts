import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "premium-obsidian-sneaker",
    name: "Obsidian Stealth-X",
    slug: "obsidian-stealth-x",
    description: "Crafted for those who move in silence. The Obsidian Stealth-X combines premium matte leather with a pressurized carbon fiber sole for unmatched durability and a sleek, minimal silhouette.",
    price: 126000,
    category: "Sneakers",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    features: ["Hand-stitched leather", "Carbon fiber plate", "Breathable mesh interior"],
    isFeatured: true,
    status: "published"
  },
  {
    id: "gilded-monarch-derby",
    name: "Gilded Monarch",
    slug: "gilded-monarch",
    description: "A statement of pure elegance. These Derby shoes feature full-grain Italian leather with subtle gold-thread detailing and a hand-polished finish that glows under soft light.",
    price: 249200,
    category: "Formal",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["8", "9", "10", "11"],
    features: ["Italian Calfskin", "Blake stitch construction", "Gold-foiled insole"],
    isFeatured: true,
    status: "published"
  },
  {
    id: "velvet-cloud-loafer",
    name: "Velvet Cloud Loafer",
    slug: "velvet-cloud-loafer",
    description: "Experience the sensation of walking on clouds. Our signature loafers are lined with ultra-soft shearling and wrapped in premium suede for the ultimate luxury lounging experience.",
    price: 89600,
    category: "Casual",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    features: ["Shearling lining", "Memory foam core", "Anti-slip rubber sole"],
    isFeatured: false,
    status: "published"
  },
  {
    id: "aurora-runner-limited",
    name: "Aurora V2 Limited",
    slug: "aurora-runner-limited",
    description: "Inspired by the Northern Lights. The Aurora V2 features a light-reactive upper that shifts colors as you move, paired with an ergonomic reactive cushioning system.",
    price: 336000,
    category: "Limited",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop"
    ],
    sizes: ["9", "10", "11"],
    features: ["Prismatic fabric", "Responsive tech", "Numbered edition (1/100)"],
    isFeatured: true,
    status: "published"
  }
];

export const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/#collections" },
  { name: "About", href: "/about" }
];

export const BRAND_NAME = "AB SHOES";
export const BRA_NAME = BRAND_NAME;
export const BRAND_TAGLINE = "Redefining Luxury Footwear";

export const WHATSAPP_NUMBER = "923332498678";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CURRENCY = "Rs.";
export const formatPrice = (price: number) => {
  return `${CURRENCY} ${price.toLocaleString()}`;
};
