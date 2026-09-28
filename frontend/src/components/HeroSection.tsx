"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useWallet } from "@/context/WalletContext";
import { ArrowRight, BookOpen, CheckCircle2, Search } from "lucide-react";
import { RajmudraSeal } from "@/components/RajmudraSeal";

const OrbitalNode: React.FC<{
  label: string;
  angle: number;
  radius: number;
  color: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, angle, radius, color, active, onClick }) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  const cx = Math.round((50 + radius * Math.cos(rad)) * 10) / 10;
  const cy = Math.round((50 + radius * Math.sin(rad)) * 10) / 10;
  return (
    <button
      onClick={onClick}
      className="absolute text-[8px] font-mono px-1.5 py-0.5 rounded border transition-all duration-200 cursor-pointer whitespace-nowrap"
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        transform: "translate(-50%, -50%)",
        color: active ? color : "rgba(142,157,177,0.8)",
        borderColor: active ? color + "55" : "rgba(30,50,80,0.6)",
        background: active ? color + "12" : "rgba(5,9,18,0.85)",
        boxShadow: active ? `0 0 10px ${color}25` : "none",
      }}
    >
      {label}
    </button>
  );
};

export const HeroSection: React.FC = () => {
  const { launchApp } = useWallet();
  const [activeNode, setActiveNode] = useState<string>("Strategy");

  const orbitalNodes = [
    { label: "Strategy", angle: 0, color: "#F6B72C" },
    { label: "Technology", angle: 45, color: "#18D8E8" },
    { label: "Liquidity", angle: 90, color: "#F6B72C" },
    { label: "Ecosystem", angle: 135, color: "#9A65FF" },
    { label: "Community", angle: 180, color: "#27E7A3" },
    { label: "Treasury", angle: 225, color: "#FFD35A" },
    { label: "Operations", angle: 270, color: "#18D8E8" },
    { label: "Risk & Compliance", angle: 315, color: "#F6B72C" },
  ];

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#F6B72C]/7 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[400px] bg-[#18D8E8]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#9A65FF]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center relative z-10">

        {/* ── LEFT: Hero Copy ── */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(to right, #9A65FF, #27E7A3)" }}
            />
            <span className="font-mono text-[10px] tracking-[0.18em] text-[#8E9DB1] uppercase">
              SOVEREIGN TRADE LIQUIDITY · SOLANA
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] leading-[1.1] font-semibold text-[#E7EDF5] tracking-tight">
            Sovereign infrastructure{" "}
            <br className="hidden sm:block" />
            for{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F6B72C, #FFD35A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              verified trade.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-[#8E9DB1] text-base leading-relaxed font-light max-w-lg">
            Eliminating duplicate-pledge risk, enforcing physical provenance, and
            enabling confidential settlement on Solana.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => launchApp("/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-body font-bold text-sm text-[#050912] transition-all active:scale-95 cursor-pointer relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #F6B72C 0%, #FFD35A 50%, #F6B72C 100%)",
                boxShadow: "0 0 28px rgba(246,183,44,0.35)",
              }}
            >
              <span className="relative z-10">Explore the Protocol</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </button>
            <a
              href="#architecture"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-[#1E3250] bg-[#07121E]/60 hover:bg-[#07121E] hover:border-[#2A4060] text-[#8E9DB1] hover:text-[#E7EDF5] font-body text-sm transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#F6B72C]" />
              <span>Read the Architecture</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {[
              { label: "ZK VERIFIED",  color: "#18D8E8", bg: "rgba(24,216,232,0.08)",  border: "rgba(24,216,232,0.25)" },
              { label: "PROVENANCE",   color: "#27E7A3", bg: "rgba(39,231,163,0.08)",  border: "rgba(39,231,163,0.25)" },
              { label: "CONFIDENTIAL", color: "#9A65FF", bg: "rgba(154,101,255,0.08)", border: "rgba(154,101,255,0.25)" },
            ].map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ color: t.color, background: t.bg, border: `1px solid ${t.border}` }}
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Trade Verification Console ── */}
        <div className="lg:col-span-7">
          <div
            className="rounded-2xl bg-[#07121E]/95 overflow-hidden"
            style={{
              border: "1px solid rgba(30,50,80,0.9)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Console top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E3250]/80 bg-[#050912]/50">
              <div className="flex items-center gap-2.5">
                <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                  <Image
                    src="/assets/mudraa_logo_seal.png"
                    alt="MudrAA"
                    fill
                    className="object-contain drop-shadow-[0_1px_4px_rgba(246,183,44,0.4)]"
                  />
                </div>
                <span className="font-headline font-bold text-[#E7EDF5] text-[11px] tracking-wider">
                  MudrAA
                </span>
                <span className="font-mono text-[9px] text-[#4A607C]">/</span>
                <span className="font-mono text-[9px] text-[#18D8E8]">trade.verify</span>
              </div>

              <div className="flex-1 max-w-[200px] mx-4 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#050912]/80 border border-[#1E3250] text-[10px] font-mono text-[#4A607C]">
                <Search className="w-3 h-3 text-[#2A4060]" />
                <span className="truncate">Search trade, asset, or transaction...</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#27E7A3]/8 border border-[#27E7A3]/20 text-[9px] font-mono text-[#27E7A3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27E7A3] animate-pulse" />
                  <span>0x6a2...8f2c</span>
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* LEFT sub-card: Trade detail */}
              <div className="md:col-span-6 rounded-xl bg-[#050912]/70 border border-[#1E3250]/70 p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-[#8E9DB1] uppercase tracking-wider block">
                      Trade Verification
                    </span>
                    <span className="font-mono text-[10px] text-[#4A607C]">TRD-925-0043</span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold"
                    style={{
                      background: "rgba(39,231,163,0.1)",
                      color: "#27E7A3",
                      border: "1px solid rgba(39,231,163,0.3)",
                    }}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#07121E] border border-[#1E3250]/50">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 border border-[#1E3250]">
                    <Image
                      src="/assets/maritime_cargo.jpg"
                      alt="Iron Ore Cargo"
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="font-body font-bold text-[#E7EDF5] text-[11px]">Iron Ore (Fe 62%)</h4>
                    <p className="font-mono text-[9px] text-[#8E9DB1] mt-0.5">12,500 MT · $12.5M</p>
                    <p className="font-mono text-[8px] text-[#4A607C] mt-0.5">Physical Freight</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {[
                    { label: "Origin",    val: "Saldanha Port, ZA", dot: "#18D8E8" },
                    { label: "Transport", val: "In Transit · Bulk",  dot: "#F6B72C" },
                    { label: "Custody",   val: "Mundra Port, IN",    dot: "#27E7A3" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-2 font-mono text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.dot }} />
                      <span className="text-[#4A607C] w-12 shrink-0">{r.label}</span>
                      <span className="text-[#8E9DB1]">{r.val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-[#1E3250]/50 space-y-1.5">
                  {[
                    "Origin Documents",
                    "Transport Records",
                    "Chain of Custody",
                    "Counterparty KYC",
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between font-mono text-[9px]">
                      <span className="text-[#8E9DB1]">{item}</span>
                      <span className="text-[#27E7A3]">✓</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT sub-card: Rajmudra orbital */}
              <div className="md:col-span-6 rounded-xl bg-[#050912]/70 border border-[#1E3250]/70 flex flex-col items-center justify-center p-3 relative min-h-[250px] overflow-hidden">
                {/* Gold ambient */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(246,183,44,0.1) 0%, transparent 65%)",
                  }}
                />

                {/* Symmetrical Square Orbital diagram */}
                <div className="relative w-[230px] h-[230px] mx-auto flex items-center justify-center">
                  {/* SVG rings & lines */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 230 230"
                  >
                    <circle cx="115" cy="115" r="88" fill="none" stroke="rgba(30,50,80,0.55)" strokeWidth="1" />
                    <circle
                      cx="115" cy="115" r="78"
                      fill="none"
                      stroke="rgba(246,183,44,0.18)"
                      strokeWidth="0.8"
                      strokeDasharray="4 6"
                    />
                    <circle cx="115" cy="115" r="42" fill="none" stroke="rgba(24,216,232,0.12)" strokeWidth="0.6" />
                    {orbitalNodes.map((node) => {
                      const rad = ((node.angle - 90) * Math.PI) / 180;
                      const x1 = Math.round((115 + 48 * Math.cos(rad)) * 10) / 10;
                      const y1 = Math.round((115 + 48 * Math.sin(rad)) * 10) / 10;
                      const x2 = Math.round((115 + 80 * Math.cos(rad)) * 10) / 10;
                      const y2 = Math.round((115 + 80 * Math.sin(rad)) * 10) / 10;
                      return (
                        <line
                          key={node.label}
                          x1={x1} y1={y1}
                          x2={x2} y2={y2}
                          stroke={node.color}
                          strokeWidth="0.6"
                          strokeOpacity={activeNode === node.label ? 0.75 : 0.2}
                        />
                      );
                    })}
                  </svg>

                  {/* Central realistic seal - dead center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                    <RajmudraSeal size={104} glow priority />
                  </div>

                  {/* Orbital node buttons */}
                  {orbitalNodes.map((node) => (
                    <OrbitalNode
                      key={node.label}
                      label={node.label}
                      angle={node.angle}
                      radius={38.2}
                      color={node.color}
                      active={activeNode === node.label}
                      onClick={() => setActiveNode(node.label)}
                    />
                  ))}
                </div>

                <span className="font-mono text-[8.5px] text-[#4A607C] tracking-wider mt-1.5">
                  Ashta Pradhan Governance Layer
                </span>
              </div>
            </div>

            {/* Bottom metrics strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#1E3250]/70">
              {[
                { label: "Provenance",  val: "Verified",  sub: "Origin · Transport · Custody", color: "#27E7A3" },
                { label: "Collateral",  val: "Locked",    sub: "100% · LTV 70%",               color: "#18D8E8" },
                { label: "ZK Proof",    val: "On-chain",  sub: "Valid · Token-2022 Compliant",  color: "#9A65FF" },
                { label: "Trade Value", val: "$12.5M",    sub: "View Details →",                color: "#FFD35A" },
              ].map((m, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 space-y-0.5 ${i > 0 ? "border-l border-[#1E3250]/60" : ""}`}
                >
                  <span className="font-mono text-[8.5px] text-[#4A607C] uppercase tracking-wider block">
                    {m.label}
                  </span>
                  <span className="font-mono text-[11px] font-bold block" style={{ color: m.color }}>
                    {m.val}
                  </span>
                  <span className="font-mono text-[8px] text-[#4A607C] block">{m.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
