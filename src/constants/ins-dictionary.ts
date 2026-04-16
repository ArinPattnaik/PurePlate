export type RiskLevel = 'Safe' | 'Caution' | 'High Risk';

export interface INSEntry {
  code: string;
  name: string;
  risk: RiskLevel;
  description: string;
}

export const insDictionary: Record<string, INSEntry> = {
  '102': {
    code: '102',
    name: 'Tartrazine',
    risk: 'High Risk',
    description: 'A synthetic lemon yellow azo dye primarily used as a food coloring. It is known to cause allergic reactions and hyperactivity in children.',
  },
  '110': {
    code: '110',
    name: 'Sunset Yellow FCF',
    risk: 'High Risk',
    description: 'A synthetic yellow azo dye. It may cause allergic reactions and is linked to hyperactivity in children. Banned in some countries.',
  },
  '124': {
    code: '124',
    name: 'Ponceau 4R',
    risk: 'High Risk',
    description: 'A synthetic red azo dye. Linked to allergic reactions and hyperactivity. Often used in candies, jellies, and desserts.',
  },
  '129': {
    code: '129',
    name: 'Allura Red AC',
    risk: 'Caution',
    description: 'A synthetic red dye. Some studies link it to hyperactivity in children, though it is widely used in snacks and beverages.',
  },
  '150c': {
    code: '150c',
    name: 'Ammonia Caramel',
    risk: 'Caution',
    description: 'A caramel food coloring produced using ammonia. Contains trace amounts of 4-MEI, a possible human carcinogen.',
  },
  '150d': {
    code: '150d',
    name: 'Sulphite Ammonia Caramel',
    risk: 'Caution',
    description: 'Caramel color widely used in colas. Often contains 4-MEI as a byproduct, which has raised cancer concerns in animal studies.',
  },
  '202': {
    code: '202',
    name: 'Potassium Sorbate',
    risk: 'Safe',
    description: 'A widely used chemical preservative. Generally considered safe and effective at preventing mold and yeast growth.',
  },
  '211': {
    code: '211',
    name: 'Sodium Benzoate',
    risk: 'Caution',
    description: 'A preservative. When mixed with Vitamin C (Ascorbic Acid), it can form benzene, a known carcinogen.',
  },
  '220': {
    code: '220',
    name: 'Sulphur Dioxide',
    risk: 'Caution',
    description: 'A preservative often used in dried fruits and wine. Can trigger severe asthma attacks in sensitive individuals.',
  },
  '250': {
    code: '250',
    name: 'Sodium Nitrite',
    risk: 'High Risk',
    description: 'Used in processed meats. Under high heat, it can form nitrosamines, which are strongly linked to an increased risk of cancer.',
  },
  '319': {
    code: '319',
    name: 'Tertiary Butylhydroquinone (TBHQ)',
    risk: 'Caution',
    description: 'A synthetic antioxidant used to extend the shelf life of oily and fatty foods. High doses shown to cause tumors in lab animals.',
  },
  '320': {
    code: '320',
    name: 'Butylated Hydroxyanisole (BHA)',
    risk: 'High Risk',
    description: 'An antioxidant used as a preservative. Classified as reasonably anticipated to be a human carcinogen.',
  },
  '407': {
    code: '407',
    name: 'Carrageenan',
    risk: 'Caution',
    description: 'Extracted from red seaweed and used to thicken foods. Some evidence suggests it may cause digestive inflammation.',
  },
  '412': {
    code: '412',
    name: 'Guar Gum',
    risk: 'Safe',
    description: 'A natural fiber extracted from guar beans used as a thickener and stabilizer. Safe for most people in normal amounts.',
  },
  '621': {
    code: '621',
    name: 'Monosodium Glutamate (MSG)',
    risk: 'Caution',
    description: 'A flavor enhancer. While deemed safe by FDA, it can cause transient symptoms like headaches or flushing in sensitive individuals.',
  },
  '951': {
    code: '951',
    name: 'Aspartame',
    risk: 'Caution',
    description: 'An artificial non-saccharide sweetener. Classified as "possibly carcinogenic to humans" by WHO\'s cancer research agency.',
  },
  '955': {
    code: '955',
    name: 'Sucralose',
    risk: 'Caution',
    description: 'An artificial sweetener. Recent studies suggest it may alter gut microbiome and affect insulin sensitivity over time.',
  }
};
