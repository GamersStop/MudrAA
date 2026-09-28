"use client";

import React, { useState } from "react";
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
  Search,
} from "lucide-react";

export interface FactoringRequest {
  id: string;
  invoiceNumber: string;
  buyer: string;
  corridor: string;
  goods: string;
  amountUsdc: number;
  advanceRate: number; // 0.85
  advanceAmountUsdc: number;
  bolNumber: string;
  carrierStatus: "In Transit" | "Customs Cleared" | "Docked at Port";
  zkStatus: "ZK-Verified" | "Verifying" | "Settled";
  timestamp: string;
}

const INITIAL_REQUESTS: FactoringRequest[] = [
  {
    id: "fac-101",
    invoiceNumber: "INV-IND-2026-081",
    buyer: "Vanderbilt Industrial AG (Hamburg)",
    corridor: "JNPT Nhava Sheva ➔ Hamburg",
    goods: "Industrial Precision Machining",
    amountUsdc: 320000,
    advanceRate: 0.85,
    advanceAmountUsdc: 272000,
    bolNumber: "BL-MAERSK-902110",
    carrierStatus: "In Transit",
    zkStatus: "ZK-Verified",
    timestamp: "10m ago",
  },
  {
    id: "fac-102",
    invoiceNumber: "INV-IND-2026-082",
    buyer: "Nordic Green Energy Oy (Helsinki)",
    corridor: "Mundra Port ➔ Rotterdam",
    goods: "High-Efficiency Solar Wafers",
    amountUsdc: 540000,
    advanceRate: 0.85,
    advanceAmountUsdc: 459000,
    bolNumber: "BL-MSC-441092",
    carrierStatus: "Customs Cleared",
    zkStatus: "ZK-Verified",
    timestamp: "28m ago",
  },
  {
    id: "fac-103",
    invoiceNumber: "INV-IND-2026-083",
    buyer: "Solaria Microelectronics Ltd (Taipei)",
    corridor: "Chennai Port ➔ Kaohsiung",
    goods: "Specialized Silica Conductors",
    amountUsdc: 180000,
    advanceRate: 0.85,
    advanceAmountUsdc: 153000,
    bolNumber: "BL-HAPAG-782103",
    carrierStatus: "Docked at Port",
    zkStatus: "Settled",
    timestamp: "1h ago",
  },
  {
    id: "fac-104",
    invoiceNumber: "INV-IND-2026-084",
    buyer: "Alpine Health Systems (Zurich)",
    corridor: "Nhava Sheva ➔ Antwerp",
    goods: "Active Pharmaceutical Ingredients (API)",
    amountUsdc: 410000,
    advanceRate: 0.85,
    advanceAmountUsdc: 348500,
    bolNumber: "BL-CMA-339011",
    carrierStatus: "In Transit",
    zkStatus: "Verifying",
    timestamp: "Just now",
  },
];

interface FactoringRequestsTableProps {
  onOpenNewInvoiceModal: () => void;
}

export const FactoringRequestsTable: React.FC<FactoringRequestsTableProps> = ({
  onOpenNewInvoiceModal,
}) => {
  const [requests, setRequests] = useState<FactoringRequest[]>(INITIAL_REQUESTS);
  const [filter, setFilter] = useState<string>("all");
  const [selectedReceipt, setSelectedReceipt] = useState<FactoringRequest | null>(null);

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
            Real-world collateral backed by Rajmudra cryptographic proofs
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Filter Pills */}
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

          <button
            onClick={onOpenNewInvoiceModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#06070A] font-body text-xs font-bold hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer shrink-0"
          >
            + Factoring Advance
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3">Invoice &amp; Buyer</th>
              <th className="py-3 px-3">Corridor &amp; Cargo</th>
              <th className="py-3 px-3">Face Value</th>
              <th className="py-3 px-3">85% Advance</th>
              <th className="py-3 px-3">Carrier BoL</th>
              <th className="py-3 px-3">Rajmudra Proof</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-body">
            {filteredRequests.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                {/* Invoice & Buyer */}
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-white group-hover:text-[#FCD34D] transition-colors flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{req.invoiceNumber}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                    {req.buyer}
                  </span>
                </td>

                {/* Corridor & Goods */}
                <td className="py-3.5 px-3">
                  <span className="text-slate-200 font-medium block">
                    {req.corridor}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {req.goods}
                  </span>
                </td>

                {/* Face Value */}
                <td className="py-3.5 px-3 font-mono font-semibold text-white">
                  ${req.amountUsdc.toLocaleString()}
                </td>

                {/* Advance Amount */}
                <td className="py-3.5 px-3 font-mono font-bold text-[#14F195]">
                  ${req.advanceAmountUsdc.toLocaleString()}
                </td>

                {/* Carrier BoL */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                    <Ship className="w-3 h-3 text-[#00F2FE]" />
                    <span>{req.bolNumber}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {req.carrierStatus}
                  </span>
                </td>

                {/* Rajmudra Proof */}
                <td className="py-3.5 px-3">
                  {req.zkStatus === "ZK-Verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      ZK-Verified
                    </span>
                  )}
                  {req.zkStatus === "Settled" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30">
                      <ShieldCheck className="w-3 h-3" />
                      Settled
                    </span>
                  )}
                  {req.zkStatus === "Verifying" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/15 text-amber-300 border border-amber-400/30 animate-pulse">
                      <Clock className="w-3 h-3" />
                      Proving...
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="py-3.5 px-3 text-right">
                  {req.zkStatus === "Settled" ? (
                    <button
                      onClick={() => setSelectedReceipt(req)}
                      className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white rounded bg-white/5 border border-slate-700 hover:border-slate-500 transition-all cursor-pointer"
                    >
                      Receipt
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Advance disbursed for ${req.invoiceNumber}: $${req.advanceAmountUsdc.toLocaleString()} USDC credited via SPL Token-2022.`)}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#06070A] font-bold bg-[#14F195] hover:bg-[#14F195]/90 rounded transition-all active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(20,241,149,0.3)]"
                    >
                      Disburse Advance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settlement Receipt Drawer */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0D101A] border border-[#F59E0B]/50 p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="font-headline font-bold text-white text-base">
                Settlement Proof Receipt
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="text-white font-semibold">{selectedReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Settled:</span>
                <span className="text-[#14F195] font-bold">${selectedReceipt.amountUsdc.toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bill of Lading:</span>
                <span>{selectedReceipt.bolNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ZK Nullifier Hash:</span>
                <span className="text-amber-300 truncate max-w-[180px]">0x9a8f...e102</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Solana Slot:</span>
                <span>#298104812</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-[#14F195]/10 border border-[#14F195]/30 text-[#14F195] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Perfected legal lien with unappealable MLETR title transfer.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
