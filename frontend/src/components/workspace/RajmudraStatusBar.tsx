"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Ship,
  FileCheck2,
  Hash,
  Activity,
  Zap,
  Lock,
  ArrowRight,
  Info,
} from "lucide-react";

interface StatusStep {
  title: string;
  category: string;
  detail: string;
  status: "verified" | "active" | "queued";
  hash?: string;
}

export const RajmudraStatusBar: React.FC = () => {
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const steps: StatusStep[] = [
    {
      title: "Peppol BIS 3.0 Schema",
      category: "Invoice State",
      detail: "RFC 8785 canonical hash generated and signed",
      status: "verified",
      hash: "0x8f72a...d9e1",
    },
    {
      title: "Carrier Telemetry Ingestion",
      category: "Physical Provenance",
      detail: "Bill of Lading: BL-MAERSK-902110 (In Transit)",
      status: "verified",
      hash: "0x3e18c...44a7",
    },
    {
      title: "ZK Nullifier Uniqueness",
      category: "Anti-Fraud Citadel",
      detail: "0 duplicate pledges detected across consensus layer",
      status: "verified",
      hash: "0xNullifier-90a2-f8b",
    },
    {
      title: "Solana L1 Finality",
      category: "Settlement Engine",
      detail: "Anchor program state confirmed on Devnet/Mainnet",
      status: "active",
      hash: "Slot #298104812",
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0C0F17]/95 border border-[#F59E0B]/30 p-4 sm:p-5 shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-md relative overflow-hidden">
      {/* Background Micro Glow */}
      <div className="absolute top-0 right-0 w-80 h-28 bg-[#14F195]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/60 flex items-center justify-center ashtakona-shape shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <span className="font-devanagari text-xs text-[#FCD34D] font-bold">
              मु
            </span>
          </div>
          <div>
            <h3 className="font-headline text-sm font-bold text-white flex items-center gap-2">
              Rajmudra Verification Engine — Live Integrity Tracker
            </h3>
            <span className="font-mono text-[10px] text-slate-400">
              Autonomous Anti-Fraud Protocol // Ashta Pradhan Sovereign Consensus
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/40 text-[#14F195]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-ping" />
            Active Proof Circuit
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">0.42s latency</span>
        </div>
      </div>

      {/* 4 Pipeline Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#111420]/80 border border-slate-800/80 hover:border-[#F59E0B]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {step.category}
                </span>
                {step.status === "verified" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#14F195]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#14F195]" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00F2FE] animate-pulse">
                    <Zap className="w-3.5 h-3.5 text-[#00F2FE]" />
                    Confirming
                  </span>
                )}
              </div>

              <h4 className="font-body text-xs font-bold text-slate-100 group-hover:text-[#FCD34D] transition-colors mb-1">
                {step.title}
              </h4>
              <p className="text-[11px] font-body text-slate-400 line-clamp-2 leading-relaxed">
                {step.detail}
              </p>
            </div>

            {step.hash && (
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-slate-500">Hash/Proof:</span>
                <span className="text-amber-300/90 hover:text-amber-200 cursor-pointer">
                  {step.hash}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
