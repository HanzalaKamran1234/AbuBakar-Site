"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Shield,
  Loader2,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Inquiries & Orders", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Store Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        router.replace("/admin/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (err) {
      router.replace("/admin/login");
    }
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-gold mb-4" size={36} />
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Verifying Security Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-black/90 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-widest gold-gradient">AB SHOES</span>
            <span className="text-[9px] bg-gold/10 text-gold font-bold px-2 py-0.5 rounded-full border border-gold/30 uppercase tracking-widest">
              Admin
            </span>
          </Link>
        </div>
        <Link
          href="/admin/products/new"
          className="gold-button px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <PlusCircle size={14} />
          Add Shoe
        </Link>
      </header>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <div>
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-widest gold-gradient">AB SHOES</span>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <Shield size={12} className="text-gold" />
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                  Management Atelier
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Add CTA in Desktop Sidebar */}
          <div className="p-6 pb-2">
            <Link
              href="/admin/products/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="gold-button w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <PlusCircle size={16} />
              Add New Product
            </Link>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/30 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-gold" : "text-zinc-500"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-white/10 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider group"
            >
              <span className="flex items-center gap-3">
                <ExternalLink size={16} className="text-zinc-500 group-hover:text-gold" />
                Live Storefront
              </span>
              <span className="text-[10px] text-gold font-bold">Visit ↗</span>
            </a>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors uppercase tracking-wider"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
