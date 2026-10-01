"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
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
} from "lucide-react";

interface WorkspaceHeaderProps {
  activeTab?: "exporter" | "liquidity" | "overview" | "factoring" | "verification" | "secondary";
  onTabChange?: (tab: "exporter" | "liquidity" | "overview" | "factoring" | "verification" | "secondary") => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  activeTab = "overview",
  onTabChange,
}) => {
  const pathname = usePathname();
  const { walletAddress, fullAddress, connected, disconnectWallet, openWalletModal } = useWallet();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (fullAddress) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", href: "/dashboard", icon: Layers },
    { id: "exporter", label: "Exporter Desk", href: "/exporter", icon: Ship },
    { id: "factoring", label: "Factoring", href: "/exporter/factoring", icon: Sparkles },
    { id: "liquidity", label: "Liquidity Desk", href: "/liquidity", icon: Building2 },
    { id: "verification", label: "ZK Explorer", href: "/verification", icon: Shield },
    { id: "secondary", label: "Secondary", href: "/secondary", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/90 backdrop-blur-md border-b border-[#F59E0B]/20 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand + Role Switcher */}
        <div className="flex items-center gap-6">
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

          {/* Role Navigation Pills */}
          <nav className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-[#101420] border border-slate-800">
            {navItems.map((item) => {
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
          {/* Solana Network Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111624] border border-slate-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-slate-300">Solana Devnet</span>
            <span className="text-slate-500">|</span>
            <span className="text-[#00F2FE]">2,840 TPS</span>
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
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {walletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0E121B] border border-slate-800 rounded-xl p-3 shadow-2xl z-50 animate-fade-in text-xs font-mono">
                  <div className="pb-2.5 mb-2.5 border-b border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Connected Account
                    </span>
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span className="truncate">{walletAddress}</span>
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
                      <span>SOL Balance:</span>
                      <span className="text-white font-semibold">42.85 SOL</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>USDC Balance:</span>
                      <span className="text-[#14F195] font-semibold">$250,000.00</span>
                    </div>
                  </div>

                  <div className="space-y-1">
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
                        disconnectWallet();
                        setWalletDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer"
                    >
                      <span>Disconnect Wallet</span>
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
  );
};
