"use client";

import React, { useState } from "react";
import {
  Layers,
  Coins,
  Stamp,
  Globe2,
  ShieldCheck,
  Scale,
  FileKey,
  EyeOff,
  ExternalLink,
  ChevronRight,
  X,
  Info,
} from "lucide-react";

interface Pillar {
  number: string;
  category: string;
  name: string;
  marathi: string;
  englishRole: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  status: string;
  color: string;
  icon: React.ElementType;
  specs: string[];
}

export const AshtaPradhanSection: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  const pillars: Pillar[] = [
    {
      number: "PILLAR 01",
      category: "ORCHESTRATION",
      name: "Executive Dispatcher",
      marathi: "पेशवा",
      englishRole: "Prime Minister / Dispatcher",
      description:
        "High-throughput Anchor instruction orchestration and multi-program pipeline execution, ensuring atomic swaps and zero-slippage settlement routing.",
      metricLabel: "Latency",
      metricValue: "1.2ms",
      status: "ACTIVE",
      color: "#00F2FE",
      icon: Layers,
      specs: [
        "Anchor Program Dispatcher v0.30",
        "Atomic cross-program invocations (CPI)",
        "Deterministic instruction reordering protection",
        "Zero-slippage AMM route coordination",
      ],
    },
    {
      number: "PILLAR 02",
      category: "CAPITAL & TREASURY",
      name: "Treasury & Risk Vaults",
      marathi: "अमात्य",
      englishRole: "Finance Minister / Treasurer",
      description:
        "Multi-tranche liquidity architecture with automated risk tranches, dynamic yield balancing, and collateralization ratios audited in real-time.",
      metricLabel: "Utilization",
      metricValue: "88.4%",
      status: "SOLVENT",
      color: "#14F195",
      icon: Coins,
      specs: [
        "Senior/Mezzanine/Junior tranche tranching",
        "Dynamic APY yield calculation engine",
        "Real-time collateral ratio oracle feeds",
        "Automated circuit breaker on depeg > 0.5%",
      ],
    },
    {
      number: "PILLAR 03",
      category: "COMMITMENT CORE",
      name: "Sovereign Commitment Seal",
      marathi: "सचिव",
      englishRole: "Record Keeper & State Seal",
      description:
        "The Rajmudra zero-knowledge verification engine. Generates cryptographic state commitment proofs for global trade obligations without exposing commercially sensitive metadata.",
      metricLabel: "Proofs",
      metricValue: "142.8K",
      status: "SEALED",
      color: "#F59E0B",
      icon: Stamp,
      specs: [
        "Groth16 / BN254 elliptic curve verification",
        "alt_bn128 syscall acceleration on Solana",
        "Zero-knowledge invoice hash commitments",
        "Sub-50ms prover runtime benchmarks",
      ],
    },
    {
      number: "PILLAR 04",
      category: "EXTERNAL ORACLES",
      name: "External Trade Gateway",
      marathi: "सुमंत",
      englishRole: "Foreign Envoy / Gateway",
      description:
        "Ingesting electronic invoices, Peppol BIS 3.0 messages, and IoT container telemetry directly on-chain through decentralized Pyth & Switchboard feeds.",
      metricLabel: "Sync",
      metricValue: "Live Feed",
      status: "SYNCHRONIZED",
      color: "#9945FF",
      icon: Globe2,
      specs: [
        "Peppol BIS 3.0 canonical invoice parser",
        "AIS vessel maritime GPS milestone validation",
        "Customs declaration oracle integration",
        "RFC 8785 JSON canonical data serialization",
      ],
    },
    {
      number: "PILLAR 05",
      category: "DEFENSE & REPLAY",
      name: "Anti-Fraud Citadel",
      marathi: "सेनापती",
      englishRole: "Commander-in-Chief / Defense",
      description:
        "Deterministic runtime replay defense preventing double-pledging of collateral across disparate banking registries and jurisdictions globally.",
      metricLabel: "Collisions",
      metricValue: "0",
      status: "FORTIFIED",
      color: "#F59E0B",
      icon: ShieldCheck,
      specs: [
        "Global Merkle tree of pledge commitments",
        "Deterministic collision prevention in Solana runtime",
        "Cross-corridor double-financing elimination",
        "Real-time fraud attempt penalty slashers",
      ],
    },
    {
      number: "PILLAR 06",
      category: "MLETR JURISPRUDENCE",
      name: "Legal Recourse Engine",
      marathi: "न्यायाधीश",
      englishRole: "Chief Justice / Law",
      description:
        "Digital negotiable instrument perfection under UNCITRAL Model Law on Electronic Transferable Records (MLETR) with cryptographic dispute arbitration clauses.",
      metricLabel: "Jurisdictions",
      metricValue: "42",
      status: "ENFORCEABLE",
      color: "#00F2FE",
      icon: Scale,
      specs: [
        "UNCITRAL MLETR Article 10 compliance",
        "Electronic Bill of Lading (eBL) transferability",
        "Multi-jurisdiction dispute waiver protocols",
        "Legally perfect digital possessory title",
      ],
    },
    {
      number: "PILLAR 07",
      category: "COMPLIANCE ATTESTATION",
      name: "Compliance Guardian",
      marathi: "पंडितराव",
      englishRole: "High Priest / Compliance",
      description:
        "Scoped zero-knowledge viewing keys and AML/KYC cryptographic attestations enabling Tier-1 institutions to satisfy sovereign banking directives while preserving privacy.",
      metricLabel: "KYC Proofs",
      metricValue: "Instant",
      status: "COMPLIANT",
      color: "#FCD34D",
      icon: FileKey,
      specs: [
        "Selective viewing key generation for auditors",
        "Zero-knowledge KYC/AML identity credentials",
        "FINMA / MAS / FATF Travel Rule compatibility",
        "Immutable audit trial without public surveillance",
      ],
    },
    {
      number: "PILLAR 08",
      category: "SHIELDED INTELLIGENCE",
      name: "Shielded Intelligence Layer",
      marathi: "वाकनीस",
      englishRole: "Intelligence / Confidentiality",
      description:
        "Confidential SPL Token-2022 extension rails keeping corporate balances, invoicing volume, and payment histories completely shielded from competitors on public explorers.",
      metricLabel: "Privacy",
      metricValue: "Zero Leakage",
      status: "SHIELDED",
      color: "#9945FF",
      icon: EyeOff,
      specs: [
        "SPL Token-2022 confidential transfer extension",
        "ElGamal homomorphic balance encryption",
        "Twisted ElGamal cryptographic range proofs",
        "Competitor-blind balance shielding on public explorers",
      ],
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto relative" id="architecture">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded text-[#FCD34D] font-mono text-xs uppercase tracking-widest mb-3">
          <span className="font-devanagari font-bold">॥ अष्टप्रधान व्यवस्था ॥</span>
          <span>•</span>
          <span>Crypto-Sovereignty</span>
        </div>

        <h2 className="font-headline text-3xl sm:text-5xl font-bold text-[#F59E0B] tracking-tight max-w-3xl">
          The Eight Pillars of Sovereign Governance
        </h2>

        <p className="font-body text-slate-300 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
          Inspired by the 8 council ministers of Chhatrapati Shivaji Maharaj, re-architected as high-throughput Solana cryptographic engines to safeguard institutional trade finance.
        </p>
      </div>

      {/* 8-Card Matrix in a 4x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.number}
              onClick={() => setSelectedPillar(pillar)}
              className="bg-[#111318]/80 border border-[#F59E0B]/25 hover:border-[#F59E0B] transition-all duration-300 rounded-xl p-6 flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] cursor-pointer relative overflow-hidden backdrop-blur-md"
            >
              {/* Subtle card glow accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl pointer-events-none rounded-full"
                style={{ backgroundColor: pillar.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 ashtakona-shape flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border"
                    style={{
                      backgroundColor: `${pillar.color}15`,
                      borderColor: `${pillar.color}50`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                  </div>

                  <span
                    className="font-devanagari text-xs font-semibold px-2 py-0.5 rounded border"
                    style={{
                      color: pillar.color,
                      backgroundColor: `${pillar.color}10`,
                      borderColor: `${pillar.color}30`,
                    }}
                  >
                    {pillar.marathi}
                  </span>
                </div>

                <div
                  className="font-mono text-[10px] tracking-widest uppercase font-semibold"
                  style={{ color: pillar.color }}
                >
                  {pillar.number} // {pillar.category}
                </div>

                <h3 className="font-headline text-lg font-bold text-slate-100 mt-1 mb-2 group-hover:text-[#FCD34D] transition-colors">
                  {pillar.name}
                </h3>

                <p className="font-body text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  {pillar.metricLabel}: <strong className="text-slate-200">{pillar.metricValue}</strong>
                </span>
                <span
                  className="font-bold tracking-wider px-1.5 py-0.5 rounded text-[10px]"
                  style={{
                    color: pillar.color,
                    backgroundColor: `${pillar.color}15`,
                  }}
                >
                  {pillar.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Detail Modal / Drawer */}
      {selectedPillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#0B0D13] border-2 border-[#F59E0B]/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.3)]">
            <button
              onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 ashtakona-shape flex items-center justify-center border"
                style={{
                  backgroundColor: `${selectedPillar.color}20`,
                  borderColor: selectedPillar.color,
                }}
              >
                {React.createElement(selectedPillar.icon, {
                  className: "w-7 h-7",
                  style: { color: selectedPillar.color },
                })}
              </div>
              <div>
                <span className="font-mono text-xs text-[#00F2FE] font-bold">
                  {selectedPillar.number} • {selectedPillar.category}
                </span>
                <h3 className="font-headline text-2xl font-bold text-white">
                  {selectedPillar.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-devanagari text-sm text-[#FCD34D] font-bold">
                    {selectedPillar.marathi}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({selectedPillar.englishRole})
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {selectedPillar.description}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="font-mono text-xs uppercase text-slate-400 tracking-wider font-semibold">
                Cryptographic Specifications &amp; Architecture:
              </h4>
              <ul className="space-y-2">
                {selectedPillar.specs.map((spec, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-[#111318] p-2.5 rounded-lg border border-slate-800"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: selectedPillar.color }}
                    />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-400">
                Live Status:{" "}
                <span className="font-bold" style={{ color: selectedPillar.color }}>
                  {selectedPillar.status}
                </span>
              </span>
              <button
                onClick={() => setSelectedPillar(null)}
                className="px-4 py-2 bg-[#F59E0B] text-[#06070A] font-bold rounded hover:brightness-110 cursor-pointer"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
