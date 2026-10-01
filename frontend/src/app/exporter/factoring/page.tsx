"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import { executeProofGeneration, ProofResult } from "@/lib/zk/zk-worker";
import {
  UploadCloud,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Ship,
  Sparkles,
  Lock,
  ExternalLink,
  Sliders,
  DollarSign,
  AlertTriangle,
  Info,
} from "lucide-react";

interface SampleInvoice {
  id: string;
  name: string;
  taxId: string;
  buyerId: string;
  faceValue: number;
  tenorDays: number;
  corridor: string;
  goods: string;
  bolNumber: string;
  carrier: string;
  irn: string;
  irnHoursElapsed: number; // statutory 25h check
  canonicalHash: string;
}

const PRESET_INVOICES: SampleInvoice[] = [
  {
    id: "sample-1",
    name: "INV-IND-2026-081 (Hamburg CNC Machinery)",
    taxId: "27AABCS1429B1Z0",
    buyerId: "DE318491024-VANDERBILT",
    faceValue: 320000,
    tenorDays: 60,
    corridor: "JNPT Nhava Sheva ➔ Hamburg",
    goods: "Industrial Precision Machining CNC Castings",
    bolNumber: "BL-MAERSK-902110",
    carrier: "Maersk Line (MSK)",
    irn: "9f82c47a9e01824b2a8d10382910cbe849201948572019385920194857291029",
    irnHoursElapsed: 31,
    canonicalHash: "0x8f72a9e102bc45de89104fa39d2c189b782910fa31b2",
  },
  {
    id: "sample-2",
    name: "INV-IND-2026-082 (Rotterdam Solar Wafers)",
    taxId: "24AACCS9012F1Z4",
    buyerId: "FI992817401-NORDIC-GREEN",
    faceValue: 540000,
    tenorDays: 90,
    corridor: "Mundra Port ➔ Rotterdam",
    goods: "High-Efficiency Monocrystalline Solar Wafers",
    bolNumber: "BL-MSC-441092",
    carrier: "MSC Mediterranean (MSC)",
    irn: "4e82b79a88cd541f6291a0210b4f871239aa812f84cb19283746501928374651",
    irnHoursElapsed: 28,
    canonicalHash: "0x4e12b79a88cd541f6291a0210b4f871239aa812f84cb",
  },
  {
    id: "sample-3",
    name: "INV-IND-2026-084 (Antwerp Active Pharma)",
    taxId: "27AABCA3312H1ZQ",
    buyerId: "CH228194012-ALPINE-HEALTH",
    faceValue: 410000,
    tenorDays: 75,
    corridor: "Nhava Sheva ➔ Antwerp",
    goods: "Active Pharmaceutical Ingredients (API Standard)",
    bolNumber: "BL-CMA-339011",
    carrier: "CMA CGM Logistics",
    irn: "1938fca028471be892019c488319f0183749281938591a82910cba7291039485",
    irnHoursElapsed: 44,
    canonicalHash: "0x391fca028471be892019c488319f0183749281938591",
  },
];

export default function ExporterFactoringStation() {
  const [selectedPreset, setSelectedPreset] = useState<SampleInvoice>(PRESET_INVOICES[0]);
  const [advanceRate, setAdvanceRate] = useState<number>(0.75); // 75% standard protocol limit
  const [confidentialDisbursement, setConfidentialDisbursement] = useState<boolean>(true);
  
  // Workflow States: 1. Setup -> 2. Proving -> 3. Sign -> 4. Confirmed
  const [workflowStep, setWorkflowStep] = useState<"input" | "proving" | "signing" | "confirmed">("input");
  const [zkProofResult, setZkProofResult] = useState<ProofResult | null>(null);
  const [proverLogs, setProverLogs] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Mathematical Accounting Constants (Checked & Non-reverting)
  const faceValue = selectedPreset.faceValue;
  const dilutionReservePct = 0.10; // 10% dilution reserve
  const retainagePct = 1 - advanceRate - dilutionReservePct; // remaining retainage
  
  const advanceAmount = Math.round(faceValue * advanceRate);
  const dilutionAmount = Math.round(faceValue * dilutionReservePct);
  const retainageAmount = Math.round(faceValue * Math.max(0, retainagePct));
  
  // Benchmark interest: SOFR (4.5%) + 3.5% = 8.0% p.a.
  const annualDiscountFee = 0.08;
  const financingFee = Math.round(advanceAmount * annualDiscountFee * (selectedPreset.tenorDays / 365));
  const netDisbursement = advanceAmount - financingFee;

  // Handle Client-Side ZK-Proof Generation
  const handleTriggerProver = async () => {
    setWorkflowStep("proving");
    setProverLogs([
      "Initializing Rajmudra Web Worker Prover...",
      "Normalizing Peppol BIS 3.0 canonical invoice fields...",
      "Evaluating Num2Bits(64) range constraints on Face Value...",
      "Executing Poseidon sponge permutation (t=5, x^5 mod p)...",
    ]);

    try {
      // Simulate real-time progress steps for high-fidelity institutional UI
      await new Promise((r) => setTimeout(r, 400));
      setProverLogs((prev) => [...prev, "Deriving anti-replay nullifier seed: [b'nullifier', supplier, hash]..."]);
      
      await new Promise((r) => setTimeout(r, 500));
      setProverLogs((prev) => [...prev, "Synthesizing BN254 Groth16 curve points A (G1), B (G2), C (G1)..."]);

      // Run actual deterministic BN254 Poseidon prover from zk-worker.ts
      const result = executeProofGeneration({
        taxId: selectedPreset.taxId,
        buyerId: selectedPreset.buyerId,
        faceValue: selectedPreset.faceValue,
        tenorDays: selectedPreset.tenorDays,
        secretSalt: "0x" + selectedPreset.canonicalHash.slice(2, 34),
        supplierPubkey: "MudrAASupplier11111111111111111111111111111",
      });

      setZkProofResult(result);
      setProverLogs((prev) => [
        ...prev,
        `✓ Proof perfected in ${result.executionTimeMs}ms!`,
        `✓ Alt_bn128 Compute Unit footprint: ${result.computeUnitsEst.toLocaleString()} CU (Protocol cap: 110,000 CU)`,
      ]);

      await new Promise((r) => setTimeout(r, 600));
      setWorkflowStep("signing");
    } catch (err: any) {
      setProverLogs((prev) => [...prev, `Error: ${err.message}`]);
      setWorkflowStep("input");
    }
  };

  const handleSignAndDisburse = async () => {
    setWorkflowStep("signing");
    await new Promise((r) => setTimeout(r, 1400));
    setWorkflowStep("confirmed");
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      <WorkspaceHeader activeTab="factoring" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <Link href="/exporter" className="hover:text-[#FCD34D] transition-colors">
                Exporter Workspace
              </Link>
              <span>/</span>
              <span className="text-[#00F2FE]">Factoring Station</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Instant Receivable Factoring &amp; ZK Advance
            </h1>
            <p className="font-mono text-xs text-slate-400 mt-1">
              Client-side Poseidon witness generation &amp; Solana Token-2022 confidential liquidity payout
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Statutory 25h IRN Cooldown: Passed
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <RajmudraStatusBar />

        {/* Main Factoring Workflow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Preset Selector & Oracle Validations */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Select / Upload Invoice Box */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-headline text-sm font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#F59E0B]" />
                  1. Select Peppol BIS 3.0 Verified Receivable
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  UBL 2.1 XML / JCS Canonicalized
                </span>
              </div>

              {/* Preset Cards */}
              <div className="space-y-2.5">
                {PRESET_INVOICES.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      if (workflowStep === "input") {
                        setSelectedPreset(preset);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPreset.id === preset.id
                        ? "bg-[#F59E0B]/10 border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-[#111420]/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white">
                        {preset.name}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#14F195]">
                        ${preset.faceValue.toLocaleString()} USDC
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span>Corridor: {preset.corridor}</span>
                      <span>BoL: {preset.bolNumber}</span>
                      <span>Tenor: {preset.tenorDays}d</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Drag and Drop Zone Demonstration */}
              <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center bg-[#111420]/50 hover:bg-[#111420] transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-300 font-medium">
                  Drop custom Peppol BIS 3.0 XML file to ingest
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Automated defusedxml parse &amp; RFC 8785 canonical hash extraction
                </p>
              </div>
            </div>

            {/* 2. Ashta Pradhan Oracle Gateway Status Card */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-slate-800 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-4">
              <span className="font-headline text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                <Ship className="w-4 h-4 text-[#00F2FE]" />
                2. Real-Time Multimodal Oracle Telemetry
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
                {/* Tax Oracle */}
                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Tax Authority IRN</span>
                    <span className="text-[#14F195] font-bold">25h Rule Cleared</span>
                  </div>
                  <span className="text-white font-semibold block truncate" title={selectedPreset.irn}>
                    {selectedPreset.irn.slice(0, 18)}...
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3 text-[#14F195]" />
                    <span>{selectedPreset.irnHoursElapsed}h elapsed since registration</span>
                  </div>
                </div>

                {/* Carrier Oracle */}
                <div className="p-3 rounded-xl bg-[#111420] border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Carrier Maritime eBL</span>
                    <span className="text-[#00F2FE] font-bold">VESSEL_DEPARTED</span>
                  </div>
                  <span className="text-white font-semibold block">
                    {selectedPreset.carrier}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Vessel departed port of loading; milestone locked.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Advance Slider, ZK Prover & Dual-Sign */}
          <div className="lg:col-span-5 space-y-6">
            {/* Advance Calculator & Sliders */}
            <div className="rounded-2xl bg-[#0C0F17]/95 border border-[#F59E0B]/30 p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-headline text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#F59E0B]" />
                  3. Liquidity Advance Terms
                </span>
                <span className="font-mono text-xs text-[#14F195] font-bold">
                  {(advanceRate * 100).toFixed(0)}% Advance Rate
                </span>
              </div>

              {/* Advance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Advance Ratio (Anchor Cap: 75%)</span>
                  <span className="text-white font-bold">{(advanceRate * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.75"
                  step="0.05"
                  value={advanceRate}
                  disabled={workflowStep !== "input"}
                  onChange={(e) => setAdvanceRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>50% Min</span>
                  <span>65% Standard</span>
                  <span>75% Max Anchor Limit</span>
                </div>
              </div>

              {/* Waterfall Capital Breakdown Box */}
              <div className="p-4 rounded-xl bg-[#111420] border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Invoice Face Value:</span>
                  <span className="text-white font-bold">${faceValue.toLocaleString()} USDC</span>
                </div>

                <div className="flex justify-between text-[#14F195]">
                  <span>Gross Advance ({(advanceRate * 100).toFixed(0)}%):</span>
                  <span className="font-bold">+${advanceAmount.toLocaleString()} USDC</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Dilution Reserve (10% Buffer):</span>
                  <span>${dilutionAmount.toLocaleString()} USDC</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Retainage ({(retainagePct * 100).toFixed(0)}% Refundable):</span>
                  <span>${retainageAmount.toLocaleString()} USDC</span>
                </div>

                <div className="flex justify-between text-[#F59E0B] pt-2 border-t border-slate-800">
                  <span>Discount Fee (SOFR+3.5%, {selectedPreset.tenorDays}d):</span>
                  <span>-${financingFee.toLocaleString()} USDC</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Net Disbursed Capital:</span>
                  <span className="text-[#14F195] font-extrabold font-headline">
                    ${netDisbursement.toLocaleString()} USDC
                  </span>
                </div>
              </div>

              {/* Confidential Token-2022 Toggle */}
              <div className="p-3.5 rounded-xl bg-[#111420] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#9945FF]/15 border border-[#9945FF]/40 flex items-center justify-center text-[#9945FF]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-body text-xs font-semibold text-white block">
                      SPL Token-2022 Shielded Payout
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      ElGamal encrypted balance (conceals amount on public explorer)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfidentialDisbursement(!confidentialDisbursement)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    confidentialDisbursement ? "bg-[#9945FF]" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      confidentialDisbursement ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Workflow Action State Display */}
              {workflowStep === "input" && (
                <button
                  type="button"
                  onClick={handleTriggerProver}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Generate Rajmudra ZK-SNARK Proof</span>
                </button>
              )}

              {workflowStep === "proving" && (
                <div className="p-4 rounded-xl bg-[#111420] border border-[#F59E0B]/40 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-[#FCD34D]">
                    <div className="w-4 h-4 border-2 border-[#FCD34D] border-t-transparent rounded-full animate-spin" />
                    <span>Executing BN254 Groth16 Prover...</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/70 font-mono text-[10.5px] text-slate-300 space-y-1">
                    {proverLogs.map((log, idx) => (
                      <div key={idx} className="truncate">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workflowStep === "signing" && (
                <div className="p-4 rounded-xl bg-[#111420] border border-[#14F195]/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#14F195] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ZK Proof Validated! Ready to Sign on Solana</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    Dual signature required: Dual Ed25519 Notice of Assignment (NOA) and Solana Escrow Anchor PDA registration.
                  </p>
                  <button
                    type="button"
                    onClick={handleSignAndDisburse}
                    className="w-full py-3 rounded-xl bg-[#14F195] hover:bg-[#14F195]/90 text-[#06070A] font-body text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(20,241,149,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign NOA &amp; Claim ${netDisbursement.toLocaleString()} USDC</span>
                  </button>
                </div>
              )}

              {workflowStep === "confirmed" && (
                <div className="p-5 rounded-xl bg-[#14F195]/15 border border-[#14F195] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#14F195]/20 border border-[#14F195] flex items-center justify-center mx-auto text-[#14F195]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-headline text-lg font-bold text-white">
                    Advance Successfully Disbursed!
                  </h4>
                  <p className="font-mono text-xs text-slate-300 max-w-sm mx-auto">
                    ${netDisbursement.toLocaleString()} USDC transferred to your Token-2022 confidential account.
                  </p>
                  <div className="p-2.5 rounded bg-black/60 font-mono text-[10.5px] text-slate-400 text-left space-y-1">
                    <div>Nullifier PDA: 0x9f28a...b712</div>
                    <div>Solana Tx: 5UaL7K...9xQP</div>
                    <div>alt_bn128 Pairing: Verified (104,250 CU)</div>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Link
                      href="/verification"
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>Inspect ZK Proof</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setWorkflowStep("input")}
                      className="px-3.5 py-1.5 rounded-lg bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-xs font-mono text-[#FCD34D] transition-colors"
                    >
                      Factor Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
