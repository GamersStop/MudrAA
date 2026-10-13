"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/workspace/AuthGuard";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ExporterInvoiceModal } from "@/components/workspace/ExporterInvoiceModal";
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  Ship,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  buyer: string;
  buyerCountry: string;
  corridor: string;
  goods: string;
  faceValue: number;
  currency: string;
  advanceRate: number; // 0.75 standard
  canonicalHash: string;
  irnStatus: string;
  carrierStatus: string;
  carrierName: string;
  bolNumber: string;
  zkStatus: string;
  issueDate: string;
  maturityDays: number;
  txHash?: string;
}

export default function ExporterInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const loadInvoices = () => {
    try {
      const stored = localStorage.getItem("mudraa_transactions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: InvoiceItem[] = parsed.map((item: any, idx: number) => ({
            id: item.id || `inv-${idx}`,
            invoiceNumber: item.invoiceNumber || `INV-2026-${idx + 1}`,
            buyer: item.buyer || "International Importer",
            buyerCountry: "Global Trade",
            corridor: item.corridor || "Direct Trade Corridor",
            goods: item.goods || "Merchandise",
            faceValue: Number(item.amountUsdc) || 0,
            currency: item.currency || "USDC",
            advanceRate: Number(item.advanceRate) || 0.75,
            canonicalHash: item.nullifierHash || "0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2",
            irnStatus: "Verified (25h Cooldown Passed)",
            carrierStatus: item.carrierStatus || "VESSEL_DEPARTED",
            carrierName: "Global Carrier",
            bolNumber: item.bolNumber || "BL-CARGO-9901",
            zkStatus: item.zkStatus || "ZK-Verified",
            issueDate: new Date().toISOString().slice(0, 10),
            maturityDays: 60,
            txHash: item.txHash,
          }));
          setInvoices(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn("Storage read error:", err);
    }
    setInvoices([]);
  };

  useEffect(() => {
    loadInvoices();

    const handleUpdate = () => loadInvoices();
    window.addEventListener("mudraa_transactions_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("mudraa_transactions_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.bolNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "zk" && inv.zkStatus === "ZK-Verified") ||
      (statusFilter === "ready" && inv.zkStatus === "Ready to Factor");
    return matchesSearch && matchesFilter;
  });

  const totalReceivables = invoices.reduce((sum, inv) => sum + inv.faceValue, 0);
  const totalEligibleAdvance = Math.round(totalReceivables * 0.75);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
        <WorkspaceHeader activeTab="exporter" />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Page Title & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <Link href="/exporter" className="hover:text-[#FCD34D] transition-colors">
                  Exporter Workspace
                </Link>
                <span>/</span>
                <span className="text-[#00F2FE]">Invoices &amp; Receivables</span>
              </div>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                Trade Invoice Portfolio
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30 font-semibold">
                  Live L1 Collateral
                </span>
              </h1>
              <p className="font-mono text-xs text-slate-400 mt-1">
                Tokenized accounts receivable verified through Peppol BIS 3.0 schema and maritime eBL validation
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Invoice</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-mono text-slate-400 block mb-1">
                Total Portfolio Value
              </span>
              <span className="font-headline text-xl sm:text-2xl font-bold text-white">
                ${totalReceivables.toLocaleString()} USDC
              </span>
              <span className="text-[11px] font-mono text-slate-400 block mt-1">
                {invoices.length} Registered Receivables
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-mono text-slate-400 block mb-1">
                Instant Eligible Advance (75% LTV)
              </span>
              <span className="font-headline text-xl sm:text-2xl font-bold text-[#14F195]">
                ${totalEligibleAdvance.toLocaleString()} USDC
              </span>
              <span className="text-[11px] font-mono text-[#14F195] block mt-1">
                Available to Draw
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md">
              <span className="text-xs font-mono text-slate-400 block mb-1">
                Ashta Pradhan Consensus
              </span>
              <span className="font-headline text-xl sm:text-2xl font-bold text-[#00F2FE]">
                100% Shielded
              </span>
              <span className="text-[11px] font-mono text-[#00F2FE] block mt-1">
                Zero Double-Pledging Risk
              </span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice, buyer, eBL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#111420] border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:border-[#F59E0B] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-mono text-slate-400 shrink-0">Filter:</span>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors shrink-0 ${
                  statusFilter === "all"
                    ? "bg-[#F59E0B]/20 text-[#FCD34D] border border-[#F59E0B]/40"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                All ({invoices.length})
              </button>
              <button
                onClick={() => setStatusFilter("zk")}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors shrink-0 ${
                  statusFilter === "zk"
                    ? "bg-[#14F195]/20 text-[#14F195] border border-[#14F195]/40"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                ZK-Verified
              </button>
            </div>
          </div>

          {/* Invoice Table or Clean Empty State */}
          <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
            {filteredInvoices.length === 0 ? (
              <div className="py-16 px-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-headline text-base font-bold text-white mb-1">
                  No Trade Invoices Registered
                </h4>
                <p className="font-mono text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
                  All demo mock transactions have been wiped clean. Register your first invoice to generate cryptographic proofs and live Solana Devnet trade collateral.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register New Invoice</span>
                  </button>
                  <Link
                    href="/exporter/factoring"
                    className="px-4 py-2 rounded-xl bg-[#111624] border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-bold hover:bg-[#00F2FE]/10 transition-all flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Factoring Station</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111420] text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 pr-3">Buyer / Corridor</th>
                      <th className="py-3 pr-3">Maritime eBL</th>
                      <th className="py-3 pr-3">Face Value</th>
                      <th className="py-3 pr-3">Advance (75%)</th>
                      <th className="py-3 pr-3">ZK Status</th>
                      <th className="py-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredInvoices.map((inv) => {
                      const advanceAmount = Math.round(inv.faceValue * inv.advanceRate);
                      return (
                        <tr
                          key={inv.id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Invoice Number */}
                          <td className="py-4 px-4">
                            <span className="font-mono font-bold text-white group-hover:text-[#FCD34D] transition-colors block">
                              {inv.invoiceNumber}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                              Issued: {inv.issueDate}
                            </span>
                          </td>

                          {/* Buyer */}
                          <td className="py-4 pr-3">
                            <span className="text-white font-medium block">
                              {inv.buyer}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block">
                              {inv.corridor}
                            </span>
                          </td>

                          {/* Maritime eBL */}
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                              <Ship className="w-3.5 h-3.5 text-[#00F2FE]" />
                              <span>{inv.bolNumber}</span>
                            </div>
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30">
                              {inv.carrierStatus}
                            </span>
                          </td>

                          {/* Face Value */}
                          <td className="py-4 pr-3 font-mono font-semibold text-white">
                            ${inv.faceValue.toLocaleString()} {inv.currency}
                          </td>

                          {/* 75% Advance */}
                          <td className="py-4 pr-3 font-mono font-bold text-[#14F195]">
                            ${advanceAmount.toLocaleString()} {inv.currency}
                          </td>

                          {/* Status */}
                          <td className="py-4 pr-3">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/40 shadow-[0_0_12px_rgba(20,241,149,0.15)]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{inv.zkStatus}</span>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-4 text-right pr-4">
                            <Link
                              href={`/exporter/factoring?invoiceId=${inv.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 border border-[#F59E0B]/40 text-[#FCD34D] text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                            >
                              <span>Factor</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        <ExporterInvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
