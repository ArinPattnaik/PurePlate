"use client";

import React, { useEffect, useState } from 'react';
import { RealProduct } from '@/lib/real-data';
import { AlertTriangle, Info, CheckCircle, ShieldAlert, Beaker, Leaf, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeepDiveTableProps {
  product: RealProduct;
}

interface INSEntry {
  code: string;
  name: string;
  type: string;
  risk: string;
  description: string;
}

interface ParsedIngredient {
  originalName: string;
  insCode: string | null;
  dictionaryEntry: INSEntry | null;
  isChemical: boolean;
}

function detectChemicalIngredient(name: string): { isChemical: boolean; concern: string | null } {
  const upper = name.toUpperCase();
  
  if (upper.includes('PALM OIL') || upper.includes('PALMOLEIN')) {
    return { isChemical: true, concern: 'Cheap industrial oil high in saturated fat. Linked to deforestation.' };
  }
  if (upper.includes('HYDROGENATED')) {
    return { isChemical: true, concern: 'Contains trans fats. Strongly linked to cardiovascular disease.' };
  }
  if (upper.includes('MALTODEXTRIN')) {
    return { isChemical: true, concern: 'Highly processed starch with very high glycemic index. Spikes blood sugar.' };
  }
  if (upper.includes('LIQUID GLUCOSE') || upper.includes('GLUCOSE SYRUP')) {
    return { isChemical: true, concern: 'Cheap sugar substitute. High glycemic index, rapid blood sugar spike.' };
  }
  if (upper.includes('INVERT SUGAR') || upper.includes('INVERT SYRUP')) {
    return { isChemical: true, concern: 'Processed sugar designed to prevent crystallization. Still pure sugar.' };
  }
  if (upper.includes('MAIDA') || (upper.includes('REFINED WHEAT FLOUR') && !upper.includes('WHOLE'))) {
    return { isChemical: true, concern: 'Stripped of fiber and nutrients. High glycemic index. Chemically bleached.' };
  }
  if (upper.includes('HYDROLYZED') || upper.includes('HYDROLYSED')) {
    return { isChemical: true, concern: 'Chemically broken-down protein used as flavor enhancer. Hidden MSG source.' };
  }
  if (upper.includes('INTERESTERIFIED')) {
    return { isChemical: true, concern: 'Chemically modified fat. Emerging research links it to insulin resistance.' };
  }
  
  return { isChemical: false, concern: null };
}

export const DeepDiveTable: React.FC<DeepDiveTableProps> = ({ product }) => {
  const [insDictionary, setInsDictionary] = useState<Record<string, INSEntry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ins')
      .then(res => res.json())
      .then(data => {
        const map: Record<string, INSEntry> = {};
        if (Array.isArray(data)) {
          data.forEach((item: INSEntry) => { map[item.code] = item; });
        }
        setInsDictionary(map);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-8 text-center flex flex-col items-center">
        <Loader2 className="w-6 h-6 text-[#f7ac32] animate-spin mb-4" />
        <p className="font-mono mt-2 text-[#f4ecd8]/40 uppercase tracking-widest text-xs">Loading ingredient dictionary...</p>
      </div>
    );
  }

  const parsedIngredients: ParsedIngredient[] = product.ingredients.flatMap((ingredient): ParsedIngredient[] => {
    const insRegex = /INS\s*(\d+[a-zA-Z]?(?:\([ivx]+\))?)/gi;
    const matches = [...ingredient.matchAll(insRegex)];
    
    const { isChemical } = detectChemicalIngredient(ingredient);
    
    if (matches.length === 0) {
      return [{
        originalName: ingredient,
        insCode: null,
        dictionaryEntry: null,
        isChemical,
      }];
    }

    return matches.map(match => {
      const rawCode = match[1].replace(/\([ivx]+\)/i, '').toUpperCase();
      const dictKey = `INS ${rawCode}`;
      const entry = insDictionary[dictKey] || null;
      return {
        originalName: ingredient,
        insCode: dictKey,
        dictionaryEntry: entry,
        isChemical: isChemical || (entry?.risk === 'High' || entry?.risk === 'Moderate'),
      };
    });
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-[#E0005C] bg-[#E0005C]/10 border-[#E0005C]/30';
      case 'Moderate': return 'text-[#f7ac32] bg-[#f7ac32]/10 border-[#f7ac32]/30';
      case 'Low': return 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50';
      default: return 'text-zinc-400 bg-zinc-900/50 border-zinc-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <ShieldAlert className="w-4 h-4 mr-1.5" />;
      case 'Moderate': return <AlertTriangle className="w-4 h-4 mr-1.5" />;
      case 'Low': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  const flaggedIngredients = parsedIngredients.filter(i => i.dictionaryEntry || i.isChemical);
  const cleanIngredients = parsedIngredients.filter(i => !i.dictionaryEntry && !i.isChemical);

  return (
    <div className="w-full overflow-hidden">
      {flaggedIngredients.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Beaker className="w-4 h-4 text-[#E0005C]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#E0005C]">
              Flagged Ingredients ({flaggedIngredients.length})
            </span>
          </div>
          <div className="rounded-lg border border-[#E0005C]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[#f4ecd8] font-sans">
                <thead className="text-xs uppercase bg-[#E0005C]/5 border-b border-[#E0005C]/20 text-[#E0005C]">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Ingredient</th>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Code</th>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Identity</th>
                    <th scope="col" className="px-4 py-3 font-semibold tracking-wider">Risk Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0005C]/10">
                  {flaggedIngredients.map((item, idx) => {
                    const chemInfo = detectChemicalIngredient(item.originalName);
                    return (
                      <tr key={idx} className="hover:bg-[#E0005C]/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-[#f4ecd8] max-w-[200px]">
                          <span className="line-clamp-2">{item.originalName.replace(/\(INS\s*\d+[a-zA-Z]?(?:\([ivx]+\))?(,\s*INS\s*\d+[a-zA-Z]?(?:\([ivx]+\))?)*\)/gi, '').trim() || item.originalName}</span>
                        </td>
                        <td className="px-4 py-3">
                          {item.insCode ? (
                            <span className="font-mono text-xs bg-[#f7ac32]/10 text-[#f7ac32] px-2 py-1 rounded-md border border-[#f7ac32]/30 whitespace-nowrap">
                              {item.insCode}
                            </span>
                          ) : (
                            <span className="text-[#f4ecd8]/30 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {item.dictionaryEntry ? (
                            <div>
                              <span className="font-semibold text-[#f4ecd8] block text-sm">{item.dictionaryEntry.name}</span>
                              <span className="text-xs text-[#f4ecd8]/50 uppercase tracking-widest">{item.dictionaryEntry.type}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#f4ecd8]/50">Processed Ingredient</span>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          {item.dictionaryEntry ? (
                            <div className="flex flex-col gap-1.5">
                              <div className={cn("inline-flex items-center w-max px-2 py-0.5 rounded-full text-xs font-bold border", getRiskColor(item.dictionaryEntry.risk))}>
                                {getRiskIcon(item.dictionaryEntry.risk)}
                                {item.dictionaryEntry.risk} Risk
                              </div>
                              <p className="text-xs text-[#f4ecd8]/60 leading-relaxed">
                                {item.dictionaryEntry.description}
                              </p>
                            </div>
                          ) : chemInfo.concern ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="inline-flex items-center w-max px-2 py-0.5 rounded-full text-xs font-bold border text-[#f7ac32] bg-[#f7ac32]/10 border-[#f7ac32]/30">
                                <Info className="w-3 h-3 mr-1" />
                                Concern
                              </div>
                              <p className="text-xs text-[#f4ecd8]/60 leading-relaxed">
                                {chemInfo.concern}
                              </p>
                            </div>
                          ) : (
                            <span className="text-[#f4ecd8]/30">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {cleanIngredients.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 px-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-500">
              Clean Ingredients ({cleanIngredients.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cleanIngredients.map((item, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 text-xs font-mono bg-emerald-500/5 border border-emerald-500/20 text-emerald-400/80 rounded-sm"
              >
                {item.originalName}
              </span>
            ))}
          </div>
        </div>
      )}

      {parsedIngredients.length === 0 && (
        <div className="py-8 text-center text-[#f4ecd8]/40 uppercase font-mono tracking-widest text-sm">
          No ingredient data available for this product.
        </div>
      )}
    </div>
  );
};
