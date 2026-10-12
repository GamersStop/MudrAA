"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TelemetryBar } from "@/components/TelemetryBar";
import { TheProblemSection } from "@/components/TheProblemSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { RajmudraArchitectureSection } from "@/components/RajmudraArchitectureSection";
import { GovernanceSection } from "@/components/GovernanceSection";
import { DashboardPreviewSection } from "@/components/DashboardPreviewSection";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/context/WalletContext";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const { isTestMode, hasSelectedRole, openRoleSelector } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#06080D] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] min-h-screen pcb-grid-bg relative overflow-x-hidden">
      {/* 1. TOP APP BAR */}
      <Navbar />

      {/* Outside Demo Mode Stakeholder Role Chooser Banner */}
      {mounted && isTestMode && !hasSelectedRole && (
        <div className="pt-24 pb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-20 animate-fade-in">
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0D1220] to-purple-500/15 border border-amber-500/35 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 font-mono text-xs uppercase tracking-wider">
                    ⚡ Hackathon Evaluation Demo Mode
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                    Stakeholder RBAC
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-sans leading-relaxed">
                  Choose a stakeholder persona (Admin, Factory/Exporter, Institutional Lender, Auditor) to test MudrAA under specific permissions. Once switched, this prompt will not be shown again.
                </p>
              </div>
            </div>
            <button
              onClick={openRoleSelector}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F6B72C] via-[#FFD35A] to-[#F6B72C] text-[#050912] font-bold text-xs font-mono shrink-0 hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Choose Role &amp; Enter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10">
        {/* 2. HERO SECTION WITH TRADE VERIFICATION TERMINAL */}
        <HeroSection />

        {/* 3. 4-PILLAR TRUST & PROTOCOL PILLS */}
        <TelemetryBar />

        {/* 4. THE PROBLEM: TRUST IS THE REAL LIQUIDITY CONSTRAINT */}
        <TheProblemSection />

        {/* 5. HOW MUDRAA WORKS: 3-STEP SEQUENCE */}
        <HowItWorksSection />

        {/* 6. RAJMUDRA VERIFICATION ENGINE ARCHITECTURE */}
        <RajmudraArchitectureSection />

        {/* 7. EIGHT PILLARS OF GOVERNANCE (8-CARD GRID) */}
        <GovernanceSection />

        {/* 8. INSTITUTIONAL-GRADE DASHBOARD PRODUCT PREVIEW */}
        <DashboardPreviewSection />

        {/* 9. READY TO BUILD MARITIME CTA BANNER */}
        <CtaBanner />
      </main>

      {/* 10. INSTITUTIONAL FOOTER */}
      <Footer />
    </div>
  );
}
