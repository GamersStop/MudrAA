"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@/context/WalletContext";
import { Wallet, ArrowUpRight, Menu, X, ExternalLink } from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    connected,
    connecting,
    walletAddress,
    openWalletModal,
    disconnectWallet,
    launchApp,
    isTestMode,
    hasSelectedRole,
    openRoleSelector,
    userRole,
  } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("protocol");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Protocol", href: "#problem", id: "protocol" },
    { label: "Architecture", href: "#architecture", id: "architecture" },
    { label: "Governance", href: "#governance", id: "governance" },
    { label: "Ecosystem", href: "#product", id: "ecosystem" },
    { label: "Docs", href: "https://github.com/GamersStop/MudrAA", id: "docs", external: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050912]/92 backdrop-blur-md border-b border-[#18D8E8]/15 shadow-[0_4px_24px_rgba(0,0,0,0.6)] py-3.5"
          : "bg-[#050912]/40 backdrop-blur-sm border-b border-white/[0.04] py-5"
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
            {/* Ambient backlight glow */}
            <div className="absolute inset-0 rounded-full bg-[#F6B72C]/20 blur-md group-hover:bg-[#F6B72C]/50 transition-all duration-300 pointer-events-none" />
            <Image
              src="/assets/mudraa_logo_seal.png"
              alt="MudrAA Rajmudra Logo"
              width={34}
              height={34}
              className="object-contain drop-shadow-[0_2px_8px_rgba(246,183,44,0.4)] group-hover:scale-110 transition-transform duration-300"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-headline text-base font-bold tracking-[0.04em]"
              style={{
                background: "linear-gradient(135deg, #FFD35A 0%, #F6B72C 50%, #FFD35A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MudrAA
            </span>
            <span className="font-mono text-[7.5px] tracking-[0.22em] text-[#8E9DB1] uppercase mt-0.5">
              SOVEREIGN TRADE LIQUIDITY
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-7 font-body text-[11.5px] font-medium text-[#8E9DB1]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              onClick={() => setActiveLink(link.id)}
              className={`relative py-1 flex items-center gap-1 transition-colors duration-150 cursor-pointer ${
                activeLink === link.id ? "text-[#FFD35A]" : "hover:text-[#E7EDF5]"
              }`}
            >
              <span>{link.label}</span>
              {link.external && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
              {activeLink === link.id && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F6B72C] to-transparent" />
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Network status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#27E7A3]/8 border border-[#27E7A3]/20 text-[9px] font-mono text-[#27E7A3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27E7A3] animate-pulse" />
            <span className="tracking-wider">MAINNET</span>
          </div>

          {/* Demo Mode Role Chooser (Outside Option) */}
          {mounted && isTestMode && !hasSelectedRole && (
            <button
              onClick={openRoleSelector}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-mono hover:bg-amber-500/25 transition-all shadow-sm cursor-pointer"
              title="Select Stakeholder Persona for Demo Evaluation"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Demo: Choose Role</span>
            </button>
          )}

          {/* Connect Wallet */}
          <button
            onClick={() => {
              if (connected) disconnectWallet();
              else openWalletModal("/dashboard");
            }}
            disabled={connecting}
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 text-[11px] font-body font-medium rounded-lg border transition-all duration-200 active:scale-95 cursor-pointer ${
              mounted && connected
                ? "border-[#27E7A3]/40 bg-[#27E7A3]/10 text-[#27E7A3]"
                : "border-[#18D8E8]/30 bg-[#07121E] text-[#E7EDF5] hover:border-[#18D8E8] hover:shadow-[0_0_12px_rgba(24,216,232,0.2)]"
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#18D8E8]" />
            <span>
              {connecting ? "Connecting…" : mounted && connected && walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </span>
          </button>

          {/* Launch App */}
          <button
            onClick={() => launchApp("/dashboard")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-body font-bold text-[#050912] bg-gradient-to-r from-[#F6B72C] via-[#FFD35A] to-[#F6B72C] rounded-lg hover:brightness-110 shadow-[0_0_18px_rgba(246,183,44,0.3)] transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#8E9DB1] hover:text-white lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050912]/98 border-b border-[#F6B72C]/20 backdrop-blur-2xl px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-2 font-body text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveLink(link.id);
                }}
                className="text-[#8E9DB1] hover:text-[#FFD35A] py-2.5 border-b border-[#1E3250]/50 flex items-center justify-between transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8E9DB1]" />
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (connected) disconnectWallet();
                else openWalletModal("/dashboard");
              }}
              className="w-full py-2.5 px-4 text-xs font-mono border border-[#1E3250] bg-[#07121E] text-[#E7EDF5] rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-[#18D8E8]" />
              <span>{connected && walletAddress ? `Connected: ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connect Solana Wallet"}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                launchApp("/dashboard");
              }}
              className="w-full py-3 px-4 text-xs font-bold text-[#050912] bg-gradient-to-r from-[#F6B72C] to-[#FFD35A] rounded-lg text-center shadow-[0_0_20px_rgba(246,183,44,0.35)] cursor-pointer"
            >
              Launch App &amp; Underwrite
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
