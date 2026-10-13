"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import {
  X,
  Shield,
  CheckCircle2,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  iconBg: string;
  tag: string;
  isJudgeDemo?: boolean;
  description: string;
}

export const WalletModal: React.FC = () => {
  const { isModalOpen, closeWalletModal, connectWallet, connecting, isTestMode } = useWallet();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isModalOpen) return null;

  // Wallet options dynamically configured based on environment testmode
  const walletOptions: WalletOption[] = [
    ...(isTestMode
      ? [
          {
            id: "factory_exporter_wallet",
            name: "Factory & Exporter Wallet",
            iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
            tag: "Exporter • 3.0 SOL",
            isJudgeDemo: true,
            description: "Used by Global Exporters to register Peppol invoices & receive factoring advances (4215yZFm...)",
          },
          {
            id: "institutional_lp_wallet",
            name: "Institutional LP Wallet",
            iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
            tag: "Lender (LP) • 5.0 SOL",
            isJudgeDemo: true,
            description: "Used by Institutional Lenders to fund liquidity pools & underwriting vaults (C3CBRnk4...)",
          },
          {
            id: "admin_approver_wallet",
            name: "Admin & Approver Wallet",
            iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
            tag: "Admin & Citadel • 12.0 SOL",
            isJudgeDemo: true,
            description: "Used by Peshawa Sovereign Admin & ZK Approver to verify proofs and govern vaults (AzHZTAXa...)",
          },
        ]
      : []),
    {
      id: "phantom",
      name: "Phantom",
      iconBg: "bg-[#AB9FF2]",
      tag: "Browser Wallet",
      description: "Connect your personal Phantom wallet extension on Solana Devnet",
    },
    {
      id: "solflare",
      name: "Solflare",
      iconBg: "bg-[#FC814A]",
      tag: "Browser Wallet",
      description: "Connect your Solflare extension or Ledger hardware custody",
    },
    {
      id: "backpack",
      name: "Backpack",
      iconBg: "bg-[#E33E38]",
      tag: "xNFT Native",
      description: "Standard Solana xNFT wallet interface",
    },
  ];

  const handleSelect = async (wallet: WalletOption) => {
    setSelectedWalletId(wallet.id);
    setErrorMessage(null);
    try {
      await connectWallet(wallet.name);
    } catch (err: any) {
      console.warn("Wallet connect error:", err);
      setErrorMessage(err?.message || "Failed to connect to wallet.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#0A0D14] border border-[#F59E0B]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-gradient-to-b from-[#F59E0B]/20 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={closeWalletModal}
          disabled={connecting}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/50 flex items-center justify-center ashtakona-shape shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="font-devanagari text-base font-black text-[#FCD34D]">
              मु
            </span>
          </div>
          <div>
            <h2 className="font-headline text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Connect Solana Wallet
            </h2>
            <p className="font-mono text-xs text-slate-400">
              Access the MudrAA sovereign liquidity &amp; factoring workspace
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs font-mono text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Connecting Banner */}
        {connecting && (
          <div className="mb-5 p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-[#FCD34D]">
                Connecting {selectedWalletId ? selectedWalletId.toUpperCase() : "Wallet"}...
              </p>
              <p className="text-slate-400 font-mono text-[11px]">
                Synchronizing with Solana Devnet cluster
              </p>
            </div>
          </div>
        )}

        {/* Wallets List */}
        <div className="space-y-2.5 mb-6">
          {walletOptions.map((wallet) => {
            const isSelected = selectedWalletId === wallet.id && connecting;
            return (
              <button
                key={wallet.id}
                onClick={() => handleSelect(wallet)}
                disabled={connecting}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                  wallet.isJudgeDemo
                    ? "bg-gradient-to-r from-amber-500/10 via-[#121624] to-[#121624] border-amber-500/60 hover:border-amber-400"
                    : isSelected
                    ? "bg-[#F59E0B]/15 border-[#F59E0B]"
                    : "bg-[#11141F]/80 border-slate-800/90 hover:border-[#F59E0B]/50 hover:bg-[#151928]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl ${wallet.iconBg} flex items-center justify-center text-white font-bold font-mono text-sm shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {wallet.isJudgeDemo ? <Zap className="w-5 h-5 text-amber-200" /> : wallet.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm font-semibold text-slate-100 group-hover:text-white">
                        {wallet.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-mono uppercase rounded ${
                          wallet.isJudgeDemo
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                            : "bg-[#14F195]/15 border border-[#14F195]/40 text-[#14F195]"
                        }`}
                      >
                        {wallet.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-body line-clamp-1">
                      {wallet.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#FCD34D] group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Compliance & Terms Acknowledgment */}
        <p className="text-[10px] font-mono text-slate-400 text-center leading-relaxed">
          By connecting a wallet, you agree to MudrAA&apos;s{" "}
          <Link
            href="/terms"
            target="_blank"
            className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            target="_blank"
            className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy &amp; Cookie Policy
          </Link>
          .
        </p>

        {/* Footer Security Strip */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#14F195]" />
            <span>Non-custodial &amp; Ed25519 Verified</span>
          </div>
          <span className="text-[#00F2FE]">Solana Devnet Cluster</span>
        </div>
      </div>
    </div>
  );
};
