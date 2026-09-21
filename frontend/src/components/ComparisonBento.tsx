"use client";

import React from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

export const ComparisonBento: React.FC = () => {
  const comparisons = [
    {
      feature: "Commercial Privacy & Confidentiality",
      legacyRwa: "Public Ledger Exposure",
      legacyDesc: "Competitors and MEV bots track client pricing margins, volumes, and trade routes in plaintext on open block explorers.",
      mudraa: "SPL Token-2022 Homomorphic Shielding",
      mudraaDesc: "Encrypted balances and transfer extensions. ZK proofs verify solvency without ever revealing underlying invoice terms.",
      advantage: "100% Confidential",
    },
    {
      feature: "Systemic Duplicate-Pledge Fraud",
      legacyRwa: "Multi-Financing Vulnerability",
      legacyDesc: "The identical invoice is pledged across multiple financial institutions simultaneously due to isolated off-chain databases.",
      mudraa: "Consensus-Level Global Nullifier Defense",
      mudraaDesc: "The Anti-Fraud Citadel (Senapati) enforces deterministic canonical hash uniqueness across all participating credit pools.",
      advantage: "Zero Fraud Possible",
    },
    {
      feature: "Physical Freight Provenance",
      legacyRwa: "Opaque Unverified Paper Scans",
      legacyDesc: "Lenders disburse capital on scanned PDF invoices and promises, disconnected from actual maritime or air cargo movement.",
      mudraa: "Multimodal Carrier IoT & AIS Oracles",
      mudraaDesc: "Disbursement unlocks strictly upon automated GPS terminal release and cryptographically signed Bills of Lading.",
      advantage: "Real-World Provenance",
    },
    {
      feature: "Cross-Border Legal Enforceability",
      legacyRwa: "Unenforceable Digital Wrappers",
      legacyDesc: "Subordinated or voided in international bankruptcy courts during debtor insolvency due to lack of statutory lien perfection.",
      mudraa: "UNCITRAL MLETR Perfection",
      mudraaDesc: "Digital negotiable instruments perfected under statutory model laws with explicit priority covenants.",
      advantage: "Institutional Recourse",
    },
  ];

  return (
    <section id="comparison" className="relative py-28 bg-[#06070B] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-[-0.03em] text-white mb-4">
            Legacy RWAs vs. <span className="text-mudraa-green">MudrAA</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Existing protocols forced enterprises into a fatal dilemma: sacrifice commercial trade secrets on a public ledger, or trust an opaque centralized black box. MudrAA eliminates this compromise.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl bg-[#0C0E1C]/80 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-glass flex flex-col justify-between"
            >
              {/* Feature Header */}
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">
                    {item.feature}
                  </h3>
                  <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-mudraa-green/15 text-mudraa-green border border-mudraa-green/30 font-bold">
                    {item.advantage}
                  </span>
                </div>

                {/* Legacy RWA Flaw Box */}
                <div className="mb-4 p-4 sm:p-5 rounded-2xl bg-red-950/20 border border-red-900/30">
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold mb-1.5">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Legacy RWAs: {item.legacyRwa}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {item.legacyDesc}
                  </p>
                </div>

                {/* MudrAA Sovereign Fix Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-mudraa-cyan/10 to-mudraa-purple/10 border border-mudraa-cyan/30 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-mono text-mudraa-cyan font-bold mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-mudraa-cyan shrink-0" />
                    <span>MudrAA: {item.mudraa}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {item.mudraaDesc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
