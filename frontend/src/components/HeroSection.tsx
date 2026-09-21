"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Lock,
  Zap,
  Sparkles,
  Info,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const [activePillar, setActivePillar] = useState<string>("SACHIV");

  const nodes = [
    { id: "PESHAWA", label: "PESHAWA", title: "Executive Dispatcher", color: "#00F2FE", pos: "top-2 left-1/2 -translate-x-1/2", desc: "High-throughput Anchor instruction orchestration & atomic dispatch." },
    { id: "AMATYA", label: "AMATYA", title: "Treasury & Risk Vaults", color: "#F59E0B", pos: "right-0 top-1/4", desc: "Multi-tranche liquidity architecture and dynamic yield balancing." },
    { id: "SACHIV", label: "SACHIV", title: "Sovereign Commitment Seal", color: "#14F195", pos: "right-2 top-1/2", desc: "Rajmudra ZK-verification engine generating mathematical state proofs." },
    { id: "SUMANT", label: "SUMANT", title: "External Trade Gateway", color: "#9945FF", pos: "right-2 bottom-1/4", desc: "Peppol BIS 3.0 e-invoice & maritime IoT logistics ingestion." },
    { id: "SENAPATI", label: "SENAPATI", title: "Anti-Fraud Citadel", color: "#F59E0B", pos: "bottom-2 left-1/2 -translate-x-1/2", desc: "Deterministic runtime replay defense preventing duplicate pledges." },
    { id: "NYAYADHISH", label: "NYAYADHISH", title: "Legal Recourse Engine", color: "#00F2FE", pos: "left-2 bottom-1/4", desc: "Digital negotiable instrument perfection under UNCITRAL MLETR." },
    { id: "PANDITRAO", label: "PANDITRAO", title: "Compliance Guardian", color: "#FCD34D", pos: "left-0 top-1/2", desc: "Scoped zero-knowledge viewing keys for institutional regulatory audit." },
    { id: "WAKNAVIS", label: "WAKNAVIS", title: "Shielded Intelligence", color: "#9945FF", pos: "left-2 top-1/4", desc: "Confidential SPL Token-2022 extension rails for enterprise privacy." },
  ];

  const currentPillar = nodes.find((n) => n.id === activePillar) || nodes[2];

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden pt-28 sm:pt-32 pb-16">
      {/* Circuit & Solar Aura Background Overlays */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] gold-solar-halo pointer-events-none -z-10 blur-3xl opacity-75" />
      <div className="absolute top-10 left-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#9945FF]/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6 z-10">
          {/* Sovereign Pulse Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111318]/90 border border-[#00F2FE]/30 text-[#00F2FE] font-mono text-xs shadow-[0_0_20px_rgba(0,242,254,0.15)] flex-wrap">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
            <span className="tracking-wide font-medium">SOVEREIGN L1 TRADE LIQUIDITY PROTOCOL</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 text-[#14F195] font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14F195]" />
              <span>SOLANA PROOF-OF-HISTORY</span>
            </div>
          </div>

          {/* Sanskrit Sovereign Epigraph */}
          <div className="border-l-2 border-[#F59E0B]/60 pl-4 py-1">
            <p className="font-devanagari text-[#FCD34D] text-sm sm:text-base tracking-wide font-medium">
              ॥ प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता शाहसूनोः शिवस्यैषा मुद्रा भद्राय राजते ॥
            </p>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              The Royal Seal of Sovereign Trade Integrity — Re-engineered in Rust &amp; ZK-Circuits
            </p>
          </div>

          {/* Main Regal Headline */}
          <h1 className="font-headline text-4xl sm:text-6xl lg:text-[68px] leading-[1.08] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-slate-100 tracking-tight">
            Reign Over Your Digital Assets
          </h1>

          {/* Subtitle */}
          <p className="font-body text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
            Fusing Chhatrapati Shivaji Maharaj’s Ashta Pradhan governance with Solana cryptographic cybernetics. 
            Eliminating duplicate-pledge trade fraud via the zero-knowledge{" "}
            <span className="text-[#F59E0B] font-medium">Rajmudra Verification Engine</span> and SPL Token-2022 confidential liquidity channels.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            <Link
              href="/vaults"
              className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body font-bold text-sm tracking-wide rounded hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all active:scale-95 group cursor-pointer w-full sm:w-auto"
            >
              <span>Enter the Vaults</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#institutions"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#111318]/90 border border-[#F59E0B]/30 hover:border-[#F59E0B]/70 text-slate-200 hover:text-[#FCD34D] font-body font-semibold text-sm rounded backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 text-[#F59E0B]" />
              <span>Whitepaper &amp; Circuit Specs</span>
            </a>
          </div>

          {/* Security Badges Mini Strip */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-6 pt-3 text-slate-400 font-mono text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#14F195]" />
              <span>Dual Formal Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00F2FE]" />
              <span>MLETR Digital Perfection</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#9945FF]" />
              <span>0% Fraud Rehypothecation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Ashtakona Sovereign Medallion & Cybernetic Orbit */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none mt-6 lg:mt-0">
          {/* Outer Concentric Orbit Rings & Interactive Nodes */}
          <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
            {/* Radiating Circuit Trace SVG */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin-reverse opacity-45 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 500 500"
            >
              <circle cx="250" cy="250" r="230" stroke="#9945FF" strokeDasharray="4 8" strokeWidth="1" />
              <circle cx="250" cy="250" r="190" stroke="#00F2FE" strokeOpacity="0.3" strokeWidth="1" />
              <circle cx="250" cy="250" r="150" stroke="#F59E0B" strokeDasharray="12 12" strokeWidth="1" />
              <path d="M250 20 L250 60 M250 440 L250 480 M20 250 L60 250 M440 250 L480 250" stroke="#00F2FE" strokeWidth="1.5" />
              <path d="M87 87 L115 115 M385 385 L413 413 M87 413 L115 385 M385 115 L413 87" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="250" cy="20" fill="#00F2FE" r="4" />
              <circle cx="480" cy="250" fill="#9945FF" r="4" />
              <circle cx="20" cy="250" fill="#14F195" r="4" />
              <circle cx="250" cy="480" fill="#F59E0B" r="4" />
            </svg>

            {/* 8 Floating Interactive Pillar Badges */}
            <div className="absolute inset-0 z-20">
              {nodes.map((node) => {
                const isSelected = activePillar === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActivePillar(node.id)}
                    className={`absolute ${node.pos} font-mono text-[9px] px-2 py-0.5 rounded transition-all duration-200 cursor-pointer shadow-lg ${
                      isSelected
                        ? "bg-[#161B30] border-2 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-30"
                        : "bg-[#111318]/90 border border-slate-700/60 hover:scale-105"
                    }`}
                    style={{
                      borderColor: isSelected ? node.color : undefined,
                      color: node.color,
                    }}
                    title={`Inspect ${node.title}`}
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>

            {/* Outer Ashtakona Radiant Halo */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#F59E0B]/40 via-[#9945FF]/30 to-[#00F2FE]/40 ashtakona-shape p-1 flex items-center justify-center shadow-[0_0_70px_rgba(245,158,11,0.35)]">
              {/* Middle Ashtakona Dark Void Layer */}
              <div className="w-full h-full bg-[#06070A] ashtakona-shape p-2 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-[#111318] via-[#06070A] to-[#111318] border border-[#F59E0B]/40 ashtakona-shape flex flex-col items-center justify-center p-5 text-center relative overflow-hidden">
                  {/* Internal Gold Guilloche pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:12px_12px]" />

                  {/* Inner Golden Core */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F59E0B]/10 border border-[#F59E0B] ashtakona-shape flex items-center justify-center mb-2 shadow-[inset_0_0_20px_rgba(245,158,11,0.6)]">
                      <span className="font-devanagari text-xl sm:text-2xl font-black text-[#FCD34D] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                        ॥ मुद्रा ॥
                      </span>
                    </div>

                    <span className="font-headline text-base sm:text-lg font-bold tracking-[0.25em] text-[#FCD34D] uppercase">
                      M U D R A A
                    </span>
                    <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-[#00F2FE] uppercase mt-0.5">
                      SOVEREIGN LIQUIDITY
                    </span>

                    <div className="h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent my-2" />

                    {/* Hash & Verifier Telemetry */}
                    <span className="font-mono text-[8px] text-slate-400">
                      SEC-P256K1 // SHA-256
                    </span>
                    <span className="font-mono text-[8px] text-[#14F195] tracking-tight mt-0.5">
                      RAJMUDRA-ZK-ENGINE v3.4.12
                    </span>
                  </div>

                  {/* Corner Accent Pins */}
                  <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 bg-[#F59E0B]/80 rounded-full" />
                  <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#F59E0B]/80 rounded-full" />
                  <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 bg-[#F59E0B]/80 rounded-full" />
                  <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 bg-[#F59E0B]/80 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Selected Pillar Info Pill */}
          <div className="mt-5 w-full max-w-sm px-4 py-2 rounded-xl bg-[#111318]/85 border border-slate-800 backdrop-blur-md flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentPillar.color }} />
              <span className="text-slate-200 font-bold">{currentPillar.title}</span>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
              {currentPillar.desc}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
