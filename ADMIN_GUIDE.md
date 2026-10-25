# 👞 AB SHOES — Atelier Administrator & Store Management Guide

Welcome to your official store management guide for **AB SHOES**! This guide was written specifically for non-technical store management. You can perform all day-to-day operations directly from your web browser on your phone, tablet, laptop, or desktop without touching code or GitHub.

---

## 1. Accessing Your Admin Portal

1. Navigate to:
   - **Production URL**: `https://abu-bakar-site.vercel.app/admin`
   - **Local URL**: `http://localhost:3000/admin`
   - *(You can also scroll to the footer on the main boutique website and click **"Atelier Portal"**).*
2. Enter your administrator password:
   - **Default Password**: `Abubakar@2026!`
   - *(You can change this password anytime in your Vercel Environment Variables under `ADMIN_PASSWORD`).*
3. Click **"Access Atelier Dashboard"**.

---

## 2. Atelier Dashboard Overview

When you log in, your executive overview displays:
- **Total Catalog**: Total number of shoe models registered in your system.
- **Published Active**: Shoes currently live and purchasable by customers.
- **Drafts Pending**: Work-in-progress shoes hidden from the public.
- **Client Inquiries & Orders**: Orders received from the online checkout.
- **Quick Shortcuts**: One-click buttons to add new products, manage collections, visit the live store, or adjust settings.

---

## 3. How to Add a New Shoe (Step-by-Step)

1. Click **"+ Add New Product"** from the sidebar or dashboard.
2. **Basic Information**:
   - **Shoe Name**: Type the model name (e.g. *Royal Suede Chelsea Boot*).
   - **Category**: Select the collection (*Sneakers*, *Formal*, *Casual*, *Limited*, or any custom category you created).
   - **Slug**: Automatically generated for clean web links.
3. **Product Photography**:
   - Click the upload box or drag-and-drop photos from your computer or mobile camera roll.
   - You can upload multiple photographs at once (JPEG, PNG, WebP).
   - The first photo has a **"Primary"** gold badge and serves as the main catalog cover.
   - Use the **arrow buttons** under thumbnails to reorder pictures, or click **"Set Primary"** to choose your cover photo.
4. **Pricing & Inventory**:
   - **Regular Price**: Enter the price in Pakistani Rupees (e.g. `145000` for Rs. 145,000).
   - **Sale Price**: Optional discount price.
   - **Available Sizes**: Tap size numbers (*6, 7, 8, 9, 10, 11, 12, 13*) to toggle them on or off.
5. **Description & Artisanal Highlights**:
   - **Short Description**: Brief 1-line summary shown on collection cards.
   - **Full Description**: The rich story of the leather, craftsmanship, comfort, and origin.
   - **Feature Badges**: Add tags like *Full-grain calfskin*, *Blake stitch construction*, etc.
6. **Publication**:
   - Select **"Published"** to make it instantly visible on the website, or **"Draft Only"** to review it privately first.
   - Toggle **"Homepage Featured"** if you want it spotlighted on the home screen.
7. Click **"Publish Product"**!

---

## 4. Editing, Duplicating & Deleting Products

Go to **"Products"** in the sidebar:
- **Search & Filters**: Type any model name or SKU, or filter by category or status.
- **Quick Status Toggle**: Tap the green **"Published"** or gray **"Draft"** badge in any row to instantly publish or unpublish with a single click.
- **Edit**: Tap the pencil icon to modify prices, add photos, or update descriptions.
- **Duplicate**: Tap the copy icon to duplicate a product into a draft, saving you time when adding similar shoes in different leathers or colors.
- **Delete**: Tap the trash icon. A confirmation window will ask you to confirm to prevent accidental deletion.

---

## 5. Managing Categories & Collections

Go to **"Categories"** in the sidebar:
- View all current collections (*Sneakers*, *Formal*, *Casual*, *Limited*).
- Click **"Create New Category"** to introduce new categories (e.g., *Loafers*, *Boots*, *Bespoke*).
- Categories created here **automatically appear** in product forms and on the public shop navigation.
- **Safe Deletion**: The system protects your data and will not allow you to delete a category that still contains products until you reassign them.

---

## 6. Client Orders & WhatsApp Concierge

Go to **"Inquiries & Orders"** in the sidebar:
- Whenever a customer places an order on `/checkout`, their information is recorded here:
  - Customer name, phone, email, and full shipping address.
  - Selected shoe models, sizes, and quantities.
  - Total order value in PKR.
- **One-Click WhatsApp Reply**:
  - Click the green **"WhatsApp Customer"** button to immediately open a pre-filled WhatsApp message addressed to the customer confirming their order and bespoke sizing!
- **Status Tracking**:
  - Change status between `Pending`, `Contacted`, and `Completed / Dispatched` to stay organized.

---

## 7. Boutique Settings

Go to **"Store Settings"** in the sidebar:
- Update your **WhatsApp concierge number**, telephone, customer service email, and atelier physical address.
- Edit your **Announcement Bar** banner (e.g., promotional announcements or holiday shipping notices).
- Changes take effect across the website immediately.

---

## 8. Supabase Cloud Database & Storage Setup (Optional)

Your website comes equipped with an intelligent dual-mode repository:
1. **Out-of-the-Box Mode**: Works immediately on Vercel with zero external dependencies and persistent memory and fallback storage.
2. **Supabase Cloud Mode**: Whenever you wish to link a dedicated Supabase PostgreSQL cloud database and image bucket:
   - Create a free project at [supabase.com](https://supabase.com).
   - In Supabase SQL Editor, paste the contents of `supabase/schema.sql` and click **Run**.
   - Copy your **Project URL**, **Anon Key**, and **Service Role Key**.
   - In your **Vercel Dashboard** → Project → **Settings** → **Environment Variables**, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Trigger a redeployment. The system will automatically switch to your live Supabase cloud database!
