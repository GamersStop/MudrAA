"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Ship,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Zap,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";

export interface FactoringRequest {
  id: string;
  invoiceNumber: string;
  buyer: string;
  corridor: string;
  goods: string;
  amountUsdc: number;
  advanceRate: number; // 0.75
  advanceAmountUsdc: number;
  bolNumber: string;
  carrierStatus: "In Transit" | "Customs Cleared" | "Docked at Port";
  zkStatus: "ZK-Verified" | "Verifying" | "Settled";
  timestamp: string;
  txHash?: string;
}

interface FactoringRequestsTableProps {
  onOpenNewInvoiceModal: () => void;
}

export const FactoringRequestsTable: React.FC<FactoringRequestsTableProps> = ({
  onOpenNewInvoiceModal,
}) => {
  const [requests, setRequests] = useState<FactoringRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedReceipt, setSelectedReceipt] = useState<FactoringRequest | null>(null);

  const loadTransactions = () => {
    try {
      const stored = localStorage.getItem("mudraa_transactions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRequests(parsed);
          return;
        }
      }
    } catch {
      // safe fallback
    }
    setRequests([]);
  };

  useEffect(() => {
    loadTransactions();

    const handleUpdate = () => loadTransactions();
    window.addEventListener("mudraa_transactions_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("mudraa_transactions_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleClearTransactions = () => {
    localStorage.removeItem("mudraa_transactions");
    setRequests([]);
    window.dispatchEvent(new Event("mudraa_transactions_updated"));
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "verified") return r.zkStatus === "ZK-Verified";
    if (filter === "settled") return r.zkStatus === "Settled";
    return true;
  });

  return (
    <div className="w-full rounded-2xl bg-[#0C0F17]/95 border border-slate-800/80 shadow-2xl p-5 sm:p-6 backdrop-blur-md">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
            Active Receivables &amp; Factoring Pipeline
          </h3>
          <p className="font-mono text-xs text-slate-400">
            Real-world collateral backed by Rajmudra cryptographic proofs (Zero Mock Data)
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {requests.length > 0 && (
            <div className="flex items-center p-1 rounded-lg bg-[#111420] border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter === "all" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All ({requests.length})
              </button>
              <button
                onClick={() => setFilter("verified")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter === "verified"
                    ? "bg-[#14F195]/15 text-[#14F195]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilter("settled")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filter === "settled"
                    ? "bg-[#00F2FE]/15 text-[#00F2FE]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Settled
              </button>
            </div>
          )}

          <button
            onClick={onOpenNewInvoiceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#06070A] font-bold text-xs hover:brightness-110 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Invoice</span>
          </button>

          {requests.length > 0 && (
            <button
              onClick={handleClearTransactions}
              title="Reset Table Transactions"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* When NO transactions exist: Clean Empty State */}
      {requests.length === 0 ? (
        <div className="py-14 px-4 text-center rounded-xl bg-[#090C14]/80 border border-dashed border-slate-800/90 my-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="font-headline text-base font-bold text-white mb-1">
            No Active Factoring Transactions
          </h4>
          <p className="font-mono text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            Only live transactions executed during your session will appear here. No demo mock values are pre-loaded.
            Register a trade invoice or run an instant factoring advance to produce the first on-chain record.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenNewInvoiceModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#06070A] text-xs font-bold hover:brightness-110 transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Invoice</span>
            </button>
            <Link
              href="/exporter/factoring"
              className="px-4 py-2 rounded-xl bg-[#111624] border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-bold hover:bg-[#00F2FE]/10 transition-all flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Go to Factoring Station</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Render Real Transactions Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Invoice / Corridor</th>
                <th className="pb-3">Buyer &amp; Cargo</th>
                <th className="pb-3 text-right">Face Value</th>
                <th className="pb-3 text-right">Advance (75%)</th>
                <th className="pb-3">Carrier / eBL</th>
                <th className="pb-3">ZK Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-white group-hover:text-[#FCD34D] transition-colors">
                      {r.invoiceNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">{r.corridor}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="text-slate-200 font-medium">{r.buyer}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{r.goods}</div>
                  </td>
                  <td className="py-3.5 text-right font-bold text-white">
                    ${r.amountUsdc.toLocaleString()} USDC
                  </td>
                  <td className="py-3.5 text-right font-bold text-[#14F195]">
                    ${r.advanceAmountUsdc.toLocaleString()} USDC
                  </td>
                  <td className="py-3.5">
                    <div className="text-slate-300 flex items-center gap-1.5">
                      <Ship className="w-3 h-3 text-[#00F2FE]" />
                      <span>{r.bolNumber}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{r.carrierStatus}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        r.zkStatus === "Settled"
                          ? "bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/40"
                          : "bg-[#14F195]/15 text-[#14F195] border-[#14F195]/40"
                      }`}
                    >
                      {r.zkStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={() => setSelectedReceipt(r)}
                      className="px-2.5 py-1 rounded bg-[#111624] hover:bg-[#182035] text-slate-300 hover:text-white border border-slate-700 transition-colors text-[11px]"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0C101A] border border-slate-800 rounded-2xl p-6 shadow-2xl text-xs font-mono space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-headline text-sm font-bold text-white">
                Factoring Settlement Receipt
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Invoice:</span>
                <span className="font-bold text-white">{selectedReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Face Value:</span>
                <span className="text-white">${selectedReceipt.amountUsdc.toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Advance (75% Cap):</span>
                <span className="text-[#14F195] font-bold">
                  ${selectedReceipt.advanceAmountUsdc.toLocaleString()} USDC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier Bill of Lading:</span>
                <span className="text-[#00F2FE]">{selectedReceipt.bolNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Privacy Mode:</span>
                <span className="text-amber-400">Token-2022 Shielded Ciphertext</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-[#14F195]">{selectedReceipt.zkStatus}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
