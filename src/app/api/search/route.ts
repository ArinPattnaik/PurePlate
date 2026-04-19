import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface INSEntry {
  code: string;
  name: string;
  type: string;
  risk: string;
  description: string;
}

interface ProductInput {
  id?: string;
  name?: string;
  brand?: string;
  category?: string;
  description?: string;
  weight?: string;
  isVeg?: boolean | null;
  ingredients?: string[] | Record<string, string>;
  imageUrl?: string | null;
  transparencyScore?: number | null;
  redFlags?: string[];
}

async function getInsDictionary() {
  try {
    const entries = await prisma.insEntry.findMany();
    const map: Record<string, INSEntry> = {};
    entries.forEach(item => {
      map[item.code] = item;
    });
    return map;
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("DATABASE ERROR [getInsDictionary]:", error.message);
    return {};
  }
}

async function gradeProduct(item: ProductInput, insDictionary: Record<string, INSEntry>) {
  const ingredientsList = Array.isArray(item.ingredients) 
    ? item.ingredients 
    : Object.values(item.ingredients || {});
  
  const allTextToScan = ingredientsList.join(' ').toUpperCase();

  const redFlags = new Set<string>();
  
  // If the product already has results from DB, we trust them but can re-verify
  // For the sake of this migration, we'll primarily use the DB data if available
  if (item.transparencyScore && item.redFlags) {
    return {
      ...item,
      ingredients: ingredientsList,
      transparencyScore: item.transparencyScore,
      redFlags: item.redFlags,
    };
  }

  // Fallback grading logic (same as legacy)
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

  // Basic flags
  if (allTextToScan.includes('PALM OIL') || allTextToScan.includes('PALMOLEIN')) {
    redFlags.add('Palm Oil / Palmolein');
    transparencyScore -= 1;
  }
  if (allTextToScan.includes('MAIDA') || allTextToScan.includes('REFINED WHEAT FLOUR')) {
    redFlags.add('Refined Flour (Maida)');
    transparencyScore -= 1;
  }

  transparencyScore = Math.max(1, Math.min(10, Math.round(transparencyScore)));

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

  // Handle "All" or "Trending" (just returning list from DB)
  if (all === 'true' || trending === 'true') {
    const products = await prisma.product.findMany({
      take: all === 'true' ? 100 : 10,
      orderBy: { createdAt: 'desc' }
    });
    const graded = await Promise.all(products.map(p => gradeProduct(p as ProductInput, insDictionary)));
    return NextResponse.json(graded);
  }

  // Handle Category search
  if (category) {
    const products = await prisma.product.findMany({
      where: {
        category: { equals: category, mode: 'insensitive' }
      },
      take: 20
    });
    const graded = await Promise.all(products.map(p => gradeProduct(p as ProductInput, insDictionary)));
    return NextResponse.json(graded);
  }

  // Handle Query search
  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 20
  });

  const gradedResults = await Promise.all(products.map(p => gradeProduct(p as ProductInput, insDictionary)));
  return NextResponse.json(gradedResults);
}
