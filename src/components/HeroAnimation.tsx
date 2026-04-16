"use client";

import React from "react";
import { motion } from "framer-motion";

export function HeroAnimation() {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center -mt-8">
      {/* Outer spinning dashed ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-dashed border-[#f7ac32]/30"
      />
      
      {/* Inner pulsating glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full bg-[#f7ac32]/10 blur-xl"
      />

      {/* The Shield/Magnifying glass SVG */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-24 h-24 text-[#f7ac32]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Shield Base */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </motion.div>
    </div>
  );
}
