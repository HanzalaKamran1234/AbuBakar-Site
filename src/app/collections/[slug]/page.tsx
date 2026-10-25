"use client";

import React, { use, useState, useEffect } from "react";
import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Product, Category } from "@/lib/types";

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
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categoryInfo, setCategoryInfo] = useState<{ title: string; subtitle: string; description: string }>(
    COLLECTION_METADATA[slug] || {
      title: slug.replace(/-/g, " ").toUpperCase(),
      subtitle: "Curated Footwear Series",
      description: `Explore the handcrafted ${slug.replace(/-/g, " ")} collection by AB SHOES.`,
    }
  );

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
        if (data.categories) {
          const matchCat = data.categories.find(
            (c: Category) => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === slug.toLowerCase()
          );
          if (matchCat) {
            setCategoryInfo({
              title: matchCat.name,
              subtitle: "The Curated Series",
              description: matchCat.description || `Handcrafted ${matchCat.name} collection by AB SHOES.`,
            });
          }
        }
      })
      .catch((err) => console.warn("Using baseline collection:", err));
  }, [slug]);

  const filteredProducts = products.filter((p) => {
    if (slug === "new-arrivals") return p.isFeatured;
    return (
      p.category.toLowerCase() === slug.toLowerCase() ||
      p.category.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
    );
  });

  const metadata = categoryInfo;

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
