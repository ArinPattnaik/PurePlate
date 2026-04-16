"use client";

import React from "react";
import { AnimatedText } from "./AnimatedText";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

export function MethodologyView() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen text-[#f4ecd8] font-sans selection:bg-[#E0005C] selection:text-white">
      <div className="mb-8">
        <h1 className="text-[4rem] md:text-[6rem] leading-[0.9] font-black uppercase tracking-tighter text-[#f7ac32] mb-6">
          <AnimatedText text="THE METHODOLOGY" />
        </h1>
        <div className="dotted_line w-full max-w-md my-6 opacity-30"></div>
        <p className="font-mono text-xl text-[#f4ecd8]/80 leading-relaxed uppercase tracking-widest">
          A brutal examination of industrial food practices.
        </p>
      </div>

      <div className="space-y-16">
        {/* Section 1 */}
        <section className="border-l-4 border-[#f7ac32] pl-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4">
            How We Calculate the 1-10 Score
          </h2>
          <p className="font-mono text-[#f4ecd8]/70 leading-loose mb-4">
            The PurePlate Score is not a simple nutritional grade; it is a measure of transparency and chemical load. We penalize products heavily for obfuscation—such as listing "Flavor Enhancers" without specifying the exact INS codes, or disguising bulk sugar under multiple aliases (Maltodextrin, Liquid Glucose, Invert Sugar). 
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#1c1a17] p-6 border border-[#f7ac32]/20">
              <div className="text-[#4ade80] font-black text-2xl mb-2">8-10: TRUTHFUL</div>
              <p className="text-xs uppercase font-mono text-[#f4ecd8]/50">Clean labels, whole ingredients, zero synthetic colors or controversial preservatives.</p>
            </div>
            <div className="bg-[#1c1a17] p-6 border border-[#E0005C]/30">
              <div className="text-[#E0005C] font-black text-2xl mb-2">1-4: HIGH RISK</div>
              <p className="text-xs uppercase font-mono text-[#f4ecd8]/50">Riddled with red flags, synthetic emulsifiers, and known metabolic disruptors.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="border-l-4 border-[#E0005C] pl-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4 flex items-center gap-3">
            <AlertTriangle className="text-[#E0005C]" /> The NOVA Classification System
          </h2>
          <p className="font-mono text-[#f4ecd8]/70 leading-loose">
            We rely heavily on the NOVA framework, which groups foods according to the extent and purpose of the industrial processing they undergo. Products flagged as "Ultra-Processed Foods" (UPFs) contain substances rarely used in kitchens, such as hydrogenated oils, hydrolyzed proteins, and cosmetic additives designed to make highly processed food palatable. 
          </p>
          <p className="font-mono text-[#f4ecd8]/70 leading-loose mt-4">
            According to recent epidemiological studies, diets high in UPFs are strongly linked to increased risks of cardiovascular disease, obesity, and all-cause mortality. PurePlate explicitly marks these chemical signatures.
          </p>
        </section>

        {/* Section 3 */}
        <section className="border-l-4 border-[#f4ecd8]/50 pl-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-4 flex items-center gap-3">
            <Info className="text-[#f7ac32]" /> FSSAI Labeling Loopholes
          </h2>
          <p className="font-mono text-[#f4ecd8]/70 leading-loose">
            Regulatory bodies like the FSSAI allow manufacturers to group critical additives under generic class titles (e.g., "Contains Permitted Synthetic Food Colors"). This legal loophole prevents consumers from knowing whether they are consuming INS 150c (linked to 4-MEI) or relatively safer alternatives.
          </p>
          <div className="bg-[#1c1a17] p-6 mt-6 border border-[#f4ecd8]/10 flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-[#f7ac32] flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#f7ac32] mb-1">Our Stance</h4>
              <p className="text-xs font-mono opacity-60 leading-relaxed uppercase">
                If a manufacturer uses a generic class title instead of an explicit INS code, we automatically penalize their transparency score and apply a default "Moderate Risk" flag simply for hiding the truth.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
