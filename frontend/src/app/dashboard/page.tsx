"use client";

import React, { useState } from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { PortfolioMetrics } from "@/components/workspace/PortfolioMetrics";
import { RajmudraStatusBar } from "@/components/workspace/RajmudraStatusBar";
import { FactoringRequestsTable } from "@/components/workspace/FactoringRequestsTable";
import { LiquidityDeskPanel } from "@/components/workspace/LiquidityDeskPanel";
import { ExporterInvoiceModal } from "@/components/workspace/ExporterInvoiceModal";
import { AdminSovereignPanel } from "@/components/workspace/AdminSovereignPanel";
import { RoleAccessGuard } from "@/components/workspace/RoleAccessGuard";
import { AuthGuard } from "@/components/workspace/AuthGuard";
import { useWallet } from "@/context/WalletContext";

export default function DashboardPage() {
  const { userRole } = useWallet();
  const [activeTab, setActiveTab] = useState<
    "overview" | "exporter" | "liquidity" | "factoring" | "verification" | "secondary" | "admin" | "vaults"
  >("overview");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
      {/* 1. Workspace Top Bar with Role Switcher */}
      <WorkspaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Admin Sovereign Console (Exclusively visible in Admin Persona) */}
        {userRole === "admin" && (
          <section>
            <AdminSovereignPanel />
          </section>
        )}

        {/* 3. Portfolio & Capital Metrics */}
        <section>
          <PortfolioMetrics />
        </section>

        {/* 4. Rajmudra Verification Status Bar */}
        <section>
          <RajmudraStatusBar />
        </section>

        {/* 5. Role-Adaptive Dynamic Views */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Exporters and Admins see Factoring Pipeline */}
            {(userRole === "admin" || userRole === "exporter") && (
              <FactoringRequestsTable
                onOpenNewInvoiceModal={() => setIsInvoiceModalOpen(true)}
              />
            )}

            {/* Lenders and Admins see Liquidity Pools */}
            {(userRole === "admin" || userRole === "lender") && (
              <LiquidityDeskPanel />
            )}

            {/* Auditor Persona gets focused verification note */}
            {userRole === "auditor" && (
              <div className="p-6 rounded-2xl bg-[#0D101A] border border-emerald-500/30 text-center font-mono text-xs space-y-3">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block">
                  Auditor Audit Mode Active
                </span>
                <p className="text-slate-400 max-w-lg mx-auto">
                  As an auditor, your persona has read-only access to on-chain Groth16 zero-knowledge proof pairings, nullifier anti-replay registries, and Token-2022 compliance status.
                </p>
                <div className="pt-2">
                  <a
                    href="/verification"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all font-bold"
                  >
                    Open Rajmudra ZK Proof Explorer ↗
                  </a>
                </div>
              </div>
            )}
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

        {activeTab === "admin" && (
          <div className="space-y-8">
            <RoleAccessGuard
              allowedRoles={["admin"]}
              moduleName="Peshawa Sovereign Citadel"
              description="Sovereign protocol administration requires root administrator privileges. Lower-access roles (Factory / Exporter, Institutional Lender, Auditor) are strictly prohibited from accessing protocol circuit breakers and regulatory registries."
            >
              <AdminSovereignPanel />
            </RoleAccessGuard>
          </div>
        )}
      </main>

      {/* Exporter Invoice Registration & Factoring Advance Modal */}
      <ExporterInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
    </AuthGuard>
  );
}
