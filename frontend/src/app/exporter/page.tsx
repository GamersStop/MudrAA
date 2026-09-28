"use client";

import React, { useState } from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { PortfolioMetrics } from "@/components/workspace/PortfolioMetrics";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import { FactoringRequestsTable } from "@/components/workspace/FactoringRequestsTable";
import { ExporterInvoiceModal } from "@/components/workspace/ExporterInvoiceModal";

export default function ExporterPortalPage() {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      <WorkspaceHeader activeTab="exporter" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <PortfolioMetrics />
        </section>

        <section>
          <RajmudraStatusBar />
        </section>

        <section>
          <FactoringRequestsTable
            onOpenNewInvoiceModal={() => setIsInvoiceModalOpen(true)}
          />
        </section>
      </main>

      <ExporterInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
}
