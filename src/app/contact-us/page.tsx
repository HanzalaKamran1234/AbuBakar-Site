"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic">
            CONTACT <br /> <span className="gold-gradient">CONCIERGE.</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Our master support team is here to assist you with bespoke requests, sizing inquiries, or tracking details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="glass-panel p-10 rounded-3xl border border-white/5 space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Us</h3>
                  <p className="text-xl font-bold">concierge@ab-shoes.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Call/WhatsApp</h3>
                  <p className="text-xl font-bold">+92 333 2498678</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Main Atelier</h3>
                  <p className="text-xl font-bold leading-relaxed">Luxury Heights, <br />Gulberg, Lahore, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-10 rounded-3xl border border-white/5"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-4">Full Name</label>
                  <input type="text" placeholder="ABUBAKAR MEHDI" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-full text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-4">Email Address</label>
                  <input type="email" placeholder="YOUR@EMAIL.COM" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-full text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-4">Phone Number</label>
                <input type="tel" placeholder="+92 XXX XXXXXXX" className="w-full bg-white/5 border border-white/10 px-8 py-5 rounded-full text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-4">Message</label>
                <textarea rows={6} placeholder="TELL US ABOUT YOUR BESPOKE NEEDS..." className="w-full bg-white/5 border border-white/10 px-8 py-6 rounded-3xl text-xs focus:outline-none focus:border-gold transition-colors uppercase tracking-widest resize-none" />
              </div>

              <button type="submit" className="gold-button w-full py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3">
                <Send size={16} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
