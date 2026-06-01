import React from "react";
import { BRA_NAME } from "@/lib/constants";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-black mb-12 gold-gradient uppercase tracking-tighter">
          Shipping Policy
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">Domestic Shipping</h2>
            <p>
              We offer standard and express shipping for all domestic orders. Standard shipping typically takes 3-5 business days, while express shipping takes 1-2 business days.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">International Shipping</h2>
            <p>
              {BRA_NAME} ships to over 50 countries worldwide. International shipping times vary by destination but generally take between 7-14 business days. Please note that international orders may be subject to import duties and taxes.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">Shipping Rates</h2>
            <p>
              Shipping rates are calculated at checkout based on the weight of your order and the destination. We offer free standard shipping on all domestic orders over $500.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">Order Tracking</h2>
            <p>
              Once your order has been shipped, you will receive a shipping confirmation email containing your tracking number. You can track your order through our website or the carrier&apos;s website.
            </p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-4">Lost or Damaged Packages</h2>
            <p>
              {BRA_NAME} is not responsible for lost or stolen packages. If your package is damaged during transit, please contact us immediately at support@ab-shoes.com.
            </p>
          </section>

          <p className="pt-8 border-t border-white/5 text-xs uppercase tracking-widest text-zinc-600">
            Last updated: April 15, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
