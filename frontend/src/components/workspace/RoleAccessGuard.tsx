"use client";

import React from "react";
import { useWallet, UserRole } from "@/context/WalletContext";
import { ShieldAlert, ArrowRight, Lock, UserCheck } from "lucide-react";
import Link from "next/link";

interface RoleAccessGuardProps {
  allowedRoles: UserRole[];
  moduleName: string;
  description: string;
  children: React.ReactNode;
}

export const RoleAccessGuard: React.FC<RoleAccessGuardProps> = ({
  allowedRoles,
  moduleName,
  description,
  children,
}) => {
  const { userRole, setUserRole } = useWallet();

  // Admin always has sovereign access across every module
  const hasAccess = userRole === "admin" || allowedRoles.includes(userRole);

  if (hasAccess) {
    return <>{children}</>;
  }

  const roleNames: Record<UserRole, string> = {
    admin: "Protocol Admin (Peshawa)",
    exporter: "Factory / Exporter",
    lender: "Institutional Lender (LP)",
    auditor: "Compliance Auditor",
  };

  const primaryAllowed = allowedRoles[0] || "admin";

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 rounded-2xl bg-[#0D101A]/95 border border-amber-500/30 backdrop-blur-md shadow-2xl text-center space-y-5">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        <Lock className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Role-Based Access Control (RBAC) Gated</span>
        </div>
        <h2 className="font-headline text-2xl font-bold text-white tracking-tight">
          {moduleName} — Restricted Persona Access
        </h2>
        <p className="font-mono text-xs text-slate-400 max-w-lg mx-auto">
          {description}
        </p>
      </div>

      <div className="p-4 max-w-md mx-auto rounded-xl bg-[#121625] border border-slate-800 text-xs font-mono space-y-2">
        <div className="flex justify-between text-slate-400">
          <span>Active Persona:</span>
          <span className="text-amber-400 font-bold">{roleNames[userRole]}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Authorized Personas:</span>
          <span className="text-emerald-400 font-bold">
            {allowedRoles.map((r) => roleNames[r]).join(" • ")}
          </span>
        </div>
      </div>

      {/* Security alert for lower-access roles attempting Admin operations */}
      {allowedRoles.length === 1 && allowedRoles[0] === "admin" && (
        <div className="p-4 max-w-md mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 text-left space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Sovereign Security Boundary Enforced</span>
          </div>
          <p className="text-slate-300 text-[11px] font-sans">
            Your active role (<strong>{roleNames[userRole]}</strong>) is a low-access stakeholder. Emergency circuit breakers and Panditrao KYB controls cannot be accessed from this session.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-[#06070A] font-bold text-xs font-mono transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <span>Return to Authorized Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
