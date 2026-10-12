"use client";

import React from "react";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { AdminSovereignPanel } from "@/components/workspace/AdminSovereignPanel";
import { RoleAccessGuard } from "@/components/workspace/RoleAccessGuard";
import { AuthGuard } from "@/components/workspace/AuthGuard";

export default function AdminCitadelPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#06070A] text-slate-100 font-body antialiased selection:bg-[#F59E0B]/20 selection:text-[#FCD34D] pcb-grid-bg">
        <WorkspaceHeader activeTab={"admin" as any} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <RoleAccessGuard
            allowedRoles={["admin"]}
            moduleName="Peshawa Sovereign Citadel"
            description="Sovereign protocol administration requires root administrator privileges. Lower-access roles (Factory / Exporter, Institutional Lender, Auditor) are strictly prohibited from accessing protocol circuit breakers and regulatory registries."
          >
            <AdminSovereignPanel />
          </RoleAccessGuard>
        </main>
      </div>
    </AuthGuard>
  );
}
