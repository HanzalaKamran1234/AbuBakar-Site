"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../../lib/constants";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gold/10 text-gold mb-4">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Order <span className="gold-gradient">Confirmed.</span></h1>
          <p className="text-zinc-500 max-w-sm mx-auto uppercase tracking-widest text-[10px] leading-loose">
            Your selection has been registered. Our master artisans are preparing your order. A confirmation has been sent to your secure terminal.
          </p>
          <Link href="/shop" className="gold-button inline-block px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
            Return to Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-8">
        <p className="text-zinc-500 uppercase tracking-[0.2em]">Your bag is empty</p>
        <Link href="/shop" className="gold-gradient text-xs font-black uppercase tracking-widest border-b border-gold pb-1">
          Explore Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Form Side */}
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Finalize <span className="gold-gradient">Acquisition.</span></h1>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Secure encrypted checkout session</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Shipping Essence</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="FIRST NAME" className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
                  <input type="text" required placeholder="LAST NAME" className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
                </div>
                <input type="email" required placeholder="EMAIL@DOMAIN.COM" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
                <input type="text" required placeholder="STREET ADDRESS" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
              </div>

              <div className="space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment Protocol</h2>
                <div className="relative">
                  <input type="text" required placeholder="CARD NUMBER" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                    <div className="h-4 w-6 bg-zinc-800 rounded" />
                    <div className="h-4 w-6 bg-zinc-800 rounded" />
                  </div>
                </div>
              </div>

              <button
                disabled={isProcessing}
                type="submit"
                className="gold-button w-full py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    AUTHORIZING...
                  </>
                ) : (
                  <>
                    COMPLETE ACQUISITION ({formatPrice(totalPrice)})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Side */}
          <div className="lg:sticky lg:top-40 h-fit glass-panel p-10 rounded-3xl border border-white/10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-10 text-zinc-400">Inventory Summary</h3>
            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-zinc-900 rounded-lg overflow-hidden border border-white/5 relative">
                      <Image 
                        src={item.images[0]} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Size: {item.selectedSize} × {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-10 border-t border-white/5">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                <span>Logistic Fees</span>
                <span>Complementary</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Total Value</span>
                <span className="text-3xl font-black text-gold">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
