"use client";

import React, { use } from "react";
import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";

const COLLECTION_METADATA: Record<string, { title: string; subtitle: string; description: string }> = {
  "new-arrivals": {
    title: "New Arrivals",
    subtitle: "The 2026 Selection",
    description: "Discover our latest masterpieces, where futuristic design meets artisanal tradition."
  },
  "sneakers": {
    title: "Sneakers",
    subtitle: "Stealth & Performance",
    description: "From obsidian matte leather to carbon fiber soles, experience the pinnacle of luxury streetwear."
  },
  "formal": {
    title: "Formal Collection",
    subtitle: "Regal Elegance",
    description: "Handcrafted Derbys and Oxfords for those who command respect in every step."
  },
  "limited": {
    title: "Limited Edition",
    subtitle: "One of a Kind",
    description: "Rare, numbered pieces that transcend fashion. Crafted for the true connoisseur."
  }
};

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const metadata = COLLECTION_METADATA[slug];

  if (!metadata) {
    notFound();
  }

  const filteredProducts = PRODUCTS.filter((p) => {
    if (slug === "new-arrivals") return p.isFeatured;
    if (slug === "sneakers") return p.category === "Sneakers";
    if (slug === "formal") return p.category === "Formal";
    if (slug === "limited") return p.category === "Limited";
    return false;
  });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">
            {metadata.subtitle}
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
            {metadata.title.split(" ")[0]} <br />
            <span className="gold-gradient">{metadata.title.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            {metadata.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-zinc-600 uppercase tracking-widest text-xs">
            No pieces currently available in this curated collection.
          </div>
        )}
      </div>
    </div>
  );
}
