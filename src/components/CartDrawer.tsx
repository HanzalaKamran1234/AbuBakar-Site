"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { formatPrice } from "../lib/constants";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, addToCart, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 z-[101] shadow-2xl border-l border-white/5 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Shopping Bag</h2>
                <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">
                  {totalItems} Items Selected
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-zinc-500 mb-4">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="text-gold text-xs font-bold uppercase tracking-widest border-b border-gold pb-1"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                    <Link 
                      href={`/product/${item.id}`} 
                      onClick={onClose}
                      className="relative h-24 w-24 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 border border-white/5"
                    >
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link 
                            href={`/product/${item.id}`} 
                            onClick={onClose}
                            className="text-sm font-medium pr-4 hover:text-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm font-bold text-gold">{formatPrice(item.price)}</p>
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                          Size: {item.selectedSize}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-white/5 rounded-full px-2 py-1">
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="p-1 text-zinc-500 hover:text-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-4 text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item, item.selectedSize)}
                            className="p-1 text-zinc-500 hover:text-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-zinc-900/50 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest">Subtotal</p>
                  <p className="text-2xl font-bold text-gold">{formatPrice(totalPrice)}</p>
                </div>
                <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest">
                  Shipping and taxes calculated at checkout
                </p>
                <Link 
                  href="/checkout"
                  onClick={onClose}
                  className="gold-button w-full py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 group text-sm"
                >
                  Checkout Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
