"use client";

import React from "react";
import Link from "next/link";
import { BRA_NAME, BRAND_TAGLINE } from "../lib/constants";
import { Instagram, Twitter, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-black tracking-widest gold-gradient">
                {BRA_NAME}
              </span>
            </Link>
            <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
              {BRAND_TAGLINE}. Crafted with precision, designed for the exceptional. Elevating footprints across the globe since 2012.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-zinc-400 hover:text-gold transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-gold transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-gold transition-colors">
                <Facebook size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-8">
              Explore
            </h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><Link href="/collections/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/sneakers" className="hover:text-white transition-colors">Sneakers</Link></li>
              <li><Link href="/collections/formal" className="hover:text-white transition-colors">Formal Collection</Link></li>
              <li><Link href="/collections/limited" className="hover:text-white transition-colors">Limited Edition</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-8">
              Service
            </h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><Link href="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] uppercase tracking-widest">
          <p>© 2026 {BRA_NAME}. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Condition</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
