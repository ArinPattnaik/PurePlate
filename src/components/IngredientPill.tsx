"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INSEntry, insDictionary } from '@/constants/ins-dictionary';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface IngredientPillProps {
  name: string;
}

export const IngredientPill: React.FC<IngredientPillProps> = ({ name }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Attempt to extract INS code if present
  const insMatch = name.match(/INS\s*(\d+[a-zA-Z]?)/i);
  const insCode = insMatch ? insMatch[1].toLowerCase() : null;
  
  const insData: INSEntry | undefined = insCode ? insDictionary[insCode] : undefined;

  if (!insData) {
    return (
      <div className="px-3 py-1.5 text-sm md:text-base font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full">
        {name}
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Safe': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Caution': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'High Risk': return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
      default: return 'text-zinc-300 border-zinc-700 bg-zinc-800/50';
    }
  };


  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className={cn(
          "px-3 py-1.5 text-sm md:text-base font-mono rounded-full border cursor-help flex items-center gap-2 transition-colors",
          getRiskColor(insData.risk)
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>{name}</span>
        <Info className="w-4 h-4 opacity-70" />
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, type: 'spring', bounce: 0.4 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-72 md:w-80 p-4 rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl z-50 pointer-events-none"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-sans font-bold text-lg text-white">
                {insData.name} <span className="text-zinc-500 text-sm font-mono">(INS {insData.code.toUpperCase()})</span>
              </h4>
              <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", getRiskColor(insData.risk))}>
                {insData.risk}
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed font-sans">
              {insData.description}
            </p>
            {/* Tooltip Triangle */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-8 border-r-8 border-t-[8px] border-l-transparent border-r-transparent border-t-white/10" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-zinc-950/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
