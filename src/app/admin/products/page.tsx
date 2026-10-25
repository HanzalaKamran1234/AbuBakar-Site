"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { Product, Category } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name">("newest");
  const [isLoading, setIsLoading] = useState(true);

  // Modal state for delete confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/products?category=${encodeURIComponent(selectedCategory)}&status=${selectedStatus}&sortBy=${sortBy}&search=${encodeURIComponent(searchQuery)}`),
        fetch("/api/admin/categories"),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle Publish / Draft
  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, status: nextStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
        );
        showNotification(
          `"${product.name}" is now ${nextStatus === "published" ? "published live on boutique" : "saved as draft"}.`
        );
      } else {
        showNotification("Failed to update status", "error");
      }
    } catch (err) {
      showNotification("Error communicating with server", "error");
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (product: Product) => {
    const nextFeatured = !product.isFeatured;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, isFeatured: nextFeatured }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isFeatured: nextFeatured } : p))
        );
        showNotification(
          `"${product.name}" ${nextFeatured ? "marked as homepage featured" : "removed from featured"}.`
        );
      }
    } catch (err) {
      showNotification("Failed to update featured flag", "error");
    }
  };

  // Duplicate Product
  const handleDuplicate = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        showNotification(`Duplicated "${product.name}" as draft.`);
      } else {
        showNotification(data.error || "Failed to duplicate product", "error");
      }
    } catch (err) {
      showNotification("Error duplicating product", "error");
    }
  };

  // Delete confirmed
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        showNotification(`Deleted "${productToDelete.name}".`);
        setProductToDelete(null);
      } else {
        showNotification("Failed to delete product", "error");
      }
    } catch (err) {
      showNotification("Error deleting product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border text-xs font-bold uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            notification.type === "success"
              ? "bg-black/95 text-emerald-400 border-emerald-500/30"
              : "bg-black/95 text-red-400 border-red-500/30"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-1">
            Product Catalog
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Footwear <span className="gold-gradient italic">Collection</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Manage your footwear inventory, pricing, imagery, and storefront publication.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="gold-button px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-lg hover:scale-105 transition-transform"
        >
          <PlusCircle size={16} />
          Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by shoe name, SKU, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-gold pl-11 pr-4 py-3 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none transition-colors"
            >
              <option value="All" className="bg-zinc-900 text-white">
                All Categories
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.name} className="bg-zinc-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none transition-colors"
            >
              <option value="newest" className="bg-zinc-900 text-white">
                Sort: Recently Added
              </option>
              <option value="price-asc" className="bg-zinc-900 text-white">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-zinc-900 text-white">
                Price: High to Low
              </option>
              <option value="name" className="bg-zinc-900 text-white">
                Alphabetical: A - Z
              </option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mr-2">
            Status:
          </span>
          {(["all", "published", "draft"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedStatus === st
                  ? "bg-gold text-black"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {st === "all" ? "All Products" : st === "published" ? "Published Live" : "Drafts Only"}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table / Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-gold mb-3" size={32} />
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Searching catalog...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Sizes</th>
                  <th className="py-4 px-6 text-center">Featured</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => {
                  const isPublished = p.status === "published";
                  const mainImage = p.images?.[0] || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000";

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                            <Image
                              src={mainImage}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="font-bold text-white group-hover:text-gold transition-colors text-sm tracking-tight block"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              SKU: {p.sku || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="inline-block bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-gold text-sm">
                          Rs. {p.price.toLocaleString()}
                        </div>
                        {p.salePrice && (
                          <div className="text-[10px] text-zinc-500 line-through">
                            Rs. {p.salePrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Sizes */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {p.sizes?.slice(0, 5).map((s) => (
                            <span
                              key={s}
                              className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded border border-white/5"
                            >
                              {s}
                            </span>
                          ))}
                          {(p.sizes?.length || 0) > 5 && (
                            <span className="text-[9px] text-zinc-500 font-bold self-center">
                              +{p.sizes.length - 5}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Featured Star */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          title={p.isFeatured ? "Featured on Homepage" : "Click to feature"}
                          className={`p-2 rounded-lg transition-colors ${
                            p.isFeatured
                              ? "text-gold bg-gold/10"
                              : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                          }`}
                        >
                          <Star size={16} fill={p.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </td>

                      {/* Publication Status Toggle Button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isPublished
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-zinc-800 text-zinc-400 border border-white/10 hover:bg-zinc-700"
                          }`}
                          title={isPublished ? "Click to set as Draft" : "Click to Publish Live"}
                        >
                          {isPublished ? (
                            <>
                              <Eye size={12} />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} />
                              Draft
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Menu */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Live preview */}
                          {isPublished && (
                            <a
                              href={`/product/${p.slug || p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-zinc-400 hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                              title="View on Storefront"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}

                          {/* Edit */}
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-6">
          <div className="h-16 w-16 bg-white/5 text-zinc-500 rounded-full flex items-center justify-center mx-auto">
            <Package size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">
              No Footwear Products Found
            </h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "All" || selectedStatus !== "all"
                ? "No products match the selected filters. Try resetting your search."
                : "Your atelier catalog is empty. Add your first footwear piece to begin."}
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="gold-button inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <PlusCircle size={16} />
            Add First Product
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-white/15 bg-zinc-950 shadow-2xl relative space-y-6">
            <div className="flex items-center gap-4 text-red-400">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Confirm Deletion
                </h3>
                <p className="text-[11px] text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-bold">"{productToDelete.name}"</strong>? It will be
              removed from the database and will no longer appear on your boutique.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
