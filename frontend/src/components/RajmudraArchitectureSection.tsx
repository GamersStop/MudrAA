"use client";

import React, { useState } from "react";
import { Radio, FileText, Database, Building, ArrowRight, ShieldCheck, Lock, Layers, Zap } from "lucide-react";
import { RajmudraSeal } from "@/components/RajmudraSeal";

export const RajmudraArchitectureSection: React.FC = () => {
  const [activeSource, setActiveSource] = useState<string>("IoT / GPS");

  const dataSources = [
    { name: "IoT / GPS",          icon: Radio,    desc: "Carrier telemetry & maritime container tracking" },
    { name: "Documents",          icon: FileText,  desc: "Peppol BIS 3.0 e-invoices & Bills of Lading" },
    { name: "Oracles",            icon: Database,  desc: "Sovereign tax portals & customs clearance APIs" },
    { name: "Enterprise Systems", icon: Building,  desc: "ERP, SAP, and core banking settlement hooks" },
  ];

  const solanaPillars = [
    { name: "Solana",          desc: "High-throughput L1 settlement layer",            color: "#9A65FF" },
    { name: "Token-2022",      desc: "Confidential transfers & metadata extensions",   color: "#27E7A3" },
    { name: "Smart Contracts", desc: "Anchor v0.30 state machines & PDA uniqueness",  color: "#18D8E8" },
    { name: "Immutable Records", desc: "Permanent on-chain ledger proof & audit trails", color: "#F6B72C" },
  ];

  const pipeline = [
    { label: "Data Integrity",         icon: ShieldCheck, color: "#18D8E8" },
    { label: "Cryptographic Proofs",   icon: Zap,         color: "#F6B72C" },
    { label: "On-chain Verification",  icon: Layers,      color: "#27E7A3" },
    { label: "Confidential Settlement",icon: Lock,        color: "#9A65FF" },
  ];

  return (
    <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* ── LEFT: Copy ── */}
        <div className="lg:col-span-4 space-y-5 text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#27E7A3] font-semibold block">
            RAJMUDRA VERIFICATION ENGINE
          </span>

          <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-semibold text-[#E7EDF5] tracking-tight leading-[1.15]">
            Cryptography.
            <br />
            Compliance.
            <br />
            Real-World Assets.
          </h2>

          <p className="font-body text-[#8E9DB1] text-sm sm:text-base leading-relaxed font-light">
            A modular verification engine designed for institutional trade and
            enterprise workflows. Every asset, every proof, every settlement —
            on-chain.
          </p>

          <div className="pt-2">
            <a
              href="#governance"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#1E3250] bg-[#07121E]/60 hover:bg-[#07121E] hover:border-[#27E7A3]/40 hover:text-[#27E7A3] text-[#8E9DB1] font-body text-xs font-semibold transition-all cursor-pointer"
            >
              <span>Explore Technical Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ── RIGHT: Interactive Architecture Diagram ── */}
        <div className="lg:col-span-8">
          <div
            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{
              background: "rgba(7,18,30,0.95)",
              border: "1px solid rgba(30,50,80,0.9)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(246,183,44,0.07) 0%, transparent 70%)" }}
            />

            <div className="relative z-10">
              {/* Top panel label */}
              <div className="text-center mb-6">
                <span className="font-mono text-[10px] text-[#8E9DB1] uppercase tracking-[0.2em]">
                  Rajmudra Verification Engine
                </span>
              </div>

              {/* 3-column flow */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                {/* LEFT: Data Sources */}
                <div className="md:col-span-4 space-y-2">
                  <span className="font-mono text-[9px] text-[#8E9DB1] uppercase tracking-[0.15em] block mb-3">
                    Data Sources
                  </span>
                  {dataSources.map((source) => {
                    const IconComp = source.icon;
                    const isSelected = activeSource === source.name;
                    return (
                      <div
                        key={source.name}
                        onClick={() => setActiveSource(source.name)}
                        className="p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 cursor-pointer"
                        style={{
                          background: isSelected ? "rgba(24,216,232,0.08)" : "rgba(5,9,18,0.7)",
                          borderColor: isSelected ? "rgba(24,216,232,0.5)" : "rgba(30,50,80,0.7)",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(24,216,232,0.1)" }}
                        >
                          <IconComp className="w-3.5 h-3.5 text-[#18D8E8]" />
                        </div>
                        <div className="truncate">
                          <span
                            className="text-[11px] font-semibold block leading-tight"
                            style={{ color: isSelected ? "#E7EDF5" : "#8E9DB1" }}
                          >
                            {source.name}
                          </span>
                          <span className="text-[9px] text-[#4A607C] block leading-tight mt-0.5">
                            {source.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CENTER: Arrows + Seal */}
                <div className="md:col-span-4 flex flex-col items-center justify-center py-4">
                  {/* Incoming arrow */}
                  <div className="flex items-center gap-1 mb-4 w-full justify-center">
                    <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(24,216,232,0.5))" }} />
                    <ArrowRight className="w-3 h-3 text-[#18D8E8]" />
                  </div>

                  {/* Seal */}
                  <div className="relative flex items-center justify-center my-1">
                    <RajmudraSeal size={136} glow />
                  </div>

                  {/* ZK Badge */}
                  <div
                    className="mt-4 px-3 py-1 rounded-full font-mono text-[9px] font-bold tracking-wider"
                    style={{
                      background: "rgba(24,216,232,0.08)",
                      color: "#18D8E8",
                      border: "1px solid rgba(24,216,232,0.35)",
                    }}
                  >
                    ZK Proofs Engine
                  </div>

                  {/* Outgoing arrow */}
                  <div className="flex items-center gap-1 mt-4 w-full justify-center">
                    <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(154,101,255,0.5), transparent)" }} />
                    <ArrowRight className="w-3 h-3 text-[#9A65FF]" />
                  </div>
                </div>

                {/* RIGHT: Solana Blockchain */}
                <div className="md:col-span-4 space-y-2">
                  <span className="font-mono text-[9px] text-[#8E9DB1] uppercase tracking-[0.15em] block mb-3">
                    Solana Blockchain
                  </span>
                  {solanaPillars.map((p) => (
                    <div
                      key={p.name}
                      className="p-2.5 rounded-xl text-left transition-all duration-200 cursor-default"
                      style={{
                        background: "rgba(5,9,18,0.7)",
                        border: "1px solid rgba(30,50,80,0.7)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = p.color + "40";
                        el.style.background = p.color + "08";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = "rgba(30,50,80,0.7)";
                        el.style.background = "rgba(5,9,18,0.7)";
                      }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                        <span className="font-body text-[11px] font-semibold text-[#E7EDF5]">{p.name}</span>
                      </div>
                      <span className="font-mono text-[9px] text-[#4A607C] block leading-tight pl-3.5">
                        {p.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom pipeline */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(30,50,80,0.6)" }}
              >
                {pipeline.map((item, i) => {
                  const IconComp = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                      <IconComp className="w-3.5 h-3.5 shrink-0" style={{ color: item.color }} />
                      <span className="text-[#8E9DB1]">{item.label}</span>
                      {i < pipeline.length - 1 && (
                        <ArrowRight className="hidden sm:block w-3 h-3 text-[#1E3250] ml-auto shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
