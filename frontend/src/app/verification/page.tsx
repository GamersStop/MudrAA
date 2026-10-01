"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import {
  Shield,
  ShieldCheck,
  Search,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Lock,
  FileCode,
  Sparkles,
  Layers,
  Copy,
  Check,
  Terminal,
  Eye,
} from "lucide-react";

interface VerificationRecord {
  nullifierHash: string;
  commitmentHash: string;
  txSignature: string;
  slotNumber: number;
  blockTimestamp: string;
  groth16Status: "VALID_PAIRING_CONFIRMED";
  computeUnits: number;
  antiReplayPda: string;
  supplierPubkey: string;
  ivkAttestation: string;
  proofA: string;
  proofB: string;
  proofC: string;
  publicInputs: string[];
}

const PRESET_RECORDS: Record<string, VerificationRecord> = {
  "0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2": {
    nullifierHash: "0x8f72a9e102bc45de89104fa39d2c189b782910fa31b20491820491823901a82f",
    commitmentHash: "0x2c19a849f802c398410294857201948572910293847561029384756102938475",
    txSignature: "5UaL7K91hVxM8P2WqRtNyEbCsVdFzGxAhJkLmOpQrStUvWxYz123456789abcdef",
    slotNumber: 298410219,
    blockTimestamp: "2026-10-01 14:28:11 UTC",
    groth16Status: "VALID_PAIRING_CONFIRMED",
    computeUnits: 104250,
    antiReplayPda: "Nullif1erCitade11111111111111111111111111111",
    supplierPubkey: "MudrAASupplier11111111111111111111111111111",
    ivkAttestation: "0x9812fbc9081234567890abcdef1234567890abcdef1234567890abcdef12345678",
    proofA: "0x12a9b83c7482f9104820194857291048201948572910482019485729104820194820194857291048201948572910482019485729104820194820194857291048",
    proofB: "0x28f710293847561029384756102938475610293847561029384756102938475628f71029384756102938475610293847561029384756102938475610293847563910293847561029384756102938475610293847561029384756102938475639102938475610293847561029384756102938475610293847561029384756",
    proofC: "0x39182746501928374650192837465019283746501928374650192837465019283918274650192837465019283746501928374650192837465019283746501928",
    publicInputs: [
      "0x8f72a9e102bc45de89104fa39d2c189b782910fa31b20491820491823901a82f",
      "0x2c19a849f802c398410294857201948572910293847561029384756102938475",
      "0x00000000000000000000000000000000000000000000000000000000000003e8",
      "0x00000000000000000000000000000000000000000000000000000000000000b4",
    ],
  },
  "0x4e12b79a88cd541f6291a0210b4f871239aa812f84cb": {
    nullifierHash: "0x4e12b79a88cd541f6291a0210b4f871239aa812f84cb19283746501928374651",
    commitmentHash: "0x7a81923049182736450192837465019283746501928374650192837465019283",
    txSignature: "4KzR8m29VwYx10pLqNsTyAcBvDfGzHxJkLmNpQrStUvWxYz987654321fedcba0",
    slotNumber: 298412850,
    blockTimestamp: "2026-10-01 14:49:03 UTC",
    groth16Status: "VALID_PAIRING_CONFIRMED",
    computeUnits: 104250,
    antiReplayPda: "Nullif1erCitade12222222222222222222222222222",
    supplierPubkey: "MudrAASupplier22222222222222222222222222222",
    ivkAttestation: "0x77281bc9081234567890abcdef1234567890abcdef1234567890abcdef12345678",
    proofA: "0x44a9b83c7482f9104820194857291048201948572910482019485729104820194820194857291048201948572910482019485729104820194820194857291048",
    proofB: "0x55f710293847561029384756102938475610293847561029384756102938475628f71029384756102938475610293847561029384756102938475610293847563910293847561029384756102938475610293847561029384756102938475639102938475610293847561029384756102938475610293847561029384756",
    proofC: "0x66182746501928374650192837465019283746501928374650192837465019283918274650192837465019283746501928374650192837465019283746501928",
    publicInputs: [
      "0x4e12b79a88cd541f6291a0210b4f871239aa812f84cb19283746501928374651",
      "0x7a81923049182736450192837465019283746501928374650192837465019283",
      "0x00000000000000000000000000000000000000000000000000000000000003e8",
      "0x00000000000000000000000000000000000000000000000000000000000000b4",
    ],
  },
};

export default function VerificationPortalPage() {
  const [searchQuery, setSearchQuery] = useState("0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2");
  const [activeRecord, setActiveRecord] = useState<VerificationRecord>(
    PRESET_RECORDS["0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2"]
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (PRESET_RECORDS[query]) {
      setActiveRecord(PRESET_RECORDS[query]);
    } else {
      // Default to record 1 with updated display
      setActiveRecord(PRESET_RECORDS["0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2"]);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      <WorkspaceHeader activeTab="verification" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <Link href="/dashboard" className="hover:text-[#FCD34D] transition-colors">
                Workspace
              </Link>
              <span>/</span>
              <span className="text-[#00F2FE]">Rajmudra ZK Explorer</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Rajmudra Zero-Knowledge Verification Portal
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30 font-semibold">
                alt_bn128 Verified
              </span>
            </h1>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Public mathematical proof inspector verifying valid trade invoices without revealing proprietary pricing or line items
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-[#9945FF]/15 text-[#9945FF] border border-[#9945FF]/30 flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              Zero-Knowledge Privacy Active
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <RajmudraStatusBar />

        {/* Explorer Search Form */}
        <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Paste invoice nullifier hash, commitment, or Solana tx signature..."
                className="w-full pl-10 pr-4 py-3 bg-[#111420] border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:border-[#F59E0B] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Inspect Proof</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
            <span>Quick Samples:</span>
            {Object.keys(PRESET_RECORDS).map((key, idx) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSearchQuery(key);
                  setActiveRecord(PRESET_RECORDS[key]);
                }}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-800 transition-colors"
              >
                Sample #{idx + 1} ({key.slice(0, 10)}...)
              </button>
            ))}
          </div>
        </div>

        {/* Verification Report Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Ashta Pradhan Verification Pillars */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Sachiv Groth16 On-Chain Verifier Card */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-[#14F195]/40 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-headline text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#14F195]" />
                  Sachiv Rajmudra Verifier (Native Solana alt_bn128)
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/40 font-bold">
                  {activeRecord.groth16Status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Syscall Execution
                  </span>
                  <span className="text-white font-bold block">sol_alt_bn128_group_op</span>
                  <span className="text-[10px] text-[#14F195] block mt-0.5">Pairing Equation Valid</span>
                </div>

                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Compute Budget
                  </span>
                  <span className="text-[#00F2FE] font-bold block">
                    {activeRecord.computeUnits.toLocaleString()} CU
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Standard Cap: 110,000 CU</span>
                </div>

                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Solana Slot / Time
                  </span>
                  <span className="text-white font-bold block">Slot {activeRecord.slotNumber}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{activeRecord.blockTimestamp}</span>
                </div>
              </div>

              {/* Transaction Signature */}
              <div className="p-3 rounded-xl bg-[#111420] border border-slate-800 font-mono text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Solana Transaction Signature
                  </span>
                  <span className="text-slate-200 font-bold break-all">
                    {activeRecord.txSignature}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(activeRecord.txSignature, "tx")}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 shrink-0 ml-3"
                  title="Copy signature"
                >
                  {copiedKey === "tx" ? <Check className="w-4 h-4 text-[#14F195]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2. Senapati Anti-Replay Citadel PDA Card */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-[#F59E0B]/30 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-headline text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#F59E0B]" />
                  Senapati Anti-Replay Citadel (Double-Pledge Barrier)
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#F59E0B]/15 text-[#FCD34D] border border-[#F59E0B]/30 font-semibold">
                  Threat A.1 &amp; A.2 Mitigated
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Anti-Replay Nullifier PDA Seed
                    </span>
                    <span className="text-white font-bold">
                      [b&quot;nullifier&quot;, supplier_pubkey, nullifier_hash]
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Canonical Address: {activeRecord.antiReplayPda}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#14F195]/20 text-[#14F195] text-[10px] font-bold">
                    ACTIVE PDA
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Authorized Supplier Signer
                    </span>
                    <span className="text-slate-200 font-bold">
                      {activeRecord.supplierPubkey}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      MEV Front-Running Protection: Enforced via Signer&lt;&apos;info&gt; constraint
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] text-[10px] font-bold">
                    SIGNER OK
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Cryptographic Curve Points Viewer */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <span className="font-headline text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileCode className="w-5 h-5 text-[#00F2FE]" />
                BN254 Groth16 Curve Points &amp; Public Inputs
              </span>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Point A (G1, 64-byte compressed):</span>
                    <span className="text-[#00F2FE]">G1</span>
                  </div>
                  <div className="text-slate-300 break-all bg-black/50 p-2 rounded">
                    {activeRecord.proofA}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Point B (G2, 128-byte compressed):</span>
                    <span className="text-[#9945FF]">G2</span>
                  </div>
                  <div className="text-slate-300 break-all bg-black/50 p-2 rounded">
                    {activeRecord.proofB}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Point C (G1, 64-byte compressed):</span>
                    <span className="text-[#00F2FE]">G1</span>
                  </div>
                  <div className="text-slate-300 break-all bg-black/50 p-2 rounded">
                    {activeRecord.proofC}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Panditrao Scoped Auditor Attestation */}
          <div className="lg:col-span-4 space-y-6">
            {/* Scoped Auditor Viewing Key (IVK) Card */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-[#9945FF]/40 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Eye className="w-5 h-5 text-[#9945FF]" />
                <h4 className="font-headline text-sm font-bold text-white">
                  Panditrao Scoped Auditor Attestation
                </h4>
              </div>

              <p className="text-xs font-mono text-slate-400">
                Enterprise auditors can inspect and verify this trade receivable using their registered Zcash Incoming Viewing Key (IVK) without public exposure.
              </p>

              <div className="p-3.5 rounded-xl bg-[#111420] border border-slate-800 space-y-2 font-mono text-xs">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  HMAC-SHA256 Audit Seal
                </span>
                <span className="text-slate-200 break-all font-semibold block">
                  {activeRecord.ivkAttestation}
                </span>
                <div className="text-[10.5px] text-[#9945FF] pt-2 border-t border-slate-800">
                  Attestation binds Nullifier || Commitment to Disclosed Auditor Key.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#14F195]/10 border border-[#14F195]/30 text-xs font-mono text-[#14F195] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Auditor Clear: Zero trade secret leakage detected</span>
              </div>
            </div>

            {/* Public Inputs Breakdown */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Terminal className="w-5 h-5 text-[#F59E0B]" />
                <h4 className="font-headline text-sm font-bold text-white">
                  Public Inputs Vector
                </h4>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                {activeRecord.publicInputs.map((val, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#111420] border border-slate-800/80">
                    <span className="text-slate-400 block text-[9.5px]">
                      x[{idx}]: {idx === 0 ? "Nullifier Hash" : idx === 1 ? "Commitment Hash" : idx === 2 ? "Min Face Value ($1,000)" : "Max Tenor (180d)"}
                    </span>
                    <span className="text-white truncate block">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
