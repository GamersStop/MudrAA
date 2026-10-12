"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Power,
  Users,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
} from "lucide-react";

export const AdminSovereignPanel: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [feeBps, setFeeBps] = useState<number>(25);
  const [kybWalletInput, setKybWalletInput] = useState<string>("");
  const [kybEntities, setKybEntities] = useState<Array<{ wallet: string; tier: number; status: "Verified" | "Sanctioned" }>>([
    { wallet: "EXP-IND-MH-01 (Nhava Sheva Exporters Corp)", tier: 2, status: "Verified" },
    { wallet: "IMP-EUR-HH-09 (Vanderbilt Logistics AG)", tier: 2, status: "Verified" },
    { wallet: "OFAC-SANCTIONED-0x99281 (Blacklisted Corridor)", tier: 0, status: "Sanctioned" },
  ]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mudraa_protocol_paused");
      if (stored !== null) {
        setIsPaused(stored === "true");
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleTogglePause = () => {
    const nextState = !isPaused;
    setIsPaused(nextState);
    try {
      localStorage.setItem("mudraa_protocol_paused", String(nextState));
    } catch {}
    setStatusMessage(
      nextState
        ? "⚠️ Peshawa Dispatcher: Protocol operations halted by sovereign authority."
        : "✓ Peshawa Dispatcher: Protocol operations resumed successfully."
    );
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAddKyb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kybWalletInput.trim()) return;
    setKybEntities((prev) => [
      { wallet: kybWalletInput.trim(), tier: 2, status: "Verified" },
      ...prev,
    ]);
    setKybWalletInput("");
    setStatusMessage("✓ Panditrao Compliance: New KYB verified entity registered to on-chain PDA.");
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#14101A] to-[#0A0D15] border border-purple-500/30 p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-purple-500/20 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-white flex items-center gap-2">
              👑 Peshawa Sovereign Admin Citadel
            </h3>
            <p className="font-mono text-xs text-purple-300/70">
              Root Authority Console: Emergency Circuit Breakers &amp; Panditrao KYB Controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">Protocol State:</span>
          <span
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold border flex items-center gap-1.5 ${
              isPaused
                ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
            }`}
          >
            {isPaused ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isPaused ? "EMERGENCY PAUSED" : "OPERATIONAL"}</span>
          </span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 font-mono text-xs text-purple-200 animate-fade-in flex items-center gap-2">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid of Admin Subsystems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Peshawa Circuit Breaker */}
        <div className="p-5 rounded-xl bg-[#0F1320]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 uppercase font-bold flex items-center gap-1.5">
              <Power className="w-4 h-4 text-purple-400" />
              1. Circuit Breaker
            </span>
            <span className="text-[10px] font-mono text-slate-500">TASK-305</span>
          </div>
          <p className="font-mono text-xs text-slate-400">
            Instantly halt all new invoice financing, payouts, and settlements during extreme volatility or zero-day exploits.
          </p>
          <button
            onClick={handleTogglePause}
            className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isPaused
                ? "bg-emerald-500 hover:bg-emerald-400 text-[#06070A]"
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
            }`}
          >
            {isPaused ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isPaused ? "Resume Protocol Operations" : "Trigger Emergency Pause"}</span>
          </button>
        </div>

        {/* 2. Amatya Parameter Management */}
        <div className="p-5 rounded-xl bg-[#0F1320]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 uppercase font-bold flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-amber-400" />
              2. Treasury Parameters
            </span>
            <span className="text-[10px] font-mono text-slate-500">TASK-301</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Protocol Fee:</span>
              <span className="text-white font-bold">{feeBps} bps (0.25%)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Max Advance Cap:</span>
              <span className="text-[#14F195] font-bold">75.0%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Base Dilution Buffer:</span>
              <span className="text-[#00F2FE] font-bold">10.0%</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Immutable Ashta Pradhan genesis constants protected by authority signature.
          </p>
        </div>

        {/* 3. Panditrao KYB Registry */}
        <div className="p-5 rounded-xl bg-[#0F1320]/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 uppercase font-bold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#00F2FE]" />
              3. Panditrao Whitelist
            </span>
            <span className="text-[10px] font-mono text-slate-500">TASK-502</span>
          </div>
          <form onSubmit={handleAddKyb} className="flex gap-2">
            <input
              type="text"
              placeholder="Enterprise Name or Pubkey"
              value={kybWalletInput}
              onChange={(e) => setKybWalletInput(e.target.value)}
              className="flex-1 bg-black/50 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:border-purple-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-mono font-bold cursor-pointer"
            >
              Add
            </button>
          </form>

          <div className="space-y-1.5 max-h-24 overflow-y-auto text-[11px] font-mono">
            {kybEntities.map((ent, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-black/30 border border-slate-800/80">
                <span className="truncate max-w-[170px] text-slate-300">{ent.wallet}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] ${
                    ent.status === "Verified" ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                  }`}
                >
                  {ent.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
