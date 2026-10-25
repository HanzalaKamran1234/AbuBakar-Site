"use client";

import React, { useState, useEffect, use } from "react";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "@/lib/types";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product);
        } else {
          setError(data.error || "Product not found.");
        }
      } catch (err: any) {
        setError("Error connecting to server: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="animate-spin text-gold mb-3" size={32} />
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading shoe details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-4">
        <div className="h-12 w-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Product Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">{error || "Could not retrieve product record."}</p>
        <Link
          href="/admin/products"
          className="gold-button inline-block px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}
