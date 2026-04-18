const fs = require('fs');
const filePath = './src/lib/indian-products.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the end of the INDIAN_PRODUCTS array
// INDIAN_PRODUCTS is declared at the top and closed before helper functions.
const insertIndex = content.indexOf('];', content.indexOf('export const INDIAN_PRODUCTS'));

if (insertIndex === -1) {
  console.error("Could not find ]; for INDIAN_PRODUCTS");
  process.exit(1);
}

const manualProducts = [
  {
    id: "kissan-mixed-fruit-jam",
    name: "Mixed Fruit Jam",
    brand: "Kissan",
    category: "Sauces & Spreads",
    description: "India's favorite fruit jam. Often packed in school tiffins.",
    weight: "500g",
    isVeg: true,
    ingredients: ["Sugar", "Mixed Fruit Pulp", "Acidity Regulator (INS 330)", "Thickener (INS 440)", "Preservative (INS 211)", "Synthetic Food Color (INS 122)"],
    imageUrl: null,
  },
  {
    id: "nutella-hazelnut-spread",
    name: "Nutella Hazelnut Spread",
    brand: "Ferrero",
    category: "Sauces & Spreads",
    description: "Iconic hazelnut spread. Marketed as a breakfast staple but mostly sugar and palm oil.",
    weight: "350g",
    isVeg: true,
    ingredients: ["Sugar", "Palm Oil", "Hazelnuts (13%)", "Skimmed Milk Powder (8.7%)", "Fat-reduced Cocoa Powder (7.4%)", "Emulsifier (INS 322)", "Vanillin"],
    imageUrl: null,
  },
  {
    id: "snickers-chocolate",
    name: "Snickers Bar",
    brand: "Mars",
    category: "Chocolates & Sweets",
    description: "Peanut and caramel filled chocolate bar.",
    weight: "45g",
    isVeg: true,
    ingredients: ["Sugar", "Peanuts", "Glucose Syrup", "Milk Solids", "Cocoa Butter", "Cocoa Mass", "Palm Fat", "Lactose", "Whey Permeate", "Emulsifier (INS 322)", "Salt", "Egg White Powder", "Artificial Flavoring"],
    imageUrl: null,
  },
  {
    id: "kinley-water",
    name: "Kinley Packaged Drinking Water",
    brand: "Coca-Cola",
    category: "Beverages",
    description: "Packaged drinking water with added minerals.",
    weight: "1L",
    isVeg: true,
    ingredients: ["Water", "Magnesium Sulphate", "Potassium Bicarbonate"],
    imageUrl: null,
  },
  {
    id: "center-fresh-gum",
    name: "Center Fresh",
    brand: "Perfetti",
    category: "Chocolates & Sweets",
    description: "India's most popular liquid filled chewing gum.",
    weight: "1.5g",
    isVeg: true,
    ingredients: ["Sugar", "Gum Base", "Liquid Glucose", "Humectant (INS 422)", "Emulsifier (INS 322)", "Antioxidant (INS 320)", "Synthetic Colors (INS 102, INS 133)", "Artificial Flavoring (Mint)"],
    imageUrl: null,
  }
];

const brands = ["Haldiram's", "Britannia", "Parle", "ITC", "Nestle", "Amul", "Pepsico", "Coca-Cola", "Dabur", "Patanjali", "MTR", "Mother Dairy", "Gits", "Kellogg's", "Bikano"];
const adjectives = ["Spicy", "Sweet", "Classic", "Desi", "Premium", "Nutty", "Crunchy", "Golden", "Rich", "Tangy", "Zesty", "Magic", "Achaari", "Masaledar", "Oven Baked", "Diet"];
const baseProducts = [
  { cat: "Chips & Snacks", types: ["Potato Chips", "Corn Puffs", "Khakhra", "Nachos", "Rings"], ingredients: ["Potato", "Corn", "Palm Oil", "Salt", "Spices", "INS 627", "INS 631", "INS 330", "Maltodextrin", "Hydrolyzed Vegetable Protein"] },
  { cat: "Biscuits & Cookies", types: ["Glucose Biscuit", "Butter Cookie", "Oatmeal Cookie", "Digestive", "Cream Biscuit"], ingredients: ["Maida", "Sugar", "Hydrogenated Fat", "Milk Solids", "Maltodextrin", "INS 500(ii)", "Invert Syrup", "INS 503(ii)", "Artificial Flavoring"] },
  { cat: "Beverages", types: ["Cola Drink", "Mango Drink", "Orange Juice", "Energy Drink", "Cold Coffee", "Fruit Nectar"], ingredients: ["Water", "Sugar", "Liquid Glucose", "Carbonated Water", "INS 150d", "INS 211", "INS 330", "INS 444", "High Fructose Corn Syrup"] },
  { cat: "Namkeen", types: ["Bhujia", "Navratan Mix", "Moong Dal", "Sev", "Mixture", "Khatta Meetha"], ingredients: ["Gram Flour", "Palm Oil", "Salt", "Spices", "TBHQ (INS 319)", "INS 551", "Raisins", "Sugar"] },
  { cat: "Dairy", types: ["Flavored Milk", "Cheese Slices", "Paneer", "Yogurt", "Lassi", "Buttermilk"], ingredients: ["Milk", "Sugar", "Artificial Flavoring", "INS 407", "Milk Solids", "INS 211"] },
  { cat: "Chocolates & Sweets", types: ["Milk Chocolate", "Dark Chocolate", "Caramel Bar", "Fruit Jelly", "Eclairs"], ingredients: ["Sugar", "Cocoa Solids", "Palm Oil", "Lecithin (INS 322)", "Maltodextrin", "INS 129", "INS 102", "INS 110", "Milk Solids"] },
  { cat: "Sauces & Spreads", types: ["Tomato Ketchup", "Mayonnaise", "Jam", "Peanut Butter", "Garlic Sauce", "Chilli Sauce"], ingredients: ["Sugar", "Water", "Tomato Paste", "Palm Oil", "Liquid Glucose", "INS 211", "INS 330", "INS 440", "INS 385", "Starch"] },
  { cat: "Instant Noodles", types: ["Atta Noodles", "Masala Noodles", "Chicken Noodles", "Schezwan Noodles"], ingredients: ["Refined Wheat Flour (Maida)", "Palm Oil", "Salt", "INS 412", "INS 501(i)", "Sugar", "INS 627", "INS 631", "Dehydrated Vegetables", "Hydrolyzed Vegetable Protein"] },
];

let generatedCount = manualProducts.length;
let newProductsStr = ",\n" + manualProducts.map(p => `  ${JSON.stringify(p, null, 4).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, '\n  ')}`).join(",\n");
newProductsStr += ",\n";

for (let i = 0; i < 200; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const base = baseProducts[Math.floor(Math.random() * baseProducts.length)];
  const type = base.types[Math.floor(Math.random() * base.types.length)];
  
  const name = `${adj} ${type}`;
  const id = `gen-${brand.toLowerCase().replace(/[^a-z]/g, '')}-${name.toLowerCase().replace(/[^a-z]/g, '-')}-${i}`;
  
  // Take a subset of ingredients
  const shuffledIng = [...base.ingredients].sort(() => 0.5 - Math.random());
  const selectedIng = shuffledIng.slice(0, Math.floor(Math.random() * 4) + 4);
  
  newProductsStr += `  {
    id: "${id}",
    name: "${name}",
    brand: "${brand}",
    category: "${base.cat}",
    description: "Expanded database ${type} variant from ${brand}.",
    weight: "${Math.floor(Math.random() * 200 + 50)}g",
    isVeg: ${Math.random() > 0.2},
    ingredients: ${JSON.stringify(selectedIng)},
    imageUrl: null,
  },\n`;
  generatedCount++;
}

content = content.slice(0, insertIndex) + newProductsStr + content.slice(insertIndex);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully added " + generatedCount + " products");
