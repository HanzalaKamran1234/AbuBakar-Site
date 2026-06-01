"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";
import { PRODUCTS, formatPrice } from "../../../lib/constants";
import { useCart } from "../../../context/CartContext";
import { notFound } from "next/navigation";
import { ProductCard } from "../../../components/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart, setNotificationProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, selectedSize);
    setNotificationProduct(product);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        {/* Back Link */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-[0.2em] mb-12 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery Side */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5"
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
                />
              </AnimatePresence>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-24 w-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-gold shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Side */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                {product.category} Series
              </span>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6 mb-8">
                <p className="text-4xl font-black text-gold">{formatPrice(product.price)}</p>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">(48 Reviews)</span>
                </div>
              </div>

              <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-light">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-end">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">Select Your Size</h3>
                  <button className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800 hover:text-gold hover:border-gold transition-all">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 w-14 rounded-xl border flex items-center justify-center text-sm font-bold transition-all ${
                        selectedSize === size
                          ? "bg-gold border-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                          : "border-white/10 text-zinc-400 hover:border-white hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 gold-button py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag size={20} />
                  Acquire This Piece
                </button>
              </div>

              {/* Features Lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12 border-t border-white/5">
                <div className="flex items-center gap-3 text-zinc-500 group">
                  <ShieldCheck size={18} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Lifetime Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 group">
                  <Truck size={18} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Express Global Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 group">
                  <RefreshCw size={18} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Bespoke Fitting Service</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <section className="mt-32 pt-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">You may also like</span>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Recommended <br /> <span className="gold-gradient italic">Masterpieces.</span></h2>
          </div>
          <Link href="/shop" className="text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800 pb-1">
            View All Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
