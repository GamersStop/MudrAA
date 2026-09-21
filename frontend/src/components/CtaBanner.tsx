"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LockOpen, FileText, CheckCircle2, X } from "lucide-react";

export const CtaBanner: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: "",
    email: "",
    deskType: "Export Credit Desk",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setFormData({ institutionName: "", email: "", deskType: "Export Credit Desk" });
    }, 2000);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto" id="launch">
      <div className="relative rounded-2xl bg-gradient-to-r from-[#111318] via-[#151922] to-[#111318] border-2 border-[#F59E0B]/40 p-8 sm:p-14 overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.2)]">
        {/* Background Radiant Solar Flare */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#F59E0B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#9945FF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F59E0B]/20 border border-[#F59E0B]/40 rounded text-[#FCD34D] font-mono text-xs mb-3">
              <LockOpen className="w-3.5 h-3.5 text-[#FCD34D]" />
              <span className="font-semibold tracking-wider uppercase">
                PERMISSIONED INSTITUTIONAL ONBOARDING
              </span>
            </div>

            <h2 className="font-headline text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
              Enter the MudrAA Sovereign Liquidity Pools
            </h2>

            <p className="font-body text-slate-300 text-sm sm:text-base mt-3 leading-relaxed font-light">
              Tier-1 trade finance desks, export credit agencies, and institutional liquidity providers: Request permissioned access to verified MLETR real-world asset pools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F59E0B] via-[#FCD34D] to-[#F59E0B] text-[#06070A] font-body font-bold text-sm tracking-wider uppercase rounded hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all active:scale-95 text-center cursor-pointer"
            >
              Request KYC &amp; Protocol Access
            </button>

            <Link
              href="/brand"
              className="w-full sm:w-auto px-6 py-4 bg-[#111318] border border-slate-700 hover:border-[#00F2FE] text-slate-300 hover:text-[#00F2FE] font-mono text-xs rounded transition-all text-center cursor-pointer"
            >
              View Formal Audit Reports
            </Link>
          </div>
        </div>
      </div>

      {/* KYC Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0B0D13] border border-[#F59E0B]/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#14F195] mx-auto" />
                <h3 className="font-headline text-xl font-bold text-white">
                  Application Received
                </h3>
                <p className="text-xs text-slate-400">
                  Our compliance officer (Panditrao Engine) has queued your institutional onboarding request on Solana devnet/mainnet.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-headline text-xl font-bold text-[#FCD34D]">
                    Institutional Onboarding
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Join permissioned multi-tranche sovereign liquidity pools.
                  </p>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-mono text-slate-300">
                    Institution / Desk Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard Maritime Credit Desk"
                    value={formData.institutionName}
                    onChange={(e) =>
                      setFormData({ ...formData, institutionName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#111318] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-mono text-slate-300">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@maritimefinance.org"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#111318] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-mono text-slate-300">
                    Participant Category
                  </label>
                  <select
                    value={formData.deskType}
                    onChange={(e) =>
                      setFormData({ ...formData, deskType: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#111318] border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-[#F59E0B]"
                  >
                    <option>Export Credit Desk (Tier-1)</option>
                    <option>Trade Finance Bank</option>
                    <option>Maritime Logistics Carrier</option>
                    <option>Institutional LP (Yield Vaults)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#06070A] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all cursor-pointer mt-4"
                >
                  Submit KYC Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
