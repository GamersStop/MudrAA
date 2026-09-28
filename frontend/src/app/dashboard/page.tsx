"use client";

import React, { useState } from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { PortfolioMetrics } from "@/components/workspace/PortfolioMetrics";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import { FactoringRequestsTable } from "@/components/workspace/FactoringRequestsTable";
import { LiquidityDeskPanel } from "@/components/workspace/LiquidityDeskPanel";
import { ExporterInvoiceModal } from "@/components/workspace/ExporterInvoiceModal";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "exporter" | "liquidity">("overview");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      {/* 1. Workspace Top Bar */}
      <WorkspaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Portfolio & Capital Metrics */}
        <section>
          <PortfolioMetrics />
        </section>

        {/* 3. Rajmudra Verification Status Bar */}
        <section>
          <RajmudraStatusBar />
        </section>

        {/* 4. Tab Views based on Role Switcher */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <FactoringRequestsTable
              onOpenNewInvoiceModal={() => setIsInvoiceModalOpen(true)}
            />
            <LiquidityDeskPanel />
          </div>
        )}

        {activeTab === "exporter" && (
          <div className="space-y-8">
            <FactoringRequestsTable
              onOpenNewInvoiceModal={() => setIsInvoiceModalOpen(true)}
            />
          </div>
        )}

        {activeTab === "liquidity" && (
          <div className="space-y-8">
            <LiquidityDeskPanel />
          </div>
        )}
      </main>

      {/* Exporter Invoice Registration & Factoring Advance Modal */}
      <ExporterInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
}
