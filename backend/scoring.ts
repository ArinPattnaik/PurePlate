/**
 * PurePlate Scoring Engine v2
 * 
 * Scores products on a 1-10 scale based on:
 * 1. Chemical additives (INS codes)
 * 2. Problematic base ingredients (palm oil, maida, etc.)
 * 3. Sugar position in ingredient list (higher = more sugar)
 * 4. Vague/obfuscated labeling
 * 5. Category-aware penalties (sugary drinks, ultra-processed snacks)
 * 6. Ingredient count (more ingredients = more processed)
 * 7. Low real-ingredient percentage detection
 */

// ─── INS CODE RISK SETS ───
const HIGH_RISK_CODES = [
  'ins 102','ins 110','ins 122','ins 124',
  'ins 150c','ins 150d','ins 250','ins 320','ins 951',
];
const MODERATE_RISK_CODES = [
  'ins 129','ins 133','ins 143','ins 211','ins 220','ins 223',
  'ins 319','ins 321','ins 338','ins 385','ins 407','ins 444',
  'ins 471','ins 621','ins 627','ins 631','ins 635','ins 950','ins 955',
];

// ─── PROBLEMATIC INGREDIENT CHECKS ───
// [keyword, penalty, red-flag label]
const INGREDIENT_CHECKS: [string, number, string][] = [
  ['hydrogenated',              2.0, 'Hydrogenated Fat (Trans Fat)'],
  ['interesterified',           1.5, 'Interesterified Fat'],
  ['high fructose corn syrup',  1.5, 'High Fructose Corn Syrup'],
  ['palm oil',                  1.0, 'Palm Oil'],
  ['palmolein',                 1.0, 'Palmolein'],
  ['maltodextrin',              0.8, 'Maltodextrin'],
  ['liquid glucose',            0.8, 'Liquid Glucose'],
  ['glucose syrup',             0.8, 'Glucose Syrup'],
  ['invert syrup',              0.5, 'Invert Syrup'],
  ['invert sugar',              0.5, 'Invert Sugar'],
  ['refined wheat flour',       0.8, 'Refined Flour (Maida)'],
  ['maida',                     0.8, 'Refined Flour (Maida)'],
  ['hydrolyzed vegetable protein',  1.0, 'Hydrolyzed Vegetable Protein'],
  ['hydrolysed vegetable protein',  1.0, 'Hydrolyzed Vegetable Protein'],
  ['artificial flavoring',      0.3, 'Artificial Flavoring'],
  ['artificial flavour',        0.3, 'Artificial Flavoring'],
  ['synthetic food color',      0.5, 'Synthetic Colors'],
];

// ─── VAGUE LABELING PATTERNS ───
// Brands use these to hide what's actually inside
const VAGUE_LABELS = [
  'nature identical',
  'contains added flavors',
  'contains added flavours',
  'permitted class ii',
  'permitted synthetic',
  'permitted natural color',
  'permitted food color',
  'contains permitted',
  'added flavors',
  'added flavours',
  'natural flavoring substances',
];

// ─── SUGAR ALIASES ───
// All the ways brands disguise sugar
const SUGAR_ALIASES = [
  'sugar', 'sucrose', 'dextrose', 'fructose',
  'liquid glucose', 'glucose syrup', 'glucose',
  'maltodextrin', 'invert syrup', 'invert sugar',
  'high fructose corn syrup', 'corn syrup',
  'honey powder', 'brown rice syrup', 'agave',
  'jaggery',
];

// ─── CATEGORIES THAT ARE INHERENTLY SUGARY ───
const SUGARY_CATEGORIES = [
  'beverages', 'chocolates & sweets', 'ice cream',
];

export function scoreProduct(
  ingredients: string[],
  category?: string | null,
): { score: number; redFlags: string[] } {
  const redFlags: string[] = [];
  let deductions = 0;
  const joined = ingredients.join(' ').toLowerCase();

  // ────────────────────────────────────────
  // 1. HIGH RISK INS codes (−2.0 each)
  // ────────────────────────────────────────
  for (const code of HIGH_RISK_CODES) {
    if (joined.includes(code)) {
      redFlags.push(code.toUpperCase());
      deductions += 2;
    }
  }

  // ────────────────────────────────────────
  // 2. MODERATE RISK INS codes (−0.7 each)
  // ────────────────────────────────────────
  for (const code of MODERATE_RISK_CODES) {
    if (joined.includes(code)) {
      deductions += 0.7;
    }
  }

  // ────────────────────────────────────────
  // 3. PROBLEMATIC BASE INGREDIENTS
  // ────────────────────────────────────────
  const seenLabels = new Set<string>();
  for (const [keyword, penalty, label] of INGREDIENT_CHECKS) {
    if (joined.includes(keyword)) {
      if (!seenLabels.has(label)) {
        seenLabels.add(label);
        redFlags.push(label);
      }
      deductions += penalty;
    }
  }

  // ────────────────────────────────────────
  // 4. SUGAR POSITION PENALTY
  //    If sugar (or alias) is in the top 3 ingredients,
  //    it means sugar is a primary component.
  //    Top 1 = −2.0, Top 2 = −1.5, Top 3 = −1.0
  // ────────────────────────────────────────
  const top3 = ingredients.slice(0, 3).map(i => i.toLowerCase());
  let sugarPosition = -1;
  for (let i = 0; i < top3.length; i++) {
    for (const alias of SUGAR_ALIASES) {
      // Check if the ingredient IS sugar (not just contains the word in a longer name)
      // e.g. "Sugar" or "Liquid Glucose" but not "Sugar-free"
      if (top3[i] === alias || top3[i].startsWith(alias + ' ') || top3[i].startsWith(alias + ',')) {
        sugarPosition = i;
        break;
      }
    }
    if (sugarPosition >= 0) break;
  }

  if (sugarPosition === 0) {
    deductions += 2.0;
    if (!redFlags.includes('Sugar is #1 Ingredient')) redFlags.push('Sugar is #1 Ingredient');
  } else if (sugarPosition === 1) {
    deductions += 1.5;
    if (!redFlags.includes('High Sugar (Top 2)')) redFlags.push('High Sugar (Top 2)');
  } else if (sugarPosition === 2) {
    deductions += 1.0;
    if (!redFlags.includes('High Sugar (Top 3)')) redFlags.push('High Sugar (Top 3)');
  }

  // ────────────────────────────────────────
  // 5. VAGUE / OBFUSCATED LABELING (−0.5 each, max −1.5)
  // ────────────────────────────────────────
  let vagueCount = 0;
  for (const pattern of VAGUE_LABELS) {
    if (joined.includes(pattern)) {
      vagueCount++;
    }
  }
  if (vagueCount > 0) {
    const vaguePenalty = Math.min(vagueCount * 0.5, 1.5);
    deductions += vaguePenalty;
    redFlags.push('Vague Labeling');
  }

  // ────────────────────────────────────────
  // 6. CATEGORY-AWARE PENALTIES
  //    Sugary drinks / frozen desserts that are mostly
  //    water + sugar should never score 10.
  // ────────────────────────────────────────
  const cat = (category || '').toLowerCase();

  // 6a. Beverages: if it contains sugar but is NOT 100% juice, penalize
  if (cat === 'beverages') {
    const hasAddedSugar = joined.includes('sugar') || joined.includes('glucose') || joined.includes('sucrose');
    const is100Juice = ingredients.length <= 2 && (joined.includes('juice (100%)') || joined.includes('juice'));
    if (hasAddedSugar && !is100Juice) {
      deductions += 0.5; // Sugary drink penalty
    }
    // Check for low fruit content: "pulp (XX%)" where XX < 25
    const fruitMatch = joined.match(/(?:pulp|juice|fruit)[^)]*?\((\d+)%\)/);
    if (fruitMatch) {
      const pct = parseInt(fruitMatch[1], 10);
      if (pct < 25) {
        deductions += 1.0;
        if (!redFlags.includes(`Low Fruit Content (${pct}%)`)) {
          redFlags.push(`Low Fruit Content (${pct}%)`);
        }
      }
    }
  }

  // 6b. Ice Cream: "Frozen Dessert" (vegetable fat based) vs real ice cream (milk based)
  if (cat === 'ice cream') {
    // If first ingredient is Water (not Milk), it's a frozen dessert, not real ice cream
    if (ingredients.length > 0 && ingredients[0].toLowerCase().startsWith('water')) {
      deductions += 1.0;
      redFlags.push('Frozen Dessert (Not Real Ice Cream)');
    }
  }

  // ────────────────────────────────────────
  // 7. INGREDIENT COUNT PENALTY
  //    More ingredients = more processed.
  //    15+ ingredients = −0.5, 20+ = −1.0
  // ────────────────────────────────────────
  if (ingredients.length >= 20) {
    deductions += 1.0;
  } else if (ingredients.length >= 15) {
    deductions += 0.5;
  }

  // ────────────────────────────────────────
  // 8. CLEAN PRODUCT BONUS
  //    Very few ingredients, all natural = boost
  // ────────────────────────────────────────
  if (ingredients.length <= 3 && deductions === 0) {
    deductions = -1; // Boost to 10+, clamped to 10
  }

  // ────────────────────────────────────────
  // FINAL SCORE
  // ────────────────────────────────────────
  const score = Math.max(1, Math.min(10, Math.round(10 - deductions)));
  return { score, redFlags: redFlags.slice(0, 8) };
}
