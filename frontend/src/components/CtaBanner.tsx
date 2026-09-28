"use client";

import React from "react";
import Image from "next/image";
import { useWallet } from "@/context/WalletContext";
import { ArrowRight, BookOpen } from "lucide-react";
import { RajmudraSeal } from "@/components/RajmudraSeal";

export const CtaBanner: React.FC = () => {
  const { launchApp } = useWallet();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto" id="cta">
      <div
        className="relative rounded-3xl p-8 sm:p-14 overflow-hidden"
        style={{
          background: "rgba(7,18,30,0.96)",
          border: "1px solid rgba(246,183,44,0.22)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Background Harbor Image */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12 }}>
          <Image
            src="/assets/maritime_cargo.jpg"
            alt="Maritime Trade Background"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(5,9,18,0.6) 0%, rgba(7,18,30,0.3) 50%, rgba(5,9,18,0.7) 100%)",
          }}
        />

        {/* Ambient glows */}
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(246,183,44,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -left-20 -top-20 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(24,216,232,0.1) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
          {/* Left: CTA copy */}
          <div className="lg:col-span-7 space-y-5">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#8E9DB1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27E7A3] animate-pulse" />
              Built on Solana · Institutional Grade
            </div>

            <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-semibold text-white tracking-tight leading-[1.15]">
              Build a more trusted
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #F6B72C, #FFD35A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                trade ecosystem.
              </span>
            </h2>

            <p className="font-body text-[#8E9DB1] text-sm sm:text-base leading-relaxed font-light max-w-xl">
              Explore the protocol, architecture and verification model behind MudrAA.
              Join institutions, partners and builders enabling sovereign trade
              liquidity on Solana.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => launchApp("/dashboard")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-body font-bold text-sm text-[#050912] transition-all active:scale-95 cursor-pointer relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #F6B72C 0%, #FFD35A 50%, #F6B72C 100%)",
                  boxShadow: "0 0 28px rgba(246,183,44,0.35)",
                }}
              >
                <span>Explore the Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://github.com/MudrAA"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-[#1E3250] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#2A4060] text-[#8E9DB1] hover:text-white font-body text-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#F6B72C]" />
                <span>Read the Documentation</span>
              </a>
            </div>
          </div>

          {/* Right: MudrAA seal + Solana */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center lg:justify-end gap-6">
            {/* Realistic Octagonal seal */}
            <div className="shrink-0">
              <RajmudraSeal size={120} glow />
            </div>

            {/* Solana identity */}
            <div className="text-left space-y-2.5">
              <span className="font-headline text-sm font-semibold text-white block">
                Built on Solana.
              </span>
              <p className="font-body text-xs text-[#8E9DB1] max-w-[200px] leading-relaxed">
                For a more transparent, liquid and resilient world.
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#27E7A3]">
                  <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(to right, #9A65FF, #27E7A3)" }} />
                  <span className="font-bold tracking-wider">SOLANA MAINNET</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-[#4A607C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A65FF]" />
                  <span>Token-2022 · ZK Compression</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
