import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// INS DICTIONARY — 60+ codes
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
  { code: "INS 621", name: "Monosodium Glutamate (MSG)", type: "Flavor Enhancer", risk: "Moderate", description: "Widely used flavor enhancer. While deemed safe by FDA, can cause headaches or flushing in sensitive individuals (Chinese Restaurant Syndrome)." },
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

// ─────────────────────────────────────────────
// PRODUCTS DATA
// ─────────────────────────────────────────────
const PRODUCTS_DATA = [
  // ===== INSTANT NOODLES =====
  { id: "maggi-masala-2min", name: "2-Minute Masala Noodles", brand: "Maggi", category: "Instant Noodles", description: "India's most popular instant noodles. The iconic yellow pack found in every Indian household.", weight: "70g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Palm Oil", "Iodised Salt", "Wheat Gluten", "Thickeners (508 & 412)", "Acidity Regulators (501(i) & 500(i))", "Humectant (451(i))", "Spices & Condiments", "Onion Powder", "Maltodextrin", "Sugar", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)", "Garlic Powder", "Turmeric", "Citric Acid"], imageUrl: null },
  { id: "maggi-atta-noodles", name: "Atta Noodles", brand: "Maggi", category: "Instant Noodles", description: "Whole wheat variant of Maggi noodles marketed as a healthier alternative.", weight: "75g", isVeg: true, ingredients: ["Whole Wheat Flour (Atta) (84%)", "Palm Oil", "Iodised Salt", "Wheat Gluten", "Thickeners (INS 412)", "Acidity Regulator (INS 501(i))", "Humectant (INS 451(i))", "Spices", "Sugar", "Onion Powder", "Dehydrated Vegetables", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)"], imageUrl: null },
  { id: "maggi-oats-noodles", name: "Oats Masala Noodles", brand: "Maggi", category: "Instant Noodles", description: "Noodles made with oats, marketed as a fiber-rich option.", weight: "73g", isVeg: true, ingredients: ["Oat Flour (45%)", "Refined Wheat Flour (Maida)", "Palm Oil", "Iodised Salt", "Wheat Gluten", "Thickeners (INS 412)", "Acidity Regulator (INS 501(i))", "Spices", "Maltodextrin", "Sugar", "Onion Powder", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)"], imageUrl: null },
  { id: "maggi-chicken-noodles", name: "Chicken Noodles", brand: "Maggi", category: "Instant Noodles", description: "Non-vegetarian variant with chicken flavoring.", weight: "71g", isVeg: false, ingredients: ["Refined Wheat Flour (Maida)", "Palm Oil", "Iodised Salt", "Wheat Gluten", "Thickeners (INS 412)", "Chicken Fat Powder", "Dehydrated Chicken", "Spices", "Maltodextrin", "Sugar", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)", "Garlic Powder", "Onion Powder"], imageUrl: null },
  { id: "yippee-noodles-magic", name: "Magic Masala Noodles", brand: "Sunfeast Yippee", category: "Instant Noodles", description: "ITC's rival to Maggi. Known for its round noodle cakes and non-sticky texture.", weight: "70g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Edible Vegetable Oil (Palm Oil)", "Iodised Salt", "Wheat Gluten", "Thickener (INS 412)", "Acidity Regulator (INS 501(i))", "Humectant (INS 451(i))", "Spices", "Dried Vegetables", "Maltodextrin", "Sugar", "Hydrolyzed Vegetable Protein", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)"], imageUrl: null },
  { id: "top-ramen-curry", name: "Curry Noodles", brand: "Top Ramen", category: "Instant Noodles", description: "Classic Japanese-style instant noodles adapted for Indian taste with curry flavor.", weight: "70g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Edible Vegetable Oil (Palmolein)", "Iodised Salt", "Wheat Gluten", "Curry Powder", "Sugar", "Maltodextrin", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)", "Onion Powder", "Garlic Powder", "Acidity Regulator (INS 330)"], imageUrl: null },
  { id: "chings-schezwan", name: "Schezwan Instant Noodles", brand: "Ching's Secret", category: "Instant Noodles", description: "Indo-Chinese flavor noodles with bold Schezwan spice profile.", weight: "60g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Edible Vegetable Oil (Palmolein)", "Salt", "Wheat Gluten", "Chilli Flakes", "Dried Vegetables", "Maltodextrin", "Sugar", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)", "Acidity Regulator (INS 330)", "INS 150c"], imageUrl: null },
  { id: "patanjali-atta-noodles", name: "Atta Noodles", brand: "Patanjali", category: "Instant Noodles", description: "Patanjali's whole wheat noodles marketed as a desi, healthier alternative.", weight: "60g", isVeg: true, ingredients: ["Whole Wheat Flour (Atta)", "Edible Vegetable Oil (Rice Bran)", "Salt", "Spices", "Dehydrated Vegetables", "Sugar", "Turmeric", "Ajwain"], imageUrl: null },
  { id: "knorr-soupy-noodles", name: "Soupy Noodles Mast Masala", brand: "Knorr", category: "Instant Noodles", description: "Hindustan Unilever's soupy noodles with extra broth.", weight: "75g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Palm Oil", "Corn Starch", "Iodised Salt", "Wheat Gluten", "Sugar", "Spices", "Maltodextrin", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)", "Dehydrated Vegetables", "Thickener (INS 412)"], imageUrl: null },

  // ===== CHIPS & SNACKS =====
  { id: "lays-classic-salted", name: "Classic Salted Chips", brand: "Lay's", category: "Chips & Snacks", description: "The original salted potato chip. India's best-selling chip flavor.", weight: "52g", isVeg: true, ingredients: ["Potato", "Edible Vegetable Oil (Palmolein, Rice Bran Oil)", "Iodised Salt"], imageUrl: null },
  { id: "lays-magic-masala", name: "Magic Masala Chips", brand: "Lay's", category: "Chips & Snacks", description: "India-exclusive masala flavor with tangy spice blend.", weight: "52g", isVeg: true, ingredients: ["Potato", "Edible Vegetable Oil (Palmolein, Rice Bran Oil)", "Seasoning (Maltodextrin, Sugar, Iodised Salt, Spices, Nature Identical Flavoring Substances, Acidity Regulators (INS 330, INS 296), Anti-caking Agent (INS 551))"], imageUrl: null },
  { id: "lays-cream-onion", name: "Cream & Onion Chips", brand: "Lay's", category: "Chips & Snacks", description: "Creamy onion flavored potato chips.", weight: "52g", isVeg: true, ingredients: ["Potato", "Edible Vegetable Oil (Palmolein, Rice Bran Oil)", "Seasoning (Maltodextrin, Sugar, Iodised Salt, Onion Powder, Cream Cheese Powder, Spices, Milk Solids, Acidity Regulators (INS 330), Anti-caking Agent (INS 551))"], imageUrl: null },
  { id: "bingo-mad-angles", name: "Mad Angles Achari Masti", brand: "Bingo", category: "Chips & Snacks", description: "ITC's triangle-shaped crispy snack with pickle flavor.", weight: "72.5g", isVeg: true, ingredients: ["Corn Flour", "Rice Flour", "Edible Vegetable Oil (Palmolein)", "Gram Flour", "Starch", "Iodised Salt", "Sugar", "Spices & Condiments", "Maltodextrin", "Acidity Regulator (INS 330)", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)"], imageUrl: null },
  { id: "kurkure-masala-munch", name: "Masala Munch", brand: "Kurkure", category: "Chips & Snacks", description: "India's iconic crunchy puffed snack. Made with rice, corn, and gram dal.", weight: "90g", isVeg: true, ingredients: ["Rice Meal", "Edible Vegetable Oil (Palmolein)", "Corn Meal", "Gram Meal", "Seasoning (Spices & Condiments, Iodised Salt, Sugar, Maltodextrin, Tomato Powder)", "Acidity Regulator (INS 330)", "Anticaking Agent (INS 551)", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)"], imageUrl: null },
  { id: "kurkure-chilli-chatka", name: "Green Chutney Rajasthani Style", brand: "Kurkure", category: "Chips & Snacks", description: "Kurkure variant with spicy green chutney flavor.", weight: "90g", isVeg: true, ingredients: ["Rice Meal", "Edible Vegetable Oil (Palmolein)", "Corn Meal", "Gram Meal", "Seasoning (Spices, Iodised Salt, Sugar, Maltodextrin, Coriander Powder, Mint Powder)", "Acidity Regulator (INS 330)", "Anticaking Agent (INS 551)", "Flavor Enhancer (INS 627)", "Flavor Enhancer (INS 631)"], imageUrl: null },
  { id: "uncle-chipps-spicy", name: "Spicy Treat", brand: "Uncle Chipps", category: "Chips & Snacks", description: "Classic Indian chip brand. The original desi chip before Lay's dominated.", weight: "55g", isVeg: true, ingredients: ["Potato", "Edible Vegetable Oil (Palmolein, Rice Bran Oil)", "Seasoning (Iodised Salt, Spices, Sugar, Maltodextrin, Tomato Powder, Anti-caking Agent (INS 551))"], imageUrl: null },
  { id: "act2-classic-salted-popcorn", name: "Classic Salted Popcorn", brand: "Act II", category: "Chips & Snacks", description: "Microwave popcorn. India's leading popcorn brand.", weight: "99g", isVeg: true, ingredients: ["Corn Kernels", "Edible Vegetable Oil (Palmolein, Partially Hydrogenated Soyabean Oil)", "Iodised Salt", "Butter Flavor", "INS 319 (TBHQ)", "Color (INS 160c)"], imageUrl: null },
  { id: "pringles-original", name: "Original Chips", brand: "Pringles", category: "Chips & Snacks", description: "Iconic stackable potato crisps in the cylinder tube.", weight: "107g", isVeg: true, ingredients: ["Dried Potatoes", "Vegetable Oil (Sunflower, Corn)", "Rice Flour", "Wheat Starch", "Maltodextrin", "Salt", "Emulsifier (INS 471)", "Dextrose"], imageUrl: null },
  { id: "too-yumm-multigrain", name: "Multigrain Chips Dahi Papdi Chaat", brand: "Too Yumm!", category: "Chips & Snacks", description: "Baked multigrain chips marketed as a healthier alternative.", weight: "54g", isVeg: true, ingredients: ["Potato Flakes", "Rice Flour", "Corn Flour", "Edible Vegetable Oil (Rice Bran Oil)", "Ragi Flour", "Oat Flour", "Sesame Seeds", "Seasoning (Salt, Sugar, Spices, Dried Curd Powder, Maltodextrin)"], imageUrl: null },

  // ===== NAMKEEN =====
  { id: "haldiram-aloo-bhujia", name: "Aloo Bhujia", brand: "Haldiram's", category: "Namkeen", description: "India's most popular namkeen. Crispy potato sev snack.", weight: "200g", isVeg: true, ingredients: ["Potatoes (44%)", "Edible Vegetable Oil (Cotton Seed, Corn & Palmolein Oil)", "Gram Pulse Flour", "Tepary Beans Flour", "Starch", "Iodised Salt", "Spices & Condiments", "Maltodextrin", "INS 319 (TBHQ)"], imageUrl: null },
  { id: "haldiram-moong-dal", name: "Moong Dal", brand: "Haldiram's", category: "Namkeen", description: "Crispy fried moong dal namkeen with salt and spices.", weight: "200g", isVeg: true, ingredients: ["Moong Dal (60%)", "Edible Vegetable Oil (Palmolein, Cotton Seed Oil)", "Iodised Salt", "Black Pepper", "Asafoetida", "Red Chilli", "INS 319 (TBHQ)"], imageUrl: null },
  { id: "haldiram-bhujia-sev", name: "Bhujia Sev", brand: "Haldiram's", category: "Namkeen", description: "Traditional Bikaneri bhujia. Thin crispy gram flour noodles.", weight: "200g", isVeg: true, ingredients: ["Gram Flour (Besan) (55%)", "Edible Vegetable Oil (Palmolein, Cotton Seed Oil)", "Moth Bean Flour", "Iodised Salt", "Spices", "Green Chilli", "INS 319 (TBHQ)"], imageUrl: null },
  { id: "haldiram-navratan-mix", name: "Navratan Mix", brand: "Haldiram's", category: "Namkeen", description: "Premium mixed namkeen with 9 varieties of snacks.", weight: "200g", isVeg: true, ingredients: ["Gram Flour", "Edible Vegetable Oil (Palmolein)", "Peanuts", "Puffed Rice", "Potato Flakes", "Sugar", "Raisins", "Cashew Nuts", "Iodised Salt", "Spices", "Maltodextrin", "INS 319 (TBHQ)"], imageUrl: null },
  { id: "bikano-bhujia", name: "Bikaji Bhujia", brand: "Bikano", category: "Namkeen", description: "Authentic Rajasthani bhujia sev from Bikaner.", weight: "200g", isVeg: true, ingredients: ["Gram Flour (Besan)", "Edible Vegetable Oil (Palmolein)", "Moth Bean Flour", "Iodised Salt", "Spices", "Red Chilli", "Turmeric", "INS 319 (TBHQ)"], imageUrl: null },

  // ===== BISCUITS & COOKIES =====
  { id: "parle-g-original", name: "Parle-G Original Glucose Biscuit", brand: "Parle", category: "Biscuits & Cookies", description: "India's largest selling biscuit. The iconic glucose biscuit found in every home.", weight: "80g", isVeg: true, ingredients: ["Wheat Flour (Atta)", "Sugar", "Edible Vegetable Oil (Palm Oil)", "Invert Syrup", "Milk Solids", "Raising Agents (INS 503(ii), INS 500(ii))", "Iodised Salt", "Emulsifier (INS 322)", "Dough Conditioner (INS 223)"], imageUrl: null },
  { id: "parle-marie", name: "Marie Biscuit", brand: "Parle", category: "Biscuits & Cookies", description: "Light and crispy Marie biscuit. Lower sugar than glucose biscuits.", weight: "65g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Oil (Palm Oil)", "Invert Syrup", "Milk Solids", "Iodised Salt", "Raising Agents (INS 503(ii), INS 500(ii))", "Emulsifier (INS 322)"], imageUrl: null },
  { id: "parle-monaco", name: "Monaco Classic", brand: "Parle", category: "Biscuits & Cookies", description: "India's popular salty cracker biscuit. Perfect with chai.", weight: "75g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Edible Vegetable Oil (Palm Oil)", "Sugar", "Iodised Salt", "Corn Starch", "Invert Syrup", "Yeast", "Raising Agent (INS 500(ii))", "Emulsifier (INS 322)", "Dough Conditioner (INS 223)"], imageUrl: null },
  { id: "britannia-good-day-butter", name: "Good Day Butter Cookies", brand: "Britannia", category: "Biscuits & Cookies", description: "Premium butter cookies with signature swirl shape.", weight: "75g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Fat (Palm Oil)", "Butter (8%)", "Invert Syrup", "Milk Solids", "Raising Agents (INS 503(ii), INS 500(ii))", "Iodised Salt", "Emulsifier (INS 322)", "Dough Conditioner (INS 223)", "Artificial Flavoring - Butter"], imageUrl: null },
  { id: "britannia-marie-gold", name: "Marie Gold", brand: "Britannia", category: "Biscuits & Cookies", description: "Britannia's version of the Marie biscuit with added vitamins.", weight: "83g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Oil (Palm Oil)", "Invert Syrup", "Liquid Glucose", "Milk Solids", "Raising Agents (INS 503(ii), INS 500(ii))", "Iodised Salt", "Emulsifier (INS 322)", "Added Vitamins"], imageUrl: null },
  { id: "britannia-bourbon", name: "Bourbon Chocolate Cream", brand: "Britannia", category: "Biscuits & Cookies", description: "Classic chocolate cream sandwich biscuit.", weight: "100g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Fat (Palm Oil, Palmolein)", "Cocoa Solids (6%)", "Invert Syrup", "Liquid Glucose", "Milk Solids", "Raising Agents (INS 503(ii), INS 500(ii))", "Emulsifier (INS 322)", "Iodised Salt", "Artificial Flavoring - Chocolate & Vanilla"], imageUrl: null },
  { id: "sunfeast-dark-fantasy", name: "Dark Fantasy Choco Fills", brand: "Sunfeast", category: "Biscuits & Cookies", description: "Premium cookie with chocolate cream filling. ITC's bestselling biscuit.", weight: "75g", isVeg: true, ingredients: ["Choco Creme (38%) [Sugar, Refined Palmolein, Cocoa Solids, Milk Solids, Emulsifier (INS 322)]", "Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Oil (Palmolein, Interesterified Fat)", "Hydrogenated Vegetable Oils", "Liquid Glucose", "Cocoa Solids", "Invert Syrup", "Milk Solids", "Raising Agents (INS 500(ii), INS 503(ii))", "Iodised Salt", "Emulsifier (INS 322)"], imageUrl: null },
  { id: "oreo-vanilla", name: "Original Vanilla Creme Biscuit", brand: "Oreo", category: "Biscuits & Cookies", description: "America's favorite cookie, now India's too. Twist, lick, and dunk.", weight: "120g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Fat (Palm Oil, Interesterified Vegetable Fat)", "Invert Sugar Syrup", "Cocoa Solids (4.5%)", "Starch", "Leavening Agents (INS 500(ii), INS 503(ii))", "Iodised Salt", "Emulsifier (INS 322)", "Synthetic Food Color (INS 150d)"], imageUrl: null },
  { id: "hide-seek-chocolate", name: "Hide & Seek Chocolate Chip", brand: "Parle", category: "Biscuits & Cookies", description: "Chocolate chip cookies. Competitor to Dark Fantasy.", weight: "100g", isVeg: true, ingredients: ["Refined Wheat Flour (Maida)", "Sugar", "Edible Vegetable Oil (Palm Oil)", "Choco Chips (10%)", "Cocoa Solids", "Invert Syrup", "Liquid Glucose", "Milk Solids", "Raising Agents (INS 500(ii), INS 503(ii))", "Iodised Salt", "Emulsifier (INS 322)", "Artificial Flavoring"], imageUrl: null },

  // ===== BEVERAGES =====
  { id: "coca-cola-original", name: "Coca-Cola Original", brand: "Coca-Cola", category: "Beverages", description: "The world's most recognized soft drink. India's carbonated market leader.", weight: "300ml", isVeg: true, ingredients: ["Carbonated Water", "Sugar", "INS 150d (Sulphite Ammonia Caramel)", "Acidity Regulator (INS 338)", "Natural Flavoring Substances", "Caffeine"], imageUrl: null },
  { id: "thums-up", name: "Thums Up", brand: "Thums Up", category: "Beverages", description: "India's strongest cola. Originally Indian, now owned by Coca-Cola.", weight: "300ml", isVeg: true, ingredients: ["Carbonated Water", "Sugar", "INS 150d (Sulphite Ammonia Caramel)", "Acidity Regulator (INS 338)", "Natural Flavoring Substances Including Caffeine"], imageUrl: null },
  { id: "pepsi-can", name: "Pepsi", brand: "Pepsi", category: "Beverages", description: "PepsiCo's flagship cola. Major rival to Coca-Cola in India.", weight: "300ml", isVeg: true, ingredients: ["Carbonated Water", "Sugar", "INS 150d (Sulphite Ammonia Caramel)", "Acidity Regulator (INS 338)", "Caffeine", "Natural Flavoring Substances"], imageUrl: null },
  { id: "sprite-can", name: "Sprite", brand: "Coca-Cola", category: "Beverages", description: "Clear lemon-lime soda. Popular in India's hot climate.", weight: "300ml", isVeg: true, ingredients: ["Carbonated Water", "Sugar", "Acidity Regulator (INS 330)", "Natural Flavoring Substances"], imageUrl: null },
  { id: "frooti-mango", name: "Frooti Mango Drink", brand: "Frooti", category: "Beverages", description: "India's iconic mango drink. 'Mango Frooti, Fresh and Juicy.'", weight: "200ml", isVeg: true, ingredients: ["Water", "Sugar", "Mango Pulp (15%)", "Acidity Regulator (INS 330)", "Preservative (INS 211)", "Antioxidant (INS 300)", "Contains Added Flavors (Nature Identical)"], imageUrl: null },
  { id: "maaza-mango", name: "Maaza Mango Drink", brand: "Maaza", category: "Beverages", description: "Coca-Cola's mango drink competing with Frooti/Slice.", weight: "250ml", isVeg: true, ingredients: ["Water", "Sugar", "Mango Pulp (14%)", "Acidity Regulator (INS 330)", "Antioxidant (INS 300)", "Stabilizers (INS 440, INS 412)", "Contains Added Flavors"], imageUrl: null },
  { id: "real-mixed-fruit", name: "Mixed Fruit Juice", brand: "Real", category: "Beverages", description: "Dabur's fruit juice brand. Marketed as 'real fruit juice'.", weight: "200ml", isVeg: true, ingredients: ["Water", "Mixed Fruit Concentrate (Apple, Grape, Mango, Pineapple, Guava)", "Sugar", "Acidity Regulator (INS 330)", "Preservative (INS 211)", "Antioxidant (INS 300)", "Stabilizer (INS 440)"], imageUrl: null },
  { id: "paper-boat-aam-panna", name: "Aam Panna", brand: "Paper Boat", category: "Beverages", description: "Traditional Indian raw mango drink. Premium nostalgia brand.", weight: "250ml", isVeg: true, ingredients: ["Water", "Sugar", "Raw Mango Pulp (12%)", "Iodised Salt", "Cumin Powder", "Black Salt", "Mint Extract", "Acidity Regulator (INS 330)", "Preservative (INS 211)"], imageUrl: null },
  { id: "tropicana-orange", name: "Orange Juice", brand: "Tropicana", category: "Beverages", description: "PepsiCo's premium juice brand. '100% juice' claim.", weight: "200ml", isVeg: true, ingredients: ["Orange Juice from Concentrate (Reconstituted)", "Water", "Sugar", "Acidity Regulator (INS 330)", "Preservative (INS 202)", "Antioxidant (INS 300)"], imageUrl: null },
  { id: "bournvita-chocolate", name: "Cadbury Bournvita", brand: "Bournvita", category: "Beverages", description: "India's iconic chocolate health drink for children.", weight: "500g", isVeg: true, ingredients: ["Sugar", "Cocoa Solids (12%)", "Malt Extract", "Liquid Glucose", "Milk Solids", "Emulsifier (INS 322)", "Raising Agent (INS 500(ii))", "Added Vitamins & Minerals", "Artificial Flavoring - Chocolate & Caramel", "INS 150c"], imageUrl: null },
  { id: "horlicks-classic", name: "Classic Malt Horlicks", brand: "Horlicks", category: "Beverages", description: "Malt-based health drink. 'Taller, Stronger, Sharper.'", weight: "500g", isVeg: true, ingredients: ["Wheat Flour", "Malted Barley (26%)", "Sugar", "Milk Solids", "Cocoa Powder", "Edible Vegetable Oil", "Minerals", "Vitamins", "Acidity Regulator (INS 500(ii))", "Salt", "Emulsifier (INS 322)", "Artificial Flavoring"], imageUrl: null },
  { id: "mountain-dew", name: "Mountain Dew", brand: "PepsiCo", category: "Beverages", description: "High-caffeine citrus soda. 'Darr Ke Aage Jeet Hai.'", weight: "300ml", isVeg: true, ingredients: ["Carbonated Water", "Sugar", "Acidity Regulators (INS 330, INS 331(iii))", "Concentrated Orange Juice", "Caffeine", "Natural Flavoring Substances", "Antioxidant (INS 300)", "Stabilizer (INS 444)", "Color (INS 110)"], imageUrl: null },
  { id: "limca", name: "Limca", brand: "Coca-Cola", category: "Beverages", description: "India-origin lemon-lime soda. Refreshing in hot weather.", weight: "300ml", isVeg: true, ingredients: ["Carbonated Water", "Sugar", "Acidity Regulator (INS 330)", "Natural Lemon-Lime Flavoring", "Stabilizer (INS 444)", "Antioxidant (INS 300)"], imageUrl: null },

  // ===== CHOCOLATES & SWEETS =====
  { id: "cadbury-dairy-milk", name: "Dairy Milk Chocolate", brand: "Cadbury", category: "Chocolates & Sweets", description: "India's most loved chocolate. 'Kuch Meetha Ho Jaaye.'", weight: "49.5g", isVeg: true, ingredients: ["Sugar", "Cocoa Butter", "Milk Solids (20%)", "Cocoa Solids (Min 25%)", "Emulsifier (INS 442, INS 476)", "Vegetable Fat (Palm Oil)", "Nature Identical Flavoring - Vanilla"], imageUrl: null },
  { id: "cadbury-silk", name: "Dairy Milk Silk", brand: "Cadbury", category: "Chocolates & Sweets", description: "Premium smoother version of Dairy Milk with extra cocoa butter.", weight: "60g", isVeg: true, ingredients: ["Sugar", "Cocoa Butter", "Milk Solids (20%)", "Cocoa Solids (Min 33%)", "Emulsifier (INS 442, INS 476)", "Vegetable Fat", "Nature Identical Flavoring - Vanilla"], imageUrl: null },
  { id: "cadbury-5star", name: "5 Star Chocolate Bar", brand: "Cadbury", category: "Chocolates & Sweets", description: "Chocolate bar with caramel and nougat center.", weight: "40g", isVeg: true, ingredients: ["Sugar", "Glucose Syrup", "Vegetable Fat (Palm Oil)", "Milk Solids", "Cocoa Butter", "Cocoa Solids", "Hydrogenated Vegetable Fat", "Wheat Flour", "Maltodextrin", "Emulsifier (INS 322)", "Iodised Salt", "Artificial Flavoring - Vanilla & Caramel"], imageUrl: null },
  { id: "kitkat-4-finger", name: "KitKat 4 Finger", brand: "KitKat", category: "Chocolates & Sweets", description: "'Have a break, have a KitKat.' Wafer fingers coated in chocolate.", weight: "37.3g", isVeg: true, ingredients: ["Sugar", "Refined Wheat Flour (Maida)", "Cocoa Butter", "Vegetable Fat (Palm Oil, Sal Fat)", "Cocoa Mass", "Milk Solids", "Whey Protein Concentrate", "Emulsifier (INS 322)", "Yeast", "Raising Agent (INS 500(ii))", "Iodised Salt", "Nature Identical Flavoring - Vanilla"], imageUrl: null },
  { id: "nestle-munch", name: "Munch Crunch Bar", brand: "Nestle", category: "Chocolates & Sweets", description: "Crunchy wafer chocolate bar at Rs5. India's top-selling small chocolate.", weight: "23g", isVeg: true, ingredients: ["Sugar", "Refined Wheat Flour (Maida)", "Edible Vegetable Fat (Palm Oil, Palmolein)", "Cocoa Solids", "Milk Solids", "Liquid Glucose", "Emulsifier (INS 322)", "Iodised Salt", "Raising Agent (INS 500(ii))", "Artificial Flavoring"], imageUrl: null },
  { id: "cadbury-gems", name: "Gems Chocolate", brand: "Cadbury", category: "Chocolates & Sweets", description: "Colorful sugar-coated chocolate buttons for kids.", weight: "17.8g", isVeg: true, ingredients: ["Sugar", "Cocoa Butter", "Milk Solids", "Cocoa Solids", "Emulsifier (INS 322)", "Vegetable Fat (Palm Oil)", "Glazing Agent (INS 903, INS 904)", "Permitted Synthetic Food Colors (INS 102, INS 110, INS 129, INS 133)", "Nature Identical Flavoring"], imageUrl: null },
  { id: "cadbury-perk", name: "Perk Wafer Chocolate", brand: "Cadbury", category: "Chocolates & Sweets", description: "Light wafer chocolate. Budget-friendly option.", weight: "22g", isVeg: true, ingredients: ["Sugar", "Refined Wheat Flour (Maida)", "Cocoa Butter", "Edible Vegetable Fat (Palm Oil)", "Cocoa Solids", "Milk Solids", "Liquid Glucose", "Emulsifier (INS 322)", "Raising Agent (INS 500(ii))", "Iodised Salt", "Artificial Flavoring"], imageUrl: null },
  { id: "ferrero-rocher", name: "Ferrero Rocher", brand: "Ferrero", category: "Chocolates & Sweets", description: "Premium Italian chocolate with hazelnut. Gift-giving favorite.", weight: "37.5g", isVeg: true, ingredients: ["Milk Chocolate (Sugar, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Whey, Emulsifier (INS 322))", "Hazelnuts (28.5%)", "Sugar", "Palm Oil", "Wheat Flour", "Whey Powder", "Skimmed Milk Powder", "Raising Agent (INS 500(ii))", "Vanillin"], imageUrl: null },

  // ===== DAIRY =====
  { id: "amul-butter", name: "Amul Butter", brand: "Amul", category: "Dairy", description: "'Utterly Butterly Delicious.' India's most trusted butter brand.", weight: "100g", isVeg: true, ingredients: ["Pasteurized Cream (Milk Fat 80%)", "Common Salt (2.5%)", "Annatto Color (INS 160b)"], imageUrl: null },
  { id: "amul-cheese-slices", name: "Amul Cheese Slices", brand: "Amul", category: "Dairy", description: "Processed cheese slices for sandwiches.", weight: "200g", isVeg: true, ingredients: ["Cheese", "Water", "Milk Solids", "Emulsifier (INS 331(iii), INS 339(iii))", "Class II Preservatives (INS 200, INS 234)", "Iodised Salt"], imageUrl: null },
  { id: "amul-masti-dahi", name: "Masti Dahi", brand: "Amul", category: "Dairy", description: "Set curd in plastic cups. Staple for Indian meals.", weight: "400g", isVeg: true, ingredients: ["Pasteurised Toned Milk", "Active Culture"], imageUrl: null },
  { id: "nandini-milk", name: "Nandini Toned Milk", brand: "Nandini", category: "Dairy", description: "Karnataka's staple toned milk in the blue and white pouch.", weight: "500ml", isVeg: true, ingredients: ["Toned Milk (Fat 3%, SNF 8.5%)"], imageUrl: null },

  // ===== COOKING OIL =====
  { id: "fortune-soyabean-oil", name: "Soyabean Oil", brand: "Fortune", category: "Cooking Oil", description: "Refined soyabean oil for everyday Indian cooking.", weight: "1L", isVeg: true, ingredients: ["Refined Soyabean Oil", "Antioxidant (INS 319)", "Vitamin A", "Vitamin D"], imageUrl: null },
  { id: "saffola-gold", name: "Saffola Gold Blended Oil", brand: "Saffola", category: "Cooking Oil", description: "Blended cooking oil marketed for heart health.", weight: "1L", isVeg: true, ingredients: ["Refined Rice Bran Oil (80%)", "Refined Sunflower Oil (20%)", "Antioxidant (INS 319)", "Anti-foaming Agent (INS 900a)", "Vitamin A", "Vitamin D2"], imageUrl: null },
  { id: "fortune-mustard-oil", name: "Kachi Ghani Mustard Oil", brand: "Fortune", category: "Cooking Oil", description: "Cold-pressed mustard oil with pungent aroma.", weight: "1L", isVeg: true, ingredients: ["Mustard Oil"], imageUrl: null },

  // ===== MASALA & SPICES =====
  { id: "everest-garam-masala", name: "Garam Masala", brand: "Everest", category: "Masala & Spices", description: "India's bestselling essential spice blend.", weight: "100g", isVeg: true, ingredients: ["Coriander", "Cumin", "Cassia Leaves", "Black Pepper", "Cassia Bark", "Clove", "Black Cardamom", "Nutmeg", "Dry Ginger", "Caraway", "Mace"], imageUrl: null },
  { id: "mdh-chunky-chaat-masala", name: "Chunky Chaat Masala", brand: "MDH", category: "Masala & Spices", description: "Tangy Indian spice mix sprinkled on fruits and snacks.", weight: "100g", isVeg: true, ingredients: ["Iodised Salt", "Dry Mango", "Black Salt", "Cumin", "Coriander", "Mint Leaves", "Black Pepper", "Dry Ginger", "Citric Acid (INS 330)"], imageUrl: null },
  { id: "mtr-sambar-powder", name: "Sambar Powder", brand: "MTR", category: "Masala & Spices", description: "Authentic Karnataka-style sambar powder.", weight: "100g", isVeg: true, ingredients: ["Coriander", "Rice", "Cumin", "Red Chilli", "Fenugreek", "Cassia", "Bengal Gram Dal", "Turmeric", "Asafoetida"], imageUrl: null },
  { id: "maggi-masala-ae-magic", name: "Masala-ae-Magic", brand: "Maggi", category: "Masala & Spices", description: "All-purpose seasoning to add the 'Maggi taste' to sabzi.", weight: "6g", isVeg: true, ingredients: ["Mixed Spices (38.7%)", "Iodised Salt", "Sugar", "Flavor Enhancer (INS 635)", "Palm Oil", "Edible Starch", "Dehydrated Onion", "Acidity Regulator (INS 330)", "Caramel Color (INS 150d)"], imageUrl: null },

  // ===== BREAKFAST & HEALTH =====
  { id: "kelloggs-corn-flakes", name: "Corn Flakes", brand: "Kellogg's", category: "Breakfast & Health", description: "The classic American breakfast cereal, widely adopted in urban India.", weight: "475g", isVeg: true, ingredients: ["Corn Grits (89%)", "Sugar", "Malt Extract", "Iodised Salt", "Vitamins", "Minerals", "Antioxidant (INS 320)"], imageUrl: null },
  { id: "kelloggs-chocos", name: "Chocos", brand: "Kellogg's", category: "Breakfast & Health", description: "Chocolate flavored wheat cereal targeting kids.", weight: "350g", isVeg: true, ingredients: ["Wheat Flour (Atta) (66%)", "Sugar", "Cocoa Solids (5.4%)", "Malt Extract", "Iodised Salt", "Color (INS 150d)", "Vitamins", "Minerals", "Antioxidant (INS 320)"], imageUrl: null },
  { id: "quaker-oats", name: "Oats", brand: "Quaker", category: "Breakfast & Health", description: "Plain whole grain rolled oats. Pushed as a health food for heart & cholesterol.", weight: "1kg", isVeg: true, ingredients: ["Rolled Oats (100%)"], imageUrl: null },
  { id: "saffola-masala-oats", name: "Masala Oats Classic Peppy Tomato", brand: "Saffola", category: "Breakfast & Health", description: "Oats Indianized with masala flavor to compete with instant noodles.", weight: "39g", isVeg: true, ingredients: ["Rolled Oats (73.9%)", "Maltodextrin", "Salt", "Spices & Condiments", "Dried Vegetables (Carrot, Onion, French Beans)", "Sugar", "Tomato Powder", "Hydrolyzed Vegetable Protein", "Flavor Enhancer (INS 627, INS 631)", "Acidity Regulator (INS 330)"], imageUrl: null },
  { id: "mtr-rava-idli", name: "Rava Idli Mix", brand: "MTR", category: "Breakfast & Health", description: "Instant breakfast mix. Just add curd. A lifesaver for bachelor life.", weight: "500g", isVeg: true, ingredients: ["Semolina (70%)", "Edible Vegetable Fat", "Bengal Gram Dal", "Cashew Nut", "Salt", "Curry Leaves", "Mustard", "Green Chilli", "Ginger", "Raising Agent (INS 500(ii))"], imageUrl: null },

  // ===== SAUCES & SPREADS =====
  { id: "kissan-tomato-ketchup", name: "Fresh Tomato Ketchup", brand: "Kissan", category: "Sauces & Spreads", description: "Sweet Indianized tomato ketchup. Perfect partner for samosas.", weight: "500g", isVeg: true, ingredients: ["Water", "Tomato Paste (28%)", "Sugar", "Salt", "Acidity Regulator (INS 260)", "Stabilizers (INS 1422, INS 415)", "Preservative (INS 211)", "Onion Powder", "Garlic Powder", "Spices"], imageUrl: null },
  { id: "maggi-hot-sweet", name: "Hot & Sweet Tomato Chilli Sauce", brand: "Maggi", category: "Sauces & Spreads", description: "Spicy variant of tomato ketchup. 'It's different!'", weight: "500g", isVeg: true, ingredients: ["Water", "Sugar", "Tomato Paste (24%)", "Chilli Puree (3%)", "Salt", "Acidity Regulator (INS 260)", "Thickeners (INS 1422, INS 415)", "Dehydrated Onion", "Preservative (INS 211)", "Spices"], imageUrl: null },
  { id: "funfoods-veg-mayonnaise", name: "Veg Mayonnaise", brand: "Funfoods", category: "Sauces & Spreads", description: "Eggless mayonnaise. Revolutionized Indian street fast food.", weight: "275g", isVeg: true, ingredients: ["Refined Soybean Oil", "Water", "Sugar", "Milk Solids", "Iodised Salt", "Lemon Juice", "Emulsifiers (INS 1442, INS 415, INS 412)", "Acidity Regulators (INS 270, INS 260)", "Preservatives (INS 211, INS 202)", "Antioxidant (INS 319)"], imageUrl: null },
  { id: "kissan-mixed-fruit-jam", name: "Mixed Fruit Jam", brand: "Kissan", category: "Sauces & Spreads", description: "The classic jelly-like red fruit jam. Childhood tiffin staple.", weight: "500g", isVeg: true, ingredients: ["Sugar", "Mixed Fruit Pulp (45%)", "Thickener (INS 440)", "Acidity Regulator (INS 330)", "Preservative (INS 211)", "Synthetic Food Color (INS 122)"], imageUrl: null },
  { id: "nutella", name: "Nutella Hazelnut Spread", brand: "Ferrero", category: "Sauces & Spreads", description: "Premium chocolate hazelnut spread.", weight: "350g", isVeg: true, ingredients: ["Sugar", "Palm Oil", "Hazelnuts (13%)", "Skimmed Milk Powder (8.7%)", "Fat-Reduced Cocoa (7.4%)", "Emulsifier (INS 322)", "Vanillin"], imageUrl: null },
  { id: "hersheys-chocolate-syrup", name: "Chocolate Syrup", brand: "Hershey's", category: "Sauces & Spreads", description: "Chocolate syrup used for milkshakes and desserts.", weight: "623g", isVeg: true, ingredients: ["High Fructose Corn Syrup", "Corn Syrup", "Water", "Cocoa", "Sugar", "Salt", "Preservative (INS 202)", "Emulsifier (INS 415)", "Artificial Flavor (Vanilla)"], imageUrl: null },

  // ===== ATTA & STAPLES =====
  { id: "aashirvaad-atta", name: "Select Premium Sharbati Atta", brand: "Aashirvaad", category: "Atta & Staples", description: "Premium whole wheat flour from ITC. Sourced from MP's Sehore region.", weight: "5kg", isVeg: true, ingredients: ["Whole Wheat (Sharbati)"], imageUrl: null },
  { id: "fortune-besan", name: "Chana Besan", brand: "Fortune", category: "Atta & Staples", description: "Gram flour used for pakodas, kadhi, and sweets.", weight: "500g", isVeg: true, ingredients: ["Chana Dal"], imageUrl: null },
  { id: "india-gate-basmati", name: "Classic Basmati Rice", brand: "India Gate", category: "Atta & Staples", description: "Premium long-grain basmati rice favored for biryanis.", weight: "1kg", isVeg: true, ingredients: ["Basmati Rice"], imageUrl: null },

  // ===== ICE CREAM =====
  { id: "kwality-walls-cornetto", name: "Cornetto Double Chocolate", brand: "Kwality Wall's", category: "Ice Cream", description: "Iconic cone ice cream with a chocolate tip at the bottom.", weight: "115ml", isVeg: true, ingredients: ["Water", "Sugar", "Wafer Cone (Wheat Flour, Sugar, Palm Oil)", "Edible Vegetable Fat (Palm Oil)", "Milk Solids", "Cocoa Solids", "Liquid Glucose", "Emulsifiers (INS 471)", "Stabilizers (INS 412, INS 410, INS 407)", "Artificial Flavoring"], imageUrl: null },
  { id: "amul-vanilla-magic", name: "Vanilla Magic Ice Cream", brand: "Amul", category: "Ice Cream", description: "Real milk vanilla ice cream. Known for the 'Real Milk, Real Ice Cream' tag.", weight: "1L", isVeg: true, ingredients: ["Milk", "Milk Solids", "Sugar", "Permitted Emulsifier (INS 471)", "Stabilizers (INS 412, INS 407, INS 466)", "Artificial Flavoring - Vanilla"], imageUrl: null },
  { id: "kwality-walls-feast", name: "Feast Chocolate", brand: "Kwality Wall's", category: "Ice Cream", description: "Chocolate-covered frozen dessert stick with crispies.", weight: "70ml", isVeg: true, ingredients: ["Water", "Chocolate Compound (Palm Oil, Sugar, Cocoa Solids, Emulsifier INS 322)", "Sugar", "Edible Vegetable Oil (Palm Oil)", "Milk Solids", "Liquid Glucose", "Emulsifier (INS 471)", "Stabilizer (INS 412, INS 410, INS 407)"], imageUrl: null },
];

// ─────────────────────────────────────────────
// SCORING LOGIC
// ─────────────────────────────────────────────
const HIGH_RISK_CODES = new Set(["INS 102", "INS 110", "INS 122", "INS 124", "INS 150c", "INS 150d", "INS 250", "INS 320", "INS 951"]);
const MODERATE_RISK_CODES = new Set(["INS 129", "INS 133", "INS 143", "INS 211", "INS 220", "INS 223", "INS 319", "INS 321", "INS 338", "INS 385", "INS 407", "INS 444", "INS 471", "INS 621", "INS 627", "INS 631", "INS 635", "INS 950", "INS 955"]);

const PROBLEMATIC_INGREDIENTS = [
  'palm oil', 'palmolein', 'hydrogenated', 'maltodextrin', 'liquid glucose',
  'glucose syrup', 'invert syrup', 'invert sugar', 'maida', 'refined wheat flour',
  'high fructose corn syrup', 'hydrolyzed vegetable protein', 'interesterified'
];

function scoreProduct(ingredients: string[]): { score: number; redFlags: string[] } {
  const redFlags: string[] = [];
  let deductions = 0;
  const joined = ingredients.join(' ').toLowerCase();

  // Check INS codes
  for (const code of HIGH_RISK_CODES) {
    if (joined.includes(code.toLowerCase())) {
      redFlags.push(code);
      deductions += 2;
    }
  }
  for (const code of MODERATE_RISK_CODES) {
    if (joined.includes(code.toLowerCase())) {
      deductions += 1;
    }
  }

  // Check problematic ingredients
  for (const bad of PROBLEMATIC_INGREDIENTS) {
    if (joined.includes(bad)) {
      const label = bad.replace(/\b\w/g, c => c.toUpperCase());
      if (!redFlags.includes(label)) {
        redFlags.push(label);
        deductions += 1.5;
      }
    }
  }

  const score = Math.max(1, Math.min(10, Math.round(10 - deductions)));
  return { score, redFlags: redFlags.slice(0, 6) };
}

// ─────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────
async function main() {
  console.log(`\n🌱 Starting seed...`);

  // Seed INS dictionary
  console.log(`📚 Seeding ${INS_DATA.length} INS entries...`);
  for (const entry of INS_DATA) {
    await prisma.insEntry.upsert({
      where: { code: entry.code },
      update: { name: entry.name, type: entry.type, risk: entry.risk, description: entry.description },
      create: entry,
    });
  }
  console.log(`✅ INS dictionary seeded.`);

  // Seed products with computed scores
  console.log(`🛒 Seeding ${PRODUCTS_DATA.length} products...`);
  for (const product of PRODUCTS_DATA) {
    const { score, redFlags } = scoreProduct(product.ingredients);
    await prisma.product.upsert({
      where: { id: product.id },
      update: { transparencyScore: score, redFlags },
      create: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description ?? null,
        weight: product.weight ?? null,
        isVeg: product.isVeg ?? null,
        ingredients: product.ingredients,
        imageUrl: product.imageUrl,
        transparencyScore: score,
        redFlags,
      },
    });
  }
  console.log(`✅ Products seeded.`);
  console.log(`\n🎉 Seed complete! ${PRODUCTS_DATA.length} products and ${INS_DATA.length} INS entries inserted.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
