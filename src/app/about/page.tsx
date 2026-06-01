"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Package, ShieldCheck, Truck, Zap } from "lucide-react";
import { BRA_NAME } from "@/lib/constants";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center group">
    <p className="text-4xl md:text-5xl font-black gold-gradient mb-2 group-hover:scale-110 transition-transform duration-500">
      {value}
    </p>
    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
      {label}
    </p>
  </div>
);

const Feature = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-500 group"
  >
    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-black transition-colors duration-500">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-black min-h-screen">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1449241715241-2a1391696601?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury Workshop"
            fill
            className="object-cover brightness-50 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.6em] mb-6 block">Legacy & Vision</span>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-8">
              THE STORY OF <br />
              <span className="gold-gradient italic">PRECISION.</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              Founded by <span className="text-white font-bold">AbuBakar Mehdi</span>, {BRA_NAME} is more than a brand. It is a testament to the art of luxury footwear in Pakistan.
            </p>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
        >
          <ArrowDown size={32} strokeWidth={1} />
        </motion.div>
      </section>

      {/* Founder Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Text Column (Left on Desktop) */}
            <div className="space-y-10 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Our Founder</span>
                <h2 className="text-4xl md:text-6xl font-black leading-none uppercase tracking-tighter mb-8">
                  A VISION FOR <br />
                  <span className="text-zinc-500 italic">ELEGANCE.</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  AbuBakar Mehdi started {BRA_NAME} with a simple objective: to bring world-class luxury footwear to the heart of Pakistan. As a passionate ecommerce business leader, he recognized a gap between mass-produced quality and true artisanal excellence.
                </p>
                <p className="text-zinc-500 leading-relaxed italic border-l-2 border-gold pl-6 py-2">
                  "We don't just sell shoes; we deliver confidence and a legacy of craftsmanship to every doorstep in Pakistan." — AbuBakar Mehdi
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-12 pt-10 border-t border-white/5">
                <Stat label="Clients Served" value="15k+" />
                <Stat label="Artisans" value="50+" />
              </div>
            </div>

            {/* Image Column (Right on Desktop) */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/5 order-1 lg:order-2"
            >
              <Image
                src="/images/founder.jpg"
                alt="AbuBakar Mehdi"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <p className="text-2xl font-bold mb-1 uppercase tracking-tight">AbuBakar Mehdi</p>
                <p className="text-gold text-xs uppercase tracking-[0.3em] font-bold">Founder & Visionary</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nationwide Delivery Section */}
      <section className="py-32 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Our Commitment</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
              BEYOND <br /> <span className="gold-gradient italic">BOUNDARIES.</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              We take pride in our logistics. {BRA_NAME} offers <span className="text-white font-bold italic underline decoration-gold">Nationwide Delivery across the whole of Pakistan</span>. From Karachi to Gilgit, luxury is now available to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Feature 
              icon={Truck} 
              title="Whole Pakistan" 
              description="Seamless delivery to every city, town, and village across the nation."
            />
            <Feature 
              icon={Package} 
              title="Elite Packaging" 
              description="Our shoes arrive in luxury boxes designed for a premium unboxing experience."
            />
            <Feature 
              icon={ShieldCheck} 
              title="Secure Payments" 
              description="Safe and encrypted transactions for complete peace of mind."
            />
            <Feature 
              icon={Zap} 
              title="Fast Logistics" 
              description="Expedited shipping ensuring your pair arrives faster than ever before."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 relative overflow-hidden text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-12">
              READY TO <br />
              <span className="gold-gradient italic">STEP UP?</span>
            </h2>
            <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] mb-12 font-bold">Experience the pinnacle of footwear.</p>
            <a href="/shop" className="gold-button px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm">
              Explore Collection
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
