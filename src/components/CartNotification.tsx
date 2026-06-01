"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { Product } from "../lib/types";

interface CartNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const CartNotification = ({ isOpen, onClose, product }: CartNotificationProps) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[2rem] p-8 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-8 relative">
                <Check size={40} strokeWidth={3} />
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-gold"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Item Added!</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed italic">
                "{product.name}" is now in your collection. <br />
                Would you like to step up further?
              </p>

              <div className="w-full space-y-4">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-3 w-full bg-gold text-black py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors duration-300"
                >
                  <ShoppingBag size={16} />
                  Proceed to Checkout
                </Link>
                
                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400 hover:text-white transition-colors"
                >
                  Continue Exploring
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
