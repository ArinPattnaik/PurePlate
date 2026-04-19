import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

interface INSEntry {
  code: string;
  name: string;
  type: string;
  risk: string;
  description: string;
}

async function getInsDictionary() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ins`, { next: { revalidate: 3600 } });
    const data: INSEntry[] = await res.json();
    const map: Record<string, INSEntry> = {};
    for (const item of data) {
      map[item.code] = item;
    }
    return map;
  } catch (err) {
    console.error("Failed to fetch INS dictionary from backend", err);
    return {};
  }
}

interface Product {
  id?: string;
  name?: string;
  brand?: string;
  category?: string;
  description?: string;
  weight?: string;
  isVeg?: boolean;
  ingredients?: string[] | Record<string, string>;
  imageUrl?: string | null;
}

async function gradeProduct(item: Product, insDictionary: Record<string, INSEntry>) {
  const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : Object.values(item.ingredients || {});
  const allTextToScan = ingredientsList.join(' ').toUpperCase();

  const redFlags = new Set();
  let transparencyScore = 8;

  Object.keys(insDictionary).forEach(code => {
    const justNumbers = code.replace('INS ', '');
    if (
      allTextToScan.includes(code.toUpperCase()) ||
      allTextToScan.includes(justNumbers) ||
      allTextToScan.includes(`E${justNumbers}`) ||
      allTextToScan.includes(`E ${justNumbers}`)
    ) {
      const entry = insDictionary[code];
      if (entry.risk === 'High') {
        redFlags.add(entry.name);
        transparencyScore -= 2;
      } else if (entry.risk === 'Moderate') {
        redFlags.add(entry.name);
        transparencyScore -= 0.5;
      }
    }
  });

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
  const all = searchParams.get('all');

  const insDictionary = await getInsDictionary();

  if (all === 'true') {
    const res = await fetch(`${BACKEND_URL}/api/products`);
    const products = await res.json();
    const gradedProducts = await Promise.all((Array.isArray(products) ? products : []).map(p => gradeProduct(p, insDictionary)));
    return NextResponse.json(gradedProducts);
  }

  if (trending === 'true') {
    // Arbitrary trending list using backend endpoint
    const res = await fetch(`${BACKEND_URL}/api/products`);
    const products = await res.json();
    const trendingList = Array.isArray(products) ? products.slice(0, 10).sort(() => 0.5 - Math.random()) : [];
    const gradedTrending = await Promise.all(trendingList.map(p => gradeProduct(p, insDictionary)));
    return NextResponse.json(gradedTrending);
  }

  if (category) {
    const res = await fetch(`${BACKEND_URL}/api/products`);
    const products = await res.json();
    const filtered = (Array.isArray(products) ? products : []).filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    const gradedFiltered = await Promise.all(filtered.slice(0, 16).map(p => gradeProduct(p, insDictionary)));
    return NextResponse.json(gradedFiltered);
  }

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const res = await fetch(`${BACKEND_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  const products = await res.json();
  const gradedResults = await Promise.all((Array.isArray(products) ? products : []).map(p => gradeProduct(p, insDictionary)));
  return NextResponse.json(gradedResults);
}
