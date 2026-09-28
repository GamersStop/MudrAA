"use client";

import React from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { PortfolioMetrics } from "@/components/workspace/PortfolioMetrics";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import { LiquidityDeskPanel } from "@/components/workspace/LiquidityDeskPanel";

export default function LiquidityPage() {
  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      <WorkspaceHeader activeTab="liquidity" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <PortfolioMetrics />
        </section>

        <section>
          <RajmudraStatusBar />
        </section>

        <section>
          <LiquidityDeskPanel />
        </section>
      </main>
    </div>
  );
}
