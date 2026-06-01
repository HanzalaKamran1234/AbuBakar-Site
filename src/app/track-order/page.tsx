"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, MapPin, CheckCircle2, Loader2, Compass } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-24">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Order Expedition</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
            TRACK <br /> <span className="gold-gradient">ORDER.</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-loose">
            Monitor the journey of your artisanal acquisition.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden mb-12"
        >
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <form onSubmit={handleTrack} className="relative z-10 space-y-8">
            <div className="text-center space-y-4 mb-12">
              <Compass size={48} className="text-gold/20 mx-auto mb-4" />
              <h2 className="text-xl font-bold uppercase tracking-tight">Identity Your Parcel</h2>
              <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Enter your unique Order Reference or Tracking ID</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                required 
                placeholder="ORDER ID (e.g. AB-2026-XXXX)" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 px-8 py-5 rounded-full text-xs focus:outline-none focus:border-gold transition-all uppercase tracking-[0.2em]" 
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="gold-button px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                Locate Parcel
              </button>
            </div>
          </form>
        </motion.div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/5 pb-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Current Status</p>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-gold rounded-full animate-pulse" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">In Transit - Gulberg Hub</h3>
                  </div>
                </div>
                <div className="md:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Estimated Arrival</p>
                  <p className="text-2xl font-black uppercase underline decoration-gold">Tomorrow, 14:00</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-12">
                <div className="flex gap-8 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black z-10 relative">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="absolute top-10 bottom-[-48px] left-1/2 -translate-x-1/2 w-px bg-gold/30" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-1 underline">Phase 03</p>
                    <h4 className="text-lg font-bold uppercase tracking-tight mb-2">Dispatched for Delivery</h4>
                    <p className="text-zinc-500 text-xs">Parcel has left the Lahore Logistics Center and is en-route to Gulberg.</p>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-black z-10 relative">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="absolute top-10 bottom-[-48px] left-1/2 -translate-x-1/2 w-px bg-gold/30" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Phase 02</p>
                    <h4 className="text-lg font-bold uppercase tracking-tight mb-2 font-medium opacity-50">Quality Verification</h4>
                    <p className="text-zinc-600 text-xs">Final artisanal inspection completed. Authentication certificates issued.</p>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 z-10 relative border border-white/10">
                      <Package size={20} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Phase 01</p>
                    <h4 className="text-lg font-bold uppercase tracking-tight mb-2 font-medium opacity-30">Order Registered</h4>
                    <p className="text-zinc-700 text-xs">Acquisition finalized at AB SHOES Atelier.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
