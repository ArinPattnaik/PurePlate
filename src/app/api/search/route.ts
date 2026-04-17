import { NextResponse } from 'next/server';
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

  // Return local results (instant, reliable)
  const localResults = searchProducts(query);
  return NextResponse.json(localResults.map(p => gradeProduct(p)));
}
