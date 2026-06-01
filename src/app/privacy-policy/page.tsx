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

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Legal Documentation</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Privacy <br /> <span className="gold-gradient italic">Policy.</span>
          </h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Last Updated: April 15, 2026</p>
        </motion.div>

        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5">
          <Section title="01. Introduction">
            <p>
              At {BRA_NAME}, we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our luxury footwear platform.
            </p>
          </Section>

          <Section title="02. Information Collection">
            <p>
              We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact our concierge service. This may include your name, email address, billing/shipping address, and payment information.
            </p>
            <p>
              We also automatically collect certain technical information when you visit our site, including your IP address, browser type, and interaction data to enhance your shopping experience.
            </p>
          </Section>

          <Section title="03. How We Use Your Data">
            <p>Your information is used to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and fulfill your luxury footwear orders.</li>
              <li>Provide personalized customer support through our concierge.</li>
              <li>Send exclusive invitations to private drops and collaborations.</li>
              <li>Improve our website's performance and design.</li>
            </ul>
          </Section>

          <Section title="04. Data Security">
            <p>
              We implement industry-leading security measures to protect your personal data. All financial transactions are encrypted using secure socket layer technology (SSL) and processed through Tier-1 payment gateways.
            </p>
          </Section>

          <Section title="05. Your Rights">
            <p>
              As a valued client of {BRA_NAME}, you have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications by following the instructions in our emails or contacting support.
            </p>
          </Section>

          <Section title="06. Contact Us">
            <p>
              If you have any questions regarding this Privacy Policy or our data practices, please reach out to our legal department via our WhatsApp concierge or email at legal@ab-shoes.com.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
