"use client";

import React from "react";
import {
  TrendingUp,
  DollarSign,
  Coins,
  Percent,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export const PortfolioMetrics: React.FC = () => {
  const metrics = [
    {
      title: "Total Value Locked (TVL)",
      value: "$48,250,000",
      change: "+14.8% (30d)",
      changePositive: true,
      subtext: "Secured across 8 multi-tranche sovereign vaults",
      icon: DollarSign,
      glowColor: "from-[#F59E0B]/20",
      borderColor: "border-[#F59E0B]/30",
    },
    {
      title: "Available Factoring Liquidity",
      value: "$16,840,000",
      change: "Instant Settlement",
      changePositive: true,
      subtext: "SPL Token-2022 confidential liquidity pool",
      icon: Coins,
      glowColor: "from-[#00F2FE]/20",
      borderColor: "border-[#00F2FE]/30",
    },
    {
      title: "Active Advance Rate",
      value: "85.0%",
      change: "T+0 Settlement",
      changePositive: true,
      subtext: "Disbursed upon Rajmudra BoL telemetry proof",
      icon: Percent,
      glowColor: "from-[#14F195]/20",
      borderColor: "border-[#14F195]/30",
    },
    {
      title: "Accumulated Protocol Yield",
      value: "14.2% APY",
      change: "Weighted Net",
      changePositive: true,
      subtext: "Senior Tranche 9.4% • Junior Tranche 18.6%",
      icon: TrendingUp,
      glowColor: "from-[#9945FF]/20",
      borderColor: "border-[#9945FF]/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {metrics.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={idx}
            className={`relative rounded-2xl bg-gradient-to-b ${metric.glowColor} to-[#0E121C] border ${metric.borderColor} p-5 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                {metric.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <IconComponent className="w-4 h-4 text-[#FCD34D]" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {metric.value}
              </h3>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <span className="font-mono text-[11px] text-slate-400 truncate max-w-[160px]">
                {metric.subtext}
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/30 shrink-0">
                {metric.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
