// ============================================================================
// PurePlate Indian FMCG — Types & UI Constants
// All product data has been migrated to PostgreSQL (backend/seed.ts).
// These are UI-only constants used by the frontend for display purposes.
// ============================================================================

export type ProductCategory =
  | "Instant Noodles"
  | "Chips & Snacks"
  | "Biscuits & Cookies"
  | "Beverages"
  | "Chocolates & Sweets"
  | "Dairy"
  | "Cooking Oil"
  | "Masala & Spices"
  | "Breakfast & Health"
  | "Sauces & Spreads"
  | "Atta & Staples"
  | "Ice Cream"
  | "Namkeen";

export interface IndianProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  weight: string;
  isVeg: boolean;
  ingredients: string[];
  imageUrl: string | null;
}

// Brand color mapping for placeholder generation
export const BRAND_COLORS: Record<string, string> = {
  "Nestle": "#003DA5",
  "Maggi": "#E31837",
  "Lay's": "#FFD700",
  "PepsiCo": "#004B93",
  "ITC": "#003366",
  "Bingo": "#FF6600",
  "Kurkure": "#FF8C00",
  "Haldiram's": "#8B0000",
  "Parle": "#FFD700",
  "Britannia": "#1E3A5F",
  "Sunfeast": "#D4001A",
  "Cadbury": "#4B0082",
  "Mondelez": "#4B0082",
  "Oreo": "#000080",
  "Coca-Cola": "#E31837",
  "Pepsi": "#004B93",
  "Thums Up": "#E31837",
  "Amul": "#FFD700",
  "Mother Dairy": "#006400",
  "Dabur": "#006400",
  "Patanjali": "#FF8C00",
  "Fortune": "#003DA5",
  "Saffola": "#008000",
  "MDH": "#E31837",
  "Everest": "#E31837",
  "MTR": "#FFD700",
  "Kissan": "#E31837",
  "Kellogg's": "#E31837",
  "Quaker": "#003DA5",
  "Frooti": "#FFD700",
  "Paper Boat": "#006400",
  "Bournvita": "#4B0082",
  "Horlicks": "#FF8C00",
  "KitKat": "#E31837",
  "Uncle Chipps": "#FF6600",
  "Act II": "#E31837",
  "Bikano": "#8B0000",
  "Priya": "#E31837",
  "Aashirvaad": "#003366",
  "Maaza": "#FFD700",
  "Real": "#006400",
  "Tropicana": "#FF8C00",
  "Complan": "#003DA5",
  "Veeba": "#E31837",
  "Funfoods": "#FFD700",
  "Nandini": "#006400",
  "Kwality Wall's": "#003DA5",
  "Baskin Robbins": "#FF69B4",
  "Havmor": "#003DA5",
  "Top Ramen": "#E31837",
  "Ching's Secret": "#FF6600",
  "Knorr": "#008000",
  "Sunfeast Yippee": "#D4001A",
  "Pringles": "#E31837",
  "Too Yumm!": "#008000",
  "Ferrero": "#8B4513",
  "Mars": "#8B0000",
  "McVitie's": "#003DA5",
  "Unibic": "#8B4513",
  "Red Bull": "#003DA5",
  "Hershey's": "#8B4513",
  "Del Monte": "#006400",
  "Sundrop": "#FFD700",
  "Gits": "#E31837",
  "Wai Wai": "#E31837",
  "Nissin": "#E31837",
  "Balaji": "#FFD700",
  "Diamond": "#006400",
  "Cornitos": "#FF6600",
  "Tata": "#003DA5",
  "Daawat": "#003DA5",
  "India Gate": "#003DA5",
  "Lijjat": "#FFD700",
  "Naturals": "#006400",
  "Epigamia": "#4B0082",
  "Go": "#FFD700",
  "Yakult": "#E31837",
  "DS Group": "#006400",
  "Perfetti": "#003DA5",
  "ITC Kitchens of India": "#003366",
  "Yoga Bar": "#006400",
  "Bagrry's": "#8B4513",
  "True Elements": "#006400",
  "Soulfull": "#FF8C00",
  "Protinex": "#003DA5",
  "Abbott": "#003DA5",
  "Raw Pressery": "#006400",
  "Bisleri": "#003DA5",
  "Weikfield": "#E31837",
  "Hellmann's": "#003DA5",
  "Oleev": "#006400",
  "Dhara": "#FFD700",
  "Catch": "#E31837",
  "Suhana": "#E31837",
  "Tang": "#FF8C00",
};

export const CATEGORY_EMOJIS: Record<ProductCategory, string> = {
  "Instant Noodles": "🍜",
  "Chips & Snacks": "🥔",
  "Biscuits & Cookies": "🍪",
  "Beverages": "🥤",
  "Chocolates & Sweets": "🍫",
  "Dairy": "🧈",
  "Cooking Oil": "🫒",
  "Masala & Spices": "🌶️",
  "Breakfast & Health": "🥣",
  "Sauces & Spreads": "🫙",
  "Atta & Staples": "🌾",
  "Ice Cream": "🍦",
  "Namkeen": "🥜",
};
