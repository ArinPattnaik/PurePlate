export type RiskLevel = "High" | "Moderate" | "Low";

export interface INSEntry {
  name: string;
  type: string;
  risk: RiskLevel;
  description: string;
}

// Comprehensive INS Dictionary — 50+ codes commonly found in Indian FMCG
export const INS_DICTIONARY: Record<string, INSEntry> = {
  // ---- COLORS ----
  "INS 102": { name: "Tartrazine", type: "Synthetic Color (Yellow)", risk: "High", description: "Synthetic lemon yellow azo dye. Linked to hyperactivity in children and allergic reactions. Banned in Austria and Norway." },
  "INS 110": { name: "Sunset Yellow FCF", type: "Synthetic Color (Yellow)", risk: "High", description: "Synthetic yellow azo dye linked to hyperactivity in children. Restricted in EU, banned in some Scandinavian countries." },
  "INS 124": { name: "Ponceau 4R", type: "Synthetic Color (Red)", risk: "High", description: "Synthetic red azo dye linked to hyperactivity and allergic reactions. Banned in the USA and Norway." },
  "INS 129": { name: "Allura Red AC", type: "Synthetic Color (Red)", risk: "Moderate", description: "Synthetic red dye. Studies link it to hyperactivity in children. Requires warning label in the EU." },
  "INS 133": { name: "Brilliant Blue FCF", type: "Synthetic Color (Blue)", risk: "Moderate", description: "Blue dye used in sweets and beverages. Some links to allergic reactions." },
  "INS 143": { name: "Fast Green FCF", type: "Synthetic Color (Green)", risk: "Moderate", description: "Synthetic green dye. Limited data on long-term safety." },
  "INS 150c": { name: "Ammonia Caramel", type: "Synthetic Color (Brown)", risk: "High", description: "Brown coloring. Produced using ammonium compounds. Contains 4-MEI, a potential carcinogen identified by California Prop 65." },
  "INS 150d": { name: "Sulphite Ammonia Caramel", type: "Synthetic Color (Brown)", risk: "High", description: "Dark brown color used in colas and sauces. Contains 4-MEI, classified as possibly carcinogenic." },
  "INS 160b": { name: "Annatto", type: "Natural Color (Orange)", risk: "Low", description: "Natural plant-based orange-yellow coloring from annatto seeds. Generally considered safe." },
  "INS 160c": { name: "Paprika Extract", type: "Natural Color (Red)", risk: "Low", description: "Natural color and flavor extracted from red bell peppers. Safe for consumption." },

  // ---- PRESERVATIVES ----
  "INS 200": { name: "Sorbic Acid", type: "Preservative", risk: "Low", description: "Naturally occurring preservative. Effective against molds and yeasts." },
  "INS 202": { name: "Potassium Sorbate", type: "Preservative", risk: "Low", description: "Widely used synthetic preservative. Generally considered safe and effective." },
  "INS 211": { name: "Sodium Benzoate", type: "Preservative", risk: "Moderate", description: "Common preservative. When combined with Vitamin C (ascorbic acid), can form benzene, a known carcinogen." },
  "INS 220": { name: "Sulphur Dioxide", type: "Preservative", risk: "Moderate", description: "Used in dried fruits and wines. Can trigger severe asthma attacks in sensitive individuals." },
  "INS 223": { name: "Sodium Metabisulphite", type: "Dough Conditioner", risk: "Moderate", description: "Bleaching agent and preservative. Can cause allergic reactions in sulphite-sensitive individuals." },
  "INS 250": { name: "Sodium Nitrite", type: "Preservative", risk: "High", description: "Used in processed meats. Under high heat, forms nitrosamines, strongly linked to cancer risk." },

  // ---- ANTIOXIDANTS ----
  "INS 300": { name: "Ascorbic Acid (Vitamin C)", type: "Antioxidant", risk: "Low", description: "Natural antioxidant identical to Vitamin C. Safe and beneficial." },
  "INS 319": { name: "TBHQ (Tert-Butylhydroquinone)", type: "Antioxidant", risk: "Moderate", description: "Synthetic antioxidant to extend shelf life of fats. High doses linked to tumors in lab animals." },
  "INS 320": { name: "BHA (Butylated Hydroxyanisole)", type: "Antioxidant", risk: "High", description: "Synthetic antioxidant. Classified as 'reasonably anticipated to be a human carcinogen' by the US NTP." },
  "INS 321": { name: "BHT (Butylated Hydroxytoluene)", type: "Antioxidant", risk: "Moderate", description: "Synthetic antioxidant. Some evidence of endocrine disruption at high doses." },

  // ---- EMULSIFIERS ----
  "INS 322": { name: "Lecithins", type: "Emulsifier", risk: "Low", description: "Typically soy or sunflower derived. Helps oil and water combine. Generally safe." },
  "INS 471": { name: "Mono- and Diglycerides", type: "Emulsifier", risk: "Moderate", description: "Keeps oil and water mixed. May contain trans fats depending on the manufacturing process." },
  "INS 442": { name: "Ammonium Phosphatides", type: "Emulsifier", risk: "Low", description: "Emulsifier used in chocolate making. Considered safe." },
  "INS 476": { name: "Polyglycerol Polyricinoleate", type: "Emulsifier", risk: "Low", description: "Used in chocolate to improve flow. Made from castor oil. Considered safe." },

  // ---- FLAVOR ENHANCERS ----
  "INS 621": { name: "Monosodium Glutamate (MSG)", type: "Flavor Enhancer", risk: "Moderate", description: "Widely used flavor enhancer. While deemed safe by FDA, can cause headaches or flushing in sensitive individuals (Chinese Restaurant Syndrome)." },
  "INS 627": { name: "Disodium Guanylate", type: "Flavor Enhancer", risk: "Moderate", description: "Used synergistically with MSG to amplify umami. Can trigger gout in sensitive individuals." },
  "INS 631": { name: "Disodium Inosinate", type: "Flavor Enhancer", risk: "Moderate", description: "Used with MSG. Often derived from meat or fish, problematic for strict vegetarians." },
  "INS 635": { name: "Disodium 5'-ribonucleotides", type: "Flavor Enhancer", risk: "Moderate", description: "Combination of INS 627 and 631. Used to enhance savory flavors." },

  // ---- THICKENERS & STABILIZERS ----
  "INS 407": { name: "Carrageenan", type: "Thickener", risk: "Moderate", description: "Seaweed extract. Some evidence suggests it may cause digestive inflammation and gut damage." },
  "INS 410": { name: "Locust Bean Gum", type: "Thickener", risk: "Low", description: "Natural gum from carob seeds. Used as thickener and stabilizer. Safe." },
  "INS 412": { name: "Guar Gum", type: "Thickener", risk: "Low", description: "Natural fiber from guar beans. Safe in normal amounts, can cause digestive issues in excess." },
  "INS 415": { name: "Xanthan Gum", type: "Thickener", risk: "Low", description: "Microbial polysaccharide. Widely used thickener. Generally safe." },
  "INS 440": { name: "Pectins", type: "Gelling Agent", risk: "Low", description: "Natural gelling agent from fruit. Used in jams and jellies. Safe." },
  "INS 444": { name: "Sucrose Acetate Isobutyrate", type: "Stabilizer", risk: "Moderate", description: "Emulsifier/stabilizer used in beverages. Limited safety data for long-term consumption." },
  "INS 508": { name: "Potassium Chloride", type: "Firming Agent", risk: "Low", description: "Salt substitute. Generally safe in food quantities." },

  // ---- ACIDIFIERS ----
  "INS 260": { name: "Acetic Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid found in vinegar. Safe for consumption." },
  "INS 270": { name: "Lactic Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid produced during fermentation. Safe." },
  "INS 296": { name: "Malic Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid found in apples. Safe and commonly used." },
  "INS 330": { name: "Citric Acid", type: "Acidity Regulator", risk: "Low", description: "Natural acid from citrus fruits. Ubiquitous food additive. Very safe." },
  "INS 331": { name: "Sodium Citrate", type: "Acidity Regulator", risk: "Low", description: "Sodium salt of citric acid. Used as buffering agent. Safe." },
  "INS 338": { name: "Phosphoric Acid", type: "Acidity Regulator", risk: "Moderate", description: "Used in colas. Linked to reduced bone mineral density with heavy consumption." },
  "INS 385": { name: "Calcium Disodium EDTA", type: "Sequestrant", risk: "Moderate", description: "Preserves color and flavor. Chelation agent that binds metals. Some concerns about mineral depletion." },

  // ---- LEAVENING / RAISING AGENTS ----
  "INS 450": { name: "Diphosphates", type: "Raising Agent", risk: "Low", description: "Leavening agent used in baking. Safe in normal amounts." },
  "INS 451": { name: "Triphosphates", type: "Humectant", risk: "Low", description: "Retains moisture. Used in processed foods. Generally safe." },
  "INS 452": { name: "Polyphosphates", type: "Emulsifying Salt", risk: "Low", description: "Used in processed cheese. Safe in food quantities." },
  "INS 500": { name: "Sodium Carbonates", type: "Raising Agent", risk: "Low", description: "Baking soda. Very common leavening agent. Safe." },
  "INS 501": { name: "Potassium Carbonates", type: "Raising Agent", risk: "Low", description: "Alkaline salt used in baking. Safe." },
  "INS 503": { name: "Ammonium Carbonates", type: "Raising Agent", risk: "Low", description: "Traditional leavening agent. Ammonia evaporates during baking. Safe." },

  // ---- ANTI-CAKING ----
  "INS 551": { name: "Silicon Dioxide", type: "Anti-caking Agent", risk: "Low", description: "Fine silica powder that prevents clumping. Safe in food quantities." },

  // ---- SWEETENERS ----
  "INS 951": { name: "Aspartame", type: "Artificial Sweetener", risk: "High", description: "Artificial sweetener classified as 'possibly carcinogenic to humans' (Group 2B) by WHO/IARC in 2023." },
  "INS 955": { name: "Sucralose", type: "Artificial Sweetener", risk: "Moderate", description: "Chlorinated sugar. Recent studies suggest it may damage DNA and alter gut microbiome." },
  "INS 950": { name: "Acesulfame Potassium", type: "Artificial Sweetener", risk: "Moderate", description: "Often used with aspartame. Some animal studies show potential carcinogenicity." },

  // ---- GLAZING ----
  "INS 903": { name: "Carnauba Wax", type: "Glazing Agent", risk: "Low", description: "Natural plant wax. Used to make candies and fruits shiny. Safe." },
  "INS 904": { name: "Shellac", type: "Glazing Agent", risk: "Low", description: "Natural resin secreted by lac bugs. Used to coat candies and pills. Safe but animal-derived." },

  // ---- MODIFIED STARCHES ----
  "INS 1422": { name: "Acetylated Distarch Adipate", type: "Modified Starch", risk: "Low", description: "Chemically modified starch used as thickener. Generally considered safe." },

  // ---- EMULSIFYING SALTS ----
  "INS 339": { name: "Sodium Phosphates", type: "Emulsifying Salt", risk: "Low", description: "Used in processed cheese and meats. Safe in moderate amounts." },
};

export interface RealProduct {
  id: string;
  name: string;
  brand: string;
  category?: string;
  description?: string;
  weight?: string;
  isVeg?: boolean;
  transparencyScore: number;
  redFlags: string[];
  ingredients: string[];
  imageUrl: string | null;
}
