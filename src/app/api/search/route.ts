import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { INS_DICTIONARY, RealProduct } from '@/lib/real-data';
import { searchProducts } from '@/lib/indian-products';

// Convert an IndianProduct to a fully graded RealProduct
function gradeProduct(item: { id: string; name: string; brand: string; category?: string; description?: string; weight?: string; isVeg?: boolean; ingredients: string[]; imageUrl?: string | null }): RealProduct {
  const ingredientsList: string[] = Array.isArray(item.ingredients) ? item.ingredients : Object.values(item.ingredients || {});
  const allTextToScan = ingredientsList.join(' ').toUpperCase();

  const redFlags = new Set<string>();
  let transparencyScore = 8;

  // Check all INS codes in dictionary
  Object.keys(INS_DICTIONARY).forEach(code => {
    const justNumbers = code.replace('INS ', '');
    if (
      allTextToScan.includes(code.toUpperCase()) ||
      allTextToScan.includes(justNumbers) ||
      allTextToScan.includes(`E${justNumbers}`) ||
      allTextToScan.includes(`E ${justNumbers}`)
    ) {
      const entry = INS_DICTIONARY[code];
      if (entry.risk === 'High') {
        redFlags.add(entry.name);
        transparencyScore -= 2;
      } else if (entry.risk === 'Moderate') {
        redFlags.add(entry.name);
        transparencyScore -= 0.5;
      }
    }
  });

  // Common stealth chemicals
  if (allTextToScan.includes('PALM OIL') || allTextToScan.includes('PALMOLEIN')) {
    redFlags.add('Palm Oil / Palmolein');
    transparencyScore -= 1;
  }
  if (allTextToScan.includes('HYDROGENATED')) {
    redFlags.add('Hydrogenated Fat (Trans Fat Risk)');
    transparencyScore -= 1.5;
  }
  if (allTextToScan.includes('MALTODEXTRIN') || allTextToScan.includes('LIQUID GLUCOSE') || allTextToScan.includes('INVERT SUGAR') || allTextToScan.includes('INVERT SYRUP') || allTextToScan.includes('GLUCOSE SYRUP') || allTextToScan.includes('HIGH FRUCTOSE')) {
    redFlags.add('Hidden Sugars');
    transparencyScore -= 1;
  }
  if (allTextToScan.includes('MAIDA') || allTextToScan.includes('REFINED WHEAT FLOUR') || allTextToScan.includes('REFINED FLOUR')) {
    redFlags.add('Refined Flour (Maida)');
    transparencyScore -= 1;
  }
  if (allTextToScan.includes('ARTIFICIAL FLAVORING') || allTextToScan.includes('ARTIFICIAL FLAVOUR') || allTextToScan.includes('NATURE IDENTICAL')) {
    redFlags.add('Artificial/Synthetic Flavoring');
    transparencyScore -= 0.5;
  }
  if (allTextToScan.includes('SYNTHETIC COLOR') || allTextToScan.includes('SYNTHETIC FOOD COLOR') || allTextToScan.includes('PERMITTED SYNTHETIC')) {
    redFlags.add('Synthetic Colors (Unspecified)');
    transparencyScore -= 1;
  }

  transparencyScore = Math.max(1, Math.min(10, Math.round(transparencyScore)));

  if (ingredientsList.length === 0) {
    transparencyScore = 1;
    redFlags.add('No Ingredients Data Found');
  }

  // Boost score for clean products
  if (redFlags.size === 0 && ingredientsList.length > 0) {
    transparencyScore = Math.min(10, transparencyScore + 1);
  }

  return {
    id: item.id || Math.random().toString(36).substring(7),
    name: item.name || 'Unknown Product',
    brand: item.brand || 'Unknown',
    category: item.category,
    description: item.description,
    weight: item.weight,
    isVeg: item.isVeg,
    imageUrl: item.imageUrl || null,
    ingredients: ingredientsList,
    transparencyScore,
    redFlags: Array.from(redFlags),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const trending = searchParams.get('trending');

  // Trending products endpoint
  if (trending === 'true') {
    const { getTrendingProducts } = await import('@/lib/indian-products');
    const trendingProducts = getTrendingProducts();
    return NextResponse.json(trendingProducts.map(p => gradeProduct(p)));
  }

  // Category filter endpoint
  if (category) {
    const { INDIAN_PRODUCTS } = await import('@/lib/indian-products');
    const filtered = INDIAN_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return NextResponse.json(filtered.slice(0, 16).map(p => gradeProduct(p)));
  }

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  // STEP 1: Search local database first (instant, reliable)
  const localResults = searchProducts(query);
  
  // If we got enough local results, return immediately
  if (localResults.length >= 6) {
    return NextResponse.json(localResults.map(p => gradeProduct(p)));
  }

  // STEP 2: If local results are sparse, try Gemini to augment
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY || localResults.length >= 4) {
    // Return local results if no API key or enough results
    return NextResponse.json(localResults.map(p => gradeProduct(p)));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const existingNames = localResults.map(p => p.name).join(', ');
    
    const prompt = `You are a strict product database API for the Indian FMCG market.
The user searched for: "${query}".
We already have these products: ${existingNames || 'none'}.
Find ${8 - localResults.length} MORE real-world packaged products (specific variants) available in INDIA that match this search.
Focus exclusively on brands available in Indian stores like Big Bazaar, D-Mart, Blinkit, Zepto, BigBasket.
Return EXACTLY a raw JSON array. Do not include markdown code blocks.
JSON Schema:
[
  {
    "id": "unique-slug-string",
    "name": "Full Product Name (e.g. 'Classic Salted Chips 52g')",
    "brand": "Brand Name",
    "category": "Category (e.g. Chips & Snacks, Beverages, Biscuits & Cookies)",
    "description": "One line description of the product",
    "weight": "Weight/Volume (e.g. 52g, 500ml)",
    "isVeg": true,
    "ingredients": ["Real Ingredient 1", "Real Ingredient 2", "INS 627", "Refined Wheat Flour (Maida)"]
  }
]
IMPORTANT: Provide REAL ingredients from actual product labels. Return ONLY valid JSON array.`;

    let rawText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      rawText = ((response as { text?: string }).text ?? '').trim().replace(/```json/g, '').replace(/```/g, '').trim();
    } catch {
      // API failed, return local results only
      return NextResponse.json(localResults.map(p => gradeProduct(p)));
    }

    let aiProducts: Array<{ id?: string; name?: string; brand?: string; category?: string; description?: string; weight?: string; isVeg?: boolean; ingredients?: string[] }>;
    try {
      aiProducts = JSON.parse(rawText);
    } catch {
      return NextResponse.json(localResults.map(p => gradeProduct(p)));
    }

    // Merge: local results first, then AI results
    const allGraded = [
      ...localResults.map(p => gradeProduct(p)),
      ...aiProducts.map((item) => gradeProduct({
        id: item.id || `ai-${Math.random().toString(36).substring(7)}`,
        name: item.name || 'Unknown',
        brand: item.brand || 'Unknown',
        category: item.category,
        description: item.description,
        weight: item.weight,
        isVeg: item.isVeg !== false,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        imageUrl: null,
      })),
    ];

    // Deduplicate by name
    const seen = new Set<string>();
    const deduped = allGraded.filter(p => {
      const key = p.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(deduped.slice(0, 16));
  } catch (error: unknown) {
    console.error('Search API Error:', error);
    // Even on error, return local results
    if (localResults.length > 0) {
      return NextResponse.json(localResults.map(p => gradeProduct(p)));
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Search failed', message }, { status: 500 });
  }
}
