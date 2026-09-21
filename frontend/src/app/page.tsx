"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TelemetryBar } from "@/components/TelemetryBar";
import { AshtaPradhanSection } from "@/components/AshtaPradhanSection";
import { InstitutionalInfrastructure } from "@/components/InstitutionalInfrastructure";
import { RajmudraVerifierDemo } from "@/components/RajmudraVerifierDemo";
import { ComparisonBento } from "@/components/ComparisonBento";
import { CtaBanner } from "@/components/CtaBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#06070A] text-slate-200 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] min-h-screen pcb-grid-bg relative overflow-x-hidden">
      {/* 1. TOP APP BAR (Glassmorphic Docked Header) */}
      <Navbar />

      <main className="relative z-10">
        {/* 2. HERO SECTION */}
        <HeroSection />

        {/* 3. TELEMETRY LIVE STRIP */}
        <TelemetryBar />

        {/* 4. THE ASHTA PRADHAN ARCHITECTURE (8 Sovereign Pillars) */}
        <AshtaPradhanSection />

        {/* 5. INSTITUTIONAL INFRASTRUCTURE & LIVE SOLANA TELEMETRY TERMINAL */}
        <InstitutionalInfrastructure />

        {/* 6. INTERACTIVE RAJMUDRA ZK-VERIFIER DEMO */}
        <section id="verifier" className="py-12">
          <RajmudraVerifierDemo />
        </section>

        {/* 7. WHY MUDRAA / COMPARISON BENTO */}
        <section id="comparison" className="py-12">
          <ComparisonBento />
        </section>

        {/* 8. REGAL CALL-TO-ACTION BANNER */}
        <CtaBanner />
      </main>

      {/* 9. INSTITUTIONAL FOOTER */}
      <Footer />
    </div>
  );
}
