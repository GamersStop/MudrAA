"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Check, Copy } from "lucide-react";

export const TelemetryBar: React.FC = () => {
  const [currentSlot, setCurrentSlot] = useState(264891048);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlot((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      id: 1,
      label: "TOTAL VALUE LOCKED",
      value: "$24.7M",
      sub: "+14.2% Past 30D",
      dotColor: "#F59E0B",
      valueColor: "text-[#F59E0B]",
      glow: "drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]",
      pulse: true,
    },
    {
      id: 2,
      label: "TARGET APY (USD)",
      value: "18.2%",
      sub: "Real-World Invoice Yield",
      dotColor: "#14F195",
      valueColor: "text-[#14F195]",
      glow: "drop-shadow-[0_0_12px_rgba(20,241,149,0.4)]",
      pulse: false,
    },
    {
      id: 3,
      label: "SETTLEMENT FINALITY",
      value: "400ms",
      sub: "Solana Slot Confirmation",
      dotColor: "#9945FF",
      valueColor: "text-[#9945FF]",
      glow: "drop-shadow-[0_0_12px_rgba(153,69,255,0.4)]",
      pulse: false,
    },
    {
      id: 4,
      label: "COLLATERAL PROVENANCE",
      value: "100%",
      sub: "Zero Double-Pledge Risk",
      dotColor: "#00F2FE",
      valueColor: "text-[#00F2FE]",
      glow: "drop-shadow-[0_0_12px_rgba(0,242,254,0.4)]",
      pulse: false,
    },
    {
      id: 5,
      label: "ZK VERIFICATION",
      value: "< 50ms",
      sub: "Groth16 / BN254 Solana Rollup",
      dotColor: "#FCD34D",
      valueColor: "text-[#FCD34D]",
      glow: "drop-shadow-[0_0_12px_rgba(252,211,77,0.4)]",
      pulse: false,
    },
  ];

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto -mt-6 sm:-mt-8 mb-16 relative z-20" id="telemetry">
      <div className="w-full bg-[#111318]/90 border border-[#F59E0B]/30 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle decorative circuit watermark */}
        <div className="absolute top-0 right-0 w-80 h-full opacity-5 pointer-events-none bg-[radial-gradient(#00F2FE_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {metrics.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => handleCopy(idx, `${m.label}: ${m.value}`)}
              className={`flex flex-col items-center sm:items-start px-3 py-1 cursor-pointer group transition-colors hover:bg-white/[0.02] rounded-lg ${
                idx === 4 ? "col-span-2 sm:col-span-1" : ""
              } ${idx > 0 && idx < 4 ? "pt-3 sm:pt-1" : ""}`}
              title="Click to copy metric"
            >
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono tracking-wider uppercase">
                <span
                  className={`w-2 h-2 rounded-full ${m.pulse ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: m.dotColor }}
                />
                <span className="group-hover:text-slate-200 transition-colors">
                  {m.label}
                </span>
                {copiedIndex === idx && (
                  <Check className="w-3 h-3 text-[#14F195] ml-1 inline" />
                )}
              </div>

              <span
                className={`font-mono text-2xl lg:text-3xl font-bold ${m.valueColor} ${m.glow} mt-1 tracking-tight`}
              >
                {m.value}
              </span>

              <span className="font-mono text-[10px] text-slate-500 mt-0.5 group-hover:text-slate-400 transition-colors">
                {m.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Live Slot & Solana Network Telemetry Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-ping" />
            <span className="text-slate-400">Solana Slot:</span>
            <span className="text-[#00F2FE] font-bold">{currentSlot.toLocaleString()}</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">TPS:</span>
            <span className="text-[#14F195] font-bold">2,842</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">Epoch 698</span>
            <span className="text-[#F59E0B] font-semibold">Rajmudra ZK Verifier v3.4.12</span>
          </div>
        </div>
      </div>
    </div>
  );
};
