"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  TrendingUp,
  Coins,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Info,
} from "lucide-react";

export const LiquidityDeskPanel: React.FC = () => {
  const [tranche, setTranche] = useState<"senior" | "junior">("senior");
  const [amount, setAmount] = useState<number>(250000);
  const [currency, setCurrency] = useState<"USDC" | "PYUSD">("USDC");
  const [confidential, setConfidential] = useState<boolean>(true);
  const [isAllocating, setIsAllocating] = useState<boolean>(false);
  const [allocatedSuccess, setAllocatedSuccess] = useState<boolean>(false);

  const seniorApy = 9.4;
  const juniorApy = 18.6;
  const currentApy = tranche === "senior" ? seniorApy : juniorApy;

  const annualYield = Math.round(amount * (currentApy / 100));
  const monthlyYield = Math.round(annualYield / 12);

  const handleAllocate = async () => {
    setIsAllocating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsAllocating(false);
    setAllocatedSuccess(true);
    setTimeout(() => setAllocatedSuccess(false), 3000);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0C0F17]/95 border border-slate-800 shadow-2xl p-5 sm:p-7 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-3">
        <div>
          <h3 className="font-headline text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            Institutional Liquidity Desk &amp; Vault Allocation
          </h3>
          <p className="font-mono text-xs text-slate-400">
            Allocate enterprise balance sheet capital into structured sovereign trade receivables
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setCurrency("USDC")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              currency === "USDC"
                ? "bg-[#00F2FE]/15 border-[#00F2FE] text-[#00F2FE] font-bold"
                : "border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            USDC
          </button>
          <button
            onClick={() => setCurrency("PYUSD")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              currency === "PYUSD"
                ? "bg-[#9945FF]/15 border-[#9945FF] text-[#9945FF] font-bold"
                : "border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            PYUSD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tranche Selection & Config */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tranche Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Senior Tranche */}
            <div
              onClick={() => setTranche("senior")}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                tranche === "senior"
                  ? "bg-[#14F195]/10 border-[#14F195] shadow-[0_0_25px_rgba(20,241,149,0.15)]"
                  : "bg-[#111420]/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline font-bold text-white text-sm">
                  Senior Tranche
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/40 font-bold">
                  {seniorApy}% APY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body mb-3">
                First-lien capital protection. Protected against initial defaults by Junior tranche equity buffer.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
                <span>Capital Protected (AAA/A2)</span>
              </div>
            </div>

            {/* Junior Tranche */}
            <div
              onClick={() => setTranche("junior")}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                tranche === "junior"
                  ? "bg-[#F59E0B]/10 border-[#F59E0B] shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                  : "bg-[#111420]/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline font-bold text-white text-sm">
                  Junior Tranche
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40 font-bold">
                  {juniorApy}% APY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body mb-3">
                High-yield equity tranche. Absorbs initial counterparty default risk in exchange for maximum yield.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-[#FCD34D]" />
                <span>Subordinated High Yield</span>
              </div>
            </div>
          </div>

          {/* Capital Allocation Input */}
          <div className="p-4 rounded-xl bg-[#111420] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">
                Allocation Principal Amount:
              </label>
              <span className="text-xs font-mono text-slate-400">
                Available: $250,000.00 {currency}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={10000}
                  step={25000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-16 py-2.5 bg-black/60 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-[#F59E0B] outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">
                  {currency}
                </span>
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="flex items-center gap-2 font-mono text-[11px]">
              {[50000, 100000, 250000, 500000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  ${(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Confidential Transfer Toggle */}
          <div className="p-3.5 rounded-xl bg-[#111420] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#9945FF]/15 border border-[#9945FF]/40 flex items-center justify-center text-[#9945FF]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-body text-xs font-semibold text-white block">
                  SPL Token-2022 Confidential Transfers
                </span>
                <span className="font-mono text-[10px] text-slate-400 block">
                  Shield balance and allocation amounts using zero-knowledge Pedersen commitments
                </span>
              </div>
            </div>

            <button
              onClick={() => setConfidential(!confidential)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                confidential ? "bg-[#9945FF]" : "bg-slate-700"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  confidential ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Yield Breakdown & Mint Button */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-b from-[#141824] to-[#0E111A] border border-[#F59E0B]/30">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase text-[#FCD34D] tracking-wider block">
              Projected Capital Return
            </span>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Selected Tranche:</span>
                <span className="text-white capitalize font-semibold">{tranche}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Effective Net APY:</span>
                <span className="text-[#14F195] font-bold text-sm">{currentApy}%</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Estimated Annual Yield:</span>
                <span className="text-[#FCD34D] font-bold text-sm">
                  +${annualYield.toLocaleString()} {currency}
                </span>
              </div>

              <div className="flex justify-between text-slate-400 pb-3 border-b border-slate-800">
                <span>Monthly Cash Flow:</span>
                <span className="text-white font-semibold">
                  +${monthlyYield.toLocaleString()} {currency}/mo
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Maturity Cycle:</span>
                <span>45-90 Days Rolling Settlement</span>
              </div>
            </div>
          </div>

          <div className="pt-5">
            {allocatedSuccess ? (
              <div className="p-3 rounded-xl bg-[#14F195]/15 border border-[#14F195] text-[#14F195] text-xs font-mono flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Allocation Confirmed on Solana Devnet!</span>
              </div>
            ) : (
              <button
                onClick={handleAllocate}
                disabled={isAllocating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isAllocating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#06070A] border-t-transparent rounded-full animate-spin" />
                    <span>Signing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Allocate ${amount.toLocaleString()} {currency}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
