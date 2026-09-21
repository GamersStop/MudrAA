"use client";

import React, { useState } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  Ship,
  Binary,
  Check,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";

type VerificationStep = "idle" | "peppol" | "freight" | "zkproof" | "settled";

export const RajmudraVerifierDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("idle");
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<"textiles" | "hardware">("textiles");

  const scenarios = {
    textiles: {
      ref: "INV-2026-EU-MUM-9842",
      commodity: "Organic Cotton & High-Count Yarns (120 TEU)",
      route: "Port of Nhava Sheva (JNPT) → Hamburg Port Gate",
      carrier: "Maersk Maritime Logistics / BL-948172",
      faceValue: "$850,000 USD",
      advanceRate: "85% ($722,500 USDC)",
      shipperHash: "0x8f2a1b94c3e7d580...a417 (Shielded)",
      consigneeHash: "0x3e1d77a02c918f45...6b89 (Shielded)",
      txId: "4w7bV9fQ7...hL3n9zK1e",
    },
    hardware: {
      ref: "INV-2026-EU-CHN-5519",
      commodity: "Tier-1 Photovoltaic Solar Inverters & Batteries",
      route: "Chennai Container Terminal → Port of Rotterdam",
      carrier: "MSC Mediterranean Shipping / BL-339108",
      faceValue: "$1,420,000 USD",
      advanceRate: "80% ($1,136,000 USDC)",
      shipperHash: "0x67c9d044ea1893bf...98fc (Shielded)",
      consigneeHash: "0x12bb94a3df5518ee...77a1 (Shielded)",
      txId: "9k2jM8vP1...tX4m6bY2w",
    },
  };

  const activeData = scenarios[selectedScenario];

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep("peppol");

    setTimeout(() => {
      setCurrentStep("freight");
    }, 1100);

    setTimeout(() => {
      setCurrentStep("zkproof");
    }, 2300);

    setTimeout(() => {
      setCurrentStep("settled");
      setIsSimulating(false);
    }, 3600);
  };

  const resetSimulation = () => {
    setCurrentStep("idle");
    setIsSimulating(false);
  };

  return (
    <section id="verifier" className="relative py-28 bg-[#070913] border-t border-white/5 overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-tr from-mudraa-purple/12 via-mudraa-cyan/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-dots opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-[-0.03em] text-white mb-4">
            The <span className="text-mudraa-purple-light">Rajmudra</span> Verification Engine
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Witness how real-world Peppol BIS 3.0 receivables synchronize with physical carrier IoT telemetry and resolve through zero-knowledge elliptic curve proofs on Solana L1.
          </p>
        </div>

        {/* Verifier Console Shell */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0D1020]/90 border border-white/15 shadow-2xl shadow-black/90 backdrop-blur-3xl overflow-hidden">
          {/* Top Control Bar */}
          <div className="px-6 py-5 bg-[#080A15] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Ashtakona Royal Seal Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mudraa-purple via-indigo-600 to-mudraa-cyan p-[1.5px] shadow-neon-purple">
                <div className="w-full h-full bg-[#070912] rounded-[10px] flex items-center justify-center font-devanagari text-mudraa-gold-light text-sm font-bold">
                  राज
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide font-sans">
                  Rajmudra Solana L1 Runtime Console
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Engine: <span className="text-mudraa-green font-semibold">Active</span> • Model: ZK-SNARK (alt_bn128) • Program: Anchor v0.30+
                </p>
              </div>
            </div>

            {/* Scenario Picker & Simulation Button */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Scenario Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setSelectedScenario("textiles")}
                  disabled={isSimulating}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedScenario === "textiles"
                      ? "bg-gradient-to-r from-mudraa-purple to-indigo-600 text-white font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Cotton ($850K)
                </button>
                <button
                  onClick={() => setSelectedScenario("hardware")}
                  disabled={isSimulating}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    selectedScenario === "hardware"
                      ? "bg-gradient-to-r from-mudraa-cyan to-teal-500 text-slate-900 font-bold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Solar ($1.4M)
                </button>
              </div>

              {currentStep === "settled" ? (
                <button
                  onClick={resetSimulation}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sandbox</span>
                </button>
              ) : (
                <button
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-lg ${
                    isSimulating
                      ? "bg-slate-700 cursor-not-allowed opacity-80"
                      : "bg-gradient-to-r from-mudraa-purple via-indigo-600 to-mudraa-cyan hover:shadow-neon-cyan active:scale-95"
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? "animate-spin" : ""}`} />
                  <span>{isSimulating ? "Computing Proofs on Solana..." : "Run Cryptographic Simulation"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Stepper Stage Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-white/10 bg-[#090C1A]/70 text-xs font-mono">
            {/* Step 1 */}
            <div
              className={`p-4 border-b sm:border-b-0 sm:border-r border-white/10 transition-colors ${
                currentStep === "peppol" || currentStep === "freight" || currentStep === "zkproof" || currentStep === "settled"
                  ? "bg-mudraa-purple/15 text-mudraa-purple-light"
                  : "text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileCheck2 className="w-4 h-4" />
                <span className="font-bold">1. Peppol BIS 3.0</span>
              </div>
              <span className="text-[11px] text-slate-400">Canonical invoice hash</span>
            </div>

            {/* Step 2 */}
            <div
              className={`p-4 border-b sm:border-b-0 lg:border-r border-white/10 transition-colors ${
                currentStep === "freight" || currentStep === "zkproof" || currentStep === "settled"
                  ? "bg-mudraa-cyan/15 text-mudraa-cyan"
                  : "text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Ship className="w-4 h-4" />
                <span className="font-bold">2. Freight Provenance</span>
              </div>
              <span className="text-[11px] text-slate-400">Carrier GPS & BL oracle</span>
            </div>

            {/* Step 3 */}
            <div
              className={`p-4 border-b sm:border-b-0 sm:border-r border-white/10 transition-colors ${
                currentStep === "zkproof" || currentStep === "settled"
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Binary className="w-4 h-4" />
                <span className="font-bold">3. ZK Proof Engine</span>
              </div>
              <span className="text-[11px] text-slate-400">Circuit non-duplication</span>
            </div>

            {/* Step 4 */}
            <div
              className={`p-4 transition-colors ${
                currentStep === "settled"
                  ? "bg-mudraa-green/20 text-mudraa-green"
                  : "text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">4. L1 Settlement</span>
              </div>
              <span className="text-[11px] text-slate-400">Shielded Token-2022</span>
            </div>
          </div>

          {/* Interactive Screen Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Split Data Telemetry View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
              {/* Box 1: Trade Asset Payload */}
              <div className="p-5 rounded-2xl bg-[#080A16] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    Receivable Ingestion Telemetry
                  </span>
                  <span className="text-mudraa-cyan font-bold px-2 py-0.5 rounded bg-mudraa-cyan/10 border border-mudraa-cyan/30">
                    Peppol RFC 8785
                  </span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Invoice Ref:</span>
                    <span className="text-white font-semibold">{activeData.ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cargo:</span>
                    <span className="text-slate-200 text-right max-w-[240px] truncate">{activeData.commodity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipper (ZK Shielded):</span>
                    <span className="text-mudraa-purple-light font-mono">{activeData.shipperHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consignee:</span>
                    <span className="text-mudraa-purple-light font-mono">{activeData.consigneeHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carrier Logistics:</span>
                    <span className="text-slate-200">{activeData.carrier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Freight Provenance:</span>
                    <span className="text-mudraa-cyan font-medium">Customs Gate Cleared (AIS Validated)</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Solana L1 Smart Contract Execution */}
              <div className="p-5 rounded-2xl bg-[#080A16] border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    Solana L1 Verification State
                  </span>
                  <span
                    className={`font-bold uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded ${
                      currentStep === "settled"
                        ? "bg-mudraa-green/20 text-mudraa-green border border-mudraa-green/40"
                        : currentStep === "idle"
                        ? "bg-slate-800 text-slate-400"
                        : "bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse"
                    }`}
                  >
                    {currentStep === "idle"
                      ? "Ready For Simulation"
                      : currentStep === "settled"
                      ? "Proof Verified & Settled"
                      : "Verifying Proof..."}
                  </span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Circuit Algorithm:</span>
                    <span className="text-white font-semibold">Groth16 / BN254 Curve</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nullifier Status:</span>
                    <span className={currentStep === "settled" ? "text-mudraa-green font-bold" : "text-slate-400"}>
                      {currentStep === "settled" ? "UNIQUE (Unpledged Collateral)" : "Pending Nullifier Query"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Anchor Instruction:</span>
                    <span className="text-mudraa-cyan font-mono text-[11px]">instruction::verify_rajmudra_seal()</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Disbursed Liquidity:</span>
                    <span className="text-mudraa-green font-bold">{activeData.advanceRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">L1 Transaction Cost:</span>
                    <span className="text-mudraa-green">0.000005 SOL (&lt;$0.001)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Status Feedback Banner */}
            <div
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                currentStep === "settled"
                  ? "bg-mudraa-green/15 border-mudraa-green/50 text-white shadow-lg shadow-mudraa-green/10"
                  : currentStep === "idle"
                  ? "bg-[#080A14] border-white/10 text-slate-400"
                  : "bg-mudraa-cyan/15 border-mudraa-cyan/50 text-white shadow-lg shadow-mudraa-cyan/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    currentStep === "settled"
                      ? "bg-mudraa-green shadow-lg shadow-mudraa-green/80"
                      : currentStep === "idle"
                      ? "bg-slate-600"
                      : "bg-mudraa-cyan animate-ping"
                  }`}
                />
                <span className="text-xs font-mono font-medium leading-relaxed">
                  {currentStep === "idle" && "Select an invoice scenario above and click 'Run Cryptographic Simulation' to execute."}
                  {currentStep === "peppol" && "1/4 Hashing Peppol BIS 3.0 invoice XML into RFC 8785 canonical hash..."}
                  {currentStep === "freight" && "2/4 Ingesting carrier AIS freight telemetry & authenticating digital Bill of Lading..."}
                  {currentStep === "zkproof" && "3/4 Generating client ZK-SNARK circuit: confirming non-duplication in global nullifier tree..."}
                  {currentStep === "settled" && `4/4 Rajmudra seal validated on Solana L1! Shielded liquidity disbursed to exporter in 384ms.`}
                </span>
              </div>

              {currentStep === "settled" && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-mudraa-green font-bold bg-mudraa-green/20 px-3 py-1 rounded-lg border border-mudraa-green/50">
                  <Check className="w-4 h-4" />
                  <span>SETTLED FINALITY</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
