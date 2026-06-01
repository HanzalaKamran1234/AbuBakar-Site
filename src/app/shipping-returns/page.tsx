"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, RefreshCw, ShieldCheck, Globe } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-16"
  >
    <h2 className="text-gold text-xs font-bold uppercase tracking-[0.4em] mb-8">{title}</h2>
    <div className="text-zinc-400 leading-relaxed space-y-6 text-sm md:text-base font-light">
      {children}
    </div>
  </motion.div>
);

export default function ShippingReturnsPage() {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Logistics & Care</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
            SHIPPING & <br /> <span className="gold-gradient">RETURNS.</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-loose">
            Experience white-glove delivery and seamless artisanal support.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          <div className="text-center p-6 glass-panel rounded-3xl border border-white/5">
            <Truck className="mx-auto text-gold mb-4" size={24} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery</p>
          </div>
          <div className="text-center p-6 glass-panel rounded-3xl border border-white/5">
            <Globe className="mx-auto text-gold mb-4" size={24} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Global Reach</p>
          </div>
          <div className="text-center p-6 glass-panel rounded-3xl border border-white/5">
            <ShieldCheck className="mx-auto text-gold mb-4" size={24} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Secure Packing</p>
          </div>
          <div className="text-center p-6 glass-panel rounded-3xl border border-white/5">
            <RefreshCw className="mx-auto text-gold mb-4" size={24} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Easy Returns</p>
          </div>
        </div>

        <div className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5">
          <Section title="01. Shipping Protocol">
            <p>
              At AB SHOES, we understand that luxury is defined by the experience. Every pair of our footwear is dispatched via secure, expedited logistics to ensure that your acquisition arrives in pristine condition.
            </p>
            <p>
              Within Pakistan, we offer nationwide delivery within 3-5 business days. For international orders, transit times vary by region but typically range from 7-12 business days.
            </p>
          </Section>

          <Section title="02. Returns & Exchanges">
            <p>
              Your satisfaction is our absolute priority. We accept returns and exchanges on all unworn, meticulously preserved items within 14 days of receipt.
            </p>
            <p>
              Items must be returned in their original packaging, including all dust bags, security tags, and authenticity certificates. Customized or bespoke commissions are not eligible for standard returns.
            </p>
          </Section>

          <Section title="03. Packaging">
            <p>
              Each pair of AB SHOES is encased in a custom-designed, premium presentation box, reflecting the artisanal quality of the footwear within. This packaging is designed both for aesthetic pleasure and maximum protection during transit.
            </p>
          </Section>

          <Section title="04. Support">
            <p>
              Should you require assistance with a return or have specific shipping requirements, please contact our concierge team at concierge@ab-shoes.com or via our WhatsApp support.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
