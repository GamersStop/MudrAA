"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Verify",
      desc: "Validate asset, counterparty and documents using trusted data sources.",
      detail: "Peppol BIS 3.0 e-invoices, carrier IoT telemetry, and sovereign tax oracles.",
      icon: CheckCircle2,
      accent: "#18D8E8",
      bg: "rgba(24,216,232,0.06)",
      border: "rgba(24,216,232,0.2)",
      numBg: "rgba(24,216,232,0.12)",
      numBorder: "rgba(24,216,232,0.4)",
      label: "CRYPTOGRAPHIC VALIDATION",
    },
    {
      num: "02",
      title: "Prove",
      desc: "Generate cryptographic proofs and record immutable provenance on Solana.",
      detail: "Zero-knowledge circuit generation with deterministic PDA state uniqueness.",
      icon: ShieldCheck,
      accent: "#9A65FF",
      bg: "rgba(154,101,255,0.06)",
      border: "rgba(154,101,255,0.2)",
      numBg: "rgba(154,101,255,0.12)",
      numBorder: "rgba(154,101,255,0.4)",
      label: "ZK PROOF GENERATION",
    },
    {
      num: "03",
      title: "Settle",
      desc: "Enable confidential and programmable settlement using Token-2022.",
      detail: "Homomorphic encrypted balance dispersal and automated factoring advances.",
      icon: Zap,
      accent: "#F6B72C",
      bg: "rgba(246,183,44,0.06)",
      border: "rgba(246,183,44,0.2)",
      numBg: "rgba(246,183,44,0.12)",
      numBorder: "rgba(246,183,44,0.4)",
      label: "CONFIDENTIAL SETTLEMENT",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto text-left">
      {/* Section header */}
      <div className="max-w-2xl mb-14 space-y-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#18D8E8] font-semibold block">
          HOW MUDRAA WORKS
        </span>
        <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-semibold text-[#E7EDF5] tracking-tight leading-[1.15]">
          From physical assets
          <br />
          to digital certainty.
        </h2>
        <p className="font-body text-[#8E9DB1] text-sm sm:text-base leading-relaxed font-light">
          MudrAA connects real-world trade with blockchain infrastructure, using
          cryptography, verified data and on-chain settlement.
        </p>
      </div>

      {/* 3-Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        {/* Horizontal connector line (desktop only) */}
        <div className="hidden md:block absolute top-[44px] left-[calc(33.33%_-_24px)] right-[calc(33.33%_-_24px)] h-px" style={{ background: "linear-gradient(to right, rgba(24,216,232,0.4), rgba(154,101,255,0.4), rgba(246,183,44,0.4))" }} />

        {steps.map((step, idx) => {
          const IconComp = step.icon;
          return (
            <div
              key={idx}
              className="group relative rounded-2xl p-6 sm:p-7 flex flex-col transition-all duration-300"
              style={{
                background: "rgba(7,18,30,0.8)",
                border: `1px solid rgba(30,50,80,0.8)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = step.border;
                el.style.background = step.bg;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.6), 0 0 25px ${step.accent}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(30,50,80,0.8)";
                el.style.background = "rgba(7,18,30,0.8)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Step marker + connector arrow */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-headline font-bold text-sm transition-all duration-300"
                  style={{
                    background: step.numBg,
                    border: `1.5px solid ${step.numBorder}`,
                    color: step.accent,
                    boxShadow: `0 0 14px ${step.accent}25`,
                  }}
                >
                  {step.num}
                </div>
                {idx < 2 && (
                  <ArrowRight
                    className="hidden md:block w-4 h-4 transition-all duration-200"
                    style={{ color: step.accent, opacity: 0.5 }}
                  />
                )}
              </div>

              {/* Step label */}
              <span
                className="font-mono text-[9px] uppercase tracking-[0.15em] font-semibold mb-2 block"
                style={{ color: step.accent }}
              >
                {step.label}
              </span>

              <h3 className="font-headline text-xl font-bold text-[#E7EDF5] mb-2.5">
                {step.title}
              </h3>
              <p className="font-body text-[#8E9DB1] text-sm leading-relaxed mb-4 flex-1">
                {step.desc}
              </p>

              {/* Technical detail */}
              <div
                className="pt-3.5 border-t font-mono text-[10px] text-[#4A607C] leading-relaxed"
                style={{ borderColor: "rgba(30,50,80,0.6)" }}
              >
                {step.detail}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
