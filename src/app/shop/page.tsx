"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PRODUCTS } from "../../lib/constants";
import { ProductCard } from "../../components/ProductCard";

const CATEGORIES = ["All", "Sneakers", "Formal", "Casual", "Limited"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-8"
          >
            <div>
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Archive catalog</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                The <br /><span className="gold-gradient italic">Collection.</span>
              </h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest leading-loose">
                Showing {filteredProducts.length} of {PRODUCTS.length} <br />
                Masterpieces currently available
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between border-b border-white/5 pb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === category
                    ? "gold-button"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold transition-colors" size={16} />
            <input
              type="text"
              placeholder="SEARCH CATALOG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-14 pr-6 text-[10px] tracking-widest font-bold focus:outline-none focus:border-gold transition-all uppercase placeholder:text-zinc-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center"
            >
              <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">No masterpieces found matching your search</p>
              <button 
                onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
                className="mt-8 gold-gradient text-xs font-black uppercase tracking-widest border-b border-gold pb-1"
              >
                Reset Catalog
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
