"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import {
  TrendingUp,
  DollarSign,
  Coins,
  Percent,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

export const PortfolioMetrics: React.FC = () => {
  const { balanceSol } = useWallet();
  const [totalFactored, setTotalFactored] = useState<number>(0);
  const [totalDisbursed, setTotalDisbursed] = useState<number>(0);
  const [activeInvoiceCount, setActiveInvoiceCount] = useState<number>(0);

  const calculateMetrics = () => {
    try {
      const stored = localStorage.getItem("mudraa_transactions");
      if (stored) {
        const txs = JSON.parse(stored);
        if (Array.isArray(txs)) {
          const factored = txs.reduce((acc: number, item: any) => acc + (Number(item.amountUsdc) || 0), 0);
          const disbursed = txs.reduce((acc: number, item: any) => acc + (Number(item.advanceAmountUsdc) || 0), 0);
          setTotalFactored(factored);
          setTotalDisbursed(disbursed);
          setActiveInvoiceCount(txs.length);
          return;
        }
      }
    } catch {
      // safe fallback
    }
    setTotalFactored(0);
    setTotalDisbursed(0);
    setActiveInvoiceCount(0);
  };

  useEffect(() => {
    calculateMetrics();

    const handleUpdate = () => calculateMetrics();
    window.addEventListener("mudraa_transactions_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("mudraa_transactions_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const metrics = [
    {
      title: "Total Factored Volume",
      value: totalFactored > 0 ? `$${totalFactored.toLocaleString()} USDC` : "$0.00 USDC",
      change: activeInvoiceCount > 0 ? `${activeInvoiceCount} Active Receivables` : "No Active Receivables",
      changePositive: activeInvoiceCount > 0,
      subtext: "Aggregated from verified electronic invoices",
      icon: DollarSign,
      glowColor: "from-[#F59E0B]/20",
      borderColor: "border-[#F59E0B]/30",
    },
    {
      title: "Advances Disbursed (ZK Shielded)",
      value: totalDisbursed > 0 ? `$${totalDisbursed.toLocaleString()} USDC` : "$0.00 USDC",
      change: totalDisbursed > 0 ? "Settled via Token-2022" : "Awaiting Transaction",
      changePositive: totalDisbursed > 0,
      subtext: "Confidential liquidity payout via Amatya Waterfall",
      icon: Coins,
      glowColor: "from-[#00F2FE]/20",
      borderColor: "border-[#00F2FE]/30",
    },
    {
      title: "Active Advance Rate",
      value: "75.0%",
      change: "Ashta Pradhan Cap",
      changePositive: true,
      subtext: "Statutory 75% advance, 10% dilution, 15% retainage",
      icon: Percent,
      glowColor: "from-[#14F195]/20",
      borderColor: "border-[#14F195]/30",
    },
    {
      title: "Live Devnet Wallet Balance",
      value: `${balanceSol.toFixed(4)} SOL`,
      change: "Live On-Chain",
      changePositive: true,
      subtext: "Live Solana Devnet account balance",
      icon: ShieldCheck,
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
