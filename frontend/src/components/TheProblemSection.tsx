"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, CopyX, FileQuestion, Hourglass, TrendingDown } from "lucide-react";

export const TheProblemSection: React.FC = () => {
  const problems = [
    {
      title: "Duplicate Pledge Risk",
      desc: "Assets pledged multiple times across institutions and markets, creating systemic fraud risk.",
      icon: CopyX,
      iconColor: "#F6B72C",
      accentBg: "rgba(246,183,44,0.06)",
      accentBorder: "rgba(246,183,44,0.2)",
      hoverBorder: "rgba(246,183,44,0.4)",
    },
    {
      title: "Provenance Uncertainty",
      desc: "No trusted, end-to-end record of physical movement and custody across the supply chain.",
      icon: FileQuestion,
      iconColor: "#18D8E8",
      accentBg: "rgba(24,216,232,0.06)",
      accentBorder: "rgba(24,216,232,0.2)",
      hoverBorder: "rgba(24,216,232,0.4)",
    },
    {
      title: "Opaque Settlement",
      desc: "Delayed, manual and non-transparent settlement processes increase counterparty risk.",
      icon: Hourglass,
      iconColor: "#9A65FF",
      accentBg: "rgba(154,101,255,0.06)",
      accentBorder: "rgba(154,101,255,0.2)",
      hoverBorder: "rgba(154,101,255,0.4)",
    },
  ];

  return (
    <section id="problem" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* ── LEFT: Problem Copy ── */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F6B72C] font-semibold block">
            THE PROBLEM
          </span>

          <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-semibold text-[#E7EDF5] tracking-tight leading-[1.15]">
            Trust is the real
            <br />
            liquidity constraint.
          </h2>

          <p className="font-body text-[#8E9DB1] text-sm sm:text-base leading-relaxed font-light">
            In global trade, duplicate pledges, unverifiable provenance and opaque
            settlements create fraud risk, capital inefficiency and lost value.
            Traditional systems lack real-time verification and unified, tamper-proof
            records.
          </p>

          {/* Problem bullets */}
          <div className="space-y-2 pt-1">
            {[
              "Duplicate pledges across institutions",
              "Unverifiable physical provenance",
              "Opaque, delayed settlement",
              "Capital inefficiency at scale",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 font-body text-xs text-[#8E9DB1]">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#F6B72C]/60" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#1E3250] bg-[#07121E]/60 hover:bg-[#07121E] hover:border-[#F6B72C]/30 hover:text-[#FFD35A] text-[#8E9DB1] font-body text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Learn more about the risks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ── RIGHT: 3 Cards + Cinematic Freight Visual ── */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">

          {/* Problem cards */}
          <div className="md:col-span-5 space-y-3">
            {problems.map((prob, i) => {
              const IconComp = prob.icon;
              return (
                <div
                  key={i}
                  className="group p-4 rounded-xl text-left transition-all duration-300 cursor-default"
                  style={{
                    background: "rgba(7,18,30,0.8)",
                    border: `1px solid rgba(30,50,80,0.8)`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = prob.hoverBorder;
                    el.style.background = prob.accentBg;
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = "rgba(30,50,80,0.8)";
                    el.style.background = "rgba(7,18,30,0.8)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: prob.accentBg, border: `1px solid ${prob.accentBorder}` }}
                  >
                    <IconComp className="w-4 h-4" style={{ color: prob.iconColor }} />
                  </div>
                  <h4 className="font-body text-[12px] font-bold text-[#E7EDF5] mb-1.5">
                    {prob.title}
                  </h4>
                  <p className="font-body text-[11px] text-[#8E9DB1] leading-relaxed">
                    {prob.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Cinematic freight visual */}
          <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-[#1E3250]/70 shadow-[0_15px_50px_rgba(0,0,0,0.7)] min-h-[320px] sm:min-h-[360px] group">
            <Image
              src="/assets/maritime_cargo.jpg"
              alt="Global Trade Maritime Container Vessel"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 450px"
            />
            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(5,9,18,0.3) 0%, rgba(5,9,18,0.7) 60%, rgba(5,9,18,0.92) 100%)",
              }}
            />

            {/* Top status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span
                className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(246,183,44,0.12)",
                  color: "#F6B72C",
                  border: "1px solid rgba(246,183,44,0.25)",
                }}
              >
                Global Trade · Live View
              </span>
              <span
                className="font-mono text-[9px] flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(5,9,18,0.7)",
                  color: "#8E9DB1",
                  border: "1px solid rgba(30,50,80,0.6)",
                }}
              >
                <TrendingDown className="w-3 h-3 text-[#F6B72C]" />
                Capital at risk
              </span>
            </div>

            {/* Bottom metric overlay */}
            <div
              className="absolute bottom-4 left-4 right-4 p-4 rounded-xl text-left"
              style={{
                background: "rgba(7,18,30,0.88)",
                border: "1px solid rgba(246,183,44,0.25)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="font-mono text-[9px] text-[#8E9DB1] uppercase tracking-wider block mb-1">
                Illustrative: Trade value at risk
              </span>
              <div
                className="font-headline text-2xl sm:text-3xl font-bold text-white mb-0.5"
                style={{ letterSpacing: "-0.02em" }}
              >
                $2.4T+
              </div>
              <p className="font-body text-[11px] text-[#8E9DB1]">
                Estimated annual exposure in global trade finance.
              </p>
              <p className="font-mono text-[9px] text-[#4A607C] mt-1.5">
                * Illustrative scenario — not independently verified statistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
