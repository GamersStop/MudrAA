"use client";

import React from "react";
import { ShieldCheck, Zap, Lock, FileCheck2 } from "lucide-react";

export const TelemetryBar: React.FC = () => {
  const trustPills = [
    {
      title: "Solana Mainnet",
      desc: "High performance. Low cost.",
      icon: Zap,
      iconColor: "#27E7A3",
      accentBg: "rgba(39,231,163,0.06)",
      accentBorder: "rgba(39,231,163,0.18)",
      dot: "#27E7A3",
    },
    {
      title: "Zero-Knowledge Verification",
      desc: "Private. Verifiable. Trustless.",
      icon: ShieldCheck,
      iconColor: "#18D8E8",
      accentBg: "rgba(24,216,232,0.06)",
      accentBorder: "rgba(24,216,232,0.18)",
      dot: "#18D8E8",
    },
    {
      title: "Token-2022 Confidential Transfers",
      desc: "Enterprise-grade confidentiality.",
      icon: Lock,
      iconColor: "#9A65FF",
      accentBg: "rgba(154,101,255,0.06)",
      accentBorder: "rgba(154,101,255,0.18)",
      dot: "#9A65FF",
    },
    {
      title: "Dual Formal Audits",
      desc: "Independent security reviews.",
      icon: FileCheck2,
      iconColor: "#F6B72C",
      accentBg: "rgba(246,183,44,0.06)",
      accentBorder: "rgba(246,183,44,0.18)",
      dot: "#F6B72C",
    },
  ];

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {trustPills.map((pill, idx) => {
          const IconComponent = pill.icon;
          return (
            <div
              key={idx}
              className="group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 cursor-default"
              style={{
                background: "rgba(7,18,30,0.8)",
                border: `1px solid rgba(30,50,80,0.8)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = pill.accentBorder;
                el.style.background = pill.accentBg;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(30,50,80,0.8)";
                el.style.background = "rgba(7,18,30,0.8)";
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  background: pill.accentBg,
                  border: `1px solid ${pill.accentBorder}`,
                }}
              >
                <IconComponent className="w-4 h-4" style={{ color: pill.iconColor }} />
              </div>
              <div className="text-left min-w-0">
                <h4 className="font-body text-[11.5px] font-semibold text-[#E7EDF5] leading-tight">
                  {pill.title}
                </h4>
                <p className="text-[10.5px] font-body text-[#8E9DB1] mt-0.5">
                  {pill.desc}
                </p>
              </div>
              {/* Right indicator dot */}
              <div className="ml-auto shrink-0">
                <span className="w-1.5 h-1.5 rounded-full block" style={{ background: pill.dot, opacity: 0.6 }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
