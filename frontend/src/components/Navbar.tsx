"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal,
  Languages,
  ArrowUpRight,
  Menu,
  X,
  Wallet,
  CheckCircle2,
  ExternalLink,
  Shield,
} from "lucide-react";

interface NavbarProps {
  onOpenTerminal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lang, setLang] = useState<"en" | "sa">("en");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleConnectWallet = () => {
    if (walletConnected) {
      setWalletConnected(false);
      return;
    }
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setWalletConnected(true);
    }, 700);
  };

  const navLinks = [
    { label: "Architecture", href: "#architecture" },
    { label: "Telemetry", href: "#telemetry" },
    { label: "Institutions", href: "#institutions" },
    { label: "Governance", href: "#governance" },
    { label: "Vaults", href: "/vaults" },
    { label: "Brand", href: "/brand" },
    { label: "Docs", href: "https://github.com/MudrAA", external: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#06070A]/90 backdrop-blur-md border-b border-[#F59E0B]/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3"
          : "bg-[#06070A]/70 backdrop-blur-sm border-b border-white/5 py-4"
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Brand Logo Anchor */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-widest text-[#F59E0B] flex items-center gap-3 group"
        >
          {/* 8-Sided Ashtakona Sovereign Seal Miniature Icon */}
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-[#F59E0B]/20 ashtakona-shape animate-pulse" />
            <div className="w-7 h-7 bg-[#111318] border border-[#F59E0B]/50 ashtakona-shape flex items-center justify-center group-hover:border-[#F59E0B] transition-colors">
              <span className="font-devanagari text-xs text-[#F59E0B] font-black">
                मु
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="tracking-[0.2em] font-headline text-lg font-bold bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-amber-600 bg-clip-text text-transparent">
              MudrAA
            </span>
            <span className="font-mono text-[8px] tracking-widest text-[#00F2FE] uppercase -mt-0.5">
              Solana L1 Core
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-label text-xs uppercase tracking-widest text-slate-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className={`hover:text-[#F59E0B] transition-colors duration-150 py-1 flex items-center gap-1 ${
                link.label === "Architecture" ? "text-slate-200" : ""
              }`}
            >
              <span>{link.label}</span>
              {link.external && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
            </a>
          ))}
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-3">
          {/* Terminal & Language Icon Actions */}
          <div className="hidden sm:flex items-center gap-1 border-r border-slate-800 pr-3 mr-1 text-slate-400">
            <button
              onClick={() => {
                if (onOpenTerminal) {
                  onOpenTerminal();
                } else {
                  const el = document.getElementById("terminal-ide");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="p-2 hover:text-[#00F2FE] hover:bg-white/5 rounded transition-all cursor-pointer"
              title="Solana RPC CLI / Terminal"
              aria-label="Open Terminal"
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLang(lang === "en" ? "sa" : "en")}
              className="p-2 hover:text-[#F59E0B] hover:bg-white/5 rounded transition-all cursor-pointer flex items-center gap-1"
              title="Locale: Devanagari / English"
              aria-label="Switch Language"
            >
              <Languages className="w-4 h-4" />
              <span className="font-mono text-[10px] text-slate-400 uppercase">
                {lang}
              </span>
            </button>
          </div>

          {/* Connect Wallet Button */}
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded transition-all duration-200 active:scale-95 cursor-pointer ${
              walletConnected
                ? "bg-[#14F195]/10 border border-[#14F195]/50 text-[#14F195]"
                : "border border-[#00F2FE]/40 bg-[#00F2FE]/5 text-[#00F2FE] hover:bg-[#00F2FE]/10 hover:border-[#00F2FE]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                walletConnected
                  ? "bg-[#14F195]"
                  : connecting
                  ? "bg-amber-400 animate-spin"
                  : "bg-[#00F2FE] animate-ping"
              }`}
            />
            <span>
              {connecting
                ? "Connecting..."
                : walletConnected
                ? "7xK9...3Mqp (Mainnet)"
                : "Connect Wallet"}
            </span>
          </button>

          {/* Launch App Primary Action */}
          <Link
            href="/vaults"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-body font-bold text-[#06070A] bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] rounded hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <span>Launch App</span>
            <div className="w-3.5 h-3.5 bg-[#06070A]/80 ashtakona-shape flex items-center justify-center">
              <ArrowUpRight className="w-2.5 h-2.5 text-[#F59E0B]" />
            </div>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#06070A]/95 border-b border-[#F59E0B]/30 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col gap-3 font-label text-sm uppercase tracking-widest">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#F59E0B] py-2 border-b border-slate-800/60 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleConnectWallet}
              className="w-full py-2.5 px-4 text-xs font-mono border border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE] rounded flex items-center justify-center gap-2"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>
                {walletConnected ? "Connected: 7xK9...3Mqp" : "Connect Solana Wallet"}
              </span>
            </button>

            <Link
              href="/vaults"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 text-xs font-bold text-[#06070A] bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] rounded text-center shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              Launch App &amp; Underwrite Vaults
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
