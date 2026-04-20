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

// ─── Scoring Engine v2 (mirrors backend/scoring.ts) ───

const HIGH_RISK_CODES = [
  'ins 102','ins 110','ins 122','ins 124',
  'ins 150c','ins 150d','ins 250','ins 320','ins 951',
];
const MODERATE_RISK_CODES = [
  'ins 129','ins 133','ins 143','ins 211','ins 220','ins 223',
  'ins 319','ins 321','ins 338','ins 385','ins 407','ins 444',
  'ins 471','ins 621','ins 627','ins 631','ins 635','ins 950','ins 955',
];
const INGREDIENT_CHECKS: [string, number, string][] = [
  ['hydrogenated', 2.0, 'Hydrogenated Fat (Trans Fat)'],
  ['interesterified', 1.5, 'Interesterified Fat'],
  ['high fructose corn syrup', 1.5, 'High Fructose Corn Syrup'],
  ['palm oil', 1.0, 'Palm Oil'],
  ['palmolein', 1.0, 'Palmolein'],
  ['maltodextrin', 0.8, 'Maltodextrin'],
  ['liquid glucose', 0.8, 'Liquid Glucose'],
  ['glucose syrup', 0.8, 'Glucose Syrup'],
  ['invert syrup', 0.5, 'Invert Syrup'],
  ['invert sugar', 0.5, 'Invert Sugar'],
  ['refined wheat flour', 0.8, 'Refined Flour (Maida)'],
  ['maida', 0.8, 'Refined Flour (Maida)'],
  ['hydrolyzed vegetable protein', 1.0, 'Hydrolyzed Vegetable Protein'],
  ['hydrolysed vegetable protein', 1.0, 'Hydrolyzed Vegetable Protein'],
  ['artificial flavoring', 0.3, 'Artificial Flavoring'],
  ['artificial flavour', 0.3, 'Artificial Flavoring'],
  ['synthetic food color', 0.5, 'Synthetic Colors'],
];
const VAGUE_LABELS = [
  'nature identical', 'contains added flavors', 'contains added flavours',
  'permitted class ii', 'permitted synthetic', 'permitted natural color',
  'permitted food color', 'contains permitted', 'added flavors', 'added flavours',
  'natural flavoring substances',
];
const SUGAR_ALIASES = [
  'sugar','sucrose','dextrose','fructose','liquid glucose','glucose syrup',
  'glucose','maltodextrin','invert syrup','invert sugar','high fructose corn syrup',
  'corn syrup','honey powder','brown rice syrup','agave','jaggery',
];

function scoreProductV2(ingredients: string[], category?: string | null): { score: number; redFlags: string[] } {
  const redFlags: string[] = [];
  let deductions = 0;
  const joined = ingredients.join(' ').toLowerCase();

  // 1. HIGH RISK INS codes
  for (const code of HIGH_RISK_CODES) {
    if (joined.includes(code)) { redFlags.push(code.toUpperCase()); deductions += 2; }
  }
  // 2. MODERATE RISK INS codes
  for (const code of MODERATE_RISK_CODES) {
    if (joined.includes(code)) { deductions += 0.7; }
  }
  // 3. Problematic ingredients
  const seen = new Set<string>();
  for (const [kw, pen, label] of INGREDIENT_CHECKS) {
    if (joined.includes(kw)) { if (!seen.has(label)) { seen.add(label); redFlags.push(label); } deductions += pen; }
  }
  // 4. Sugar position
  const top3 = ingredients.slice(0, 3).map(i => i.toLowerCase());
  let sugarPos = -1;
  for (let i = 0; i < top3.length; i++) {
    for (const alias of SUGAR_ALIASES) {
      if (top3[i] === alias || top3[i].startsWith(alias + ' ') || top3[i].startsWith(alias + ',')) { sugarPos = i; break; }
    }
    if (sugarPos >= 0) break;
  }
  if (sugarPos === 0) { deductions += 2.0; redFlags.push('Sugar is #1 Ingredient'); }
  else if (sugarPos === 1) { deductions += 1.5; redFlags.push('High Sugar (Top 2)'); }
  else if (sugarPos === 2) { deductions += 1.0; redFlags.push('High Sugar (Top 3)'); }

  // 5. Vague labeling
  let vagueCount = 0;
  for (const p of VAGUE_LABELS) { if (joined.includes(p)) vagueCount++; }
  if (vagueCount > 0) { deductions += Math.min(vagueCount * 0.5, 1.5); redFlags.push('Vague Labeling'); }

  // 6. Category-aware
  const cat = (category || '').toLowerCase();
  if (cat === 'beverages') {
    const hasAddedSugar = joined.includes('sugar') || joined.includes('glucose') || joined.includes('sucrose');
    const is100Juice = ingredients.length <= 2 && joined.includes('juice');
    if (hasAddedSugar && !is100Juice) deductions += 0.5;
    const fruitMatch = joined.match(/(?:pulp|juice|fruit)[^)]*?\((\d+)%\)/);
    if (fruitMatch) { const pct = parseInt(fruitMatch[1], 10); if (pct < 25) { deductions += 1.0; redFlags.push(`Low Fruit Content (${pct}%)`); } }
  }
  if (cat === 'ice cream' && ingredients.length > 0 && ingredients[0].toLowerCase().startsWith('water')) {
    deductions += 1.0; redFlags.push('Frozen Dessert (Not Real Ice Cream)');
  }

  // 7. Ingredient count
  if (ingredients.length >= 20) deductions += 1.0;
  else if (ingredients.length >= 15) deductions += 0.5;

  // 8. Clean bonus
  if (ingredients.length <= 3 && deductions === 0) deductions = -1;

  return { score: Math.max(1, Math.min(10, Math.round(10 - deductions))), redFlags: redFlags.slice(0, 8) };
}

async function gradeProduct(item: ProductInput, insDictionary: Record<string, INSEntry>) {
  const ingredientsList = Array.isArray(item.ingredients) 
    ? item.ingredients 
    : Object.values(item.ingredients || {});

  // If the product already has scores from DB, trust them (they were computed by the same v2 engine)
  if (item.transparencyScore != null && item.redFlags && item.redFlags.length >= 0) {
    return {
      ...item,
      ingredients: ingredientsList,
      transparencyScore: item.transparencyScore,
      redFlags: item.redFlags,
    };
  }

  // Fallback: score on the fly using v2 engine
  const { score, redFlags } = scoreProductV2(ingredientsList, item.category);

  // Also check INS dictionary from DB for any codes the static list might miss
  const allText = ingredientsList.join(' ').toUpperCase();
  Object.keys(insDictionary).forEach(code => {
    const justNumbers = code.replace('INS ', '');
    if (
      allText.includes(code.toUpperCase()) ||
      allText.includes(justNumbers) ||
      allText.includes(`E${justNumbers}`)
    ) {
      const entry = insDictionary[code];
      if (entry.risk === 'High' && !redFlags.includes(entry.name)) {
        redFlags.push(entry.name);
      }
    }
  });

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
    transparencyScore: score,
    redFlags: redFlags.slice(0, 8),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const trending = searchParams.get('trending');
  const all = searchParams.get('all');

  const insDictionary = await getInsDictionary();

  // Handle "All" or "Trending"
  if (all === 'true' || trending === 'true') {
    const products = await prisma.product.findMany({
      take: all === 'true' ? 200 : 12,
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
      take: 50
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
    take: 40
  });

  const gradedResults = await Promise.all(products.map(p => gradeProduct(p as ProductInput, insDictionary)));
  return NextResponse.json(gradedResults);
}
