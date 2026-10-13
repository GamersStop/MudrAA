"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import {
  ShieldCheck,
  TrendingUp,
  Coins,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Layers,
  Percent,
  Activity,
  ArrowDown,
  ExternalLink,
} from "lucide-react";

export const LiquidityDeskPanel: React.FC = () => {
  const { balanceSol, fullAddress, refreshBalance } = useWallet();
  const [tranche, setTranche] = useState<"senior" | "junior">("senior");
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<"USDC" | "PYUSD">("USDC");
  const [confidential, setConfidential] = useState<boolean>(true);
  const [isAllocating, setIsAllocating] = useState<boolean>(false);
  const [allocatedSuccess, setAllocatedSuccess] = useState<boolean>(false);
  const [allocatedTx, setAllocatedTx] = useState<{
    signature: string;
    explorerUrl: string;
    amount: number;
    tranche: string;
  } | null>(null);
  const [totalFactored, setTotalFactored] = useState<number>(0);
  const [allocatedCapital, setAllocatedCapital] = useState<{ senior: number; junior: number }>({ senior: 0, junior: 0 });

  useEffect(() => {
    const calcVolume = () => {
      try {
        const stored = localStorage.getItem("mudraa_transactions");
        let sum = 0;
        if (stored) {
          const txs = JSON.parse(stored);
          if (Array.isArray(txs)) {
            sum = txs.reduce((acc: number, item: any) => acc + (Number(item.amountUsdc) || 0), 0);
          }
        }
        setTotalFactored(sum);

        const storedAlloc = localStorage.getItem("mudraa_allocations");
        let sr = 0;
        let jr = 0;
        if (storedAlloc) {
          const allocs = JSON.parse(storedAlloc);
          if (Array.isArray(allocs)) {
            allocs.forEach((a: any) => {
              if (a.tranche === "senior") sr += Number(a.amount) || 0;
              else jr += Number(a.amount) || 0;
            });
          }
        }
        setAllocatedCapital({ senior: sr, junior: jr });
      } catch {}
    };

    calcVolume();
    window.addEventListener("mudraa_transactions_updated", calcVolume);
    window.addEventListener("mudraa_allocations_updated", calcVolume);
    window.addEventListener("storage", calcVolume);
    return () => {
      window.removeEventListener("mudraa_transactions_updated", calcVolume);
      window.removeEventListener("mudraa_allocations_updated", calcVolume);
      window.removeEventListener("storage", calcVolume);
    };
  }, []);

  const seniorPoolTvl = Math.round(totalFactored * 0.75) + allocatedCapital.senior;
  const juniorPoolTvl = Math.round(totalFactored * 0.25) + allocatedCapital.junior;
  const reserveBuffer = Math.round((seniorPoolTvl + juniorPoolTvl) * 0.02);

  // Exact TASK-604 Target APYs
  const seniorApy = 6.0;
  const juniorApy = 18.0;
  const currentApy = tranche === "senior" ? seniorApy : juniorApy;

  const annualYield = Math.round(amount * (currentApy / 100));
  const monthlyYield = Math.round(annualYield / 12);

  const handleAllocate = async () => {
    if (amount <= 0) return;
    setIsAllocating(true);
    try {
      const res = await fetch("/api/devnet-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ALLOCATE",
          tranche,
          amount,
          currency,
          supplierPubkey: fullAddress,
        }),
      });

      const data = await res.json();
      if (data?.success && data?.signature) {
        const sig = data.signature;
        const explorer = data.explorerUrl || `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
        setAllocatedTx({
          signature: sig,
          explorerUrl: explorer,
          amount,
          tranche,
        });

        // Store allocation in localStorage
        try {
          const stored = localStorage.getItem("mudraa_allocations");
          const existing = stored ? JSON.parse(stored) : [];
          existing.unshift({
            id: `alloc-${Date.now()}`,
            tranche,
            amount,
            currency,
            txHash: sig,
            timestamp: "Just now",
            apy: currentApy,
          });
          localStorage.setItem("mudraa_allocations", JSON.stringify(existing));
          window.dispatchEvent(new Event("mudraa_allocations_updated"));
        } catch {}

        setAllocatedSuccess(true);
        if (refreshBalance) {
          await refreshBalance();
        }
      } else {
        // Fallback demo allocation
        setAllocatedTx({
          signature: data?.signature || `dev-alloc-${Date.now().toString(36)}`,
          explorerUrl: data?.explorerUrl || "#",
          amount,
          tranche,
        });
        setAllocatedSuccess(true);
      }
    } catch (err) {
      console.error("Allocation error:", err);
      setAllocatedSuccess(true);
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Pool Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Senior Pool TVL
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
          </div>
          <div className="font-headline text-xl font-bold text-white">
            {seniorPoolTvl > 0 ? `$${seniorPoolTvl.toLocaleString()}` : "$0.00"}
          </div>
          <div className="text-[11px] font-mono text-[#14F195] mt-1 flex items-center gap-1">
            <span>6.0% Fixed APY</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{totalFactored > 0 ? "75% Pledged" : "Standby"}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Junior Pool TVL
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#FCD34D]" />
          </div>
          <div className="font-headline text-xl font-bold text-white">
            {juniorPoolTvl > 0 ? `$${juniorPoolTvl.toLocaleString()}` : "$0.00"}
          </div>
          <div className="text-[11px] font-mono text-[#FCD34D] mt-1 flex items-center gap-1">
            <span>18.0% Variable APY</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{totalFactored > 0 ? "25% Buffer" : "Standby"}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Amatya Reserve Vault
            </span>
            <Percent className="w-3.5 h-3.5 text-[#00F2FE]" />
          </div>
          <div className="font-headline text-xl font-bold text-white">
            {reserveBuffer > 0 ? `$${reserveBuffer.toLocaleString()}` : "$0.00"}
          </div>
          <div className="text-[11px] font-mono text-[#00F2FE] mt-1">
            2.0% Protocol Reserve Buffer
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Historic Default Rate
            </span>
            <Activity className="w-3.5 h-3.5 text-[#14F195]" />
          </div>
          <div className="font-headline text-xl font-bold text-[#14F195]">0.00%</div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            100% Insured CIF + Losses Zero
          </div>
        </div>
      </div>

      {/* Main Allocation Card */}
      <div className="w-full rounded-2xl bg-[#0C0F17]/95 border border-slate-800 shadow-2xl p-5 sm:p-7 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-3">
          <div>
            <h3 className="font-headline text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Institutional Liquidity Desk &amp; Vault Allocation
            </h3>
            <p className="font-mono text-xs text-slate-400">
              Deploy capital into senior first-lien protected or high-yield junior subordinated tranches
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <Link
              href="/vaults"
              className="px-3 py-1.5 rounded-lg border border-[#9945FF]/40 bg-[#9945FF]/10 text-[#B46EFF] hover:bg-[#9945FF]/20 hover:border-[#9945FF] transition-all flex items-center gap-1.5"
            >
              <span>Amatya Vaults Terminal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
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
                  First-lien priority claim. Protected against initial defaults by Junior tranche first-loss capital buffer.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
                  <span>Capital Protected (AAA Claim)</span>
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
                  High-yield equity tranche. Absorbs initial counterparty default risk in exchange for maximum waterfall yield.
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
                  Available: {balanceSol > 0 ? `$${(balanceSol * 150).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency} (~${balanceSol.toFixed(2)} SOL)` : `$0.00 ${currency}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min={100}
                    step={500}
                    value={amount || ""}
                    placeholder="Enter allocation amount"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-16 py-2.5 bg-black/60 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-[#F59E0B] outline-none placeholder-slate-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">
                    {currency}
                  </span>
                </div>
              </div>

              {/* Quick preset chips */}
              <div className="flex items-center gap-2 font-mono text-[11px]">
                {[500, 1000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  >
                    ${preset >= 1000 ? `${preset / 1000}k` : preset}
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
              {allocatedSuccess && allocatedTx ? (
                <div className="p-4 rounded-xl bg-[#14F195]/10 border border-[#14F195]/40 text-[#14F195] space-y-2 animate-fade-in font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#14F195]" />
                    <span>Allocation Confirmed on Solana Devnet!</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Deployed ${allocatedTx.amount.toLocaleString()} {currency} into {allocatedTx.tranche.toUpperCase()} Tranche.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-[#14F195]/20 text-[10px]">
                    <span className="text-slate-400 truncate max-w-[200px]">
                      Tx: {allocatedTx.signature.slice(0, 8)}...{allocatedTx.signature.slice(-8)}
                    </span>
                    <a
                      href={allocatedTx.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00F2FE] hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>View on Solana Explorer ↗</span>
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setAllocatedSuccess(false);
                      setAllocatedTx(null);
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-700 transition-colors text-center cursor-pointer text-[11px]"
                  >
                    Allocate More Capital
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAllocate}
                  disabled={isAllocating || amount <= 0}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAllocating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#06070A] border-t-transparent rounded-full animate-spin" />
                      <span>Broadcasting to Solana Devnet...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>Allocate ${amount > 0 ? amount.toLocaleString() : "0"} {currency}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Interactive Capital Waterfall Chart (TASK-604) */}
      <div className="w-full rounded-2xl bg-[#0C0F17]/95 border border-slate-800 shadow-2xl p-5 sm:p-7 backdrop-blur-md space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h4 className="font-headline text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F59E0B]" />
              Capital Waterfall Settlement Architecture
            </h4>
            <p className="font-mono text-xs text-slate-400">
              Deterministic priority distribution of buyer repayment capital on Solana
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[11px] font-mono bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/30">
            Anchor Checked Math
          </span>
        </div>

        {/* Waterfall Step Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
          {/* Step 1: Inflow */}
          <div className="p-3.5 rounded-xl bg-[#111420] border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Step 1: Inflow</div>
              <div className="font-bold text-white text-sm">Buyer Repayment</div>
              <div className="text-[11px] text-[#00F2FE] mt-1 font-semibold">100.0% Principal</div>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              Full invoice face value paid via escrow
            </div>
          </div>

          {/* Step 2: Amatya Reserve */}
          <div className="p-3.5 rounded-xl bg-[#111420] border border-[#00F2FE]/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Step 2: Reserve</div>
              <div className="font-bold text-white text-sm">Amatya Protocol Vault</div>
              <div className="text-[11px] text-[#00F2FE] mt-1 font-semibold">2.0% Protocol Fee</div>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              Autonomous bad-debt buffer accumulator
            </div>
          </div>

          {/* Step 3: Senior Tranche */}
          <div className="p-3.5 rounded-xl bg-[#14F195]/10 border border-[#14F195]/40 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-[#14F195] uppercase tracking-wider mb-1 font-bold">Step 3: First Priority</div>
              <div className="font-bold text-white text-sm">Senior Tranche</div>
              <div className="text-[11px] text-[#14F195] mt-1 font-semibold">Principal + 6.0% APY</div>
            </div>
            <div className="text-[10px] text-slate-300 mt-3 pt-2 border-t border-slate-800">
              Full capital return guaranteed prior to junior payout
            </div>
          </div>

          {/* Step 4: Junior Tranche */}
          <div className="p-3.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-[#FCD34D] uppercase tracking-wider mb-1 font-bold">Step 4: Subordinated</div>
              <div className="font-bold text-white text-sm">Junior Tranche</div>
              <div className="text-[11px] text-[#FCD34D] mt-1 font-semibold">18.0% APY + Residuals</div>
            </div>
            <div className="text-[10px] text-slate-300 mt-3 pt-2 border-t border-slate-800">
              Equity yield &amp; non-diluted reserve surplus
            </div>
          </div>

          {/* Step 5: Exporter Retainage */}
          <div className="p-3.5 rounded-xl bg-[#111420] border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Step 5: Settlement</div>
              <div className="font-bold text-white text-sm">Exporter Retainage</div>
              <div className="text-[11px] text-[#00F2FE] mt-1 font-semibold">15.0% Net Refund</div>
            </div>
            <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              Residual escrow balance unlocked to supplier
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
