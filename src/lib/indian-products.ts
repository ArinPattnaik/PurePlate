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
