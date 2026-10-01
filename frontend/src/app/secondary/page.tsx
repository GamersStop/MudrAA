"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import {
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  DollarSign,
  ArrowUpDown,
  Sliders,
  ExternalLink,
  Coins,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface SecondaryDebtNote {
  id: string;
  symbol: string;
  name: string;
  underlyingBuyer: string;
  tranche: "Senior (Priority)" | "Junior (First-Loss)";
  faceValuePar: number; // $1,000 per note
  marketPrice: number; // e.g. $982.50
  discountPct: number; // e.g. 1.75% discount
  impliedApy: number; // e.g. 10.8%
  remainingDays: number;
  totalNotes: number;
  availableNotes: number;
  insuranceCoverage: string;
}

const MARKET_NOTES: SecondaryDebtNote[] = [
  {
    id: "note-001",
    symbol: "MDR-VND-SR-26",
    name: "Vanderbilt Industrial 60d Senior Note",
    underlyingBuyer: "Vanderbilt Industrial AG (Hamburg)",
    tranche: "Senior (Priority)",
    faceValuePar: 1000,
    marketPrice: 986.50,
    discountPct: 1.35,
    impliedApy: 7.8,
    remainingDays: 42,
    totalNotes: 320,
    availableNotes: 64,
    insuranceCoverage: "110% CIF Loss-Payee Policy Active",
  },
  {
    id: "note-002",
    symbol: "MDR-NRD-JR-26",
    name: "Nordic Green Energy 90d Junior Note",
    underlyingBuyer: "Nordic Green Energy Oy (Helsinki)",
    tranche: "Junior (First-Loss)",
    faceValuePar: 1000,
    marketPrice: 968.00,
    discountPct: 3.20,
    impliedApy: 19.4,
    remainingDays: 61,
    totalNotes: 540,
    availableNotes: 110,
    insuranceCoverage: "110% CIF Loss-Payee Policy Active",
  },
  {
    id: "note-003",
    symbol: "MDR-ALP-SR-26",
    name: "Alpine Health Systems 75d Senior Note",
    underlyingBuyer: "Alpine Health Systems (Zurich)",
    tranche: "Senior (Priority)",
    faceValuePar: 1000,
    marketPrice: 981.20,
    discountPct: 1.88,
    impliedApy: 8.4,
    remainingDays: 52,
    totalNotes: 410,
    availableNotes: 85,
    insuranceCoverage: "110% CIF Loss-Payee Policy Active",
  },
  {
    id: "note-004",
    symbol: "MDR-SLR-JR-26",
    name: "Solaria Microelectronics 45d Junior Note",
    underlyingBuyer: "Solaria Microelectronics Ltd (Taipei)",
    tranche: "Junior (First-Loss)",
    faceValuePar: 1000,
    marketPrice: 978.00,
    discountPct: 2.20,
    impliedApy: 21.2,
    remainingDays: 28,
    totalNotes: 180,
    availableNotes: 32,
    insuranceCoverage: "110% CIF Loss-Payee Policy Active",
  },
];

export default function SecondaryMarketDeskPage() {
  const [selectedNote, setSelectedNote] = useState<SecondaryDebtNote>(MARKET_NOTES[0]);
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");
  const [orderQuantity, setOrderQuantity] = useState<number>(10); // number of $1k notes
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  const totalCost = Math.round(orderQuantity * selectedNote.marketPrice);
  const maturityPayout = orderQuantity * selectedNote.faceValuePar;
  const projectedProfit = maturityPayout - totalCost;

  const handleExecuteTrade = async () => {
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsExecuting(false);
    setExecutionSuccess(true);
    setTimeout(() => setExecutionSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      <WorkspaceHeader activeTab="secondary" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <Link href="/dashboard" className="hover:text-[#FCD34D] transition-colors">
                Workspace
              </Link>
              <span>/</span>
              <span className="text-[#00F2FE]">Secondary Debt Market</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Secondary Debt Note Trading Desk
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30 font-semibold">
                $1,000 Ticket Fractional Notes
              </span>
            </h1>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Institutional AMM and orderbook for fractional syndicated trade debt tokens prior to invoice maturity
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30 flex items-center gap-1.5 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Secondary AMM Liquidity: Active
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <RajmudraStatusBar />

        {/* Top Secondary Market Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Active Trade Note Listings
            </span>
            <div className="font-headline text-xl font-bold text-white">4 Available Tranches</div>
            <div className="text-[11px] font-mono text-[#00F2FE] mt-1">1,450 Total Notes ($1.45M)</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-[#14F195]/30">
            <span className="text-[11px] font-mono text-[#14F195] uppercase tracking-wider block mb-1">
              Average Senior Secondary Yield
            </span>
            <div className="font-headline text-xl font-bold text-[#14F195]">8.1% Implied APY</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">First-lien priority protection</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-[#F59E0B]/30">
            <span className="text-[11px] font-mono text-[#FCD34D] uppercase tracking-wider block mb-1">
              Average Junior Secondary Yield
            </span>
            <div className="font-headline text-xl font-bold text-[#FCD34D]">20.3% Implied APY</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">High-yield discount notes</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Settlement Standard
            </span>
            <div className="font-headline text-xl font-bold text-white">T+0 Atomic</div>
            <div className="text-[11px] font-mono text-[#00F2FE] mt-1">Instant Solana Delivery vs Payment</div>
          </div>
        </div>

        {/* Main Trading Desk Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Market Listings Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-headline text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                  Fractional Syndicated Debt Notes
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Select Note to Trade
                </span>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {MARKET_NOTES.map((note) => {
                  const isSelected = selectedNote.id === note.id;
                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#F59E0B]/10 border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                          : "bg-[#111420]/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white border border-slate-700">
                            {note.symbol}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {note.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-slate-400">Price:</span>
                          <span className="text-white font-bold">
                            ${note.marketPrice.toFixed(2)} USDC
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#14F195]/20 text-[#14F195] font-bold">
                            +{note.impliedApy}% APY
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block text-[9.5px]">Counterparty</span>
                          <span className="text-slate-300 truncate block">{note.underlyingBuyer}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9.5px]">Tranche</span>
                          <span className={note.tranche.includes("Senior") ? "text-[#14F195]" : "text-[#FCD34D]"}>
                            {note.tranche}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9.5px]">Remaining Tenor</span>
                          <span className="text-white font-semibold">{note.remainingDays} Days</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9.5px]">Available / Par</span>
                          <span className="text-white font-semibold">{note.availableNotes} / ${note.faceValuePar}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Depth / Orderbook Preview */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <span className="font-headline text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Layers className="w-4 h-4 text-[#00F2FE]" />
                Orderbook Depth — {selectedNote.symbol}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {/* Bids */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>Bid Price (USDC)</span>
                    <span>Quantity (Notes)</span>
                    <span>Total</span>
                  </div>
                  {[
                    { price: (selectedNote.marketPrice - 1.5).toFixed(2), qty: 15 },
                    { price: (selectedNote.marketPrice - 3.0).toFixed(2), qty: 25 },
                    { price: (selectedNote.marketPrice - 5.5).toFixed(2), qty: 40 },
                  ].map((bid, i) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span className="text-[#14F195] font-semibold">${bid.price}</span>
                      <span>{bid.qty} notes</span>
                      <span className="text-slate-400">${(Number(bid.price) * bid.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Asks */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>Ask Price (USDC)</span>
                    <span>Quantity (Notes)</span>
                    <span>Total</span>
                  </div>
                  {[
                    { price: selectedNote.marketPrice.toFixed(2), qty: selectedNote.availableNotes },
                    { price: (selectedNote.marketPrice + 2.0).toFixed(2), qty: 20 },
                    { price: (selectedNote.marketPrice + 4.5).toFixed(2), qty: 35 },
                  ].map((ask, i) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span className="text-[#F59E0B] font-semibold">${ask.price}</span>
                      <span>{ask.qty} notes</span>
                      <span className="text-slate-400">${(Number(ask.price) * ask.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trade Execution Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-[#F59E0B]/30 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-headline text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#F59E0B]" />
                  Trade Execution
                </span>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <button
                    onClick={() => setTradeMode("buy")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      tradeMode === "buy"
                        ? "bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/40 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeMode("sell")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      tradeMode === "sell"
                        ? "bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40 font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Selected Note Summary */}
              <div className="p-3.5 rounded-xl bg-[#111420] border border-slate-800 space-y-1 font-mono text-xs">
                <div className="text-slate-400 text-[10px] uppercase">Selected Instrument</div>
                <div className="font-bold text-white text-sm">{selectedNote.symbol}</div>
                <div className="text-[11px] text-[#00F2FE]">{selectedNote.name}</div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 mt-2">
                  {selectedNote.insuranceCoverage}
                </div>
              </div>

              {/* Quantity Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block">
                  Quantity (Fractional $1,000 Notes):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={selectedNote.availableNotes}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 bg-[#111420] border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-[#F59E0B] outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 text-xs">
                    Notes
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>1 note min</span>
                  <span>Available: {selectedNote.availableNotes}</span>
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="p-4 rounded-xl bg-[#111420] border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Price:</span>
                  <span className="text-white">${selectedNote.marketPrice.toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Maturity Face Value:</span>
                  <span className="text-white font-bold">${maturityPayout.toLocaleString()} USDC</span>
                </div>
                <div className="flex justify-between text-[#14F195]">
                  <span>Projected Yield / Profit:</span>
                  <span className="font-bold">+${projectedProfit.toLocaleString()} USDC ({selectedNote.impliedApy}% APY)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Maturity Countdown:</span>
                  <span>{selectedNote.remainingDays} Days</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Capital:</span>
                  <span className="text-[#FCD34D] font-headline font-bold">
                    ${totalCost.toLocaleString()} USDC
                  </span>
                </div>
              </div>

              {/* Execute Button */}
              {executionSuccess ? (
                <div className="p-3.5 rounded-xl bg-[#14F195]/15 border border-[#14F195] text-center space-y-1 text-xs font-mono text-[#14F195]">
                  <div className="flex items-center justify-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Order Executed Atomically!</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {orderQuantity} notes credited to your Solana wallet.
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleExecuteTrade}
                  disabled={isExecuting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#06070A] border-t-transparent rounded-full animate-spin" />
                      <span>Executing Atomic Solana Swap...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {tradeMode === "buy" ? "Buy" : "Sell"} {orderQuantity} Notes for ${totalCost.toLocaleString()} USDC
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
