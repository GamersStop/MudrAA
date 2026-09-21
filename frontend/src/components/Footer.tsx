"use client";

import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, Activity } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#06070A]/90 border-t border-[#F59E0B]/20 full-width bottom flat no shadows mt-20 text-slate-400">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-12 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Row: Brand & Manifesto */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="font-display text-lg font-bold tracking-widest text-[#F59E0B] flex items-center gap-2 group">
              <div className="w-6 h-6 bg-[#F59E0B]/20 ashtakona-shape flex items-center justify-center border border-[#F59E0B]/50 group-hover:border-[#F59E0B] transition-colors">
                <span className="font-devanagari text-[10px] text-[#F59E0B] font-black">
                  मु
                </span>
              </div>
              <span className="font-headline tracking-widest text-[#FCD34D]">MudrAA</span>
              <span className="font-mono text-xs text-slate-500 font-normal ml-2">
                | Sovereign L1 Protocol
              </span>
            </Link>

            <p className="font-body text-xs text-slate-400 max-w-xl leading-relaxed font-light">
              Sovereign trade liquidity rails bridging maritime logistics, global electronic invoices, and Solana cryptographic execution under the Ashta Pradhan governance charter.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-slate-800 rounded font-mono text-[11px] text-[#14F195]">
              <span className="w-2 h-2 rounded-full bg-[#14F195] animate-ping" />
              <span>Solana Mainnet: 100% Operational</span>
            </div>
          </div>
        </div>

        {/* Institutional Navigation Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-body text-xs text-slate-400">
          <a
            className="text-[#F59E0B] font-medium hover:text-[#FCD34D] transition-colors duration-200 cursor-pointer"
            href="#architecture"
          >
            Architecture
          </a>
          <a
            className="text-slate-400 hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer"
            href="#institutions"
          >
            Ashta Pradhan Charter
          </a>
          <Link
            className="text-slate-400 hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer"
            href="/vaults"
          >
            Amatya Vaults
          </Link>
          <Link
            className="text-slate-400 hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer"
            href="/brand"
          >
            Brand Specimen
          </Link>
          <a
            className="text-slate-400 hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer"
            href="#telemetry"
          >
            Solana Telemetry
          </a>
          <a
            className="text-slate-400 hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer"
            href="#launch"
          >
            Institutional KYC
          </a>
          <a
            className="text-slate-400 hover:text-[#F59E0B] transition-colors duration-200 cursor-pointer"
            href="https://github.com/MudrAA"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Specs
          </a>
        </div>

        {/* Legal Perfection Notice & Monospace Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-900 text-slate-500 font-mono text-[11px]">
          <p>© 2025 MudrAA Sovereign Liquidity Protocol. Sovereign Cryptographic Governance. Built on Solana L1.</p>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-slate-400">UNCITRAL MLETR COMPLIANT</span>
            <span>•</span>
            <span className="text-slate-400">ZERO REHYPOTHECATION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
