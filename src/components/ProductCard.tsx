"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IngredientPill } from '@/components/IngredientPill';

export interface ProductData {
  title: string;
  imageUrl: string;
  score: number; // 0 to 100
  ingredients: string[];
}

export const ProductCard: React.FC<{ data: ProductData }> = ({ data }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to actual over 1 second
    const duration = 1000;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.round((data.score / steps) * currentStep));
      if (currentStep >= steps) {
        setAnimatedScore(data.score);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [data.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // emerald-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  const circleLength = 283; // 2 * pi * r (r=45)
  const strokeDashoffset = circleLength - (circleLength * animatedScore) / 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
      className="w-full max-w-4xl mx-auto rounded-3xl border border-white/10 bg-zinc-950/40 backdrop-blur-2xl overflow-hidden shadow-2xl relative"
    >
      {/* Glow Behind Score */}
      <div 
        className="absolute top-10 right-10 w-32 h-32 blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: getScoreColor(data.score) }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0">
        
        {/* Left Col: Image & Score */}
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center gap-8 relative bg-black/20">
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-48 h-48 md:w-56 md:h-56"
          >
            {/* SVG Ring Chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getScoreColor(data.score)}
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circleLength }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  strokeDasharray: circleLength,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black font-sans tracking-tight text-white">{animatedScore}</span>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono mt-1">Score</span>
            </div>
          </motion.div>


        </div>

        {/* Right Col: Title & Ingredients */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-black text-white font-sans tracking-tighter leading-tight"
          >
            {data.title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-zinc-400 font-mono text-sm uppercase tracking-widest"
          >
            Ingredient Breakdown
          </motion.p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            {data.ingredients.map((ing, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (idx * 0.05) }}
              >
                <IngredientPill name={ing} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
