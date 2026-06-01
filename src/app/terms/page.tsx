"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRA_NAME } from "@/lib/constants";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-12"
  >
    <h2 className="text-gold text-xs font-bold uppercase tracking-[0.4em] mb-6">{title}</h2>
    <div className="text-zinc-400 leading-relaxed space-y-4 text-sm md:text-base font-light">
      {children}
    </div>
  </motion.div>
);

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Client Agreement</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Terms of <br /> <span className="gold-gradient italic">Condition.</span>
          </h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Last Updated: April 15, 2026</p>
        </motion.div>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5">
          <Section title="01. Acceptance of Terms">
            <p>
              By accessing and using the {BRA_NAME} website, you agree to be bound by these Terms of Condition. If you do not agree to these terms, please refrain from using our platform.
            </p>
          </Section>

          <Section title="02. Product Availability & Pricing">
            <p>
              Due to the exclusive nature of our collections, all products are subject to availability. {BRA_NAME} reserves the right to limit the quantity of items purchased per client.
            </p>
            <p>
              Prices are subject to change without notice. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.
            </p>
          </Section>

          <Section title="03. Shipping & Delivery">
            <p>
              We provide worldwide white-glove shipping. Delivery times are estimates and may vary based on your location and the specific artisan requirements of your selected footwear.
            </p>
          </Section>

          <Section title="04. Intellectual Property">
            <p>
              All content on this site, including designs, logos, images, and text, is the exclusive property of {BRA_NAME} and is protected by international copyright laws. Unauthorized use of our intellectual property is strictly prohibited.
            </p>
          </Section>

          <Section title="05. Returns & Exchanges">
            <p>
              As our products are handcrafted to perfection, we accept returns within 14 days of delivery, provided the items are in their original, unworn condition with all security tags intact.
            </p>
          </Section>

          <Section title="06. Governing Law">
            <p>
              These terms are governed by and construed in accordance with international trade laws. Any disputes arising from the use of this site shall be resolved through independent arbitration.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
