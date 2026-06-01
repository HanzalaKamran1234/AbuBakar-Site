"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WHATSAPP_LINK } from "../lib/constants";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[90]">
      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] overflow-hidden group border border-white/20"
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1 
        }}
      >
        {/* Luxury Emerald Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-emerald-600 to-emerald-400 group-hover:scale-110 transition-transform duration-500" />
        
        {/* Animated Shine Effect */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%]"
          animate={{
            translateX: ["200%", "-200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        />

        {/* WhatsApp Icon */}
        <MessageCircle 
          className="w-8 h-8 text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" 
          strokeWidth={1.5}
        />

        {/* Outer Ring Pulse */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.a>

      {/* Premium Notification Badge */}
      <motion.div
        className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full z-[91] flex items-center justify-center border-2 border-black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </motion.div>

      {/* Floating Tooltip */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-4 group-hover:translate-x-0">
        <div className="bg-black/90 backdrop-blur-xl text-white text-[10px] uppercase tracking-[0.3em] font-bold px-6 py-3 rounded-full border border-white/10 shadow-2xl whitespace-nowrap">
          Concierge Support
        </div>
      </div>
    </div>
  );
};
