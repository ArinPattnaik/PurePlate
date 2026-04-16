"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedText } from "./AnimatedText";
import { AlertTriangle, Info, ShieldAlert, Search, Beaker, Skull, Eye, Heart, Brain, Flame, Droplets, Palette, Shield, CheckCircle, XCircle, ChevronDown, ChevronUp, Leaf, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

// Complete INS Code Reference Data
interface INSReference {
  code: string;
  name: string;
  category: string;
  risk: "High Risk" | "Caution" | "Safe";
  banned?: string;
  description: string;
  commonProducts: string;
}

const INS_REFERENCE: INSReference[] = [
  // HIGH RISK
  { code: "102", name: "Tartrazine", category: "Synthetic Color", risk: "High Risk", banned: "Austria, Norway", description: "Synthetic lemon yellow azo dye. Linked to hyperactivity in children, allergic reactions, and asthma. Required to carry warning labels in the EU.", commonProducts: "Gems, candies, soft drinks, instant noodles" },
  { code: "110", name: "Sunset Yellow FCF", category: "Synthetic Color", risk: "High Risk", banned: "Norway, Finland", description: "Synthetic yellow azo dye. Studies show increased hyperactivity in children. EU requires warning label on products containing it.", commonProducts: "Mountain Dew, Tang, Rasna, candies" },
  { code: "124", name: "Ponceau 4R", category: "Synthetic Color", risk: "High Risk", banned: "USA, Norway", description: "Synthetic red azo dye. Linked to hyperactivity and allergic reactions including skin rashes and asthma.", commonProducts: "Kissan Jam, jellies, candies, desserts" },
  { code: "129", name: "Allura Red AC", category: "Synthetic Color", risk: "High Risk", description: "Synthetic red dye derived from petroleum. California proposed ban in 2023. EU requires warning label.", commonProducts: "Gems, candies, colored sweets" },
  { code: "133", name: "Brilliant Blue FCF", category: "Synthetic Color", risk: "High Risk", description: "Blue dye used in sweets and beverages. Associated with allergic reactions. Banned in some European countries.", commonProducts: "Gems, colored candies, blue beverages" },
  { code: "150c", name: "Ammonia Caramel", category: "Synthetic Color", risk: "High Risk", description: "Brown coloring produced using ammonia. Contains 4-MEI (4-Methylimidazole), listed as a possible carcinogen under California Proposition 65.", commonProducts: "Bournvita, dark sauces, soy sauce" },
  { code: "150d", name: "Sulphite Ammonia Caramel", category: "Synthetic Color", risk: "High Risk", description: "Dark brown color used in colas. Contains 4-MEI, classified as possibly carcinogenic. Found in almost every cola product.", commonProducts: "Coca-Cola, Pepsi, Thums Up, Oreo" },
  { code: "250", name: "Sodium Nitrite", category: "Preservative", risk: "High Risk", description: "Used in processed meats for color and preservation. Under high heat, forms nitrosamines — compounds strongly linked to stomach and colorectal cancer.", commonProducts: "Processed meats, bacon, sausages" },
  { code: "320", name: "BHA (Butylated Hydroxyanisole)", category: "Antioxidant", risk: "High Risk", description: "Synthetic antioxidant. Classified by the US National Toxicology Program as 'reasonably anticipated to be a human carcinogen.' Used to prevent fats from going rancid.", commonProducts: "Kellogg's cereals, chips, chewing gum" },
  { code: "951", name: "Aspartame", category: "Artificial Sweetener", risk: "High Risk", description: "In July 2023, WHO's IARC classified aspartame as 'possibly carcinogenic to humans' (Group 2B). Despite controversy, it remains approved by FSSAI and FDA.", commonProducts: "Diet Coke, Tang, sugar-free gum, diet products" },

  // CAUTION
  { code: "211", name: "Sodium Benzoate", category: "Preservative", risk: "Caution", description: "When combined with Vitamin C (ascorbic acid/INS 300), it can form benzene — a known carcinogen. This reaction is accelerated by heat and light. Many Indian beverages contain both.", commonProducts: "Frooti, Real juice, packaged fruit drinks, ketchup" },
  { code: "319", name: "TBHQ", category: "Antioxidant", risk: "Caution", description: "Tert-Butylhydroquinone. Synthetic antioxidant used to extend shelf life of oils and fats. High doses caused tumors in lab animals. CSPI rates it as 'avoid.'", commonProducts: "Haldiram's snacks, Act II popcorn, cooking oils" },
  { code: "321", name: "BHT", category: "Antioxidant", risk: "Caution", description: "Butylated Hydroxytoluene. Similar to BHA. Some evidence of endocrine disruption and tumor promotion at high doses.", commonProducts: "Cereals, snack foods, chewing gum" },
  { code: "338", name: "Phosphoric Acid", category: "Acidity Regulator", risk: "Caution", description: "Gives colas their tangy taste. Regular consumption linked to reduced bone mineral density and increased kidney stone risk.", commonProducts: "Coca-Cola, Pepsi, Thums Up, all dark colas" },
  { code: "407", name: "Carrageenan", category: "Thickener", risk: "Caution", description: "Extracted from red seaweed. Degraded carrageenan is a known carcinogen. Even food-grade carrageenan may cause digestive inflammation.", commonProducts: "Ice cream, chocolate milk, yogurt" },
  { code: "471", name: "Mono- and Diglycerides", category: "Emulsifier", risk: "Caution", description: "Keeps oil and water mixed. May contain trans fats depending on manufacturing. Often derived from palm oil.", commonProducts: "Pringles, bread, baked goods, ice cream" },
  { code: "621", name: "MSG (Monosodium Glutamate)", category: "Flavor Enhancer", risk: "Caution", description: "Amplifies savory (umami) taste. Can cause 'Chinese Restaurant Syndrome' — headaches, flushing, sweating. FDA deems it GRAS but requires labeling.", commonProducts: "Chinese food, soups, instant noodles (indirectly via other enhancers)" },
  { code: "627", name: "Disodium Guanylate", category: "Flavor Enhancer", risk: "Caution", description: "Used synergistically with MSG to amplify umami taste by up to 8x. Can trigger gout in sensitive individuals due to purine content. Often listed as 'flavor enhancer' without specifics.", commonProducts: "Maggi, Kurkure, Bingo, all instant noodles" },
  { code: "631", name: "Disodium Inosinate", category: "Flavor Enhancer", risk: "Caution", description: "Works with MSG and INS 627. Often derived from animal sources (meat or fish) — problematic for strict vegetarians despite products claiming 'veg.'", commonProducts: "Maggi, Yippee, Cup Noodles, flavored chips" },
  { code: "955", name: "Sucralose", category: "Artificial Sweetener", risk: "Caution", description: "A chlorinated sugar molecule. 2023 research suggests it damages DNA, alters gut microbiome, and may trigger inflammatory responses.", commonProducts: "Diet beverages, sugar-free products, protein bars" },
  { code: "950", name: "Acesulfame Potassium", category: "Artificial Sweetener", risk: "Caution", description: "Often used alongside aspartame. Some animal studies suggest potential carcinogenicity. Contains methylene chloride, a possible carcinogen.", commonProducts: "Diet sodas, tabletop sweeteners, protein shakes" },
  { code: "223", name: "Sodium Metabisulphite", category: "Dough Conditioner", risk: "Caution", description: "Bleaching agent and preservative. Can cause severe allergic reactions in sulphite-sensitive individuals, especially asthmatics.", commonProducts: "Parle-G, Monaco, many biscuits" },
  { code: "385", name: "Calcium Disodium EDTA", category: "Sequestrant", risk: "Caution", description: "A chelation agent that binds to metals. Some concerns about mineral depletion with habitual consumption.", commonProducts: "Kissan ketchup, mayonnaise, packaged pickles" },
  { code: "444", name: "Sucrose Acetate Isobutyrate", category: "Stabilizer", risk: "Caution", description: "Used in beverages to keep flavoring oils mixed. Limited long-term safety data available.", commonProducts: "Mountain Dew, Limca, flavored sodas" },

  // SAFE  
  { code: "300", name: "Ascorbic Acid (Vitamin C)", category: "Antioxidant", risk: "Safe", description: "Identical to natural Vitamin C. Used as an antioxidant to prevent browning and spoilage. Nutritionally beneficial.", commonProducts: "Juices, beverages, packaged fruits" },
  { code: "322", name: "Lecithins (Soy/Sunflower)", category: "Emulsifier", risk: "Safe", description: "Natural emulsifier derived from soy or sunflower. Helps blend oil and water. Generally safe and widely used.", commonProducts: "Almost all chocolates, biscuits, bread" },
  { code: "330", name: "Citric Acid", category: "Acidity Regulator", risk: "Safe", description: "Naturally found in citrus fruits. One of the most common food additives. Very safe for consumption.", commonProducts: "Sprite, lemon drinks, sour candies, jams" },
  { code: "412", name: "Guar Gum", category: "Thickener", risk: "Safe", description: "Natural fiber from guar beans, grown extensively in Rajasthan. Used as a thickener and stabilizer. Safe in normal amounts.", commonProducts: "Ice cream, sauces, soups, noodles" },
  { code: "440", name: "Pectins", category: "Gelling Agent", risk: "Safe", description: "Natural gelling agent extracted from fruit peels (usually apple or citrus). Used in jams and jellies. Nutritionally beneficial as fiber.", commonProducts: "Kissan jam, all fruit jams, gummy candies" },
  { code: "500", name: "Sodium Carbonates (Baking Soda)", category: "Raising Agent", risk: "Safe", description: "Common baking soda. Used as a leavening agent for thousands of years. Very safe.", commonProducts: "All biscuits, bread, cakes, naan" },
];

// Hidden Sugar Aliases
const HIDDEN_SUGARS = [
  { name: "Maltodextrin", description: "Highly processed starch with glycemic index of 95-136 (higher than table sugar at 65). Spikes blood sugar rapidly." },
  { name: "Liquid Glucose", description: "Corn-derived industrial sugar. Cheaper than sucrose. Very high glycemic index." },
  { name: "Invert Sugar / Invert Syrup", description: "Processed sugar designed to prevent crystallization. Same calories as regular sugar but harder to detect." },
  { name: "Dextrose", description: "Pure glucose in powder form. GI of 100. Used as cheap filler." },
  { name: "High Fructose Corn Syrup", description: "Linked to obesity, fatty liver disease, and metabolic syndrome. Cheap industrial sweetener." },
  { name: "Corn Syrup Solids", description: "Dehydrated corn syrup. Same health concerns as HFCS but marketed differently." },
  { name: "Fructose", description: "Can only be metabolized by the liver. Excess consumption linked to fatty liver disease." },
  { name: "Glucose Syrup", description: "Industrial sugar made from starch. Used to add sweetness and texture cheaply." },
  { name: "Honey Powder", description: "Dehydrated honey mixed with maltodextrin. Mostly sugar with negligible nutritional benefit." },
  { name: "Agave Nectar", description: "Marketed as 'natural' but is 85% fructose — worse than HFCS for liver health." },
  { name: "Brown Rice Syrup", description: "Sounds healthy but is essentially pure glucose with a GI of 98." },
  { name: "Sucrose", description: "Table sugar by another name. Half glucose, half fructose." },
];

// Dangerous Processed Ingredients
const PROCESSED_DANGERS = [
  { name: "Refined Wheat Flour (Maida)", icon: "🌾", description: "Chemically bleached flour stripped of fiber and nutrients. GI of 71 vs whole wheat at 54. Used in Maggi, Oreo, most biscuits." },
  { name: "Palm Oil / Palmolein", icon: "🌴", description: "Cheapest vegetable oil. High in saturated fat. Linked to cardiovascular disease. Also causes massive deforestation in Southeast Asia." },
  { name: "Hydrogenated Vegetable Fat", icon: "⚗️", description: "Partially hydrogenated oils contain trans fats — the most dangerous type of fat. Even 2g/day increases heart disease risk by 23%. Found in Dark Fantasy, 5 Star." },
  { name: "Interesterified Fat", icon: "🧪", description: "The industry's replacement for trans fats. Emerging research links it to insulin resistance, elevated blood sugar, and altered fat metabolism." },
  { name: "Hydrolyzed Vegetable Protein", icon: "🔬", description: "Chemically broken-down protein used as a 'natural' flavor enhancer. Actually a hidden source of MSG (glutamate). Found in Yippee, chips." },
];

// Expandable INS Card component
function INSCard({ entry }: { entry: INSReference }) {
  const [expanded, setExpanded] = useState(false);
  
  const riskColor = entry.risk === "High Risk" 
    ? "border-[#E0005C]/30 bg-[#E0005C]/5" 
    : entry.risk === "Caution" 
    ? "border-[#f7ac32]/30 bg-[#f7ac32]/5" 
    : "border-emerald-500/30 bg-emerald-500/5";

  const riskTextColor = entry.risk === "High Risk" 
    ? "text-[#E0005C]" 
    : entry.risk === "Caution" 
    ? "text-[#f7ac32]" 
    : "text-emerald-500";

  const riskIcon = entry.risk === "High Risk" 
    ? <Skull className="w-4 h-4" /> 
    : entry.risk === "Caution" 
    ? <AlertTriangle className="w-4 h-4" /> 
    : <CheckCircle className="w-4 h-4" />;

  return (
    <motion.div 
      layout
      className={cn("border rounded-sm overflow-hidden transition-colors cursor-pointer", riskColor)}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs bg-[#1c1a17] px-2 py-0.5 rounded text-[#f7ac32] border border-[#f7ac32]/20 whitespace-nowrap flex-shrink-0">
            INS {entry.code}
          </span>
          <span className="font-bold text-sm text-[#f4ecd8] truncate">{entry.name}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn("text-[10px] uppercase font-bold tracking-wider flex items-center gap-1", riskTextColor)}>
            {riskIcon} {entry.risk}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#f4ecd8]/30" /> : <ChevronDown className="w-4 h-4 text-[#f4ecd8]/30" />}
        </div>
      </div>
      
      {expanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 pb-3 border-t border-[#f4ecd8]/5"
        >
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#f4ecd8]/30">Category:</span>
              <span className="text-xs text-[#f4ecd8]/60">{entry.category}</span>
            </div>
            <p className="text-xs text-[#f4ecd8]/60 leading-relaxed">{entry.description}</p>
            {entry.banned && (
              <div className="flex items-center gap-1.5 text-[#E0005C]">
                <XCircle className="w-3 h-3" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Banned in: {entry.banned}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#f4ecd8]/30">Found in:</span>
              <span className="text-[11px] text-[#f7ac32]/70 italic">{entry.commonProducts}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function MethodologyView() {
  const [activeTab, setActiveTab] = useState<"scoring" | "ins" | "sugars" | "chemicals">("scoring");
  const [riskFilter, setRiskFilter] = useState<"all" | "High Risk" | "Caution" | "Safe">("all");

  const filteredINS = riskFilter === "all" 
    ? INS_REFERENCE 
    : INS_REFERENCE.filter(e => e.risk === riskFilter);

  const highRiskCount = INS_REFERENCE.filter(e => e.risk === "High Risk").length;
  const cautionCount = INS_REFERENCE.filter(e => e.risk === "Caution").length;
  const safeCount = INS_REFERENCE.filter(e => e.risk === "Safe").length;

  return (
    <div className="pt-24 pb-24 px-4 md:px-6 max-w-6xl mx-auto min-h-screen text-[#f4ecd8] font-sans selection:bg-[#E0005C] selection:text-white">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] leading-[0.85] font-black uppercase tracking-tighter text-[#f7ac32] mb-4">
          <AnimatedText text="THE METHODOLOGY" />
        </h1>
        <div className="dotted_line w-full max-w-md my-6 opacity-30"></div>
        <p className="font-mono text-base md:text-lg text-[#f4ecd8]/70 leading-relaxed uppercase tracking-wider max-w-2xl">
          Everything you need to understand about food chemicals, INS codes, and how we grade products.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-10 sticky top-16 z-20 bg-[#1c1a17]/95 backdrop-blur-md py-3 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-[#f7ac32]/10">
        {[
          { id: "scoring" as const, label: "Scoring", icon: <Shield className="w-4 h-4" /> },
          { id: "ins" as const, label: "INS Codes", icon: <FlaskConical className="w-4 h-4" /> },
          { id: "sugars" as const, label: "Hidden Sugars", icon: <Droplets className="w-4 h-4" /> },
          { id: "chemicals" as const, label: "Processed Chemicals", icon: <Beaker className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 rounded-sm border",
              activeTab === tab.id
                ? "bg-[#f7ac32] text-[#1c1a17] border-[#f7ac32]"
                : "bg-transparent text-[#f4ecd8]/50 border-[#f4ecd8]/10 hover:border-[#f7ac32]/40 hover:text-[#f7ac32]"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== SCORING TAB ==================== */}
      {activeTab === "scoring" && (
        <div className="space-y-12 animate-in fade-in">
          <section className="border-l-4 border-[#f7ac32] pl-6 md:pl-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4">
              How We Calculate the 1–10 Score
            </h2>
            <p className="font-mono text-sm md:text-base text-[#f4ecd8]/60 leading-loose mb-6">
              The PurePlate Transparency Score is not a simple nutritional grade — it measures chemical load, ingredient obfuscation, and corporate transparency. We start every product at <strong className="text-[#f7ac32]">8/10</strong> and deduct points for:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#151311] p-5 border border-[#E0005C]/20">
                <div className="text-[#E0005C] font-black text-lg mb-2 flex items-center gap-2"><Skull className="w-5 h-5" /> −2.0 Points</div>
                <p className="text-xs font-mono text-[#f4ecd8]/50 uppercase">Each HIGH RISK INS code found (carcinogens, banned substances)</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#f7ac32]/20">
                <div className="text-[#f7ac32] font-black text-lg mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> −0.5 Points</div>
                <p className="text-xs font-mono text-[#f4ecd8]/50 uppercase">Each MODERATE RISK INS code (flavor enhancers, controversial emulsifiers)</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#f4ecd8]/10">
                <div className="text-[#f4ecd8] font-black text-lg mb-2 flex items-center gap-2"><Flame className="w-5 h-5" /> −1.0 Point</div>
                <p className="text-xs font-mono text-[#f4ecd8]/50 uppercase">Palm Oil / Palmolein, Refined Flour (Maida), Synthetic Colors</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#f4ecd8]/10">
                <div className="text-[#f4ecd8] font-black text-lg mb-2 flex items-center gap-2"><Droplets className="w-5 h-5" /> −1.0 Point</div>
                <p className="text-xs font-mono text-[#f4ecd8]/50 uppercase">Hidden Sugars (Maltodextrin, Liquid Glucose, Invert Syrup)</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#f4ecd8]/10">
                <div className="text-[#f4ecd8] font-black text-lg mb-2 flex items-center gap-2"><Heart className="w-5 h-5 text-[#E0005C]" /> −1.5 Points</div>
                <p className="text-xs font-mono text-[#f4ecd8]/50 uppercase">Hydrogenated Fats (Trans Fat source)</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#f4ecd8]/10">
                <div className="text-[#f4ecd8] font-black text-lg mb-2 flex items-center gap-2"><Palette className="w-5 h-5" /> −0.5 Points</div>
                <p className="text-xs font-mono text-[#f4ecd8]/50 uppercase">Artificial/Synthetic Flavoring or Nature-Identical flavors</p>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-emerald-500 pl-6 md:pl-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4">
              Score Interpretation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#151311] p-5 border border-emerald-500/30">
                <div className="text-emerald-500 font-black text-3xl mb-1">8–10</div>
                <div className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-2">CLEAN</div>
                <p className="text-xs font-mono text-[#f4ecd8]/40">Minimal processing, whole ingredients, zero or low-risk additives only. Examples: Quaker Oats, MDH Masala, Amul Butter</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#f7ac32]/30">
                <div className="text-[#f7ac32] font-black text-3xl mb-1">4–7</div>
                <div className="text-[#f7ac32] font-bold uppercase tracking-widest text-sm mb-2">MODERATE CONCERN</div>
                <p className="text-xs font-mono text-[#f4ecd8]/40">Contains processed ingredients and some flagged additives. Examples: Lay&apos;s, Parle-G, Frooti</p>
              </div>
              <div className="bg-[#151311] p-5 border border-[#E0005C]/30">
                <div className="text-[#E0005C] font-black text-3xl mb-1">1–3</div>
                <div className="text-[#E0005C] font-bold uppercase tracking-widest text-sm mb-2">HIGH RISK</div>
                <p className="text-xs font-mono text-[#f4ecd8]/40">Loaded with synthetic chemicals, hidden sugars, and industrial fillers. Examples: Products with multiple high-risk INS codes</p>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#E0005C] pl-6 md:pl-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4 flex items-center gap-3">
              <AlertTriangle className="text-[#E0005C]" /> The NOVA Classification
            </h2>
            <p className="font-mono text-sm text-[#f4ecd8]/60 leading-loose mb-4">
              We integrate the <strong className="text-[#f7ac32]">NOVA food classification system</strong> developed by researchers at the University of São Paulo. It categorizes foods by the extent of industrial processing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                <span className="text-emerald-500 font-bold text-sm">NOVA 1 — Unprocessed</span>
                <p className="text-xs text-[#f4ecd8]/40 mt-1">Fresh fruits, vegetables, grains, eggs, milk</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                <span className="text-emerald-500 font-bold text-sm">NOVA 2 — Processed Ingredients</span>
                <p className="text-xs text-[#f4ecd8]/40 mt-1">Oils, butter, sugar, salt, flour</p>
              </div>
              <div className="bg-[#f7ac32]/5 border border-[#f7ac32]/20 p-4 rounded-sm">
                <span className="text-[#f7ac32] font-bold text-sm">NOVA 3 — Processed Foods</span>
                <p className="text-xs text-[#f4ecd8]/40 mt-1">Canned food, cheese, freshly made bread</p>
              </div>
              <div className="bg-[#E0005C]/5 border border-[#E0005C]/20 p-4 rounded-sm">
                <span className="text-[#E0005C] font-bold text-sm">NOVA 4 — Ultra-Processed</span>
                <p className="text-xs text-[#f4ecd8]/40 mt-1">Maggi, Oreo, Kurkure, Cola — most packaged FMCG</p>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#f4ecd8]/30 pl-6 md:pl-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4 flex items-center gap-3">
              <Info className="text-[#f7ac32]" /> FSSAI Labeling Loopholes
            </h2>
            <p className="font-mono text-sm text-[#f4ecd8]/60 leading-loose">
              Indian FSSAI regulations allow brands to use generic class titles like &ldquo;Contains Permitted Synthetic Food Colors&rdquo; or &ldquo;Permitted Flavor Enhancers&rdquo; without specifying exact INS codes. This legal loophole prevents consumers from knowing whether they&apos;re consuming INS 150c (carcinogen risk) or INS 160b (natural and safe).
            </p>
            <div className="bg-[#151311] p-5 mt-4 border border-[#f7ac32]/15 flex items-start gap-4 rounded-sm">
              <ShieldAlert className="w-8 h-8 text-[#f7ac32] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-[#f7ac32] mb-1">Our Stance</h4>
                <p className="text-xs font-mono opacity-50 leading-relaxed">
                  If a manufacturer uses a generic class title instead of explicit INS codes, we automatically penalize their transparency score by −1.0 and apply a &ldquo;Unspecified Additives&rdquo; flag. Transparency demands specificity.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ==================== INS CODES TAB ==================== */}
      {activeTab === "ins" && (
        <div className="animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-2 flex items-center gap-3">
              <FlaskConical className="text-[#f7ac32]" /> Complete INS Code Reference
            </h2>
            <p className="font-mono text-xs md:text-sm text-[#f4ecd8]/50 uppercase tracking-wider">
              {INS_REFERENCE.length} additives commonly found in Indian packaged food
            </p>
          </div>

          {/* Risk Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setRiskFilter("all")} className={cn("px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-sm cursor-pointer transition-all", riskFilter === "all" ? "bg-[#f7ac32] text-[#1c1a17] border-[#f7ac32]" : "text-[#f4ecd8]/40 border-[#f4ecd8]/10 hover:border-[#f7ac32]/40")}>
              All ({INS_REFERENCE.length})
            </button>
            <button onClick={() => setRiskFilter("High Risk")} className={cn("px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-sm cursor-pointer transition-all flex items-center gap-1", riskFilter === "High Risk" ? "bg-[#E0005C] text-white border-[#E0005C]" : "text-[#E0005C]/60 border-[#E0005C]/20 hover:border-[#E0005C]/50")}>
              <Skull className="w-3 h-3" /> High Risk ({highRiskCount})
            </button>
            <button onClick={() => setRiskFilter("Caution")} className={cn("px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-sm cursor-pointer transition-all flex items-center gap-1", riskFilter === "Caution" ? "bg-[#f7ac32] text-[#1c1a17] border-[#f7ac32]" : "text-[#f7ac32]/60 border-[#f7ac32]/20 hover:border-[#f7ac32]/50")}>
              <AlertTriangle className="w-3 h-3" /> Caution ({cautionCount})
            </button>
            <button onClick={() => setRiskFilter("Safe")} className={cn("px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-sm cursor-pointer transition-all flex items-center gap-1", riskFilter === "Safe" ? "bg-emerald-500 text-white border-emerald-500" : "text-emerald-500/60 border-emerald-500/20 hover:border-emerald-500/50")}>
              <CheckCircle className="w-3 h-3" /> Safe ({safeCount})
            </button>
          </div>

          {/* INS Cards */}
          <div className="space-y-2">
            {filteredINS.map(entry => (
              <INSCard key={entry.code} entry={entry} />
            ))}
          </div>

          <div className="mt-8 bg-[#151311] border border-[#f7ac32]/10 p-5 rounded-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#f7ac32] mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" /> How to Read INS Codes on Labels
            </h4>
            <p className="text-xs font-mono text-[#f4ecd8]/50 leading-relaxed">
              Look for entries like &ldquo;INS 627&rdquo;, &ldquo;E150d&rdquo;, or just numbers in parentheses like &ldquo;(322)&rdquo; in the ingredients list. European products use the &ldquo;E&rdquo; prefix (E621 = INS 621 = MSG). Indian products use the INS numbering system as per FSSAI guidelines. When a product says &ldquo;Permitted Class II Preservatives&rdquo; without specifics — that&apos;s deliberate obfuscation.
            </p>
          </div>
        </div>
      )}

      {/* ==================== HIDDEN SUGARS TAB ==================== */}
      {activeTab === "sugars" && (
        <div className="animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-2 flex items-center gap-3">
              <Droplets className="text-[#f7ac32]" /> The 12+ Names for Sugar
            </h2>
            <p className="font-mono text-xs md:text-sm text-[#f4ecd8]/50 uppercase tracking-wider">
              Brands disguise sugar under different names to make it appear lower on the ingredients list
            </p>
          </div>

          <div className="bg-[#E0005C]/5 border border-[#E0005C]/20 p-5 rounded-sm mb-8">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-[#E0005C] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#E0005C] uppercase tracking-wider mb-1">The Splitting Trick</h4>
                <p className="text-xs text-[#f4ecd8]/60 leading-relaxed font-mono">
                  FSSAI requires ingredients to be listed in descending order of weight. So brands split sugar into 3-4 different forms (Sugar + Maltodextrin + Liquid Glucose + Invert Syrup). Each appears lower on the list, but combined they may be the #1 ingredient. This is completely legal.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HIDDEN_SUGARS.map((sugar, idx) => (
              <div key={idx} className="bg-[#151311] p-4 border border-[#f7ac32]/10 hover:border-[#f7ac32]/30 transition-colors rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-[#f7ac32]" />
                  <span className="font-bold text-sm text-[#f4ecd8]">{sugar.name}</span>
                </div>
                <p className="text-xs text-[#f4ecd8]/50 leading-relaxed font-mono">{sugar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#151311] border border-[#f7ac32]/10 p-5 rounded-sm">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#f7ac32] mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" /> How PurePlate Detects Hidden Sugar
            </h4>
            <p className="text-xs font-mono text-[#f4ecd8]/50 leading-relaxed">
              Our algorithm scans every ingredient for all known sugar aliases. When detected, the product receives a &ldquo;Hidden Sugars&rdquo; flag and a −1.0 point deduction from its Transparency Score. We don&apos;t penalize natural sugars in fruit or dairy — only added sugars and their industrial aliases.
            </p>
          </div>
        </div>
      )}

      {/* ==================== PROCESSED CHEMICALS TAB ==================== */}
      {activeTab === "chemicals" && (
        <div className="animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-2 flex items-center gap-3">
              <Beaker className="text-[#E0005C]" /> Dangerous Processed Ingredients
            </h2>
            <p className="font-mono text-xs md:text-sm text-[#f4ecd8]/50 uppercase tracking-wider">
              These don&apos;t have INS codes but are equally concerning
            </p>
          </div>

          <div className="space-y-4">
            {PROCESSED_DANGERS.map((item, idx) => (
              <div key={idx} className="bg-[#151311] p-5 border border-[#E0005C]/15 hover:border-[#E0005C]/30 transition-colors rounded-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-black text-lg text-[#f4ecd8] uppercase tracking-tight">{item.name}</h3>
                </div>
                <p className="text-sm text-[#f4ecd8]/60 leading-relaxed font-mono">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-[#f7ac32]/10 pt-8">
            <h3 className="text-xl font-black uppercase tracking-tight text-[#f7ac32] mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5" /> What to Look For Instead
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                <span className="font-bold text-emerald-500 text-sm">Instead of Maida →</span>
                <p className="text-xs text-[#f4ecd8]/50 mt-1">Whole Wheat Flour (Atta), Ragi Flour, Multi-grain</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                <span className="font-bold text-emerald-500 text-sm">Instead of Palm Oil →</span>
                <p className="text-xs text-[#f4ecd8]/50 mt-1">Cold-pressed Mustard Oil, Coconut Oil, Groundnut Oil</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                <span className="font-bold text-emerald-500 text-sm">Instead of Maltodextrin →</span>
                <p className="text-xs text-[#f4ecd8]/50 mt-1">Natural spices, real dried vegetables, herbs</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm">
                <span className="font-bold text-emerald-500 text-sm">Instead of Hydrogenated Fat →</span>
                <p className="text-xs text-[#f4ecd8]/50 mt-1">Butter, Ghee, Natural vegetable oils</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
