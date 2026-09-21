"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Coins,
  TrendingUp,
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  FileCheck,
  Globe2,
  Anchor,
  Sliders,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Info,
  Building2,
  HelpCircle,
  ExternalLink,
  Cpu,
} from "lucide-react";

interface TelemetryRow {
  id: string;
  txHash: string;
  corridor: string;
  goods: string;
  nominal: number;
  tenor: string;
  tranche: "Senior" | "Junior";
  proofStatus: "ZK-Verified" | "Verifying" | "Settled";
  timestamp: string;
}

const MOCK_TELEMETRY: TelemetryRow[] = [
  {
    id: "tx-901",
    txHash: "5Kt8...W2pL",
    corridor: "Singapore ➔ Rotterdam",
    goods: "Semiconductor Substrates",
    nominal: 740000,
    tenor: "38d",
    tranche: "Senior",
    proofStatus: "Settled",
    timestamp: "12s ago",
  },
  {
    id: "tx-902",
    txHash: "3mN4...7rXy",
    corridor: "Nhava Sheva ➔ Hamburg",
    goods: "Industrial Solar Modules",
    nominal: 420000,
    tenor: "45d",
    tranche: "Junior",
    proofStatus: "ZK-Verified",
    timestamp: "48s ago",
  },
  {
    id: "tx-903",
    txHash: "8vB1...9qKx",
    corridor: "Busan ➔ Long Beach",
    goods: "EV Cathode Materials",
    nominal: 1150000,
    tenor: "32d",
    tranche: "Senior",
    proofStatus: "ZK-Verified",
    timestamp: "2m ago",
  },
  {
    id: "tx-904",
    txHash: "2jR9...4tZa",
    corridor: "Antwerp ➔ Jebel Ali",
    goods: "Specialized Pharmaceuticals",
    nominal: 310000,
    tenor: "28d",
    tranche: "Senior",
    proofStatus: "Settled",
    timestamp: "4m ago",
  },
];

export default function VaultsPage() {
  const [selectedTranche, setSelectedTranche] = useState<"senior" | "junior">("senior");
  const [allocationAmount, setAllocationAmount] = useState<number>(250000);
  const [currency, setCurrency] = useState<"USDC" | "PYUSD">("USDC");
  const [confidentialTransfers, setConfidentialTransfers] = useState<boolean>(true);
  const [executionState, setExecutionState] = useState<"idle" | "signing" | "proving" | "confirmed">("idle");
  const [defaultShockSim, setDefaultShockSim] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"overview" | "stress-test" | "telemetry">("overview");

  // Dynamic yields calculation based on tranche and simulation
  const seniorBaseApy = 7.85;
  const juniorBaseApy = 16.4;

  const seniorSimulatedApy = useMemo(() => {
    // Senior is fully protected up to 18% impairment
    if (defaultShockSim <= 15) return seniorBaseApy;
    return Math.max(0, seniorBaseApy - (defaultShockSim - 15) * 1.2);
  }, [defaultShockSim]);

  const juniorSimulatedApy = useMemo(() => {
    // Junior absorbs impairment directly but captures higher spread when market is healthy
    const lossDrag = defaultShockSim * 0.95;
    return Math.max(0, juniorBaseApy - lossDrag);
  }, [defaultShockSim]);

  const currentApy = selectedTranche === "senior" ? seniorSimulatedApy : juniorSimulatedApy;
  const dailyYield = (allocationAmount * (currentApy / 100)) / 365;
  const annualYield = allocationAmount * (currentApy / 100);

  const handleExecuteAllocation = () => {
    if (allocationAmount <= 0) return;
    setExecutionState("signing");
    setTimeout(() => {
      setExecutionState("proving");
      setTimeout(() => {
        setExecutionState("confirmed");
      }, 1500);
    }, 1200);
  };

  const resetAllocation = () => {
    setExecutionState("idle");
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 selection:bg-[#9945FF] selection:text-white font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#08090D]/90 backdrop-blur-2xl border-b border-[#1E2438] px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#9945FF] via-indigo-600 to-[#00F2FE] clip-octagon p-[1.5px] group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-[#08090D] clip-octagon flex items-center justify-center">
                  <span className="font-serif text-[#FCD34D] text-base font-black">M</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm tracking-[0.16em] font-bold text-white uppercase group-hover:text-[#00F2FE] transition-colors">
                    Mudr<span className="text-[#B46EFF]">AA</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#9945FF]/15 text-[#B46EFF] border border-[#9945FF]/30">
                    Amatya Vaults
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Institutional Credit Terminal</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 border-l border-[#1E2438] pl-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-[#1E2438] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Vault Allocation
              </button>
              <button
                onClick={() => setActiveTab("stress-test")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "stress-test"
                    ? "bg-[#1E2438] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Risk & Impairment Simulator
              </button>
              <button
                onClick={() => setActiveTab("telemetry")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "telemetry"
                    ? "bg-[#1E2438] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Live Settlement Ledger
              </button>
            </nav>
          </div>

          {/* Right Network & Desk Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111420] border border-[#1E2438] text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
              <span className="text-slate-400">Solana L1</span>
              <span className="text-slate-600">|</span>
              <span className="text-[#14F195] font-medium">380ms finality</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111420] border border-[#2E3654] text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-[#9945FF]" />
              <span className="text-slate-200 font-semibold">Desk: 7xK9...3Qp1</span>
            </div>
          </div>
        </div>
      </header>

      {/* High-Density Global Telemetry Bar */}
      <section className="bg-[#0A0C14] border-b border-[#1E2438] px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-mono">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px]">Total Value Locked</span>
            <span className="text-white font-semibold text-sm">$48,650,000</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px]">24h Settled Volume</span>
            <span className="text-[#00F2FE] font-semibold text-sm">$6,420,800</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px]">Avg Tenor Duration</span>
            <span className="text-white font-semibold text-sm">41.4 Days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px]">Overcollateralization</span>
            <span className="text-[#14F195] font-semibold text-sm">134.8% Over-Pledged</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px]">Verified Invoices</span>
            <span className="text-white font-semibold text-sm">1,842 Peppol BIS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[11px]">Historical Loss Rate</span>
            <span className="text-[#FCD34D] font-semibold text-sm">0.00% (4,120 Tx)</span>
          </div>
        </div>
      </section>

      {/* Main Terminal Workspace */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Sanskrit Epigraph & Operational Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E2438] pb-6">
          <div className="space-y-1.5">
            <span className="font-serif text-sm tracking-widest text-[#FCD34D]/80 block">
              प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता || अमात्य रक्षाकोष ||
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Amatya Sovereign Underwriting Vaults
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Institutional-grade multi-tranche factoring vaults settled on Solana L1. Deploy institutional liquidity
              against cryptographically proven Peppol e-invoices with zero counterparty leakage and hardware-verified freight telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111420] border border-[#1E2438] text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14F195]" />
              SPL Token-2022 Shielded
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111420] border border-[#1E2438] text-xs text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-[#00F2FE]" />
              Rajmudra ZK Prover L1
            </span>
          </div>
        </div>

        {/* Tab Content 1: Overview & Allocation Workspace */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Dual-Tranche Architecture Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Select Allocation Tranche
                </span>
                <span className="text-xs text-slate-400">
                  Dual-tier sovereign risk waterfall
                </span>
              </div>

              {/* Senior Tranche Card */}
              <div
                onClick={() => setSelectedTranche("senior")}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border ${
                  selectedTranche === "senior"
                    ? "bg-[#111420] border-[#9945FF] shadow-xl shadow-[#9945FF]/15 ring-1 ring-[#9945FF]"
                    : "bg-[#0D0F17] border-[#1E2438] hover:border-[#2E3654]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#9945FF]" />
                      <h2 className="text-lg font-serif font-bold text-white">
                        Senior Capital-Preservation Vault
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 max-w-md">
                      First-priority redemption rights. Fully protected against credit loss by the Junior First-Loss capital layer up to 18% total pool impairment.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-white block">
                      {seniorBaseApy.toFixed(2)}%
                    </span>
                    <span className="text-[11px] font-mono text-[#B46EFF] uppercase tracking-wider">
                      Fixed Target APY
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 my-4">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Tranche Capacity: $38.2M / $45.0M Filled</span>
                    <span className="text-slate-200 font-semibold">84.8%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1E2438] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#9945FF] to-indigo-400 transition-all duration-500"
                      style={{ width: "84.8%" }}
                    />
                  </div>
                </div>

                {/* Quantitative Badges */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#1E2438]/80 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Protection Cushion</span>
                    <span className="text-[#14F195] font-semibold">$10.45M Junior Buffer</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Underlying Paper</span>
                    <span className="text-slate-200">Tier-1 EU/APAC Invoices</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Min. Allocation</span>
                    <span className="text-slate-200">100,000 USDC</span>
                  </div>
                </div>
              </div>

              {/* Junior Tranche Card */}
              <div
                onClick={() => setSelectedTranche("junior")}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border ${
                  selectedTranche === "junior"
                    ? "bg-[#111420] border-[#00F2FE] shadow-xl shadow-[#00F2FE]/15 ring-1 ring-[#00F2FE]"
                    : "bg-[#0D0F17] border-[#1E2438] hover:border-[#2E3654]"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00F2FE]" />
                      <h2 className="text-lg font-serif font-bold text-white">
                        Junior First-Loss Alpha Vault
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 max-w-md">
                      High-yield subordinated capital layer absorbing initial defaults in exchange for excess spread capture and carrier transit speed bonuses.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-white block">
                      {juniorBaseApy.toFixed(2)}%
                    </span>
                    <span className="text-[11px] font-mono text-[#00F2FE] uppercase tracking-wider">
                      Variable Alpha APY
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 my-4">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Tranche Capacity: $10.45M / $15.0M Filled</span>
                    <span className="text-slate-200 font-semibold">69.6%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1E2438] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00F2FE] to-cyan-300 transition-all duration-500"
                      style={{ width: "69.6%" }}
                    />
                  </div>
                </div>

                {/* Quantitative Badges */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#1E2438]/80 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Risk Tier</span>
                    <span className="text-[#FCD34D] font-semibold">Subordinated First-Loss</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Spread Capture</span>
                    <span className="text-slate-200">Factoring + Late Fees</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Min. Allocation</span>
                    <span className="text-slate-200">25,000 USDC</span>
                  </div>
                </div>
              </div>

              {/* Sovereign Capital Protection Architecture Notice */}
              <div className="rounded-xl p-4 bg-[#0A0C14] border border-[#1E2438] flex items-start gap-3.5 text-xs text-slate-300">
                <div className="p-2 rounded-lg bg-[#9945FF]/10 text-[#B46EFF] shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white block">
                    Zero-Rehypothecation Assurance (Amatya Mandate)
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Unlike standard DeFi lending protocols, MudrAA capital is strictly bounded to single-cycle invoice factoring. 
                    Deposits cannot be loaned out to third-party leverage protocols or recycled into speculative synthetic collateral.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Institutional Execution Drawer / Terminal */}
            <div className="lg:col-span-5 rounded-2xl bg-[#111420] border border-[#2E3654] p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E2438] pb-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Capital Deployment
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Tranche: {selectedTranche === "senior" ? "Senior Preservation" : "Junior Alpha"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#08090D] border border-[#1E2438]">
                  <button
                    onClick={() => setCurrency("USDC")}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      currency === "USDC"
                        ? "bg-[#1E2438] text-[#00F2FE] font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    USDC
                  </button>
                  <button
                    onClick={() => setCurrency("PYUSD")}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      currency === "PYUSD"
                        ? "bg-[#1E2438] text-[#00F2FE] font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    PYUSD
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <label className="text-slate-400">Allocation Amount</label>
                  <span className="text-slate-300">Desk Available: $1,450,000 {currency}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={allocationAmount}
                    onChange={(e) => setAllocationAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#08090D] border border-[#1E2438] focus:border-[#00F2FE] rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#00F2FE] transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-300">{currency}</span>
                  </div>
                </div>

                {/* Preset Presets */}
                <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                  {[50000, 100000, 250000, 500000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAllocationAmount(preset)}
                      className="px-2 py-1 rounded-md bg-[#0A0C14] hover:bg-[#1E2438] border border-[#1E2438] text-slate-300 transition-colors"
                    >
                      ${preset / 1000}k
                    </button>
                  ))}
                  <button
                    onClick={() => setAllocationAmount(1450000)}
                    className="px-2 py-1 rounded-md bg-[#9945FF]/15 hover:bg-[#9945FF]/25 border border-[#9945FF]/30 text-[#B46EFF] ml-auto transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Real-time Yield Breakdown */}
              <div className="rounded-xl bg-[#08090D] border border-[#1E2438] p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Tranche APY</span>
                  <span className="text-[#14F195] font-semibold text-sm">
                    {currentApy.toFixed(2)}% Net APY
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Daily Projected Accrual</span>
                  <span className="text-white font-medium">
                    +${dailyYield.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Annual Expected PnL</span>
                  <span className="text-white font-semibold">
                    +${annualYield.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#1E2438] flex justify-between text-slate-500 text-[11px]">
                  <span>Solana L1 Network Execution Fee</span>
                  <span>&lt; 0.00005 SOL ($0.01)</span>
                </div>
              </div>

              {/* SPL Token-2022 Confidential Transfer Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#08090D] border border-[#1E2438]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00F2FE]" />
                    <span className="text-xs font-semibold text-white">Confidential Transfer Extension</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Encrypted balance visible only to your desk viewing key
                  </p>
                </div>
                <button
                  onClick={() => setConfidentialTransfers(!confidentialTransfers)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    confidentialTransfers ? "bg-[#00F2FE]" : "bg-[#1E2438]"
                  }`}
                  aria-label="Toggle confidential transfer"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#08090D] shadow transition-transform ${
                      confidentialTransfers ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Execution States & Action Button */}
              {executionState === "idle" && (
                <button
                  onClick={handleExecuteAllocation}
                  disabled={allocationAmount <= 0}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#9945FF] via-indigo-600 to-[#00F2FE] hover:shadow-lg hover:shadow-[#00F2FE]/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Authorize & Deploy Capital</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              )}

              {executionState === "signing" && (
                <div className="w-full py-3.5 px-4 rounded-xl bg-[#1E2438] text-slate-200 text-sm font-mono flex items-center justify-center gap-3">
                  <RefreshCw className="w-4 h-4 text-[#00F2FE] animate-spin" />
                  <span>Signing Solana Transaction (Desk RPC)...</span>
                </div>
              )}

              {executionState === "proving" && (
                <div className="w-full py-3.5 px-4 rounded-xl bg-[#1E2438] text-slate-200 text-sm font-mono flex items-center justify-center gap-3">
                  <Cpu className="w-4 h-4 text-[#9945FF] animate-pulse" />
                  <span>Verifying Rajmudra ZK State Proof...</span>
                </div>
              )}

              {executionState === "confirmed" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#14F195]/10 border border-[#14F195]/30 text-[#14F195] space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Allocation Successfully Confirmed!</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">
                      Minted ${allocationAmount.toLocaleString()} {selectedTranche.toUpperCase()}-TRNCH LP tokens.
                    </p>
                  </div>
                  <button
                    onClick={resetAllocation}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-slate-300 bg-[#0A0C14] hover:bg-[#1E2438] border border-[#1E2438] transition-colors"
                  >
                    Execute Another Allocation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 2: Impairment & Default Stress-Test Simulator */}
        {activeTab === "stress-test" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111420] border border-[#1E2438] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2438] pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white">
                    Simulate Macro Trade Impairment & Default Shock
                  </h3>
                  <p className="text-xs text-slate-300">
                    Model how portfolio credit events propagate through the Ashta Pradhan waterfall. Observe Senior tranche immunity versus Junior first-loss absorption.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Simulated Impairment</span>
                  <span className="text-2xl font-bold text-[#FCD34D]">{defaultShockSim}%</span>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>0% (Baseline Equilibrium)</span>
                  <span>10% (Severe Shipping Crisis)</span>
                  <span>25% (Black Swan Collapse)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={defaultShockSim}
                  onChange={(e) => setDefaultShockSim(Number(e.target.value))}
                  className="w-full h-2 bg-[#1E2438] rounded-lg appearance-none cursor-pointer accent-[#00F2FE]"
                />
              </div>

              {/* Side-by-Side Impact Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Senior Tranche Protection */}
                <div className="rounded-xl p-5 bg-[#08090D] border border-[#1E2438] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#9945FF]" />
                      Senior Capital Position
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      defaultShockSim <= 15 ? "bg-[#14F195]/15 text-[#14F195]" : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {defaultShockSim <= 15 ? "100% Capital Preserved" : "Impaired"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Effective Annualized Yield:</span>
                    <span className="text-white font-bold">{seniorSimulatedApy.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Capital Cushion Remaining:</span>
                    <span className="text-[#14F195]">
                      ${Math.max(0, (10.45 * (1 - defaultShockSim / 18))).toFixed(2)}M Junior Shield
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-[#1E2438]">
                    Senior tranche holders suffer zero principal losses under current simulated shock parameters.
                  </p>
                </div>

                {/* Junior Tranche First Loss */}
                <div className="rounded-xl p-5 bg-[#08090D] border border-[#1E2438] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
                      Junior Alpha Position
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      defaultShockSim === 0 ? "bg-[#00F2FE]/15 text-[#00F2FE]" : "bg-[#FCD34D]/15 text-[#FCD34D]"
                    }`}>
                      {defaultShockSim === 0 ? "Full Spread Capture" : "Absorbing Defaults"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Effective Adjusted Yield:</span>
                    <span className="text-white font-bold">{juniorSimulatedApy.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subordinated First-Loss Absorption:</span>
                    <span className="text-[#FCD34D]">
                      -${((allocationAmount * (defaultShockSim / 100))).toLocaleString()} Est. Drag
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-[#1E2438]">
                    Junior capital fulfills its contractual role by shielding Senior depositors while collecting high upside factoring spreads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Live Cryptographic Settlement Telemetry */}
        {activeTab === "telemetry" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">
                Live L1 Factoring Disbursements (Peppol BIS 3.0 Verified)
              </span>
              <span className="flex items-center gap-1.5 text-[#14F195]">
                <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
                Stream Active
              </span>
            </div>

            <div className="rounded-2xl bg-[#111420] border border-[#1E2438] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#08090D] text-slate-400 border-b border-[#1E2438]">
                    <tr>
                      <th className="py-3.5 px-4">Solana Tx</th>
                      <th className="py-3.5 px-4">Trade Corridor</th>
                      <th className="py-3.5 px-4">Cargo / Goods</th>
                      <th className="py-3.5 px-4">Nominal Value</th>
                      <th className="py-3.5 px-4">Tenor</th>
                      <th className="py-3.5 px-4">Tranche</th>
                      <th className="py-3.5 px-4">ZK Proof State</th>
                      <th className="py-3.5 px-4">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2438]/60 text-slate-200">
                    {MOCK_TELEMETRY.map((row) => (
                      <tr key={row.id} className="hover:bg-[#171B2C] transition-colors">
                        <td className="py-3.5 px-4 text-[#00F2FE] font-semibold">{row.txHash}</td>
                        <td className="py-3.5 px-4">{row.corridor}</td>
                        <td className="py-3.5 px-4 text-slate-300">{row.goods}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          ${row.nominal.toLocaleString()} USDC
                        </td>
                        <td className="py-3.5 px-4">{row.tenor}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              row.tranche === "Senior"
                                ? "bg-[#9945FF]/15 text-[#B46EFF] border border-[#9945FF]/30"
                                : "bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30"
                            }`}
                          >
                            {row.tranche}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 text-[#14F195]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {row.proofStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{row.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
