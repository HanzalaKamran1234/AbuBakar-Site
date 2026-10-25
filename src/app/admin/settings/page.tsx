"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Megaphone,
  Sparkles,
  KeyRound,
  Shield,
  HelpCircle,
} from "lucide-react";
import { StoreSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    brandName: "AB SHOES",
    tagline: "Redefining Luxury Footwear",
    whatsappNumber: "923332498678",
    phone: "+92 333 2498678",
    email: "concierge@ab-shoes.com",
    address: "Luxury Heights, Gulberg, Lahore, Pakistan",
    announcementBar: "Nationwide Express Delivery Across Pakistan • Complimentary Shipping on All Orders",
    heroSubtitle: "Discover the intersection of artisanal craftsmanship and futuristic design.",
    currency: "Rs.",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Failed to load settings:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification("Store settings updated successfully!");
      } else {
        showNotification(data.error || "Failed to save settings.", "error");
      }
    } catch (err: any) {
      showNotification("Error: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="animate-spin text-gold mb-3" size={32} />
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading atelier settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border text-xs font-bold uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            notification.type === "success"
              ? "bg-black/95 text-emerald-400 border-emerald-500/30"
              : "bg-black/95 text-red-400 border-red-500/30"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-1">
            Store Configuration
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Boutique <span className="gold-gradient italic">Settings</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Manage contact channels, announcement bar banner, and concierge information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="gold-button px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand Identity */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <Sparkles size={16} />
            Brand Identity & Taglines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Homepage Hero Subtitle
            </label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <Megaphone size={16} />
            Promotional Announcement Banner
          </h2>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Top Announcement Text
            </label>
            <input
              type="text"
              value={settings.announcementBar}
              onChange={(e) => setSettings({ ...settings, announcementBar: e.target.value })}
              placeholder="e.g. Nationwide Express Delivery Across Pakistan • Complimentary Shipping on All Orders"
              className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
            />
            <p className="text-[10px] text-zinc-500 mt-1.5">
              Leave blank if you do not wish to display the top announcement banner.
            </p>
          </div>
        </div>

        {/* Contact & Concierge */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <Phone size={16} />
            Concierge & Contact Channels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <MessageCircle size={14} className="text-emerald-400" />
                WhatsApp Number (Digits only, no +)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="923332498678"
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Phone size={14} className="text-gold" />
                Display Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+92 333 2498678"
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Mail size={14} className="text-gold" />
                Concierge Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="concierge@ab-shoes.com"
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-gold" />
                Main Atelier Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Luxury Heights, Gulberg, Lahore, Pakistan"
                className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & Password Guide */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold flex items-center gap-2">
            <KeyRound size={16} />
            Administrator Credentials & Environment
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            To change your administrator password securely, update the <code className="text-gold font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">ADMIN_PASSWORD</code> environment variable in your Vercel Dashboard (<strong className="text-white">Settings → Environment Variables</strong>) or in your local <code className="text-zinc-300 font-mono">.env.local</code> file.
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 space-y-1">
            <p><strong>Current Default:</strong> <span className="font-mono text-zinc-200">Abubakar@2026!</span></p>
            <p className="text-[10px] text-zinc-500">
              Changes made in Vercel environment variables take effect on the next production deployment.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="gold-button px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
}
