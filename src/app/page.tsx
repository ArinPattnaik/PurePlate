"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, ShieldAlert, BadgeInfo, Menu, X, AlertTriangle, Loader2, Leaf, ChevronRight, Database, Beaker, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { RealProduct } from '@/lib/real-data';
import { CATEGORY_EMOJIS, type ProductCategory } from '@/lib/indian-products';
import { DeepDiveTable } from '@/components/DeepDiveTable';
import { AnimatedText } from '@/components/AnimatedText';
import { MethodologyView } from '@/components/MethodologyView';
import { cn } from '@/lib/utils';

// ────────────────────────────────────────────────────────
// Animated counter component
// ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 60;
          const stepTime = duration / steps;
          let current = 0;
          const interval = setInterval(() => {
            current++;
            setCount(Math.round((target / steps) * current));
            if (current >= steps) {
              setCount(target);
              clearInterval(interval);
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-[#f7ac32] tabular-nums">
      {count}{suffix}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Product image with lazy loading + branded placeholder
// ────────────────────────────────────────────────────────
const ProductImageCard = ({ product }: { product: RealProduct }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const brandColor = getBrandAccent(product.brand);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/image?q=${encodeURIComponent(product.brand + ' ' + product.name)}&brand=${encodeURIComponent(product.brand)}&category=${encodeURIComponent(product.category || '')}`)
      .then(res => res.json())
      .then(data => {
        if (data.imageUrl) setImageUrl(data.imageUrl);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [product.brand, product.name, product.category]);

  return (
    <div className="h-48 relative flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${brandColor}08, ${brandColor}15)` }}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-[#f4ecd8]/20 z-10">
          <Loader2 className="w-6 h-6 animate-spin mb-1" />
          <span className="text-[10px] uppercase tracking-widest font-mono">Loading</span>
        </div>
      ) : imageUrl ? (
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-4xl">{CATEGORY_EMOJIS[product.category as ProductCategory] || '📦'}</span>
          <span className="font-black text-sm opacity-20 tracking-tighter uppercase text-center px-4 line-clamp-1">
            {product.brand}
          </span>
        </div>
      )}
      {/* Score Badge */}
      <div className="absolute bottom-2 left-2 z-10">
        <span className={cn(
          "text-[10px] uppercase font-black tracking-widest px-2 py-1 shadow-lg inline-flex items-center gap-1 rounded-sm",
          product.transparencyScore < 4 ? "bg-[#E0005C] text-white" : 
          product.transparencyScore < 7 ? "bg-[#f7ac32] text-[#1c1a17]" : "bg-emerald-500 text-white"
        )}>
          {product.transparencyScore}/10
        </span>
      </div>
      {/* Veg/Non-veg Badge */}
      {product.isVeg !== undefined && (
        <div className="absolute top-2 right-2 z-10">
          <div className={cn(
            "w-5 h-5 border-2 rounded-sm flex items-center justify-center",
            product.isVeg ? "border-emerald-500" : "border-[#E0005C]"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              product.isVeg ? "bg-emerald-500" : "bg-[#E0005C]"
            )} />
          </div>
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────
// Helper: Get brand accent color
// ────────────────────────────────────────────────────────
function getBrandAccent(brand: string): string {
  const colors: Record<string, string> = {
    "Maggi": "#E31837", "Nestle": "#003DA5", "Lay's": "#FFD700", "Bingo": "#FF6600",
    "Kurkure": "#FF8C00", "Haldiram's": "#8B0000", "Parle": "#FFD700", "Britannia": "#1E3A5F",
    "Sunfeast": "#D4001A", "Cadbury": "#4B0082", "Oreo": "#000080", "Coca-Cola": "#E31837",
    "Pepsi": "#004B93", "Thums Up": "#E31837", "Amul": "#FFD700", "Patanjali": "#FF8C00",
    "Fortune": "#003DA5", "Saffola": "#008000", "MDH": "#E31837", "Everest": "#E31837",
    "Kissan": "#E31837", "KitKat": "#E31837", "Frooti": "#FFD700", "Bournvita": "#4B0082",
  };
  return colors[brand] || '#f7ac32';
}

// Category list for chips
const CATEGORIES: { name: ProductCategory; emoji: string }[] = [
  { name: "Instant Noodles", emoji: "🍜" },
  { name: "Chips & Snacks", emoji: "🥔" },
  { name: "Biscuits & Cookies", emoji: "🍪" },
  { name: "Beverages", emoji: "🥤" },
  { name: "Chocolates & Sweets", emoji: "🍫" },
  { name: "Dairy", emoji: "🧈" },
  { name: "Namkeen", emoji: "🥜" },
  { name: "Sauces & Spreads", emoji: "🫙" },
  { name: "Breakfast & Health", emoji: "🥣" },
  { name: "Masala & Spices", emoji: "🌶️" },
  { name: "Atta & Staples", emoji: "🌾" },
  { name: "Cooking Oil", emoji: "🫒" },
];


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RealProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<RealProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<RealProduct | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'methodology'>('home');

  // Load trending products on mount
  useEffect(() => {
    fetch('/api/search?trending=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTrendingProducts(data);
      })
      .catch(console.error);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      if (searchQuery.trim().length === 0 && !activeCategory) {
        setSearchResults([]);
      }
      setIsSearching(false);
      return;
    }

    setActiveCategory(null);
    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSearchResults(data);
          else setSearchResults([]);
          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
          setSearchResults([]);
        });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategory]);

  // Category search
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
    setIsSearching(true);
    fetch(`/api/search?category=${encodeURIComponent(category)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSearchResults(data);
        setIsSearching(false);
      })
      .catch(() => {
        setIsSearching(false);
      });
  };

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const handleProductSelect = (product: RealProduct) => {
    setSelectedProduct(product);
  };

  const navToMethodology = () => {
    setActiveView('methodology');
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navToHome = () => {
    setActiveView('home');
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navToDatabase = () => {
    setActiveView('home');
    setIsMenuOpen(false);
    setTimeout(() => {
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('search-input')?.focus();
    }, 100);
  };

  const hasResults = searchResults.length > 0 || activeCategory;

  return (
    <main className="min-h-screen bg-[#1c1a17] text-[#f4ecd8] font-sans selection:bg-[#E0005C] selection:text-white relative overflow-x-hidden">
      
      {/* Texture Overlays */}
      <div className="grain_texture fixed inset-0 pointer-events-none z-50"></div>
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1c1a17]/90 backdrop-blur-md border-b border-[#f7ac32]/20">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col gap-1.5 z-50 mix-blend-difference text-[#f7ac32] hover:text-white transition-colors cursor-pointer">
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>

          <div 
            className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-[#f7ac32] absolute left-1/2 -translate-x-1/2 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
            onClick={navToHome}
          >
            <Leaf className="w-5 h-5 md:w-6 md:h-6" />
            PurePlate
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navToDatabase()}
              className="px-3 py-1.5 md:px-4 md:py-2 font-bold uppercase tracking-widest cursor-pointer transition-all text-xs md:text-sm bg-[#f7ac32] text-[#1c1a17] hover:bg-white hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", duration: 0.5 }}
            className="fixed inset-0 bg-[#f7ac32] z-30 pt-24 px-6 flex flex-col"
          >
            <div className="text-[2.5rem] md:text-[3rem] font-black uppercase tracking-tighter text-[#1c1a17] flex flex-col gap-2">
              <button onClick={navToHome} className="hover:text-white text-left uppercase transition-colors">Home</button>
              <button onClick={() => navToDatabase()} className="hover:text-white text-left uppercase transition-colors">Database</button>
              <button onClick={navToMethodology} className="hover:text-white text-left uppercase transition-colors">Methodology</button>
            </div>
            <div className="mt-auto pb-12 text-[#1c1a17]/60 font-mono text-sm uppercase tracking-widest">
              <p>120+ Indian Products Indexed</p>
              <p>55+ Chemical Additives Tracked</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-16"></div>

      {activeView === 'methodology' ? (
        <MethodologyView />
      ) : (
        <>
          {/* HERO SECTION */}
          <section className="relative py-16 md:py-24 px-4 md:px-6 min-h-[80vh] flex flex-col items-center justify-center">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#f7ac32] font-mono tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm uppercase mb-4 mt-4 flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                India&apos;s FMCG Transparency Platform
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-[3rem] md:text-[6rem] lg:text-[8rem] leading-[0.85] font-black uppercase tracking-tighter text-[#f4ecd8] mb-6 drop-shadow-2xl"
              >
                decode your<br/>food
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm md:text-base text-[#f4ecd8]/50 font-mono uppercase tracking-wider max-w-lg mb-8"
              >
                Search any Indian packaged product. See what&apos;s really inside.
              </motion.p>
            </motion.div>

            {/* SEARCH BAR */}
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 mt-4" id="search">
              <div className="max-w-2xl mx-auto flex flex-col items-center w-full">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full relative shadow-[0_0_40px_-5px_rgba(247,172,50,0.3)] transition-all focus-within:shadow-[0_0_60px_-5px_rgba(247,172,50,0.5)]"
                >
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Maggi, Lay's, Parle-G, Amul..."
                    className="w-full bg-[#1c1a17] border-2 md:border-4 border-[#f7ac32] text-white px-6 md:px-8 py-4 md:py-5 text-lg md:text-2xl font-black uppercase tracking-widest outline-none focus:bg-[#252320] transition-colors placeholder:text-[#f4ecd8]/20"
                  />
                  <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[#f7ac32]">
                    {isSearching ? <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" /> : <Search className="w-6 h-6 md:w-8 md:h-8" />}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* CATEGORY CHIPS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full max-w-4xl mx-auto mt-6 md:mt-8"
            >
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={cn(
                      "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer border rounded-sm flex items-center gap-1.5 hover:scale-105",
                      activeCategory === cat.name
                        ? "bg-[#f7ac32] text-[#1c1a17] border-[#f7ac32]"
                        : "bg-transparent text-[#f4ecd8]/60 border-[#f4ecd8]/15 hover:border-[#f7ac32]/50 hover:text-[#f7ac32]"
                    )}
                  >
                    <span>{cat.emoji}</span>
                    <span className="hidden sm:inline">{cat.name}</span>
                    <span className="sm:hidden">{cat.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* STATS BAR */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="w-full max-w-4xl mx-auto mt-16 grid grid-cols-3 gap-4 md:gap-8"
            >
              <div className="text-center">
                <AnimatedCounter target={120} suffix="+" />
                <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#f4ecd8]/40 mt-1">Products Indexed</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={55} suffix="+" />
                <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#f4ecd8]/40 mt-1">Chemicals Tracked</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={12} />
                <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#f4ecd8]/40 mt-1">Categories</p>
              </div>
            </motion.div>
          </section>

          {/* TRENDING PRODUCTS SECTION */}
          {!hasResults && trendingProducts.length > 0 && searchQuery.length < 2 && (
            <section className="py-16 px-4 md:px-6 border-t border-[#f7ac32]/10 bg-[#151311]">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#f7ac32]" />
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#f4ecd8]">
                      Trending Products
                    </h2>
                  </div>
                  <button 
                    onClick={() => navToDatabase()}
                    className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#f7ac32] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {trendingProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      onClick={() => handleProductSelect(product)}
                      className="bg-[#1c1a17] border border-[#f7ac32]/10 hover:border-[#f7ac32]/60 cursor-pointer group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(247,172,50,0.1)]"
                    >
                      <ProductImageCard product={product} />
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="text-[10px] font-mono text-[#f7ac32] mb-1 uppercase tracking-wider line-clamp-1">
                          {product.brand}
                        </div>
                        <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-[#f4ecd8] group-hover:text-[#f7ac32] transition-colors leading-tight line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="mt-auto">
                          {product.redFlags.length > 0 ? (
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E0005C] inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {product.redFlags.length} flags
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 inline-flex items-center gap-1">
                              <Leaf className="w-3 h-3" />
                              Clean
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* EDUCATIONAL SECTION */}
          {!hasResults && searchQuery.length < 2 && (
            <section className="py-16 md:py-24 px-4 md:px-6 border-t border-[#f7ac32]/10">
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-[#E0005C] mb-6">
                  The Marketing Illusion
                </h3>
                <p className="text-sm md:text-lg text-[#f4ecd8]/70 max-w-3xl leading-relaxed mb-4">
                  Big FMCG brands spend billions on advertisements painting their products as &ldquo;healthy,&rdquo; &ldquo;natural,&rdquo; and &ldquo;fortified.&rdquo; But behind the colorful packaging, the reality is hidden in micro-text on the back. They replace expensive real food ingredients with cheap chemical substitutes — hyper-processed oils like Palmolein, hidden sugars like Maltodextrin, and synthetic emulsifiers. 
                </p>
                <p className="text-sm md:text-lg text-[#f4ecd8]/70 max-w-3xl leading-relaxed mb-10">
                  <strong className="text-[#f7ac32]">PurePlate strips away the marketing.</strong> We algorithmically parse the raw ingredient list of any Indian product, instantly identifying high-risk INS codes, deceptive sugars, and cheap fillers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full text-left">
                  <div className="bg-[#151311] p-5 md:p-6 border border-[#f7ac32]/15 hover:border-[#f7ac32]/40 transition-colors group">
                    <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-[#E0005C] mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-base md:text-lg font-bold uppercase text-[#f4ecd8] mb-2">Expose INS Codes</h4>
                    <p className="text-xs md:text-sm text-[#f4ecd8]/50">We translate obscure codes like INS 627 or E150c back into plain English, revealing their true health risks.</p>
                  </div>
                  <div className="bg-[#151311] p-5 md:p-6 border border-[#f7ac32]/15 hover:border-[#f7ac32]/40 transition-colors group">
                    <Beaker className="w-8 h-8 md:w-10 md:h-10 text-[#f7ac32] mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-base md:text-lg font-bold uppercase text-[#f4ecd8] mb-2">Uncover Hidden Sugar</h4>
                    <p className="text-xs md:text-sm text-[#f4ecd8]/50">Brands disguise sugar under 50+ aliases. We detect Liquid Glucose, Maltodextrin, and Invert Syrup instantly.</p>
                  </div>
                  <div className="bg-[#151311] p-5 md:p-6 border border-[#f7ac32]/15 hover:border-[#f7ac32]/40 transition-colors group">
                    <BadgeInfo className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-base md:text-lg font-bold uppercase text-[#f4ecd8] mb-2">Zero Corporate Bias</h4>
                    <p className="text-xs md:text-sm text-[#f4ecd8]/50">No sponsored reviews or partnerships. Every product is graded purely on chemical composition.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SEARCH RESULTS SECTION */}
          {(hasResults || searchQuery.length >= 2) && (
            <section className="py-12 md:py-16 px-4 md:px-6 relative border-t border-[#f7ac32]/10 bg-[#151311]">
              <div className="max-w-7xl mx-auto min-h-[300px]">
                
                {/* Active Category Header */}
                {activeCategory && !isSearching && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{CATEGORY_EMOJIS[activeCategory as ProductCategory] || '📦'}</span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-[#f4ecd8]">{activeCategory}</h2>
                    <span className="text-xs font-mono text-[#f4ecd8]/40 uppercase tracking-widest">({searchResults.length} products)</span>
                    <button 
                      onClick={() => { setActiveCategory(null); setSearchResults([]); }}
                      className="ml-auto text-xs font-mono uppercase tracking-widest text-[#f7ac32] hover:text-white cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  </div>
                )}

                {isSearching ? (
                  <div className="py-24 text-center flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-[#f7ac32] animate-spin mb-4" />
                    <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-[#f7ac32]">
                      Searching Database...
                    </h3>
                    <p className="font-mono mt-2 text-[#f4ecd8]/40 uppercase tracking-widest text-xs md:text-sm">Analyzing ingredients & grading transparency</p>
                  </div>
                ) : searchQuery.length > 0 && searchQuery.length < 2 ? (
                  <div className="py-16 text-center text-[#f4ecd8]/30 uppercase font-mono tracking-widest text-sm">
                    Type at least 2 characters to search...
                  </div>
                ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
                  <div className="py-20 text-center">
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#E0005C]/60 mb-3">
                      No Products Found
                    </h3>
                    <p className="font-mono tracking-widest text-[#f4ecd8]/30 uppercase text-xs md:text-sm">
                      Try searching for Maggi, Lay&apos;s, Parle-G, Amul, Kurkure...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {searchResults.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleProductSelect(product)}
                        className="bg-[#1c1a17] border border-[#f7ac32]/10 hover:border-[#f7ac32]/60 cursor-pointer group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(247,172,50,0.1)]"
                      >
                        <ProductImageCard product={product} />
                        <div className="p-3 md:p-4 flex-1 flex flex-col">
                          <div className="text-[10px] font-mono text-[#f7ac32] mb-1 uppercase tracking-wider line-clamp-1">
                            {product.brand}
                            {product.weight && <span className="text-[#f4ecd8]/30 ml-1">· {product.weight}</span>}
                          </div>
                          <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-[#f4ecd8] mb-2 group-hover:text-[#f7ac32] transition-colors leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {product.category && (
                            <div className="mb-2">
                              <span className="text-[9px] uppercase font-mono tracking-widest text-[#f4ecd8]/25 bg-[#f4ecd8]/5 px-1.5 py-0.5 rounded-sm">
                                {product.category}
                              </span>
                            </div>
                          )}
                          
                          <div className="mt-auto">
                            {product.redFlags.length > 0 ? (
                              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E0005C] inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {product.redFlags.length} {product.redFlags.length === 1 ? 'flag' : 'flags'}
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 inline-flex items-center gap-1">
                                <Leaf className="w-3 h-3" />
                                Clean Ingredients
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

              </div>
            </section>
          )}
        </>
      )}

      {/* PRODUCT DETAIL DRAWER */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1c1a17]/80 backdrop-blur-sm flex justify-end"
          >
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedProduct(null)} />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative h-full w-full md:w-[600px] lg:w-[800px] bg-[#1c1a17] border-l-[3px] border-[#f7ac32] shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-y-auto"
            >
              {/* Close Button Header */}
              <div className="sticky top-0 z-20 bg-[#1c1a17]/95 backdrop-blur-md border-b border-[#f7ac32]/30 px-4 py-3 md:p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#f7ac32]" />
                  <span className="text-[#f7ac32] font-black uppercase tracking-widest text-sm md:text-base">Product Report</span>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="w-10 h-10 bg-transparent text-[#f7ac32] border border-[#f7ac32]/50 flex items-center justify-center hover:bg-[#f7ac32] hover:text-[#1c1a17] transition-all cursor-pointer rounded-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto pb-24">
                <div className="p-5 md:p-8 lg:p-10">
                  {/* Product Header */}
                  <div className="flex items-start gap-3 mb-1">
                    <span className="text-[#f7ac32] font-mono tracking-widest uppercase text-xs md:text-sm">
                      {selectedProduct.brand}
                    </span>
                    {selectedProduct.isVeg !== undefined && (
                      <div className={cn(
                        "w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0",
                        selectedProduct.isVeg ? "border-emerald-500" : "border-[#E0005C]"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", selectedProduct.isVeg ? "bg-emerald-500" : "bg-[#E0005C]")} />
                      </div>
                    )}
                  </div>
                  <h2 className="text-[2rem] md:text-[3rem] font-black uppercase tracking-tighter leading-[0.9] mb-3 text-[#f4ecd8]">
                    {selectedProduct.name}
                  </h2>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {selectedProduct.category && (
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#f4ecd8]/40 bg-[#f4ecd8]/5 px-2 py-1 rounded-sm border border-[#f4ecd8]/10">
                        {CATEGORY_EMOJIS[selectedProduct.category as ProductCategory] || '📦'} {selectedProduct.category}
                      </span>
                    )}
                    {selectedProduct.weight && (
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#f4ecd8]/40 bg-[#f4ecd8]/5 px-2 py-1 rounded-sm border border-[#f4ecd8]/10">
                        {selectedProduct.weight}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <p className="text-sm md:text-base text-[#f4ecd8]/60 leading-relaxed mb-8 font-mono">
                      {selectedProduct.description}
                    </p>
                  )}
                  
                  {/* Score Section */}
                  <div className={cn("border p-5 md:p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between rounded-sm", 
                    selectedProduct.transparencyScore < 4 ? "bg-[#E0005C]/5 border-[#E0005C]/20" : 
                    selectedProduct.transparencyScore < 7 ? "bg-[#f7ac32]/5 border-[#f7ac32]/20" : 
                    "bg-emerald-500/5 border-emerald-500/20"
                  )}>
                    <div className="text-center md:text-left">
                      <h3 className="text-sm md:text-base font-bold uppercase tracking-widest text-[#f4ecd8] mb-1">Transparency Index</h3>
                      <p className="font-mono text-xs text-[#f4ecd8]/40 max-w-sm leading-relaxed">
                        Score reflects chemical reliance, greenwashing, and ingredient quality.
                      </p>
                    </div>
                    <div className="text-center md:text-right flex-shrink-0">
                      <div className={cn("text-[4rem] md:text-[5rem] font-black leading-none", 
                        selectedProduct.transparencyScore < 4 ? "text-[#E0005C]" : 
                        selectedProduct.transparencyScore < 7 ? "text-[#f7ac32]" : 
                        "text-emerald-500"
                      )}>
                        {selectedProduct.transparencyScore}<span className="text-xl text-[#f4ecd8]/20">/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Red Flags Section */}
                  {selectedProduct.redFlags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-base md:text-lg font-black uppercase tracking-tighter text-[#E0005C] mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Critical Flags ({selectedProduct.redFlags.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.redFlags.map((flag, idx) => (
                          <div key={idx} className="bg-[#E0005C]/5 border border-[#E0005C]/30 text-[#E0005C] px-3 py-1.5 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-sm">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clean Product Badge */}
                  {selectedProduct.redFlags.length === 0 && selectedProduct.ingredients.length > 0 && (
                    <div className="mb-8 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-sm flex items-center gap-3">
                      <Leaf className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Clean Product</h4>
                        <p className="text-xs text-[#f4ecd8]/40 font-mono mt-0.5">No red flags detected in the ingredient list.</p>
                      </div>
                    </div>
                  )}

                  {/* Ingredient Breakdown */}
                  <div className="border-t border-[#f7ac32]/15 pt-8 mt-4">
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-[#f7ac32] mb-6 flex items-center gap-2">
                      <Beaker className="w-5 h-5" />
                      Complete Ingredient Audit
                    </h3>
                    
                    <div className="bg-[#151311] border border-[#f7ac32]/10 p-3 md:p-5 overflow-x-auto rounded-sm">
                      <DeepDiveTable product={selectedProduct} />
                    </div>
                  </div>
                </div>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="py-12 md:py-16 border-t border-[#f7ac32]/10 bg-[#151311]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-[#f7ac32]" />
                <span className="text-lg font-black uppercase tracking-widest text-[#f7ac32]">PurePlate</span>
              </div>
              <p className="text-xs text-[#f4ecd8]/40 font-mono leading-relaxed uppercase tracking-wider">
                India&apos;s first algorithmic food transparency platform. Decoding ingredient lists so you don&apos;t have to.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f4ecd8]/60 mb-3">Platform</h4>
              <div className="flex flex-col gap-1.5">
                <button onClick={navToHome} className="text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/30 hover:text-[#f7ac32] transition-colors text-left cursor-pointer">Home</button>
                <button onClick={navToDatabase} className="text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/30 hover:text-[#f7ac32] transition-colors text-left cursor-pointer">Database</button>
                <button onClick={navToMethodology} className="text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/30 hover:text-[#f7ac32] transition-colors text-left cursor-pointer">Methodology</button>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f4ecd8]/60 mb-3">Database</h4>
              <div className="flex flex-col gap-1.5 text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/30">
                <span>120+ Indian Products</span>
                <span>55+ Chemical Additives</span>
                <span>12 FMCG Categories</span>
                <span>Real Ingredient Data</span>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-[#f4ecd8]/5 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/20">
              PurePlate &copy; 2026. Built for Data Transparency.
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/20">
              Powered by Algorithmic Intelligence
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
