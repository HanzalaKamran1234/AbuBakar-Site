"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify password.");
        setIsLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err: any) {
      setError("Network or server connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Decorative Gold Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group mb-3">
            <span className="text-3xl font-black tracking-widest gold-gradient transition-transform duration-300 group-hover:scale-105 inline-block">
              AB SHOES
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs uppercase tracking-[0.3em] font-semibold">
            <ShieldCheck size={14} className="text-gold" />
            Executive Management Portal
          </div>
        </div>

        {/* Login Form Box */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
          <h1 className="text-xl font-bold uppercase tracking-wider text-white mb-2">
            Administrator Sign In
          </h1>
          <p className="text-zinc-400 text-xs leading-relaxed mb-8">
            Access your product catalog, image manager, and customer orders.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs leading-relaxed">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password..."
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-5 py-4 pr-12 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="gold-button w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Verifying Session...
                </>
              ) : (
                <>
                  Access Atelier Dashboard
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Help Box for First-time setup */}

        </div>

        {/* Back to store link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            ← Return to Public Boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
