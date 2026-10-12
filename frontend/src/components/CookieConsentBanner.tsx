"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, X, Cookie, ArrowRight } from "lucide-react";

export const CookieConsentBanner: React.FC = () => {
  const [hasDismissed, setHasDismissed] = useState<boolean>(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("mudraa_storage_consent");
      if (!consent) {
        setHasDismissed(false);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("mudraa_storage_consent", "accepted");
    } catch {}
    setHasDismissed(true);
  };

  if (hasDismissed) return null;

  return (
    <aside
      role="region"
      aria-label="Cryptographic Storage & Privacy Notice"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-50 animate-fade-in"
    >
      <div className="relative rounded-2xl bg-[#090C15]/95 border border-amber-500/40 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl text-slate-200 space-y-3.5">
        <button
          onClick={handleAccept}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
          aria-label="Close Notice"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
              Sovereign Cryptographic Disclosure
            </span>
            <h4 className="font-headline text-sm font-bold text-white tracking-tight">
              Non-Custodial Session &amp; Storage Notice
            </h4>
          </div>
        </div>

        <p className="font-body text-xs text-slate-300 leading-relaxed">
          MudrAA uses strictly necessary local cryptographic storage to preserve non-custodial wallet sessions and stakeholder persona access. We use <strong>zero tracking or third-party marketing cookies</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <Link
              href="/privacy#cookies"
              className="underline hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>Cookie &amp; Storage Details</span>
              <ArrowRight className="w-3 h-3 opacity-70" />
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/terms"
              className="underline hover:text-amber-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-mono font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            Acknowledge &amp; Accept
          </button>
        </div>
      </div>
    </aside>
  );
};
