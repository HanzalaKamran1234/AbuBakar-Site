"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  CheckCircle,
  FileEdit,
  FolderTree,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  Settings,
  TrendingUp,
  ArrowRight,
  Database,
  Loader2,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { Product, Category, Inquiry } from "@/lib/types";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [prodRes, catRes, inqRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/inquiries"),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const inqData = await inqRes.json();

        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
        setInquiries(inqData.inquiries || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === "published").length;
  const draftProducts = products.filter((p) => p.status === "draft").length;
  const totalCategories = categories.length;
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter((i) => i.status === "pending").length;

  const recentProducts = products.slice(0, 4);
  const recentInquiries = inquiries.slice(0, 4);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="animate-spin text-gold mb-4" size={36} />
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading Atelier Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
            Executive Summary
          </span>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            Atelier <span className="gold-gradient italic">Dashboard</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Welcome back, AbuBakar Mehdi. Manage your luxury footwear catalog and orders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="gold-button px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            <PlusCircle size={16} />
            Add New Shoe
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border border-white/10 hover:border-gold/50 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ExternalLink size={15} />
            View Live Site
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Catalog</span>
            <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package size={20} />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black text-white">{totalProducts}</div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-2">
            Masterpieces in system
          </p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">Published Active</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black text-emerald-400">{publishedProducts}</div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-2">
            Visible on live boutique
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">Drafts Pending</span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileEdit size={20} />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black text-amber-400">{draftProducts}</div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-2">
            Unpublished private work
          </p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">Client Inquiries</span>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-black text-white">{totalInquiries}</div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-wider mt-2">
            {pendingInquiries} awaiting response
          </p>
        </div>
      </div>

      {/* Prominent Quick Actions Bar */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
          Quick Navigation Shortcuts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all group text-left"
          >
            <PlusCircle size={22} className="text-gold mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Add Product</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Upload images & prices</p>
          </Link>

          <Link
            href="/admin/products"
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all group text-left"
          >
            <Package size={22} className="text-zinc-400 group-hover:text-gold mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Manage Catalog</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Edit, duplicate, or delete</p>
          </Link>

          <Link
            href="/admin/categories"
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all group text-left"
          >
            <FolderTree size={22} className="text-zinc-400 group-hover:text-gold mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h3>
            <p className="text-[10px] text-zinc-500 mt-1">{totalCategories} collections active</p>
          </Link>

          <Link
            href="/admin/settings"
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all group text-left"
          >
            <Settings size={22} className="text-zinc-400 group-hover:text-gold mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Store Settings</h3>
            <p className="text-[10px] text-zinc-500 mt-1">WhatsApp & concierge</p>
          </Link>
        </div>
      </div>

      {/* Two-Column Section: Recent Orders & Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Client Inquiries / Orders */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Recent Inquiries & Orders
                </h3>
                <p className="text-[11px] text-zinc-500">From the website checkout & inquiry form</p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-[11px] font-bold text-gold hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {recentInquiries.length > 0 ? (
              <div className="space-y-4">
                {recentInquiries.map((inq) => {
                  const whatsappUrl = `https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(inq.customerName)},%20this%20is%20AB%20SHOES%20regarding%20your%20order%20(${inq.id}).`;

                  return (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{inq.customerName}</span>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              inq.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : inq.status === "contacted"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          {inq.items.map((i) => `${i.name} (Size ${i.selectedSize})`).join(", ")}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          Total: <strong className="text-gold">Rs. {inq.totalAmount.toLocaleString()}</strong> • {inq.customerPhone}
                        </p>
                      </div>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                      >
                        <MessageCircle size={14} />
                        WhatsApp Reply
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-xs uppercase tracking-wider">
                No customer inquiries yet.
              </div>
            )}
          </div>
        </div>

        {/* Recently Updated Products */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Active Shoe Catalog
                </h3>
                <p className="text-[11px] text-zinc-500">Latest shoes added to your atelier</p>
              </div>
              <Link
                href="/admin/products"
                className="text-[11px] font-bold text-gold hover:underline uppercase tracking-wider flex items-center gap-1"
              >
                Full Catalog <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            product.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-zinc-800 text-zinc-400 border border-white/10"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {product.category} • <strong className="text-gold">Rs. {product.price.toLocaleString()}</strong>
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="bg-white/5 hover:bg-gold hover:text-black border border-white/10 px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-300 transition-colors shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
