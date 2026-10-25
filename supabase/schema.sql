-- ==============================================================================
-- ABU BAKAR / AB SHOES - SUPABASE DATABASE SCHEMA & CONFIGURATION
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    sale_price NUMERIC CHECK (sale_price IS NULL OR sale_price >= 0),
    category TEXT NOT NULL REFERENCES public.categories(name) ON UPDATE CASCADE,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    sku TEXT,
    stock INTEGER DEFAULT 10,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    on_sale BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Inquiries / Orders Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT ('inq-' || substr(md5(random()::text), 1, 8)),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    brand_name TEXT DEFAULT 'AB SHOES',
    tagline TEXT DEFAULT 'Redefining Luxury Footwear',
    whatsapp_number TEXT DEFAULT '923332498678',
    phone TEXT DEFAULT '+92 333 2498678',
    email TEXT DEFAULT 'concierge@ab-shoes.com',
    address TEXT DEFAULT 'Luxury Heights, Gulberg, Lahore, Pakistan',
    announcement_bar TEXT DEFAULT 'Nationwide Express Delivery Across Pakistan • Complimentary Shipping on All Orders',
    hero_subtitle TEXT DEFAULT 'Discover the intersection of artisanal craftsmanship and futuristic design.',
    currency TEXT DEFAULT 'Rs.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 7. Public Read Policies
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products" ON public.products
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can create inquiries" ON public.inquiries;
CREATE POLICY "Public can create inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- 8. Admin Policies (Service Role / Authenticated)
DROP POLICY IF EXISTS "Admin has full access to categories" ON public.categories;
CREATE POLICY "Admin has full access to categories" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin has full access to products" ON public.products;
CREATE POLICY "Admin has full access to products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin has full access to inquiries" ON public.inquiries;
CREATE POLICY "Admin has full access to inquiries" ON public.inquiries
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin has full access to store settings" ON public.store_settings;
CREATE POLICY "Admin has full access to store settings" ON public.store_settings
    FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 9. Storage Bucket Configuration for 'product-images'
-- Note: In Supabase dashboard, create a public bucket named 'product-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'product-images'
CREATE POLICY "Public Access to product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated or service role can upload product-images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' 
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

CREATE POLICY "Authenticated or service role can delete product-images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' 
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

-- 10. Seed Data
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES 
    ('cat-sneakers', 'Sneakers', 'sneakers', 'From obsidian matte leather to carbon fiber soles, experience the pinnacle of luxury streetwear.', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', 1),
    ('cat-formal', 'Formal', 'formal', 'Handcrafted Derbys and Oxfords for those who command respect in every step.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', 2),
    ('cat-casual', 'Casual', 'casual', 'Suede loafers and effortless artisan silhouettes for refined leisure.', 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop', 3),
    ('cat-limited', 'Limited', 'limited', 'Rare, numbered pieces that transcend fashion. Crafted for the true connoisseur.', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.store_settings (id, brand_name, tagline, whatsapp_number, phone, email, address, announcement_bar, hero_subtitle, currency)
VALUES ('default', 'AB SHOES', 'Redefining Luxury Footwear', '923332498678', '+92 333 2498678', 'concierge@ab-shoes.com', 'Luxury Heights, Gulberg, Lahore, Pakistan', 'Nationwide Express Delivery Across Pakistan • Complimentary Shipping on All Orders', 'Discover the intersection of artisanal craftsmanship and futuristic design.', 'Rs.')
ON CONFLICT (id) DO UPDATE SET updated_at = now();

INSERT INTO public.products (id, name, slug, description, short_description, price, category, images, sizes, features, sku, stock, is_featured, is_new, on_sale, status, seo_title, seo_description)
VALUES
    ('premium-obsidian-sneaker', 'Obsidian Stealth-X', 'obsidian-stealth-x', 'Crafted for those who move in silence. The Obsidian Stealth-X combines premium matte leather with a pressurized carbon fiber sole for unmatched durability and a sleek, minimal silhouette.', 'Crafted for those who move in silence with pressurized carbon fiber sole.', 126000, 'Sneakers', '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"]'::jsonb, '["7", "8", "9", "10", "11", "12"]'::jsonb, '["Hand-stitched leather", "Carbon fiber plate", "Breathable mesh interior"]'::jsonb, 'AB-STX-001', 15, true, true, false, 'published', 'Obsidian Stealth-X Luxury Sneakers | AB SHOES', 'Experience the pinnacle of luxury streetwear with Obsidian Stealth-X by AB SHOES Pakistan.'),
    ('gilded-monarch-derby', 'Gilded Monarch', 'gilded-monarch', 'A statement of pure elegance. These Derby shoes feature full-grain Italian leather with subtle gold-thread detailing and a hand-polished finish that glows under soft light.', 'Pure elegance Derby shoes in full-grain Italian leather with subtle gold-thread detailing.', 249200, 'Formal', '["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop"]'::jsonb, '["8", "9", "10", "11"]'::jsonb, '["Italian Calfskin", "Blake stitch construction", "Gold-foiled insole"]'::jsonb, 'AB-MON-002', 8, true, false, false, 'published', 'Gilded Monarch Handcrafted Formal Shoes | AB SHOES', 'Full-grain Italian leather formal Derby shoes handcrafted with gold-thread detailing by AB SHOES.'),
    ('velvet-cloud-loafer', 'Velvet Cloud Loafer', 'velvet-cloud-loafer', 'Experience the sensation of walking on clouds. Our signature loafers are lined with ultra-soft shearling and wrapped in premium suede for the ultimate luxury lounging experience.', 'Signature loafers lined with ultra-soft shearling and wrapped in premium suede.', 89600, 'Casual', '["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop"]'::jsonb, '["7", "8", "9", "10", "11", "12"]'::jsonb, '["Shearling lining", "Memory foam core", "Anti-slip rubber sole"]'::jsonb, 'AB-VCL-003', 20, false, false, false, 'published', 'Velvet Cloud Loafer Casual Luxury | AB SHOES', 'Ultra-soft shearling lined loafers in premium suede for luxury lounging by AB SHOES.'),
    ('aurora-runner-limited', 'Aurora V2 Limited', 'aurora-runner-limited', 'Inspired by the Northern Lights. The Aurora V2 features a light-reactive upper that shifts colors as you move, paired with an ergonomic reactive cushioning system.', 'Light-reactive prismatic upper with reactive cushioning. Limited numbered edition.', 336000, 'Limited', '["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop"]'::jsonb, '["9", "10", "11"]'::jsonb, '["Prismatic fabric", "Responsive tech", "Numbered edition (1/100)"]'::jsonb, 'AB-AUR-004', 4, true, true, false, 'published', 'Aurora V2 Limited Edition Footwear | AB SHOES', 'Exclusive numbered edition luxury sneakers with prismatic color-shifting technology.')
ON CONFLICT (id) DO NOTHING;
