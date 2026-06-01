"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Play } from "lucide-react";
import { PRODUCTS, BRAND_TAGLINE } from "../lib/constants";
import { ProductCard } from "../components/ProductCard";

export default function Home() {
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Backdrop"
            fill
            sizes="100vw"
            className="object-cover brightness-50 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-2 text-gold mb-6"
            >
              <div className="h-px w-12 bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em]">The 2026 Collection</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              BEYOND <br />
              <span className="gold-gradient italic">PRECISION.</span>
            </h1>
            
            <p className="text-xl text-zinc-300 mb-12 max-w-lg leading-relaxed font-light">
              {BRAND_TAGLINE}. Discover the intersection of artisanal craftsmanship and futuristic design.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/shop" className="gold-button w-full sm:w-auto px-10 py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-2 group">
                Expose the Collection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-4 text-white hover:text-gold transition-colors font-bold uppercase tracking-widest text-xs group">
                <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold transition-colors">
                  <Play size={16} fill="currentColor" />
                </div>
                Watch Film
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stat */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 right-12 hidden md:flex items-center gap-8 glass-panel p-8 rounded-2xl"
        >
          <div className="text-center">
            <p className="text-4xl font-black gold-gradient">12k+</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Clients Globally</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-4xl font-black gold-gradient">4.9</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">Avg. Rating</p>
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section id="collections" className="py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Selected Works</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
                Featured <br /> Craftsmanship
              </h2>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-zinc-400 hover:text-gold transition-colors uppercase text-xs font-bold tracking-widest group">
              View Catalog
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ethos Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"
              alt="Craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <div className="space-y-10">
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] uppercase tracking-tighter">
              Artistry in <br /> 
              <span className="text-gold">Every Stitch.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              We believe that footwear is more than an accessory—it's a foundation. Our master artisans spend over 48 hours on every single pair, ensuring that comfort and style coexist in perfect harmony.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-white font-bold mb-2">Italian Leather</p>
                <p className="text-zinc-500 text-sm">Sourced from the finest tanneries in Tuscany.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-2">Ergonomic Fit</p>
                <p className="text-zinc-500 text-sm">Motion-mapped insoles for all-day comfort.</p>
              </div>
            </div>
            <Link href="/#about" className="inline-block border-b border-gold pb-2 text-gold text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all">
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-white/5 bg-zinc-950">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Join the Inner Circle</h2>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px]">Be the first to know about secret drops and limited collaborations.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="YOUR EMAIL@ADDRESS.COM"
                className="flex-1 bg-white/5 border border-white/10 px-8 py-5 rounded-full text-sm focus:outline-none focus:border-gold transition-colors uppercase tracking-widest"
              />
              <button className="gold-button px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
