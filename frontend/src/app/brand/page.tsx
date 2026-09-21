"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Copy,
  Check,
  Layers,
  Coins,
  Stamp,
  Globe2,
  ShieldCheck,
  Scale,
  FileKey,
  EyeOff,
  Cpu,
  ArrowRight,
  ExternalLink,
  Sliders,
  Type,
  Palette,
  Sparkles,
  Lock,
  ChevronRight,
  Landmark,
} from "lucide-react";

interface ColorToken {
  name: string;
  varName: string;
  hex: string;
  role: string;
  contrast: string;
  lightText?: boolean;
}

export default function BrandPage() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [specimenText, setSpecimenText] = useState("MudrAA Sovereign Verification Engine on Solana L1");
  const [specimenSize, setSpecimenSize] = useState(36);
  const [activeCategory, setActiveCategory] = useState<"all" | "obsidian" | "gold" | "solana">("all");

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const colorPalette: Record<string, ColorToken[]> = {
    obsidian: [
      {
        name: "Mudra Obsidian Ground",
        varName: "--color-mudraa-obsidian",
        hex: "#06070A",
        role: "Primary Canvas Ground (Absolute Void)",
        contrast: "21.0:1 on White",
      },
      {
        name: "Mudra Dark Surface",
        varName: "--color-mudraa-dark",
        hex: "#0A0C14",
        role: "Elevated Structural Containers & Section BGs",
        contrast: "18.2:1 on White",
      },
      {
        name: "Mudra Card Glass",
        varName: "--color-mudraa-card",
        hex: "#101322",
        role: "Glassmorphic Cards, Panels & Modal Surfaces",
        contrast: "14.5:1 on White",
      },
      {
        name: "Mudra Border Standard",
        varName: "--color-mudraa-border",
        hex: "#1C233D",
        role: "Dividers, Subtle Separators & Inactive Borders",
        contrast: "7.8:1 on Foreground",
      },
      {
        name: "Mudra Border Elevated",
        varName: "--color-mudraa-border-bright",
        hex: "#2D375E",
        role: "Active States, Focus Rings & Card Bevels",
        contrast: "5.4:1 on Foreground",
      },
    ],
    gold: [
      {
        name: "Sacred Rajmudra Gold",
        varName: "--color-mudraa-gold",
        hex: "#F59E0B",
        role: "Royal Epigraph Trim, Sovereign Crest & Accents",
        contrast: "8.2:1 on Obsidian",
      },
      {
        name: "Radiant Gold Epigraph",
        varName: "--color-mudraa-gold-light",
        hex: "#FCD34D",
        role: "Primary Inscription Highlight & Star Motifs",
        contrast: "12.4:1 on Obsidian",
      },
      {
        name: "Aged Temple Bronze",
        varName: "--color-mudraa-gold-dark",
        hex: "#B45309",
        role: "Shadow Boundaries & Deep Gold Filigree",
        contrast: "5.1:1 on Obsidian",
      },
    ],
    solana: [
      {
        name: "Solana Royal Violet",
        varName: "--color-mudraa-purple",
        hex: "#9945FF",
        role: "Solana Heritage, Senior Tranches & Primary CTAs",
        contrast: "4.8:1 on Obsidian",
      },
      {
        name: "Shielded Violet Aurora",
        varName: "--color-mudraa-purple-light",
        hex: "#B46EFF",
        role: "SPL Token-2022 Shielding & Glow Highlights",
        contrast: "7.6:1 on Obsidian",
      },
      {
        name: "Electric Cyan Circuit",
        varName: "--color-mudraa-cyan",
        hex: "#00F2FE",
        role: "ZK Verifier Flow, Circuit Traces & Telemetry",
        contrast: "14.8:1 on Obsidian",
      },
      {
        name: "L1 Consensus Green",
        varName: "--color-mudraa-green",
        hex: "#14F195",
        role: "Consensus Finality, Verified Status & Live Beats",
        contrast: "13.6:1 on Obsidian",
      },
    ],
  };

  const ministers = [
    {
      name: "Peshawa",
      marathi: "पंतप्रधान (पेशवे)",
      title: "The Executive Dispatcher",
      icon: Layers,
      color: "#9945FF",
      solana: "Anchor Instruction Orchestration",
      guarantee: "Sub-second deterministic state transition",
    },
    {
      name: "Amatya",
      marathi: "अमात्य (वित्त मंत्री)",
      title: "The Treasury & Risk Vaults",
      icon: Coins,
      color: "#F59E0B",
      solana: "Multi-Tranche Capital Pools",
      guarantee: "Dynamic first-loss capital preservation",
    },
    {
      name: "Sachiv",
      marathi: "सचिव (दफ्तरदार)",
      title: "The Sovereign Commitment Seal",
      icon: Stamp,
      color: "#00F2FE",
      solana: "Rajmudra ZK-SNARK Prover L1",
      guarantee: "Cryptographic proof of non-repudiation",
    },
    {
      name: "Sumant",
      marathi: "सुमंत (परराष्ट्र)",
      title: "The External Trade Gateway",
      icon: Globe2,
      color: "#14F195",
      solana: "Peppol BIS 3.0 & IoT Oracles",
      guarantee: "Physical cargo GPS terminal synchronization",
    },
    {
      name: "Senapati",
      marathi: "सेनापती (सरनौबत)",
      title: "The Anti-Fraud Citadel",
      icon: ShieldCheck,
      color: "#EF4444",
      solana: "Consensus-Level Duplicate Defense",
      guarantee: "Zero multi-financing or phantom pledges",
    },
    {
      name: "Nyayadhish",
      marathi: "न्यायाधीश (कायदेशीर)",
      title: "The Legal Recourse Engine",
      icon: Scale,
      color: "#FCD34D",
      solana: "UNCITRAL MLETR Paper Law",
      guarantee: "Insolvency-proof digital negotiable title",
    },
    {
      name: "Panditrao",
      marathi: "पंडितराव (धर्माधिकारी)",
      title: "The Compliance Guardian",
      icon: FileKey,
      color: "#38E1FF",
      solana: "Scoped ZK Viewing Keys",
      guarantee: "Regulatory auditability without surveillance",
    },
    {
      name: "Waknavis",
      marathi: "वाकनीस (गुप्तवार्ता)",
      title: "The Shielded Intelligence Layer",
      icon: EyeOff,
      color: "#B46EFF",
      solana: "SPL Token-2022 ElGamal Transfers",
      guarantee: "Total encryption of enterprise margins",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-sans selection:bg-[#9945FF] selection:text-white pb-24">
      {/* Top Floating Navigation */}
      <header className="sticky top-0 z-50 bg-[#08090D]/90 backdrop-blur-2xl border-b border-[#1E2438] px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#9945FF] via-indigo-600 to-[#00F2FE] clip-octagon p-[1.5px] group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#08090D] clip-octagon flex items-center justify-center">
                  <span className="font-serif text-[#FCD34D] text-base font-black">M</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm tracking-[0.16em] font-bold text-white uppercase group-hover:text-[#00F2FE] transition-colors">
                  Mudr<span className="text-[#B46EFF]">AA</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Brand & Visual System</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 border-l border-[#1E2438] pl-6 text-xs font-mono">
              <a href="#heritage" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                Heritage & Seal
              </a>
              <a href="#palette" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                Color Palette
              </a>
              <a href="#typography" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                Typography
              </a>
              <a href="#heraldry" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                Ashta Pradhan
              </a>
              <a href="#components" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors">
                Design Tokens
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vaults"
              className="px-3.5 py-1.5 rounded-xl bg-[#111422] border border-[#2E3654] hover:border-[#00F2FE]/50 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#00F2FE]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 space-y-24">
        {/* Section 1: Sovereign Identity Crest & Brand Thesis */}
        <section id="heritage" className="relative space-y-8 border-b border-[#1E2438] pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111422] border border-[#F59E0B]/30 text-xs font-mono text-[#FCD34D]">
            <Landmark className="w-3.5 h-3.5" />
            <span>Sovereign Administrative Lineage · Maharashtra</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-white uppercase leading-[1.08]">
                MudrAA Brand System & Visual Grammar
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-3xl">
                The visual world of MudrAA rejects generic web3 neon gradients and sterile corporate templates. 
                Rooted in the royal administrative governance of Chhatrapati Shivaji Maharaj&apos;s Ashta Pradhan, 
                our design system embodies a cybernetic mountain fortress on Solana: deep obsidian void, razor-etched electric cyan traces, 
                regal Solana violet shielding, and sacred sovereign gold.
              </p>

              {/* Inscription Plaque */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1020] border border-[#F59E0B]/40 shadow-[0_0_50px_rgba(245,158,11,0.12)] space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#FCD34D] font-bold block">
                  The Royal Rajmudra Epigraph
                </span>
                <p className="font-devanagari text-2xl sm:text-3xl font-bold text-[#FCD34D] leading-relaxed drop-shadow-[0_2px_16px_rgba(245,158,11,0.5)]">
                  प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता शाहसूनोः शिवस्यैषा मुद्रा भद्राय राजते ॥
                </p>
                <p className="text-xs sm:text-sm font-sans text-slate-300 italic pt-2 border-t border-[#1E2438]">
                  &ldquo;The glory of this Mudra of Shiva, the son of Shahaji, will grow like the first day moon. It will be worshiped by the universe and it will shine only for the well-being of the people.&rdquo;
                </p>
              </div>
            </div>

            {/* Geometric Octagonal Emblem Construction */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#9945FF] via-[#00F2FE] to-[#F59E0B] opacity-25 blur-3xl rounded-full animate-pulse" />
                <div className="relative w-56 h-56 clip-octagon bg-gradient-to-br from-[#9945FF] via-indigo-600 to-[#00F2FE] p-[2px] shadow-[0_0_40px_rgba(0,242,254,0.3)]">
                  <div className="w-full h-full clip-octagon bg-[#08090D] flex flex-col items-center justify-center p-6 space-y-2">
                    <span className="font-devanagari text-4xl font-black text-[#FCD34D] drop-shadow-[0_2px_16px_rgba(245,158,11,0.6)]">
                      ॥ मुद्रा ॥
                    </span>
                    <span className="text-xs font-serif tracking-[0.2em] uppercase text-[#00F2FE] font-bold">
                      Ashtakona Seal
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">8-Sided Symmetry</span>
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 max-w-xs">
                The Ashtakona geometry reflects the eight cardinal directions and Chhatrapati Shivaji Maharaj&apos;s Eight Ministers.
              </div>
            </div>
          </div>

          {/* Master Visual Reference Board — Synthesized via Gemini Model */}
          <div className="pt-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FCD34D]" />
                Master Visual Reference Board · Palette, Typography & Heraldry Specimen
              </span>
              <a
                href="/assets/mudraa-visual-reference.jpg"
                target="_blank"
                rel="noreferrer"
                className="text-[#00F2FE] hover:underline flex items-center gap-1"
              >
                <span>View Full-Res Asset</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-[#9945FF]/50 via-[#00F2FE]/40 to-[#F59E0B]/30 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden group">
              <div className="relative rounded-[22px] overflow-hidden aspect-[16/9] bg-[#0A0C14]">
                <Image
                  src="/assets/mudraa-visual-reference.jpg"
                  alt="MudrAA Master Visual Reference Board — Palette, Type, and Graphic Language"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Color Chemistry & Palette Matrix */}
        <section id="palette" className="space-y-8 border-b border-[#1E2438] pb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00F2FE] uppercase tracking-wider">
                <Palette className="w-3.5 h-3.5" />
                <span>Chromatic Strategy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                Obsidian, Sovereign Gold & Cyber-Luminescence
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl font-sans">
                A drenched obsidian canvas with strict mathematical contrast thresholds. Click any token swatch to copy its hex value directly to your clipboard.
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0C0F1E] border border-[#1E2438] text-xs font-mono">
              {(["all", "obsidian", "gold", "solana"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    activeCategory === cat ? "bg-[#1E2438] text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color Chips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(colorPalette)
              .filter(([cat]) => activeCategory === "all" || activeCategory === cat)
              .flatMap(([, tokens]) => tokens)
              .map((token) => (
                <div
                  key={token.hex}
                  onClick={() => copyToClipboard(token.hex)}
                  className="group cursor-pointer rounded-2xl bg-[#0E1120] border border-[#1E2438] hover:border-[#2E3654] p-5 space-y-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Color Swatch Block */}
                  <div
                    className="w-full h-24 rounded-xl flex items-end justify-between p-3.5 shadow-inner border border-white/10"
                    style={{ backgroundColor: token.hex }}
                  >
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded shadow-sm"
                      style={{
                        backgroundColor: token.hex === "#06070A" || token.hex === "#0A0C14" ? "#1E2438" : "rgba(0,0,0,0.6)",
                        color: "#FFFFFF",
                      }}
                    >
                      {token.hex}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-white">
                      {copiedHex === token.hex ? (
                        <>
                          <Check className="w-3 h-3 text-[#14F195]" />
                          <span className="text-[#14F195]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-300" />
                          <span>Copy</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Token Details */}
                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white font-sans">{token.name}</span>
                      <span className="text-slate-400 text-[10px]">{token.contrast}</span>
                    </div>
                    <code className="text-[11px] text-[#00F2FE] block">{token.varName}</code>
                    <p className="text-xs text-slate-400 font-sans pt-1 leading-relaxed">
                      {token.role}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Section 3: Typography System & Live Specimen Tester */}
        <section id="typography" className="space-y-8 border-b border-[#1E2438] pb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FCD34D] uppercase tracking-wider">
              <Type className="w-3.5 h-3.5" />
              <span>Type Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Regal Serifs & Cryptographic Monospaces
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-sans">
              Typography is our primary vehicle of sovereign authority. Cinzel provides monumental architectural presence, 
              Noto Sans Devanagari grounds our historical seal, and JetBrains Mono executes high-precision on-chain telemetry.
            </p>
          </div>

          {/* Type Family Hierarchy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0D1022] border border-[#1E2438] space-y-3">
              <span className="text-[10px] font-mono text-[#FCD34D] uppercase tracking-widest block font-bold">
                Display & Royal
              </span>
              <div className="font-serif text-3xl font-black text-white">Cinzel</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Weights 700, 800, 900. Used exclusively for monumental headlines, imperial titles, and sovereign brand hero banners.
              </p>
              <div className="pt-3 border-t border-[#1E2438] font-mono text-[11px] text-slate-400">
                CSS: <code className="text-[#00F2FE]">font-serif</code>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1022] border border-[#1E2438] space-y-3">
              <span className="text-[10px] font-mono text-[#FCD34D] uppercase tracking-widest block font-bold">
                Historical Seal
              </span>
              <div className="font-devanagari text-3xl font-bold text-[#FCD34D]">मुद्रा लिपि</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Noto Sans Devanagari. Weights 600, 700. For the authentic Chhatrapati Shivaji Maharaj epigraph and ministerial titles.
              </p>
              <div className="pt-3 border-t border-[#1E2438] font-mono text-[11px] text-slate-400">
                CSS: <code className="text-[#00F2FE]">font-devanagari</code>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1022] border border-[#1E2438] space-y-3">
              <span className="text-[10px] font-mono text-[#00F2FE] uppercase tracking-widest block font-bold">
                Interface & Reading
              </span>
              <div className="font-sans text-3xl font-bold text-white">Plus Jakarta</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Weights 400, 500, 600. Optimized for high-density financial underwriting, credit terms, and institutional descriptions.
              </p>
              <div className="pt-3 border-t border-[#1E2438] font-mono text-[11px] text-slate-400">
                CSS: <code className="text-[#00F2FE]">font-sans</code>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1022] border border-[#1E2438] space-y-3">
              <span className="text-[10px] font-mono text-[#14F195] uppercase tracking-widest block font-bold">
                Telemetry & Code
              </span>
              <div className="font-mono text-3xl font-bold text-white">JetBrains</div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Weights 400, 500, 600. Solana PDA hashes, ZK proof calculation telemetry, Peppol identifiers, and token amounts.
              </p>
              <div className="pt-3 border-t border-[#1E2438] font-mono text-[11px] text-slate-400">
                CSS: <code className="text-[#00F2FE]">font-mono</code>
              </div>
            </div>
          </div>

          {/* Interactive Specimen Workbench */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1122] border border-[#2E3654] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2438] pb-4">
              <h3 className="font-serif font-bold text-lg text-white">
                Live Type Specimen Workbench
              </h3>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">Scale: {specimenSize}px</span>
                <input
                  type="range"
                  min="20"
                  max="72"
                  value={specimenSize}
                  onChange={(e) => setSpecimenSize(Number(e.target.value))}
                  className="w-36 h-2 bg-[#1E2438] rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                />
              </div>
            </div>

            <input
              type="text"
              value={specimenText}
              onChange={(e) => setSpecimenText(e.target.value)}
              className="w-full bg-[#08090D] border border-[#1E2438] focus:border-[#00F2FE] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-600 focus:outline-none"
              placeholder="Type specimen preview string..."
            />

            <div className="space-y-6 pt-4 divide-y divide-[#1E2438]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#FCD34D] uppercase tracking-wider block">
                  Cinzel (Royal Display)
                </span>
                <p
                  className="font-serif font-bold text-white tracking-tight leading-tight"
                  style={{ fontSize: `${specimenSize}px` }}
                >
                  {specimenText}
                </p>
              </div>

              <div className="space-y-1 pt-6">
                <span className="text-[10px] font-mono text-[#00F2FE] uppercase tracking-wider block">
                  Plus Jakarta Sans (Interface)
                </span>
                <p
                  className="font-sans font-semibold text-slate-200 leading-tight"
                  style={{ fontSize: `${specimenSize * 0.85}px` }}
                >
                  {specimenText}
                </p>
              </div>

              <div className="space-y-1 pt-6">
                <span className="text-[10px] font-mono text-[#14F195] uppercase tracking-wider block">
                  JetBrains Mono (Telemetry)
                </span>
                <p
                  className="font-mono text-[#14F195] leading-tight"
                  style={{ fontSize: `${specimenSize * 0.75}px` }}
                >
                  {specimenText}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Ashta Pradhan Heraldic Shields */}
        <section id="heraldry" className="space-y-8 border-b border-[#1E2438] pb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B46EFF] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Heraldic Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              The Eight Sovereign Pillars of Ashta Pradhan
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-sans">
              Each ministerial department in Chhatrapati Shivaji Maharaj&apos;s administration is codified as an independent cryptographic module on Solana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ministers.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0D1020] border border-[#1E2438] hover:border-[#2E3654] space-y-4 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                      style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}40`, color: m.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-devanagari font-bold text-[#FCD34D]">
                      {m.marathi}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-white text-base">
                      {m.name}
                    </h3>
                    <div className="text-xs text-slate-300 font-sans mt-0.5">
                      {m.title}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E2438] space-y-1.5 font-mono text-[11px]">
                    <div className="text-[#00F2FE] font-medium">
                      {m.solana}
                    </div>
                    <div className="text-slate-400 font-sans">
                      {m.guarantee}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Design Tokens & Reusable UI Elements */}
        <section id="components" className="space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#14F195] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Component Patterns</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Sovereign Component Specifications
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl font-sans">
              All UI controls comply with strict WCAG AA contrast standards, 8-sided Ashtakona geometric bevels, and animated circuit traces.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Button Specifications */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1020] border border-[#1E2438] space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">
                Action Controls & CTAs
              </h3>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#9945FF] via-indigo-600 to-[#00F2FE] text-white font-bold text-xs tracking-wide shadow-lg shadow-[#00F2FE]/20 flex items-center justify-center gap-2">
                    <span>Primary Sovereign CTA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono text-slate-400">Gradient Fill + Cyan Glow</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#111422] border border-[#2E3654] text-slate-200 font-semibold text-xs tracking-wide hover:border-[#00F2FE]/50 transition-colors flex items-center justify-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#00F2FE]" />
                    <span>Secondary Institutional CTA</span>
                  </button>
                  <span className="text-xs font-mono text-slate-400">Obsidian Plate + Border Accent</span>
                </div>
              </div>
            </div>

            {/* Badges & Telemetry Chips */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1020] border border-[#1E2438] space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">
                Status Chips & Badges
              </h3>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111420] border border-[#1E2438] text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
                  <span>Solana L1 Core &lt;400ms</span>
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111420] border border-[#F59E0B]/30 text-xs font-mono text-[#FCD34D]">
                  <Sparkles className="w-3 h-3" />
                  <span>Rajmudra Verified</span>
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111420] border border-[#9945FF]/30 text-xs font-mono text-[#B46EFF]">
                  <Lock className="w-3 h-3" />
                  <span>Token-2022 Shielded</span>
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111420] border border-[#00F2FE]/30 text-xs font-mono text-[#00F2FE]">
                  <Cpu className="w-3 h-3" />
                  <span>Peppol BIS 3.0</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
