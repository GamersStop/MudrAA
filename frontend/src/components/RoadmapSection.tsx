"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export const RoadmapSection: React.FC = () => {
  const milestones = [
    {
      phase: "Phase 01",
      title: "Concept & Ashta Pradhan Synthesis",
      status: "COMPLETED",
      items: [
        "Cryptographic threat modeling against duplicate-pledge fraud",
        "Ashta Pradhan eight-pillar administrative governance synthesis",
        "Legal escrow structuring and UNCITRAL MLETR jurisdictional alignment",
      ],
      current: false,
    },
    {
      phase: "Phase 02",
      title: "Core Solana Program Architecture",
      status: "COMPLETED",
      items: [
        "Anchor v0.30+ smart contract state machine & PDA derivation graph",
        "Multi-tranche liquidity architecture (Senior, Mezzanine, Risk Buffer)",
        "Peppol BIS 3.0 & RFC 8785 canonical JSON invoice hash committers",
      ],
      current: false,
    },
    {
      phase: "Phase 03",
      title: "The Reveal (Submission Milestone)",
      status: "IN PROGRESS",
      items: [
        "Release of the complete on-chain verification engine & ZK circuits",
        "Public launch of the interactive Next.js institutional dashboard & auditor portal",
        "Publication of formal test suites, anti-frontrunning proofs & benchmarks",
      ],
      current: true,
    },
    {
      phase: "Phase 04",
      title: "Mainnet Canary & Underwriter Pilot",
      status: "UPCOMING",
      items: [
        "Production pilot with verified cross-border SME export corridors",
        "Institutional credit desks liquidity deployment into Senior tranches",
        "Carrier IoT multi-modal freight oracle mainnet integration",
      ],
      current: false,
    },
  ];

  return (
    <section id="roadmap" className="relative py-28 bg-[#080A15] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-[-0.03em] text-white mb-4">
            Protocol <span className="text-mudraa-gold">Roadmap</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            From foundational cryptographic architecture to institutional production pilot with live cross-border trade corridors.
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((step, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-3xl flex flex-col justify-between transition-all duration-300 border ${
                step.current
                  ? "bg-gradient-to-b from-[#141B34] to-[#0D1224] border-mudraa-cyan shadow-neon-cyan ring-1 ring-mudraa-cyan/50"
                  : "bg-[#0B0E1B]/80 border-white/5 hover:border-white/15"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {step.phase}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                      step.status === "COMPLETED"
                        ? "bg-mudraa-green/15 text-mudraa-green border border-mudraa-green/30"
                        : step.status === "IN PROGRESS"
                        ? "bg-mudraa-cyan/20 text-mudraa-cyan border border-mudraa-cyan/50 animate-pulse"
                        : "bg-white/5 text-slate-400 border border-white/10"
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-4 tracking-wide">
                  {step.title}
                </h3>

                <ul className="space-y-3 text-xs text-slate-300 font-sans">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5">
                      <span className="text-mudraa-cyan mt-0.5 font-bold">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {step.current && (
                <div className="mt-6 pt-4 border-t border-mudraa-cyan/25 flex items-center gap-2 text-xs font-mono text-mudraa-cyan font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Current Milestone</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
