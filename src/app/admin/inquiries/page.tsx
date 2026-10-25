"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  CheckCheck,
  Loader2,
  Package,
} from "lucide-react";
import { Inquiry } from "@/lib/types";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: Inquiry["status"]) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-1">
            Customer Relations
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Client Inquiries & <span className="gold-gradient italic">Acquisitions</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Orders and inquiries placed by customers via your online boutique and concierge.
          </p>
        </div>

        <span className="bg-white/5 border border-white/10 text-gold text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider self-start sm:self-auto">
          {inquiries.length} Total Registered
        </span>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-gold mb-3" size={32} />
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading client orders...</p>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="space-y-6">
          {inquiries.map((inq) => {
            const cleanPhone = inq.customerPhone.replace(/[^0-9]/g, "");
            const whatsappText = encodeURIComponent(
              `Assalam-o-Alaikum ${inq.customerName}, this is AbuBakar from AB SHOES regarding your inquiry/order (${inq.id}). We are preparing your artisanal footwear request. Please let us know if you have any bespoke sizing requirements!`
            );
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

            return (
              <div
                key={inq.id}
                className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition-all space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-xs">
                      #{inq.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{inq.customerName}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                        <Calendar size={12} />
                        {new Date(inq.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown & WhatsApp Action */}
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border focus:outline-none transition-colors ${
                        inq.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : inq.status === "contacted"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <option value="pending" className="bg-zinc-900 text-amber-400">
                        ● Pending
                      </option>
                      <option value="contacted" className="bg-zinc-900 text-blue-400">
                        ● Contacted
                      </option>
                      <option value="completed" className="bg-zinc-900 text-emerald-400">
                        ● Completed / Dispatched
                      </option>
                    </select>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle size={16} />
                      WhatsApp Customer
                    </a>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      Client Contact
                    </span>
                    <p className="flex items-center gap-2 text-zinc-300">
                      <Phone size={14} className="text-gold shrink-0" />
                      <span>{inq.customerPhone}</span>
                    </p>
                    <p className="flex items-center gap-2 text-zinc-300">
                      <Mail size={14} className="text-gold shrink-0" />
                      <span>{inq.customerEmail}</span>
                    </p>
                    <p className="flex items-start gap-2 text-zinc-400">
                      <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                      <span>{inq.shippingAddress}</span>
                    </p>
                  </div>

                  {/* Items Ordered */}
                  <div className="lg:col-span-2 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                      Acquisition Selection
                    </span>
                    <div className="space-y-2">
                      {inq.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-zinc-400">
                                Size: <strong className="text-gold">{item.selectedSize}</strong> • Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-gold">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs border-t border-white/5">
                      <span className="text-zinc-500 uppercase tracking-wider font-bold">
                        Total Order Value:
                      </span>
                      <span className="text-lg font-black text-gold">
                        Rs. {inq.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    {inq.message && (
                      <p className="text-[11px] text-zinc-400 bg-white/5 p-3 rounded-xl italic border-l-2 border-gold">
                        "{inq.message}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <MessageSquare size={36} className="text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase">No Client Inquiries Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            When visitors check out on your boutique or submit an inquiry, they will appear here with one-click WhatsApp response.
          </p>
        </div>
      )}
    </div>
  );
}
