"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
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
  Sparkles,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

interface InvoiceItem {
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
  irnStatus: "Verified (25h Cooldown Passed)" | "Pending IRN Verification";
  carrierStatus: "VESSEL_DEPARTED" | "CUSTOMS_CLEARED" | "AT_BERTH";
  carrierName: string;
  bolNumber: string;
  zkStatus: "ZK-Verified" | "Proof Generated" | "Ready to Factor";
  issueDate: string;
  maturityDays: number;
}

const SAMPLE_INVOICES: InvoiceItem[] = [
  {
    id: "inv-2026-001",
    invoiceNumber: "INV-IND-2026-081",
    buyer: "Vanderbilt Industrial AG",
    buyerCountry: "Germany (DE)",
    corridor: "JNPT Nhava Sheva ➔ Hamburg",
    goods: "Industrial Precision Machining CNC Castings",
    faceValue: 320000,
    currency: "USDC",
    advanceRate: 0.75,
    canonicalHash: "0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2",
    irnStatus: "Verified (25h Cooldown Passed)",
    carrierStatus: "VESSEL_DEPARTED",
    carrierName: "Maersk Line (MSK)",
    bolNumber: "BL-MAERSK-902110",
    zkStatus: "ZK-Verified",
    issueDate: "2026-09-28",
    maturityDays: 60,
  },
  {
    id: "inv-2026-002",
    invoiceNumber: "INV-IND-2026-082",
    buyer: "Nordic Green Energy Oy",
    buyerCountry: "Finland (FI)",
    corridor: "Mundra Port ➔ Rotterdam",
    goods: "High-Efficiency Monocrystalline Solar Wafers",
    faceValue: 540000,
    currency: "USDC",
    advanceRate: 0.75,
    canonicalHash: "0x4e12b79a88cd541f6291a0210b4f871239aa812f84cb",
    irnStatus: "Verified (25h Cooldown Passed)",
    carrierStatus: "VESSEL_DEPARTED",
    carrierName: "MSC Mediterranean (MSC)",
    bolNumber: "BL-MSC-441092",
    zkStatus: "ZK-Verified",
    issueDate: "2026-09-29",
    maturityDays: 90,
  },
  {
    id: "inv-2026-003",
    invoiceNumber: "INV-IND-2026-083",
    buyer: "Solaria Microelectronics Ltd",
    buyerCountry: "Taiwan (TW)",
    corridor: "Chennai Port ➔ Kaohsiung",
    goods: "Specialized Ultra-Purity Silica Conductors",
    faceValue: 180000,
    currency: "USDC",
    advanceRate: 0.75,
    canonicalHash: "0x9183ca201834df91082bc3194a029381741639d1084f",
    irnStatus: "Verified (25h Cooldown Passed)",
    carrierStatus: "CUSTOMS_CLEARED",
    carrierName: "Hapag-Lloyd (HLAG)",
    bolNumber: "BL-HAPAG-782103",
    zkStatus: "Ready to Factor",
    issueDate: "2026-09-30",
    maturityDays: 45,
  },
  {
    id: "inv-2026-004",
    invoiceNumber: "INV-IND-2026-084",
    buyer: "Alpine Health Systems",
    buyerCountry: "Switzerland (CH)",
    corridor: "Nhava Sheva ➔ Antwerp",
    goods: "Active Pharmaceutical Ingredients (API Standard)",
    faceValue: 410000,
    currency: "USDC",
    advanceRate: 0.75,
    canonicalHash: "0x391fca028471be892019c488319f0183749281938591",
    irnStatus: "Verified (25h Cooldown Passed)",
    carrierStatus: "VESSEL_DEPARTED",
    carrierName: "CMA CGM",
    bolNumber: "BL-CMA-339011",
    zkStatus: "ZK-Verified",
    issueDate: "2026-10-01",
    maturityDays: 75,
  },
];

export default function ExporterInvoicesPage() {
  const [invoices] = useState<InvoiceItem[]>(SAMPLE_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#F59E0B]/15 text-[#FCD34D] border border-[#F59E0B]/30 font-semibold">
                Peppol BIS 3.0 Standard
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/exporter/factoring"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Factor New Invoice</span>
            </Link>
          </div>
        </div>

        {/* Portfolio Quick Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Total Invoiced Face Value
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-white">
                ${totalReceivables.toLocaleString()}
              </span>
              <span className="font-mono text-xs text-[#00F2FE]">USDC</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-[#F59E0B]/30">
            <span className="text-[11px] font-mono text-[#FCD34D] uppercase tracking-wider block mb-1">
              Eligible Liquidity (75% Advance)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-[#FCD34D]">
                ${totalEligibleAdvance.toLocaleString()}
              </span>
              <span className="font-mono text-xs text-slate-400">Instant Drawdown</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0F17]/90 border border-[#14F195]/30">
            <span className="text-[11px] font-mono text-[#14F195] uppercase tracking-wider block mb-1">
              Statutory Tax Oracle Status
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14F195] animate-pulse" />
              <span className="font-mono text-sm font-semibold text-white">
                100% IRN Cooldown Cleared
              </span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <RajmudraStatusBar />

        {/* Invoices Table Card */}
        <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800/80">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoice, buyer, BoL..."
                className="w-full pl-9 pr-4 py-2 bg-[#101420] border border-slate-700/80 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:border-[#F59E0B] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
              <span className="text-slate-400 hidden sm:inline flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: "all", label: "All Invoices" },
                { id: "zk", label: "ZK Verified" },
                { id: "ready", label: "Ready to Factor" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    statusFilter === tab.id
                      ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#FCD34D] font-bold"
                      : "border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Invoice &amp; Hash</th>
                  <th className="pb-3 font-semibold">Buyer Enterprise</th>
                  <th className="pb-3 font-semibold">Maritime eBL</th>
                  <th className="pb-3 font-semibold">Face Value</th>
                  <th className="pb-3 font-semibold">75% Advance</th>
                  <th className="pb-3 font-semibold">Rajmudra Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-body">
                {filteredInvoices.map((inv) => {
                  const advanceAmount = Math.round(inv.faceValue * inv.advanceRate);
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Invoice & Canonical Hash */}
                      <td className="py-4 pr-3">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-lg bg-white/5 border border-slate-800 text-[#F59E0B] shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono font-bold text-white block">
                              {inv.invoiceNumber}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[140px] block" title={inv.canonicalHash}>
                              SHA256: {inv.canonicalHash.slice(0, 10)}...
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Issued: {inv.issueDate} ({inv.maturityDays}d tenor)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Buyer */}
                      <td className="py-4 pr-3">
                        <span className="text-white font-medium block">
                          {inv.buyer}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {inv.buyerCountry}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {inv.corridor}
                        </span>
                      </td>

                      {/* Maritime eBL */}
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                          <Ship className="w-3.5 h-3.5 text-[#00F2FE]" />
                          <span>{inv.bolNumber}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {inv.carrierName}
                        </span>
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
                        <span className="text-[9.5px] font-mono text-slate-400 block mt-1">
                          IRN Cooldown: Cleared
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 text-right">
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
        </div>
      </main>
    </div>
  );
}
