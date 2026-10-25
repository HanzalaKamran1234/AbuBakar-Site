"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UploadCloud,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Trash2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Product, Category } from "@/lib/types";

interface ProductFormProps {
  initialProduct?: Product;
  isEdit?: boolean;
}

const COMMON_SHOE_SIZES = ["6", "7", "8", "9", "10", "11", "12", "13"];

export default function ProductForm({ initialProduct, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialProduct?.slug));
  const [category, setCategory] = useState(initialProduct?.category || "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [salePrice, setSalePrice] = useState(initialProduct?.salePrice?.toString() || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [stock, setStock] = useState(initialProduct?.stock?.toString() || "10");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [images, setImages] = useState<string[]>(initialProduct?.images || []);
  const [sizes, setSizes] = useState<string[]>(
    initialProduct?.sizes && initialProduct.sizes.length > 0
      ? initialProduct.sizes
      : ["8", "9", "10", "11"]
  );
  const [customSizeInput, setCustomSizeInput] = useState("");
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features || ["Artisanal Italian leather", "Hand-stitched construction"]
  );
  const [customFeatureInput, setCustomFeatureInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [status, setStatus] = useState<"published" | "draft">(
    initialProduct?.status || "published"
  );
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialProduct?.seoDescription || "");

  // Categories list
  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug when name changes (unless manually edited)
  useEffect(() => {
    if (!isSlugManual && name.trim()) {
      const generated = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  }, [name, isSlugManual]);

  // Load available categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          if (!category) {
            setCategory(data.categories[0].name);
          }
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Size toggling
  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)));
    }
  };

  const addCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSizeInput.trim() && !sizes.includes(customSizeInput.trim())) {
      setSizes([...sizes, customSizeInput.trim()]);
      setCustomSizeInput("");
    }
  };

  // Feature tag toggling
  const addFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFeatureInput.trim() && !features.includes(customFeatureInput.trim())) {
      setFeatures([...features, customFeatureInput.trim()]);
      setCustomFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Image Upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "Failed to upload image(s).");
        setIsUploading(false);
        return;
      }

      if (data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls]);
      } else if (data.url) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err: any) {
      setUploadError("Image upload error: " + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Make Primary Image
  const makePrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([item, ...rest]);
  };

  // Move image position
  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (overrideStatus?: "published" | "draft") => {
    setFormError("");

    if (!name.trim()) {
      setFormError("Product title is required.");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setFormError("Please enter a valid price in PKR.");
      return;
    }
    if (!category) {
      setFormError("Please select a category.");
      return;
    }
    if (images.length === 0) {
      setFormError("Please upload at least one photograph of the shoe.");
      return;
    }

    setIsSaving(true);
    const finalStatus = overrideStatus || status;

    const payload = {
      ...(initialProduct?.id ? { id: initialProduct.id } : {}),
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      category: category.trim(),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      sku: sku.trim() || undefined,
      stock: stock ? Number(stock) : 10,
      shortDescription: shortDescription.trim() || undefined,
      description: description.trim() || shortDescription.trim() || name.trim(),
      images,
      sizes,
      features,
      isFeatured,
      status: finalStatus,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    };

    try {
      const endpoint = isEdit
        ? `/api/admin/products/${initialProduct?.id}`
        : "/api/admin/products";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to save product. Please verify fields.");
        setIsSaving(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setFormError("Error saving product: " + err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Products Catalog
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            {isEdit ? "Edit Footwear Listing" : "Add New Footwear Piece"}
          </h1>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={isSaving}
            className="bg-white/5 border border-white/15 hover:border-white/30 text-zinc-300 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            disabled={isSaving}
            className="gold-button px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
            {isEdit ? "Update & Publish" : "Publish to Boutique"}
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Form Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <Sparkles size={16} />
              1. Basic Footwear Information
            </h2>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Shoe Name / Model Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Obsidian Stealth-X"
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-5 py-3.5 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3.5 rounded-xl text-xs text-white focus:outline-none transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} className="bg-zinc-900 text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSlugManual(!isSlugManual)}
                    className="text-[10px] text-gold hover:underline font-bold uppercase"
                  >
                    {isSlugManual ? "Auto-Generate" : "Custom Edit"}
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="obsidian-stealth-x"
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-5 py-3.5 rounded-xl text-xs text-zinc-300 font-mono placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Photography & Imagery Upload */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                  <UploadCloud size={16} />
                  2. Product Photography <span className="text-red-400">*</span>
                </h2>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Upload high-resolution photographs from your phone or computer. The first image is the primary store cover.
                </p>
              </div>
              <span className="text-xs text-zinc-400 font-bold">
                {images.length} {images.length === 1 ? "Photo" : "Photos"}
              </span>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-gold/50 bg-white/5 hover:bg-gold/5 p-8 rounded-2xl text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <div className="h-14 w-14 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                {isUploading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                {isUploading ? "Uploading photographs..." : "Click or Drag & Drop Photos Here"}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                Supports JPEG, PNG, and WebP (up to 10MB per file)
              </p>
            </div>

            {/* Gallery Thumbnails List */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group shadow-md"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Shoe Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="180px"
                    />

                    {/* Primary Badge */}
                    {idx === 0 ? (
                      <div className="absolute top-2 left-2 bg-gold text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Primary
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makePrimary(idx)}
                        className="absolute top-2 left-2 bg-black/80 hover:bg-gold hover:text-black text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set Primary
                      </button>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImage(idx, "left")}
                            className="p-1 rounded bg-white/20 text-white hover:bg-gold hover:text-black transition-colors"
                            title="Move left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImage(idx, "right")}
                            className="p-1 rounded bg-white/20 text-white hover:bg-gold hover:text-black transition-colors"
                            title="Move right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1 rounded bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Pricing & Inventory */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
              3. Pricing & Inventory Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Regular Price (PKR) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="126000"
                    className="w-full bg-white/5 border border-white/15 focus:border-gold pl-12 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Sale Price (PKR - Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Leave empty if regular"
                    className="w-full bg-white/5 border border-white/15 focus:border-gold pl-12 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  SKU / Inventory Code
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="AB-STX-001"
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Available Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Available Shoe Sizes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Available Footwear Sizes (EU / US)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_SHOE_SIZES.map((sz) => {
                  const isSelected = sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`h-11 w-11 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-gold text-black shadow-md scale-105"
                          : "bg-white/5 text-zinc-400 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Add custom size */}
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="text"
                  placeholder="Custom size..."
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  className="bg-white/5 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-xl text-xs font-bold"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Descriptions & Artisanal Highlights */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
              4. Product Description & Craftsmanship Details
            </h2>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Short Teaser Description (for collection cards)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief 1-2 sentence luxury overview..."
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-5 py-3 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Full Product Story & Specifications
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the materials, leather origin, hand-stitching, comfort, and heritage of this piece..."
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-5 py-3.5 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Feature Highlights */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Artisanal Feature Badges
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {features.map((feat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {feat}
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. Blake-stitched sole, Full-grain calfskin..."
                  value={customFeatureInput}
                  onChange={(e) => setCustomFeatureInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/15 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-zinc-800 hover:bg-gold hover:text-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visibility & Actions (1 Col) */}
        <div className="space-y-6">
          {/* Publishing Box */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6 sticky top-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Publication Settings
            </h3>

            {/* Status Radio */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Storefront Visibility
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("published")}
                  className={`py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    status === "published"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Published
                </button>

                <button
                  type="button"
                  onClick={() => setStatus("draft")}
                  className={`py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    status === "draft"
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-md"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Draft Only
                </button>
              </div>
            </div>

            {/* Featured Switch */}
            <div className="pt-4 border-t border-white/10">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Homepage Featured</span>
                  <span className="text-[10px] text-zinc-500">Showcase in hero & collections</span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-5 w-5 accent-gold cursor-pointer rounded"
                />
              </label>
            </div>

            {/* SEO Metadata Accordion */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                SEO & Google Search (Optional)
              </span>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">Page Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={`${name || "Shoe Name"} | AB SHOES`}
                  className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Short description for Google search results..."
                  className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={isSaving}
                className="gold-button w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                {isEdit ? "Update Product" : "Publish Product"}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isSaving}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>

              {isEdit && initialProduct && (
                <a
                  href={`/product/${initialProduct.slug || initialProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 text-center text-gold hover:underline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Preview Live Page
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
