"use client";

import React from "react";
import {
  Eye, ShieldCheck, FileCheck, Coins,
  Network, AlertTriangle, Landmark, Users, ArrowRight,
} from "lucide-react";

export const GovernanceSection: React.FC = () => {
  const pillars = [
    {
      num: "01",
      concept: "Transparency",
      minister: "Peshawa",
      devanagari: "पेशवा",
      desc: "Open, verifiable and auditable on-chain records for all participants.",
      icon: Eye,
      accent: "#18D8E8",
      glow: "rgba(24,216,232,0.12)",
    },
    {
      num: "02",
      concept: "Security",
      minister: "Senapati",
      devanagari: "सेनापती",
      desc: "Multi-layer protection, formal verification and cryptographic safeguards.",
      icon: ShieldCheck,
      accent: "#27E7A3",
      glow: "rgba(39,231,163,0.12)",
    },
    {
      num: "03",
      concept: "Compliance",
      minister: "Panditrao",
      devanagari: "पंडितराव",
      desc: "Regulatory-ready KYC/AML frameworks and global trade standards.",
      icon: FileCheck,
      accent: "#FFD35A",
      glow: "rgba(255,211,90,0.12)",
    },
    {
      num: "04",
      concept: "Liquidity",
      minister: "Amatya",
      devanagari: "अमात्य",
      desc: "Efficient capital access, DeFi integration and market infrastructure.",
      icon: Coins,
      accent: "#F6B72C",
      glow: "rgba(246,183,44,0.12)",
    },
    {
      num: "05",
      concept: "Ecosystem",
      minister: "Sumant",
      devanagari: "सुमंत",
      desc: "Strategic institutional partners and enterprise network development.",
      icon: Network,
      accent: "#9A65FF",
      glow: "rgba(154,101,255,0.12)",
    },
    {
      num: "06",
      concept: "Risk Management",
      minister: "Nyayadhish",
      devanagari: "न्यायाधीश",
      desc: "Proactive monitoring, risk scoring and automated circuit breakers.",
      icon: AlertTriangle,
      accent: "#F6B72C",
      glow: "rgba(246,183,44,0.12)",
    },
    {
      num: "07",
      concept: "Treasury",
      minister: "Sachiv",
      devanagari: "सचिव",
      desc: "Sustainable protocol growth, reserve management and token economics.",
      icon: Landmark,
      accent: "#27E7A3",
      glow: "rgba(39,231,163,0.12)",
    },
    {
      num: "08",
      concept: "Community",
      minister: "Waknavis",
      devanagari: "वाकनीस",
      desc: "Builders, users and long-term alignment through governance participation.",
      icon: Users,
      accent: "#18D8E8",
      glow: "rgba(24,216,232,0.12)",
    },
  ];

  return (
    <section id="governance" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 text-left">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F6B72C] font-semibold">
              GOVERNANCE
            </span>
            <span className="text-[#1E3250]">•</span>
            <span className="font-devanagari text-sm text-[#FFD35A]/70 font-semibold">
              ॥ अष्टप्रधान व्यवस्था ॥
            </span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-semibold text-[#E7EDF5] tracking-tight leading-[1.15]">
            Eight Pillars of Governance
          </h2>

          <p className="font-body text-[#8E9DB1] text-sm sm:text-base leading-relaxed font-light max-w-2xl">
            A decentralized, multi-stakeholder governance model inspired by timeless
            principles of integrity, accountability and resilience — rooted in the
            legendary{" "}
            <span className="text-[#E7EDF5] font-medium">Ashta Pradhan</span> council
            of{" "}
            <span className="font-semibold" style={{ color: "#FFD35A" }}>
              Chhatrapati Shivaji Maharaj
            </span>
            , fused with cryptographic consensus on Solana.
          </p>
        </div>

        <a
          href="#product"
          className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-[#FFD35A] hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span>Learn about governance</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 8-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars.map((pillar) => {
          const IconComp = pillar.icon;
          return (
            <div
              key={pillar.num}
              className="gov-card group relative p-5 rounded-xl text-left flex flex-col gap-3 overflow-hidden cursor-default"
              style={{
                background: "rgba(7,18,30,0.85)",
                border: "1px solid rgba(30,50,80,0.8)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = pillar.accent + "40";
                el.style.background = pillar.glow.replace("0.12)", "0.05)").replace("rgba", "rgba");
                el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.6), 0 0 20px ${pillar.accent}10`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(30,50,80,0.8)";
                el.style.background = "rgba(7,18,30,0.85)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Corner glow on hover */}
              <div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${pillar.glow} 0%, transparent 70%)` }}
              />

              {/* Icon + Number row */}
              <div className="flex items-start justify-between relative z-10">
                <div
                  className="w-10 h-10 ashtakona-shape flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.accent}15 0%, ${pillar.accent}08 100%)`,
                    boxShadow: `0 0 12px ${pillar.glow}`,
                  }}
                >
                  <IconComp className="w-4.5 h-4.5" style={{ color: pillar.accent }} size={18} />
                </div>
                <span className="font-mono text-xs font-bold text-[#1E3250] group-hover:text-[#2A4060] transition-colors">
                  {pillar.num}
                </span>
              </div>

              {/* Text content */}
              <div className="space-y-0.5 relative z-10">
                <h4 className="font-headline text-[15px] font-bold text-[#E7EDF5] group-hover:text-white transition-colors leading-tight">
                  {pillar.concept}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] text-[#4A607C] uppercase tracking-wide">
                    {pillar.minister}
                  </span>
                  <span className="text-[#1E3250] text-[9px]">·</span>
                  <span
                    className="font-devanagari text-[11px] font-medium"
                    style={{ color: pillar.accent + "55" }}
                  >
                    {pillar.devanagari}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-[11.5px] text-[#8E9DB1] leading-relaxed flex-1 relative z-10">
                {pillar.desc}
              </p>

              {/* Footer status */}
              <div
                className="pt-3 border-t flex items-center justify-between font-mono text-[9px] relative z-10"
                style={{ borderColor: "rgba(30,50,80,0.5)" }}
              >
                <span className="text-[#4A607C]">Ashta Pradhan Pillar</span>
                <span className="flex items-center gap-1" style={{ color: pillar.accent }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse"
                  />
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
