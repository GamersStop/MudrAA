"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const links = [
    { label: "Protocol", href: "#problem" },
    { label: "Architecture", href: "#architecture" },
    { label: "Governance", href: "#governance" },
    { label: "Ecosystem", href: "#product" },
    { label: "Docs", href: "https://github.com/MudrAA", external: true },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-[#06080D] py-12 px-4 sm:px-6 lg:px-12 text-slate-400 font-body text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
            <Image
              src="/assets/mudraa_logo_seal.png"
              alt="MudrAA Rajmudra Logo"
              width={28}
              height={28}
              className="object-contain drop-shadow-[0_1px_6px_rgba(246,183,44,0.35)]"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-headline text-sm font-bold text-white tracking-wider">
              MudrAA
            </span>
            <span className="font-mono text-[7px] tracking-[0.2em] text-slate-500 uppercase -mt-0.5">
              SOVEREIGN TRADE LIQUIDITY
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>{link.label}</span>
              {link.external && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
            </a>
          ))}
        </nav>

        {/* Right: Social Links & Copyright */}
        <div className="flex items-center gap-5 font-mono text-[11px] text-slate-500">
          <div className="flex items-center gap-3 text-slate-400">
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/MudrAA"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Telegram"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>

          <span>© 2026 MudrAA. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
