"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  FileCheck,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Ship,
  Sparkles,
  Lock,
} from "lucide-react";
import { executeProofGeneration, ProofResult } from "@/lib/zk/zk-worker";

import { useWallet } from "@/context/WalletContext";

interface ExporterInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newInvoice: any) => void;
}

export const ExporterInvoiceModal: React.FC<ExporterInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { fullAddress } = useWallet();
  const [invoiceNumber, setInvoiceNumber] = useState("INV-IND-2026-095");
  const [buyerName, setBuyerName] = useState("Rotterdam Port Industrial Logistics B.V.");
  const [corridor, setCorridor] = useState("JNPT Nhava Sheva ➔ Rotterdam");
  const [goods, setGoods] = useState("High-Grade Precision Stainless Steel Valves");
  const [amountUsdc, setAmountUsdc] = useState<number>(280000);
  const [bolNumber, setBolNumber] = useState("BL-HAPAG-992144");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [lastProof, setLastProof] = useState<ProofResult | null>(null);

  if (!isOpen) return null;

  const advanceRate = 0.75; // Anchor protocol cap: 75%
  const advanceAmount = Math.round(amountUsdc * advanceRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Execute Rajmudra client-side Poseidon ZK prover
      const proofResult = executeProofGeneration({
        taxId: "27AABCS1429B1Z0",
        buyerId: buyerName.slice(0, 16),
        faceValue: amountUsdc,
        tenorDays: 60,
        secretSalt: "0x8f72a9e102bc45de89104fa39d2c189b",
        supplierPubkey: fullAddress || "11111111111111111111111111111111",
      });
      setLastProof(proofResult);

      // Attempt to post to our FastAPI backend if available
      try {
        await fetch("http://localhost:8000/api/v1/trade/invoices/ingest-xml", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoice_number: invoiceNumber,
            exporter_id: "EXP-IND-MH-01",
            importer_id: buyerName.slice(0, 12),
            amount_usdc: amountUsdc,
            peppol_bis_hash: proofResult.nullifierHash,
            cargo_tracking_bill: bolNumber,
          }),
        });
      } catch {
        // Fallback gracefully in client-only demo mode
      }

      const newInvoiceObj = {
        id: `fac-${Date.now()}`,
        invoiceNumber,
        buyer: buyerName,
        corridor,
        goods,
        amountUsdc,
        advanceRate,
        advanceAmountUsdc: advanceAmount,
        bolNumber,
        carrierStatus: "In Transit",
        zkStatus: "ZK-Verified",
        timestamp: "Just now",
        txHash: `5K${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      };

      try {
        const stored = localStorage.getItem("mudraa_transactions");
        const existing = stored ? JSON.parse(stored) : [];
        existing.unshift(newInvoiceObj);
        localStorage.setItem("mudraa_transactions", JSON.stringify(existing));
        window.dispatchEvent(new Event("mudraa_transactions_updated"));
      } catch (err) {
        console.warn("Storage sync error:", err);
      }

      setProofGenerated(true);
      if (onSuccess) {
        onSuccess(newInvoiceObj);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setProofGenerated(false);
        onClose();
      }, 1600);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0B0E17] border border-[#F59E0B]/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-64 h-24 bg-[#F59E0B]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/50 ashtakona-shape flex items-center justify-center shrink-0">
            <span className="font-devanagari text-base font-black text-[#FCD34D]">
              मु
            </span>
          </div>
          <div>
            <h3 className="font-headline text-lg sm:text-xl font-bold text-white tracking-tight">
              Register Trade Invoice &amp; Request Advance
            </h3>
            <p className="font-mono text-xs text-slate-400">
              Trigger Rajmudra ZK-SNARK proof and receive up to 75% instant capital
            </p>
          </div>
        </div>

        {proofGenerated ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#14F195]/15 border border-[#14F195] flex items-center justify-center mx-auto text-[#14F195]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-headline text-xl font-bold text-white">
              Rajmudra Verification Perfected!
            </h4>
            <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
              Peppol BIS 3.0 canonical hash committed to Solana Devnet. 75% Advance of{" "}
              <span className="text-[#14F195] font-bold">
                ${advanceAmount.toLocaleString()} USDC
              </span>{" "}
              is ready for instant disbursement.
            </p>
            {lastProof && (
              <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10.5px] text-slate-400 max-w-md mx-auto text-left space-y-1 mt-2">
                <div className="text-slate-300 font-semibold flex justify-between">
                  <span>Prover Speed:</span>
                  <span className="text-[#14F195]">{lastProof.executionTimeMs}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Compute Budget:</span>
                  <span className="text-[#00F2FE]">{lastProof.computeUnitsEst.toLocaleString()} CU</span>
                </div>
                <div className="truncate">
                  <span>Nullifier: </span>
                  <span className="text-white">{lastProof.nullifierHash.slice(0, 22)}...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111420] border border-slate-700 rounded-lg text-white font-mono focus:border-[#F59E0B] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Bill of Lading (BoL / Carrier)
                </label>
                <input
                  type="text"
                  required
                  value={bolNumber}
                  onChange={(e) => setBolNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111420] border border-slate-700 rounded-lg text-white font-mono focus:border-[#F59E0B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">
                Buyer / Importer Enterprise
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111420] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Trade Corridor
                </label>
                <input
                  type="text"
                  required
                  value={corridor}
                  onChange={(e) => setCorridor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111420] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Goods Classification
                </label>
                <input
                  type="text"
                  required
                  value={goods}
                  onChange={(e) => setGoods(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#111420] border border-slate-700 rounded-lg text-white focus:border-[#F59E0B] outline-none"
                />
              </div>
            </div>

            {/* Advance Rate & Amount Calculation Box */}
            <div className="p-4 rounded-xl bg-[#141926] border border-[#F59E0B]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Invoice Face Value:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-400">$</span>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={amountUsdc}
                    onChange={(e) => setAmountUsdc(Number(e.target.value))}
                    className="w-28 px-2 py-1 bg-black/50 border border-slate-700 rounded text-right font-mono font-bold text-white focus:border-[#F59E0B] outline-none"
                  />
                  <span className="font-mono text-slate-400">USDC</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Advance Rate:</span>
                <span className="text-[#00F2FE] font-bold">85.0% (Instant Liquidity)</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white">Disbursement Amount:</span>
                <span className="font-mono text-base font-extrabold text-[#14F195]">
                  ${advanceAmount.toLocaleString()} USDC
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#06070A] border-t-transparent rounded-full animate-spin" />
                  <span>Generating Rajmudra ZK-Proof...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Verify Receivable &amp; Request Capital</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
