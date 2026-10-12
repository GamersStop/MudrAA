"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { Lock, ArrowRight, ShieldAlert, Wallet } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const {
    connected,
    isInitialized,
    openWalletModal,
    openRoleSelector,
    isTestMode,
    hasSelectedRole,
  } = useWallet();
  const [redirectCountdown, setRedirectCountdown] = useState<number>(4);

  useEffect(() => {
    if (!isInitialized) return;

    if (!connected) {
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.replace("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isInitialized, connected, router]);

  // Initial session hydration check
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#06070A] flex items-center justify-center pcb-grid-bg">
        <div className="flex flex-col items-center gap-3 font-mono text-xs text-slate-400 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
          <span>Verifying sovereign session credentials...</span>
        </div>
      </div>
    );
  }

  // Block access if not authenticated
  if (!connected) {
    return (
      <div className="min-h-screen bg-[#06070A] text-slate-100 flex items-center justify-center p-4 pcb-grid-bg">
        <div className="max-w-md w-full rounded-2xl bg-[#090C15] border border-amber-500/30 p-6 sm:p-8 text-center space-y-5 shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[11px] uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Authentication Required (401)</span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sovereign Workspace Gated
            </h2>
            <p className="font-sans text-xs text-slate-300 leading-relaxed">
              You must connect a Solana wallet or choose a stakeholder evaluation persona to enter the MudrAA workspace. Direct unauthenticated access is strictly prohibited.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                if (isTestMode && !hasSelectedRole) {
                  openRoleSelector();
                } else {
                  openWalletModal("/dashboard");
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-mono font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet / Choose Persona</span>
            </button>

            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-slate-700 font-mono text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Return to Home Screen</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          <p className="text-[10px] font-mono text-slate-500">
            Redirecting to home screen in {redirectCountdown}s...
          </p>
        </div>
      </div>
    );
  }

  // Authenticated: Render workspace contents
  return <>{children}</>;
};
