export type RiskLevel = "High" | "Moderate" | "Low";

export interface INSEntry {
  name: string;
  type: string;
  risk: RiskLevel;
  description: string;
}

// Comprehensive INS Dictionary — 50+ codes commonly found in Indian FMCG
export const INS_DICTIONARY: Record<string, INSEntry> = {};

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
