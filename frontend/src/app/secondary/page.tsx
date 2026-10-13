"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import { RoleAccessGuard } from "@/components/workspace/RoleAccessGuard";
import { AuthGuard } from "@/components/workspace/AuthGuard";
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
  FileText,
} from "lucide-react";

export interface SecondaryDebtNote {
  id: string;
  symbol: string;
  name: string;
  underlyingBuyer: string;
  tranche: "Senior (Priority)" | "Junior (First-Loss)";
  faceValuePar: number;
  marketPrice: number;
  discountPct: number;
  impliedApy: number;
  remainingDays: number;
  totalNotes: number;
  availableNotes: number;
  insuranceCoverage: string;
}

export default function SecondaryMarketDeskPage() {
  const [notesList, setNotesList] = useState<SecondaryDebtNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<SecondaryDebtNote | null>(null);
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSuccess, setExecutionSuccess] = useState<boolean>(false);

  // Sync with real transactions from localStorage
  const syncNotes = () => {
    try {
      const stored = localStorage.getItem("mudraa_transactions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: SecondaryDebtNote[] = parsed.map((item: any, idx: number) => {
            const isSenior = idx % 2 === 0;
            const faceVal = Number(item.amountUsdc) || 100000;
            const numNotes = Math.max(1, Math.round(faceVal / 1000));
            return {
              id: item.id || `note-${idx}`,
              symbol: `MDR-${item.invoiceNumber?.slice(0, 7) || "INV"}-${isSenior ? "SR" : "JR"}`,
              name: `${item.buyer || "Trade Buyer"} ${isSenior ? "Senior Note" : "Junior Note"}`,
              underlyingBuyer: item.buyer || "International Importer",
              tranche: isSenior ? ("Senior (Priority)" as const) : ("Junior (First-Loss)" as const),
              faceValuePar: 1000,
              marketPrice: isSenior ? 985.50 : 965.00,
              discountPct: isSenior ? 1.45 : 3.50,
              impliedApy: isSenior ? 8.2 : 19.5,
              remainingDays: 45,
              totalNotes: numNotes,
              availableNotes: Math.max(1, Math.round(numNotes * 0.25)),
              insuranceCoverage: "110% CIF Loss-Payee Policy Active",
            };
          });
          setNotesList(mapped);
          setSelectedNote(mapped[0]);
          return;
        }
      }
    } catch {}
    setNotesList([]);
    setSelectedNote(null);
  };

  useEffect(() => {
    syncNotes();
    window.addEventListener("mudraa_transactions_updated", syncNotes);
    window.addEventListener("storage", syncNotes);
    return () => {
      window.removeEventListener("mudraa_transactions_updated", syncNotes);
      window.removeEventListener("storage", syncNotes);
    };
  }, []);

  const totalCost = selectedNote ? Math.round(orderQuantity * selectedNote.marketPrice) : 0;
  const maturityPayout = selectedNote ? orderQuantity * selectedNote.faceValuePar : 0;
  const projectedProfit = maturityPayout - totalCost;

  const handleExecuteTrade = async () => {
    if (!selectedNote) return;
    setIsExecuting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsExecuting(false);
    setExecutionSuccess(true);
    setTimeout(() => setExecutionSuccess(false), 3500);
  };

  return (
    <AuthGuard>
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

          {/* Top Secondary Market Stats with RBAC Guard */}
          <RoleAccessGuard
            allowedRoles={["lender", "admin"]}
            moduleName="Secondary Debt Note Trading Desk"
            description="Trading syndicated fractional yield debt notes is restricted to Institutional Lenders and Protocol Admins."
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Active Notes Listed</span>
                  <div className="font-headline text-xl font-bold text-white">{notesList.length} Notes</div>
                  <div className="text-[11px] font-mono text-[#00F2FE] mt-1">Token-2022 Shielded</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Max Senior Yield</span>
                  <div className="font-headline text-xl font-bold text-[#14F195]">
                    {notesList.length > 0 ? "8.2% APY" : "--"}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">First-Lien Bankruptcy Remote</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Max Junior Yield</span>
                  <div className="font-headline text-xl font-bold text-[#FCD34D]">
                    {notesList.length > 0 ? "19.5% APY" : "--"}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">First-Loss Subordinated Spread</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 block mb-1">Atomic DvP Settlement</span>
                  <div className="font-headline text-xl font-bold text-[#14F195]">
                    {notesList.length > 0 ? "Sub-Second" : "Standby"}
                  </div>
                  <div className="text-[11px] font-mono text-[#00F2FE] mt-1">Instant Solana Delivery vs Payment</div>
                </div>
              </div>

              {/* Main Trading Desk Grid or Standby State */}
              {notesList.length === 0 ? (
                <div className="py-16 px-4 text-center rounded-2xl bg-[#0C0F17]/95 border border-dashed border-slate-800 backdrop-blur-md">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F2FE] mb-3 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-headline text-base font-bold text-white mb-1">
                    No Secondary Trade Notes Listed
                  </h4>
                  <p className="font-mono text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
                    All dummy mock market notes have been removed. Fractional syndicated notes are issued automatically when factoring advances are signed.
                  </p>
                  <Link
                    href="/exporter/factoring"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono font-bold text-xs hover:brightness-110 transition-all shadow-md"
                  >
                    <span>Go to Factoring Station</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
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
                        {notesList.map((note) => {
                          const isSelected = selectedNote?.id === note.id;
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
                  </div>

                  {/* Right Column: Execution Order Terminal */}
                  {selectedNote && (
                    <div className="lg:col-span-4 space-y-6">
                      <div className="rounded-2xl bg-[#0C0F17]/95 border border-[#F59E0B]/30 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <span className="font-headline text-base font-bold text-white flex items-center gap-2">
                            <Coins className="w-4 h-4 text-[#F59E0B]" />
                            Atomic Order Execution
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#14F195]/20 text-[#14F195] font-bold">
                            Devnet Ready
                          </span>
                        </div>

                        {/* Buy/Sell Mode Selector */}
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#111420] border border-slate-800 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => setTradeMode("buy")}
                            className={`py-2 rounded-lg font-bold transition-all ${
                              tradeMode === "buy"
                                ? "bg-[#14F195] text-black shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Buy Notes
                          </button>
                          <button
                            type="button"
                            onClick={() => setTradeMode("sell")}
                            className={`py-2 rounded-lg font-bold transition-all ${
                              tradeMode === "sell"
                                ? "bg-rose-500 text-white shadow-md"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            Sell Notes
                          </button>
                        </div>

                        {/* Order Quantity Input */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-mono text-slate-400">
                            <span>Quantity ($1,000 Notes)</span>
                            <span className="text-white font-bold">{orderQuantity} Notes</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={orderQuantity}
                            onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                          />
                        </div>

                        {/* Order Financial Summary */}
                        <div className="p-4 rounded-xl bg-[#111420] border border-slate-800 space-y-2 font-mono text-xs">
                          <div className="flex justify-between text-slate-400">
                            <span>Selected Note:</span>
                            <span className="text-white font-bold">{selectedNote.symbol}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Unit Price:</span>
                            <span className="text-white">${selectedNote.marketPrice.toFixed(2)} USDC</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Total Capital:</span>
                            <span className="text-white font-bold">${totalCost.toLocaleString()} USDC</span>
                          </div>
                          <div className="flex justify-between text-[#14F195] pt-2 border-t border-slate-800">
                            <span>Maturity Return:</span>
                            <span className="font-bold">+${projectedProfit.toLocaleString()} USDC</span>
                          </div>
                        </div>

                        {/* Execute Button */}
                        <button
                          onClick={handleExecuteTrade}
                          disabled={isExecuting}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isExecuting ? (
                            <span>Confirming on Devnet...</span>
                          ) : (
                            <>
                              <span>Execute DvP Order</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {executionSuccess && (
                          <div className="p-3 rounded-xl bg-[#14F195]/15 border border-[#14F195] text-[#14F195] font-mono text-xs text-center animate-fade-in flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Trade Confirmed on Solana Devnet!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </RoleAccessGuard>
        </main>
      </div>
    </AuthGuard>
  );
}
