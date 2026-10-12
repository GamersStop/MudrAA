"use client";

import React from "react";
import { useWallet, UserRole } from "@/context/WalletContext";
import {
  KeyRound,
  Ship,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  ShieldAlert,
  Info,
} from "lucide-react";

interface RoleCard {
  id: UserRole;
  title: string;
  subTitle: string;
  description: string;
  accessLevel: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ElementType;
  keyFeatures: string[];
  isLowAccess: boolean;
}

const ROLE_OPTIONS: RoleCard[] = [
  {
    id: "admin",
    title: "Peshawa Sovereign Admin",
    subTitle: "Root Authority",
    description: "Emergency circuit breakers, Panditrao KYB whitelists, and unrestricted access to all 6 desks.",
    accessLevel: "Root Authority",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    borderColor: "hover:border-purple-500/70",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    icon: KeyRound,
    keyFeatures: ["Emergency Pause", "Panditrao KYB Registry", "Citadel Console"],
    isLowAccess: false,
  },
  {
    id: "exporter",
    title: "Factory / Exporter Desk",
    subTitle: "Manufacturing Corridor",
    description: "Submit electronic BoLs, run Groth16 ZK proof verification, and draw factoring advances up to 80% LTV.",
    accessLevel: "Operational",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    borderColor: "hover:border-amber-500/70",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    icon: Ship,
    keyFeatures: ["Factoring Station", "Client Groth16 ZK", "Advance Draws"],
    isLowAccess: true,
  },
  {
    id: "lender",
    title: "Institutional Lender (LP)",
    subTitle: "Capital Underwriter",
    description: "Deposit USDC into Senior (6% APY) or Junior (18% APY) tranches and trade on the Secondary Market.",
    accessLevel: "Financial LP",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    borderColor: "hover:border-cyan-500/70",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(24,216,232,0.2)]",
    icon: Building2,
    keyFeatures: ["Multi-Tranche Yields", "Secondary Market", "USDC Distributions"],
    isLowAccess: true,
  },
  {
    id: "auditor",
    title: "Compliance Auditor",
    subTitle: "ZK Observer",
    description: "Read-only inspection of on-chain Groth16 pairings, nullifier registries, and Token-2022 transfer audits.",
    accessLevel: "Read-Only",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    borderColor: "hover:border-emerald-500/70",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(39,231,163,0.2)]",
    icon: ShieldCheck,
    keyFeatures: ["Groth16 Verifier", "Nullifier Anti-Replay", "Token-2022 Audits"],
    isLowAccess: true,
  },
];

export const DemoRoleSelectorModal: React.FC = () => {
  const {
    isRoleSelectorOpen,
    closeRoleSelector,
    selectRole,
    openWalletModal,
    connected,
    walletAddress,
  } = useWallet();

  if (!isRoleSelectorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#090C15] border border-amber-500/30 p-5 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)] my-auto text-left space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeRoleSelector}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
              ⚡ Demo Evaluation Mode
            </span>
          </div>

          <h2 className="font-headline text-lg sm:text-xl font-bold text-white tracking-tight">
            Choose Stakeholder Persona
          </h2>
          <p className="font-body text-xs text-slate-400 leading-normal">
            Select a role to evaluate MudrAA’s RBAC permissions. Your session will maintain this role until you sign out.
          </p>
        </div>

        {/* Compact Hackathon Demo Notice */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-[11px] font-mono text-amber-200/90 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Demo Evaluation Only:</strong> Once selected, this prompt will not be shown again. To switch persona, <strong>sign out</strong> and re-enter.
          </span>
        </div>

        {/* 2x2 Compact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {ROLE_OPTIONS.map((role) => {
            const Icon = role.icon;

            return (
              <div
                key={role.id}
                onClick={() => selectRole(role.id)}
                className={`group relative rounded-xl p-4 bg-[#0E1322]/90 border border-slate-800 transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-2.5 hover:bg-[#12192D] ${role.borderColor} ${role.glowColor}`}
              >
                <div className="space-y-2">
                  {/* Card Top */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <Icon className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-headline text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                          {role.title}
                        </h3>
                        <p className="font-mono text-[10px] text-slate-400 leading-none mt-0.5">
                          {role.subTitle}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${role.badgeColor}`}>
                      {role.accessLevel}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans line-clamp-2">
                    {role.description}
                  </p>

                  {/* Key tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {role.keyFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{feat}</span>
                      </span>
                    ))}
                    {role.isLowAccess && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Citadel Gated</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Compact Select Button */}
                <button
                  type="button"
                  className="w-full mt-1 py-2 px-3 rounded-lg bg-white/5 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-amber-600 text-slate-300 group-hover:text-black font-mono font-bold text-[11px] border border-slate-700 group-hover:border-transparent transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Select &amp; Launch</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer: Dev wallet option */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {connected
                ? `Active Dev Wallet: ${walletAddress}`
                : "Want to test with your own wallet?"}
            </span>
          </div>

          {!connected && (
            <button
              onClick={() => {
                closeRoleSelector();
                openWalletModal("/dashboard");
              }}
              className="text-amber-300 hover:text-amber-200 underline font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Connect Phantom / Solflare ↗</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
