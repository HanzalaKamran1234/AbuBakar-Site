"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { formatPrice } from "../lib/constants";
import { useCart } from "../context/CartContext";
import { Product } from "../lib/types";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, setNotificationProduct } = useCart();

  const handleQuickAdd = () => {
    addToCart(product, product.sizes[0]);
    setNotificationProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* Image Container */}
      <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradients Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badge */}
          {product.category === "Limited" && (
            <div className="absolute top-4 left-4 bg-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Limited Edition
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium leading-none mb-2">
              {product.category}
            </p>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-lg font-bold group-hover:text-gold transition-colors tracking-tight">
                {product.name}
              </h3>
            </Link>
          </div>
          <p className="text-xl font-bold gold-gradient tracking-tighter">{formatPrice(product.price)}</p>
        </div>

        <div className="flex items-center space-x-1 text-gold/40">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} />
          ))}
          <span className="text-[10px] text-zinc-600 ml-2 uppercase tracking-widest">Premium quality</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-all duration-300"
        >
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </div>
    </motion.div>
  );
};
