/**
 * seed-all.ts — Reads ALL products from src/lib/indian-products.ts
 * and ALL INS entries from src/lib/real-data.ts (the *originals*, before cleanup)
 * and upserts them into PostgreSQL via Prisma.
 * 
 * Run from backend/ directory:
 *   npx ts-node -e "require('../src/lib/indian-products')" --project tsconfig.json seed-all.ts
 */

import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// SCORING LOGIC
// ─────────────────────────────────────────────
const HIGH_RISK_CODES = ['ins 102','ins 110','ins 122','ins 124','ins 150c','ins 150d','ins 250','ins 320','ins 951'];
const MODERATE_RISK_CODES = ['ins 129','ins 133','ins 143','ins 211','ins 220','ins 223','ins 319','ins 321','ins 338','ins 385','ins 407','ins 444','ins 471','ins 621','ins 627','ins 631','ins 635','ins 950','ins 955'];
const PROBLEMATIC_KEYWORDS = ['palm oil','palmolein','hydrogenated','maltodextrin','liquid glucose','glucose syrup','invert syrup','invert sugar','maida','refined wheat flour','high fructose corn syrup','hydrolyzed vegetable protein','hydrolysed vegetable protein','interesterified'];

function scoreProduct(ingredients: string[]): { score: number; redFlags: string[] } {
  const redFlags: string[] = [];
  let deductions = 0;
  const joined = ingredients.join(' ').toLowerCase();

  for (const code of HIGH_RISK_CODES) {
    if (joined.includes(code)) {
      const label = code.toUpperCase();
      if (!redFlags.includes(label)) { redFlags.push(label); deductions += 2; }
    }
  }
  for (const code of MODERATE_RISK_CODES) {
    if (joined.includes(code)) { deductions += 1; }
  }
  for (const kw of PROBLEMATIC_KEYWORDS) {
    if (joined.includes(kw)) {
      const label = kw.replace(/\b\w/g, c => c.toUpperCase());
      if (!redFlags.includes(label)) { redFlags.push(label); deductions += 1.5; }
    }
  }

  const score = Math.max(1, Math.min(10, Math.round(10 - deductions)));
  return { score, redFlags: redFlags.slice(0, 6) };
}

// ─────────────────────────────────────────────
// PARSE src/lib/indian-products.ts with regex
// extract each product object
// ─────────────────────────────────────────────
interface RawProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  weight: string;
  isVeg: boolean;
  ingredients: string[];
  imageUrl: string | null;
}

function parseProductsFromFile(filePath: string): RawProduct[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const products: RawProduct[] = [];
  
  // Match each { id: "...", ... imageUrl: null, } block
  const blockRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?imageUrl:\s*(null|"[^"]*"),?\s*\}/g;
  let match;
  
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[0];
    
    const id = extractString(block, 'id');
    const name = extractString(block, 'name');
    const brand = extractString(block, 'brand');
    const category = extractString(block, 'category');
    const description = extractString(block, 'description');
    const weight = extractString(block, 'weight');
    const isVegMatch = block.match(/isVeg:\s*(true|false)/);
    const isVeg = isVegMatch ? isVegMatch[1] === 'true' : true;
    const ingredients = extractArray(block, 'ingredients');
    
    if (id && name && brand) {
      products.push({ id, name, brand, category, description, weight, isVeg, ingredients, imageUrl: null });
    }
  }
  
  return products;
}

function extractString(block: string, key: string): string {
  const m = block.match(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1].replace(/\\'/g, "'").replace(/\\"/g, '"') : '';
}

function extractArray(block: string, key: string): string[] {
  const m = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  const inner = m[1];
  const items: string[] = [];
  const itemRegex = /"((?:[^"\\]|\\.)*)"/g;
  let im;
  while ((im = itemRegex.exec(inner)) !== null) {
    items.push(im[1]);
  }
  return items;
}

// ─────────────────────────────────────────────
// INS DICTIONARY (full canonical list)
// ─────────────────────────────────────────────
const INS_DATA = [
  { code: "INS 102", name: "Tartrazine", type: "Synthetic Color (Yellow)", risk: "High", description: "Synthetic lemon yellow azo dye. Linked to hyperactivity in children and allergic reactions. Banned in Austria and Norway." },
  { code: "INS 110", name: "Sunset Yellow FCF", type: "Synthetic Color (Yellow)", risk: "High", description: "Synthetic yellow azo dye linked to hyperactivity in children. Restricted in EU, banned in some Scandinavian countries." },
  { code: "INS 122", name: "Azorubine", type: "Synthetic Color (Red)", risk: "High", description: "Red synthetic dye. Linked to hyperactivity. Banned in USA, Japan, and Norway." },
  { code: "INS 124", name: "Ponceau 4R", type: "Synthetic Color (Red)", risk: "High", description: "Synthetic red azo dye linked to hyperactivity and allergic reactions. Banned in the USA and Norway." },
  { code: "INS 129", name: "Allura Red AC", type: "Synthetic Color (Red)", risk: "Moderate", description: "Synthetic red dye. Studies link it to hyperactivity in children. Requires warning label in the EU." },
  { code: "INS 133", name: "Brilliant Blue FCF", type: "Synthetic Color (Blue)", risk: "Moderate", description: "Blue dye used in sweets and beverages. Some links to allergic reactions." },
  { code: "INS 143", name: "Fast Green FCF", type: "Synthetic Color (Green)", risk: "Moderate", description: "Synthetic green dye. Limited data on long-term safety." },
  { code: "INS 150c", name: "Ammonia Caramel", type: "Synthetic Color (Brown)", risk: "High", description: "Brown coloring. Produced using ammonium compounds. Contains 4-MEI, a potential carcinogen identified by California Prop 65." },
  { code: "INS 150d", name: "Sulphite Ammonia Caramel", type: "Synthetic Color (Brown)", risk: "High", description: "Dark brown color used in colas and sauces. Contains 4-MEI, classified as possibly carcinogenic." },
  { code: "INS 160b", name: "Annatto", type: "Natural Color (Orange)", risk: "Low", description: "Natural plant-based orange-yellow coloring from annatto seeds. Generally considered safe." },
  { code: "INS 160c", name: "Paprika Extract", type: "Natural Color (Red)", risk: "Low", description: "Natural color and flavor extracted from red bell peppers. Safe for consumption." },
  { code: "INS 200", name: "Sorbic Acid", type: "Preservative", risk: "Low", description: "Naturally occurring preservative. Effective against molds and yeasts." },
  { code: "INS 202", name: "Potassium Sorbate", type: "Preservative", risk: "Low", description: "Widely used synthetic preservative. Generally considered safe and effective." },
  { code: "INS 211", name: "Sodium Benzoate", type: "Preservative", risk: "Moderate", description: "Common preservative. When combined with Vitamin C (ascorbic acid), can form benzene, a known carcinogen." },
  { code: "INS 220", name: "Sulphur Dioxide", type: "Preservative", risk: "Moderate", description: "Used in dried fruits and wines. Can trigger severe asthma attacks in sensitive individuals." },
  { code: "INS 223", name: "Sodium Metabisulphite", type: "Dough Conditioner", risk: "Moderate", description: "Bleaching agent and preservative. Can cause allergic reactions in sulphite-sensitive individuals." },
  { code: "INS 234", name: "Nisin", type: "Preservative", risk: "Low", description: "Natural antibiotic peptide produced by bacteria. Used in processed cheese. Generally safe." },
  { code: "INS 250", name: "Sodium Nitrite", type: "Preservative", risk: "High", description: "Used in processed meats. Under high heat, forms nitrosamines, strongly linked to cancer risk." },
  { code: "INS 260", name: "Acetic Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid found in vinegar. Safe for consumption." },
  { code: "INS 270", name: "Lactic Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid produced during fermentation. Safe." },
  { code: "INS 296", name: "Malic Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid found in apples. Safe and commonly used." },
  { code: "INS 300", name: "Ascorbic Acid (Vitamin C)", type: "Antioxidant", risk: "Low", description: "Natural antioxidant identical to Vitamin C. Safe and beneficial." },
  { code: "INS 319", name: "TBHQ (Tert-Butylhydroquinone)", type: "Antioxidant", risk: "Moderate", description: "Synthetic antioxidant to extend shelf life of fats. High doses linked to tumors in lab animals." },
  { code: "INS 320", name: "BHA (Butylated Hydroxyanisole)", type: "Antioxidant", risk: "High", description: "Synthetic antioxidant. Classified as 'reasonably anticipated to be a human carcinogen' by the US NTP." },
  { code: "INS 321", name: "BHT (Butylated Hydroxytoluene)", type: "Antioxidant", risk: "Moderate", description: "Synthetic antioxidant. Some evidence of endocrine disruption at high doses." },
  { code: "INS 322", name: "Lecithins", type: "Emulsifier", risk: "Low", description: "Typically soy or sunflower derived. Helps oil and water combine. Generally safe." },
  { code: "INS 330", name: "Citric Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid from citrus fruits. Ubiquitous food additive. Very safe." },
  { code: "INS 331", name: "Sodium Citrate", type: "Acidity Regulator", risk: "Low", description: "Sodium salt of citric acid. Used as buffering agent. Safe." },
  { code: "INS 338", name: "Phosphoric Acid", type: "Acidity Regulator", risk: "Moderate", description: "Used in colas. Linked to reduced bone mineral density with heavy consumption." },
  { code: "INS 339", name: "Sodium Phosphates", type: "Emulsifying Salt", risk: "Low", description: "Used in processed cheese and meats. Safe in moderate amounts." },
  { code: "INS 385", name: "Calcium Disodium EDTA", type: "Sequestrant", risk: "Moderate", description: "Preserves color and flavor. Chelation agent that binds metals. Some concerns about mineral depletion." },
  { code: "INS 407", name: "Carrageenan", type: "Thickener", risk: "Moderate", description: "Seaweed extract. Some evidence suggests it may cause digestive inflammation and gut damage." },
  { code: "INS 410", name: "Locust Bean Gum", type: "Thickener", risk: "Low", description: "Natural gum from carob seeds. Used as thickener and stabilizer. Safe." },
  { code: "INS 412", name: "Guar Gum", type: "Thickener", risk: "Low", description: "Natural fiber from guar beans. Safe in normal amounts, can cause digestive issues in excess." },
  { code: "INS 415", name: "Xanthan Gum", type: "Thickener", risk: "Low", description: "Microbial polysaccharide. Widely used thickener. Generally safe." },
  { code: "INS 422", name: "Glycerol", type: "Humectant", risk: "Low", description: "Natural humectant. Helps retain moisture. Safe and widely used." },
  { code: "INS 440", name: "Pectins", type: "Gelling Agent", risk: "Low", description: "Natural gelling agent from fruit. Used in jams and jellies. Safe." },
  { code: "INS 442", name: "Ammonium Phosphatides", type: "Emulsifier", risk: "Low", description: "Emulsifier used in chocolate making. Considered safe." },
  { code: "INS 444", name: "Sucrose Acetate Isobutyrate", type: "Stabilizer", risk: "Moderate", description: "Emulsifier/stabilizer used in beverages. Limited safety data for long-term consumption." },
  { code: "INS 450", name: "Diphosphates", type: "Raising Agent", risk: "Low", description: "Leavening agent used in baking. Safe in normal amounts." },
  { code: "INS 451", name: "Triphosphates", type: "Humectant", risk: "Low", description: "Retains moisture. Used in processed foods. Generally safe." },
  { code: "INS 452", name: "Polyphosphates", type: "Emulsifying Salt", risk: "Low", description: "Used in processed cheese. Safe in food quantities." },
  { code: "INS 466", name: "Sodium Carboxymethylcellulose", type: "Thickener", risk: "Low", description: "Cellulose-derived thickener. Used in ice cream and dairy. Generally safe." },
  { code: "INS 471", name: "Mono- and Diglycerides", type: "Emulsifier", risk: "Moderate", description: "Keeps oil and water mixed. May contain trans fats depending on the manufacturing process." },
  { code: "INS 476", name: "Polyglycerol Polyricinoleate", type: "Emulsifier", risk: "Low", description: "Used in chocolate to improve flow. Made from castor oil. Considered safe." },
  { code: "INS 500", name: "Sodium Carbonates", type: "Raising Agent", risk: "Low", description: "Baking soda. Very common leavening agent. Safe." },
  { code: "INS 501", name: "Potassium Carbonates", type: "Raising Agent", risk: "Low", description: "Alkaline salt used in baking. Safe." },
  { code: "INS 503", name: "Ammonium Carbonates", type: "Raising Agent", risk: "Low", description: "Traditional leavening agent. Ammonia evaporates during baking. Safe." },
  { code: "INS 508", name: "Potassium Chloride", type: "Firming Agent", risk: "Low", description: "Salt substitute. Generally safe in food quantities." },
  { code: "INS 551", name: "Silicon Dioxide", type: "Anti-caking Agent", risk: "Low", description: "Fine silica powder that prevents clumping. Safe in food quantities." },
  { code: "INS 621", name: "Monosodium Glutamate (MSG)", type: "Flavor Enhancer", risk: "Moderate", description: "Widely used flavor enhancer. While deemed safe by FDA, can cause headaches or flushing in sensitive individuals." },
  { code: "INS 627", name: "Disodium Guanylate", type: "Flavor Enhancer", risk: "Moderate", description: "Used synergistically with MSG to amplify umami. Can trigger gout in sensitive individuals." },
  { code: "INS 631", name: "Disodium Inosinate", type: "Flavor Enhancer", risk: "Moderate", description: "Used with MSG. Often derived from meat or fish, problematic for strict vegetarians." },
  { code: "INS 635", name: "Disodium 5'-ribonucleotides", type: "Flavor Enhancer", risk: "Moderate", description: "Combination of INS 627 and 631. Used to enhance savory flavors." },
  { code: "INS 900a", name: "Polydimethylsiloxane", type: "Anti-foaming Agent", risk: "Low", description: "Silicone-based anti-foaming agent used in cooking oils. Generally considered safe." },
  { code: "INS 903", name: "Carnauba Wax", type: "Glazing Agent", risk: "Low", description: "Natural plant wax. Used to make candies and fruits shiny. Safe." },
  { code: "INS 904", name: "Shellac", type: "Glazing Agent", risk: "Low", description: "Natural resin secreted by lac bugs. Used to coat candies and pills. Safe but animal-derived." },
  { code: "INS 950", name: "Acesulfame Potassium", type: "Artificial Sweetener", risk: "Moderate", description: "Often used with aspartame. Some animal studies show potential carcinogenicity." },
  { code: "INS 951", name: "Aspartame", type: "Artificial Sweetener", risk: "High", description: "Artificial sweetener classified as 'possibly carcinogenic to humans' (Group 2B) by WHO/IARC in 2023." },
  { code: "INS 955", name: "Sucralose", type: "Artificial Sweetener", risk: "Moderate", description: "Chlorinated sugar. Recent studies suggest it may damage DNA and alter gut microbiome." },
  { code: "INS 1422", name: "Acetylated Distarch Adipate", type: "Modified Starch", risk: "Low", description: "Chemically modified starch used as thickener. Generally considered safe." },
  { code: "INS 1442", name: "Hydroxypropyl Distarch Phosphate", type: "Modified Starch", risk: "Low", description: "Modified starch used as thickener in sauces and dressings. Generally safe." },
];

async function main() {
  console.log('\n🌱 Starting full seed from indian-products.ts...\n');

  // 1. Seed INS dictionary
  console.log(`📚 Seeding ${INS_DATA.length} INS entries...`);
  for (const entry of INS_DATA) {
    await prisma.insEntry.upsert({
      where: { code: entry.code },
      update: { name: entry.name, type: entry.type, risk: entry.risk, description: entry.description },
      create: entry,
    });
  }
  console.log(`✅ INS dictionary done.\n`);

  // 2. Parse products from the source file
  const srcFile = path.resolve(__dirname, '../src/lib/indian-products.ts');
  if (!fs.existsSync(srcFile)) {
    throw new Error(`Cannot find ${srcFile}`);
  }
  
  const products = parseProductsFromFile(srcFile);
  console.log(`🛒 Parsed ${products.length} products from indian-products.ts`);

  // 3. Remove duplicates by id
  const seen = new Set<string>();
  const unique = products.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
  console.log(`   → ${unique.length} unique products after dedup`);

  // 4. Upsert all products
  let count = 0;
  for (const product of unique) {
    if (!product.id || !product.name || !product.brand) continue;
    const { score, redFlags } = scoreProduct(product.ingredients || []);
    try {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          brand: product.brand,
          category: product.category || null,
          description: product.description || null,
          weight: product.weight || null,
          isVeg: product.isVeg ?? null,
          ingredients: product.ingredients || [],
          transparencyScore: score,
          redFlags,
        },
        create: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category || null,
          description: product.description || null,
          weight: product.weight || null,
          isVeg: product.isVeg ?? null,
          ingredients: product.ingredients || [],
          imageUrl: null,
          transparencyScore: score,
          redFlags,
        },
      });
      count++;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠ Skipped ${product.id}: ${errorMessage}`);
    }
  }

  console.log(`\n✅ Seeded ${count} products into PostgreSQL.`);
  console.log(`🎉 Full seed complete! ${count} products + ${INS_DATA.length} INS entries in DB.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
