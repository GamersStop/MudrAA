"use client";

import React from "react";
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

export default function Home() {
  return (
    <div className="bg-[#06080D] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] min-h-screen pcb-grid-bg relative overflow-x-hidden">
      {/* 1. TOP APP BAR */}
      <Navbar />

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
