"use client";

import React from "react";
import { motion } from "framer-motion";

const TableRow = ({ label, eu, us, uk, cm }: { label: string; eu: string; us: string; uk: string; cm: string }) => (
  <tr className="border-b border-white/5 text-sm">
    <td className="py-6 font-bold uppercase tracking-widest text-gold text-xs">{label}</td>
    <td className="py-6 text-zinc-400">{eu}</td>
    <td className="py-6 text-zinc-400">{us}</td>
    <td className="py-6 text-zinc-400">{uk}</td>
    <td className="py-6 text-zinc-400">{cm}</td>
  </tr>
);

export default function SizeGuidePage() {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen font-light">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">Perfect Fit</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
            SIZE <br /> <span className="gold-gradient">GUIDE.</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm uppercase tracking-widest leading-loose">
            Ensuring your acquisition fits like a second skin.
          </p>
        </motion.div>

        <div className="glass-panel rounded-[3rem] border border-white/5 overflow-hidden">
          <div className="p-10 md:p-16 border-b border-white/5">
            <h2 className="text-gold text-xs font-bold uppercase tracking-[0.4em] mb-8">Measurement Strategy</h2>
            <div className="text-zinc-400 space-y-6 text-sm md:text-base leading-relaxed">
              <p>
                To find your ideal size, we recommend measuring your foot at the end of the day. Place your foot on a piece of paper and mark the tip of your longest toe and the back of your heel.
              </p>
              <p>
                Compare the distance (in cm) to our sizing chart below. If you are between sizes, we recommend selecting the larger size for the most comfortable artisanal fit.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto p-10 md:p-16">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  <th className="pb-8">Standard</th>
                  <th className="pb-8">EU</th>
                  <th className="pb-8">US</th>
                  <th className="pb-8">UK</th>
                  <th className="pb-8">Heel-to-Toe (CM)</th>
                </tr>
              </thead>
              <tbody>
                <TableRow label="Size Small" eu="40" us="7" uk="6" cm="25.4" />
                <TableRow label="Size Med" eu="41" us="8" uk="7" cm="26.0" />
                <TableRow label="Size Large" eu="42" us="9" uk="8" cm="26.7" />
                <TableRow label="Size XL" eu="43" us="10" uk="9" cm="27.3" />
                <TableRow label="Size XXL" eu="44" us="11" uk="10" cm="28.0" />
                <TableRow label="Size 3XL" eu="45" us="12" uk="11" cm="28.6" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
