"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet, UserRole } from "@/context/WalletContext";
import {
  Wallet,
  LogOut,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Shield,
  Activity,
  Copy,
  Check,
  Building2,
  Ship,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Zap,
  Users,
  Lock,
  KeyRound,
} from "lucide-react";

interface WorkspaceHeaderProps {
  activeTab?: "exporter" | "liquidity" | "overview" | "factoring" | "verification" | "secondary" | "admin";
  onTabChange?: (tab: "exporter" | "liquidity" | "overview" | "factoring" | "verification" | "secondary" | "admin") => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeTab = "overview",
  onTabChange,
}) => {
  const pathname = usePathname();
  const {
    walletAddress,
    fullAddress,
    connected,
    disconnectWallet,
    openWalletModal,
    balanceSol,
    balanceUsdc,
    currentSlot,
    isDemoWallet,
    isTestMode,
    userRole,
    setUserRole,
    resetRoleSelection,
    refreshBalance,
  } = useWallet();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (fullAddress) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const allNavItems = [
    { id: "overview", label: "Overview", href: "/dashboard", icon: Layers },
    { id: "admin", label: "Admin Citadel", href: "/admin", icon: KeyRound },
    { id: "exporter", label: "Exporter Desk", href: "/exporter", icon: Ship },
    { id: "factoring", label: "Factoring", href: "/exporter/factoring", icon: Sparkles },
    { id: "liquidity", label: "Liquidity Desk", href: "/liquidity", icon: Building2 },
    { id: "verification", label: "ZK Explorer", href: "/verification", icon: Shield },
    { id: "secondary", label: "Secondary", href: "/secondary", icon: Activity },
  ];

  // RBAC Access Filter: Admin Citadel is strictly visible ONLY to sovereign Admin
  const allowedNavByRole: Record<UserRole, string[]> = {
    admin: ["overview", "admin", "exporter", "factoring", "liquidity", "verification", "secondary"],
    exporter: ["overview", "exporter", "factoring"],
    lender: ["overview", "liquidity", "secondary"],
    auditor: ["overview", "verification"],
  };

  const visibleNavItems = allNavItems.filter((item) =>
    allowedNavByRole[userRole].includes(item.id)
  );

  const roleMeta: Record<UserRole, { label: string; badge: string; iconBg: string }> = {
    admin: { label: "Admin (Peshawa)", badge: "Full Access", iconBg: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
    exporter: { label: "Factory / Exporter", badge: "Supplier Desk", iconBg: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
    lender: { label: "Institutional LP", badge: "Capital Tranches", iconBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
    auditor: { label: "Auditor", badge: "ZK Verifier", iconBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  };

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* 1. Judge Evaluation Mode Banner Notice (Only active if testmode is enabled via env) */}
      {mounted && isTestMode && isDemoWallet && (
        <div className="bg-gradient-to-r from-amber-950/80 via-[#0A0D15] to-cyan-950/80 border-b border-amber-500/30 px-4 sm:px-6 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
              ⚡ Judge Evaluation Mode
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Pre-authorized demo wallet is automatically connected for zero-friction evaluation.
            </span>
            <span className="text-slate-400 text-[11px]">
              (Phantom &amp; Solflare also supported)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Cluster: <strong className="text-emerald-400">Solana Devnet</strong></span>
            {currentSlot && (
              <span className="hidden md:inline">
                Slot: <strong className="text-cyan-400">#{currentSlot.toLocaleString()}</strong>
              </span>
            )}
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
            >
              <span>Devnet Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <header className="w-full bg-[#07090E]/95 backdrop-blur-md border-b border-[#F59E0B]/20 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand + Role Switcher */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
              title="Return to Public Overview"
            >
              <div className="w-8 h-8 rounded-lg bg-[#111318] border border-[#F59E0B]/50 ashtakona-shape flex items-center justify-center group-hover:border-[#F59E0B] transition-colors shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                <span className="font-devanagari text-xs text-[#FCD34D] font-black">
                  मु
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FCD34D] to-[#F59E0B] tracking-wider">
                  MudrAA
                </span>
                <span className="font-mono text-[9px] text-[#00F2FE] uppercase -mt-0.5 tracking-widest">
                  Workspace
                </span>
              </div>
            </Link>

            {/* Active RBAC Role Badge (Static Session Indicator — Role change requires Sign Out) */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium shadow-sm select-none ${roleMeta[userRole].iconBg}`}
              title={`Active Persona: ${roleMeta[userRole].label}. To change roles, sign out and select a different role upon sign in.`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{roleMeta[userRole].label}</span>
              <span className="text-[10px] opacity-75 px-1.5 py-0.5 rounded bg-black/30 border border-current/20 hidden sm:inline">
                {roleMeta[userRole].badge}
              </span>
            </div>

            {/* Role-Filtered Navigation Pills */}
            <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-[#101420] border border-slate-800">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  pathname === item.href ||
                  (item.id === "overview" && pathname === "/dashboard");

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onTabChange) {
                        onTabChange(item.id as any);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium font-body transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#F59E0B]/20 to-[#FCD34D]/10 text-[#FCD34D] border border-[#F59E0B]/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Link href={item.href} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Network Status + Connected Wallet Menu */}
          <div className="flex items-center gap-3">
            {/* Live Balance Quick Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111624] border border-slate-800 text-[11px] font-mono">
              <span className="text-slate-400">Live SOL:</span>
              <span className="text-[#14F195] font-bold">{balanceSol.toFixed(4)} SOL</span>
              <button
                onClick={handleRefresh}
                title="Refresh Live Devnet Balance"
                className={`p-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer ${isRefreshing ? "animate-spin" : ""}`}
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Wallet Trigger / Status Button */}
            {connected ? (
              <div className="relative">
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#101420] border border-[#14F195]/40 hover:border-[#14F195] text-xs font-mono text-slate-200 transition-all cursor-pointer shadow-[0_0_12px_rgba(20,241,149,0.15)]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#14F195]" />
                  <span className="font-semibold text-[#14F195]">{walletAddress}</span>
                  {isDemoWallet && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 hidden sm:inline">
                      DEMO
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {walletDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#0E121B] border border-slate-800 rounded-xl p-3 shadow-2xl z-50 animate-fade-in text-xs font-mono">
                    <div className="pb-2.5 mb-2.5 border-b border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Connected Account
                        </span>
                        {isDemoWallet && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Judge Demo Account
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-slate-200 font-bold">
                        <span className="truncate max-w-[190px]">{fullAddress}</span>
                        <button
                          onClick={handleCopy}
                          className="p-1 hover:text-[#FCD34D] transition-colors cursor-pointer"
                          title="Copy Address"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-[#14F195]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 pb-2.5 mb-2.5 border-b border-slate-800 text-[11px]">
                      <div className="flex justify-between text-slate-400">
                        <span>Active Role Persona:</span>
                        <span className="text-amber-400 font-bold">{roleMeta[userRole].label}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Live Devnet SOL:</span>
                        <span className="text-white font-semibold flex items-center gap-1">
                          {balanceSol.toFixed(4)} SOL
                          <button
                            onClick={handleRefresh}
                            className={`p-0.5 text-slate-400 hover:text-white ${isRefreshing ? "animate-spin" : ""}`}
                            title="Refresh"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Token-2022 Shielded USDC:</span>
                        <span className="text-[#14F195] font-semibold">${balanceUsdc.toLocaleString()} USDC</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setWalletDropdownOpen(false);
                          openWalletModal();
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 text-slate-300 transition-colors text-left"
                      >
                        <span>Switch Wallet (Phantom / Solflare)</span>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <Link
                        href="/"
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 text-slate-300 transition-colors"
                        onClick={() => setWalletDropdownOpen(false)}
                      >
                        <span>Public Landing Page</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </Link>

                      <button
                        onClick={() => {
                          setWalletDropdownOpen(false);
                          disconnectWallet("/");
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer"
                      >
                        <span>Sign Out &amp; Exit to Home</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openWalletModal("/dashboard")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#06070A] text-xs font-bold font-body tracking-wide hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};
