# PurePlate — India's Food Transparency Platform

<p align="center">
  <strong>🍃 Decode the truth behind Indian packaged food</strong>
</p>

PurePlate is an algorithmic food transparency platform that analyzes the ingredients of Indian FMCG products. It parses ingredient lists, identifies hidden chemicals, INS food additive codes, deceptive sugars, and cheap fillers — exposing what's really inside your food.

## Features

- **120+ Indian Products** — Comprehensive database covering Maggi, Lay's, Parle-G, Amul, Cadbury, Haldiram's, and many more
- **55+ Chemical Additives Tracked** — Full INS code dictionary with risk assessments
- **12 FMCG Categories** — Instant Noodles, Chips & Snacks, Biscuits, Beverages, Dairy, Chocolates, and more
- **Instant Search** — Local-first search with AI augmentation for products not in the database
- **Transparency Score** — Algorithmic grading (1-10) based on chemical load, greenwashing, and ingredient quality
- **Complete Ingredient Audit** — Flagged vs clean ingredients with INS code identification and risk descriptions
- **Category Browsing** — Browse products by category with clickable chips
- **Trending Products** — 8 curated popular products shown on the homepage

## Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Augmentation**: Google Gemini 2.5 Flash
- **Image Fallback**: Open Food Facts API + Branded SVG Placeholders

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Environment Variables

Create a `.env.local` file:

```env
# Google Gemini API key (optional - local database works without it)
GEMINI_API_KEY=your_key_here
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── search/route.ts    # Search API (local-first + AI)
│   │   └── image/route.ts     # Image API (Open Food Facts + placeholders)
│   ├── globals.css             # Global styles & utilities
│   ├── layout.tsx              # Root layout with SEO
│   └── page.tsx                # Main page (home, search, drawer)
├── components/
│   ├── AnimatedText.tsx        # Word-by-word text animation
│   ├── DeepDiveTable.tsx       # Ingredient audit table
│   ├── HeroAnimation.tsx       # Hero shield animation
│   ├── IngredientPill.tsx      # INS code pill with tooltip
│   ├── MethodologyView.tsx     # Methodology page view
│   └── ProductCard.tsx         # Product display card
├── constants/
│   └── ins-dictionary.ts       # INS additive codes
└── lib/
    ├── indian-products.ts       # 120+ product database
    ├── real-data.ts             # Types & expanded INS dictionary
    └── utils.ts                 # Utility functions
```

## How It Works

1. **Search** — Type a product name, brand, or category
2. **Local-First** — Instant results from our 120+ product database
3. **AI Augmentation** — Gemini fills gaps for products not in the database
4. **Transparency Grading** — Every product gets algorithmically scored based on:
   - INS code risk levels (High/Moderate/Low)
   - Hidden sugars (Maltodextrin, Liquid Glucose, Invert Syrup)
   - Refined flour (Maida) usage
   - Palm oil / Palmolein content
   - Hydrogenated fats (trans fat risk)
   - Artificial colorings and flavorings
5. **Ingredient Audit** — Full breakdown with flagged vs clean ingredients

## License

MIT

---

<p align="center">
  <em>Built for Data Transparency. Powered by Algorithmic Intelligence.</em>
</p>
