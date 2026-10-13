"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useWallet } from "@/context/WalletContext";
import {
  CheckCircle2, ArrowRight, TrendingUp, Layers, Ship,
  Coins, ShieldCheck, Lock, Landmark, FileText, Sliders,
} from "lucide-react";

// SVG Line Chart
const LineChart: React.FC = () => {
  const data = [32, 41, 38, 55, 52, 68, 64, 78, 82, 75, 90, 96];
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 280;
  const h = 80;
  const pad = 6;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const polyline = points.join(" ");
  // Area fill
  const area = `${pad},${h - pad} ${polyline} ${w - pad},${h - pad}`;
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 14}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6B72C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F6B72C" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line
          key={i}
          x1={pad} y1={pad + t * (h - pad * 2)}
          x2={w - pad} y2={pad + t * (h - pad * 2)}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1"
        />
      ))}
      {/* Area */}
      <polygon points={area} fill="url(#areaGrad)" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#F6B72C"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Data dots — last one highlighted */}
      {points.map((pt, i) => {
        const [x, y] = pt.split(",").map(Number);
        return (
          <circle
            key={i}
            cx={x} cy={y} r={i === data.length - 1 ? 3 : 1.5}
            fill={i === data.length - 1 ? "#F6B72C" : "rgba(246,183,44,0.5)"}
          />
        );
      })}
      {/* Month labels */}
      {months.map((m, i) => {
        const x = pad + (i / (months.length - 1)) * (w - pad * 2);
        return (
          <text key={i} x={x} y={h + 12} textAnchor="middle" fill="#4A607C" fontSize="7" fontFamily="JetBrains Mono, monospace">
            {m}
          </text>
        );
      })}
    </svg>
  );
};

// SVG Donut Chart
const DonutChart: React.FC = () => {
  const segments = [
    { label: "Metals",  pct: 42, color: "#F6B72C" },
    { label: "Energy",  pct: 28, color: "#18D8E8" },
    { label: "Agri",    pct: 18, color: "#27E7A3" },
    { label: "Others",  pct: 12, color: "#9A65FF" },
  ];
  const r = 30;
  const cx = 40;
  const cy = 40;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-3">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(30,50,80,0.5)" strokeWidth="10" />
        {segments.map((seg, i) => {
          const dashArr = (seg.pct / 100) * circumference;
          const dashOffset = -offset * circumference / 100;
          offset += seg.pct;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={`${dashArr} ${circumference - dashArr}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}
        <text x={cx} y={cy - 3} textAnchor="middle" fill="#E7EDF5" fontSize="9" fontWeight="bold" fontFamily="JetBrains Mono">
          42%
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#4A607C" fontSize="6" fontFamily="JetBrains Mono">
          Metals
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-3 text-[9px] font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: seg.color }} />
              <span className="text-[#8E9DB1]">{seg.label}</span>
            </span>
            <span className="text-[#E7EDF5] font-semibold">{seg.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardPreviewSection: React.FC = () => {
  const { launchApp, walletAddress, balanceSol } = useWallet();
  const [activeNav, setActiveNav] = useState("Overview");

  const features = [
    "Live trade and asset tracking",
    "Provenance timeline and document vault",
    "Collateral and risk monitoring",
    "On-chain verification history",
    "Role-based access and audit logs",
  ];

  const navItems = [
    { label: "Overview",    icon: Layers,      color: "#F6B72C" },
    { label: "Trade Desk",  icon: Ship,        color: "#18D8E8" },
    { label: "Assets",      icon: Coins,       color: "#27E7A3" },
    { label: "Provenance",  icon: ShieldCheck, color: "#FFD35A" },
    { label: "Collateral",  icon: Lock,        color: "#9A65FF" },
    { label: "Governance",  icon: Landmark,    color: "#F6B72C" },
    { label: "Reports",     icon: FileText,    color: "#8E9DB1" },
    { label: "Settings",    icon: Sliders,     color: "#8E9DB1" },
  ];

  const kpis = [
    { label: "Total Trade Volume", val: "$248.7M", delta: "+13.2%", deltaColor: "#27E7A3" },
    { label: "Active Trades",      val: "42",      delta: "+8.2%",  deltaColor: "#27E7A3" },
    { label: "Collateral Locked",  val: "$132.4M", delta: "+18.2%", deltaColor: "#27E7A3" },
  ];

  const recentActivity = [
    { id: "TRD-2025-0043", asset: "Iron Ore",  status: "Verified",  color: "#27E7A3" },
    { id: "TRD-2025-0042", asset: "Copper",    status: "Verified",  color: "#27E7A3" },
    { id: "TRD-2025-0041", asset: "Palm Oil",  status: "In Review", color: "#F6B72C" },
  ];

  return (
    <section id="product" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* ── LEFT: Feature highlights ── */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFD35A] font-semibold block">
            PRODUCT
          </span>

          <h2 className="font-headline text-3xl sm:text-4xl xl:text-5xl font-semibold text-[#E7EDF5] tracking-tight leading-[1.15]">
            Institutional-Grade
            <br />
            Dashboard
          </h2>

          <p className="font-body text-[#8E9DB1] text-sm sm:text-base leading-relaxed font-light">
            Real-time trade tracking, verification status, collateral monitoring and
            governance insights — all in one place.
          </p>

          <div className="space-y-3 pt-1">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-[13px] text-[#E7EDF5]">
                <CheckCircle2 className="w-4 h-4 text-[#27E7A3] shrink-0 mt-0.5" />
                <span className="font-body">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => launchApp("/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-body font-bold text-sm text-[#050912] transition-all active:scale-95 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #F6B72C 0%, #FFD35A 50%, #F6B72C 100%)",
                boxShadow: "0 0 28px rgba(246,183,44,0.3)",
              }}
            >
              <span>View Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Dashboard mockup ── */}
        <div className="lg:col-span-7">
          <div
            className="rounded-2xl overflow-hidden font-body"
            style={{
              background: "rgba(7,18,30,0.95)",
              border: "1px solid rgba(30,50,80,0.9)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "rgba(30,50,80,0.8)", background: "rgba(5,9,18,0.5)" }}
            >
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                  <Image
                    src="/assets/mudraa_logo_seal.png"
                    alt="MudrAA"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span className="font-mono text-[11px] font-bold text-[#E7EDF5] tracking-wide">MudrAA</span>
                <span className="font-mono text-[9px] text-[#4A607C]">/ Overview</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] text-[#8E9DB1]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27E7A3] animate-pulse" />
                <span>{walletAddress || "AzHZ...yiJ8"}</span>
                <span className="text-[#4A607C]">·</span>
                <span className="text-[#4A607C]">
                  {balanceSol > 0 ? `Sol: ◎ ${balanceSol.toFixed(2)}` : "Sol: ◎ 15.02"}
                </span>
              </div>
            </div>

            {/* Body: sidebar + content */}
            <div className="flex gap-0">
              {/* Mini Sidebar */}
              <div
                className="hidden sm:flex flex-col gap-0.5 w-28 shrink-0 p-2 border-r text-[9.5px] font-mono"
                style={{ borderColor: "rgba(30,50,80,0.6)", background: "rgba(5,9,18,0.3)" }}
              >
                {navItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveNav(item.label)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded text-left w-full transition-all cursor-pointer"
                      style={{
                        background: isActive ? "rgba(246,183,44,0.1)" : "transparent",
                        color: isActive ? "#FFD35A" : "#4A607C",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLButtonElement).style.color = "#8E9DB1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color = "#4A607C";
                        }
                      }}
                    >
                      <IconComp className="w-3 h-3 shrink-0" style={{ color: isActive ? item.color : "#4A607C" }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main content */}
              <div className="flex-1 p-3.5 space-y-3 min-w-0">
                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-2">
                  {kpis.map((kpi, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg kpi-card"
                      style={{
                        background: "rgba(5,9,18,0.8)",
                        border: "1px solid rgba(30,50,80,0.7)",
                      }}
                    >
                      <span className="font-mono text-[8px] text-[#4A607C] block mb-1 leading-tight">
                        {kpi.label}
                      </span>
                      <span className="font-mono font-bold text-[#E7EDF5] text-[11px] sm:text-xs block">
                        {kpi.val}
                      </span>
                      <span className="font-mono text-[8px] block mt-0.5" style={{ color: kpi.deltaColor }}>
                        {kpi.delta} · 30d
                      </span>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Line Chart */}
                  <div
                    className="sm:col-span-8 p-3 rounded-lg flex flex-col"
                    style={{ background: "rgba(5,9,18,0.8)", border: "1px solid rgba(30,50,80,0.7)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[8.5px] text-[#4A607C] uppercase tracking-wider">Trade Volume</span>
                      <span className="font-mono text-[8px] text-[#27E7A3] flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" /> +13.2%
                      </span>
                    </div>
                    <div className="flex-1">
                      <LineChart />
                    </div>
                  </div>

                  {/* Donut Chart */}
                  <div
                    className="sm:col-span-4 p-3 rounded-lg flex flex-col"
                    style={{ background: "rgba(5,9,18,0.8)", border: "1px solid rgba(30,50,80,0.7)" }}
                  >
                    <span className="font-mono text-[8.5px] text-[#4A607C] uppercase tracking-wider mb-2">
                      Asset Distribution
                    </span>
                    <div className="flex-1 flex items-center">
                      <DonutChart />
                    </div>
                  </div>
                </div>

                {/* Recent Activity + Provenance Timeline */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t"
                  style={{ borderColor: "rgba(30,50,80,0.5)" }}
                >
                  {/* Activity */}
                  <div>
                    <span className="font-mono text-[8.5px] text-[#4A607C] uppercase tracking-wider block mb-2">
                      Recent Activity
                    </span>
                    <div className="space-y-1.5">
                      {recentActivity.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between font-mono text-[9px] p-1.5 rounded"
                          style={{ background: "rgba(5,9,18,0.5)" }}
                        >
                          <div>
                            <span className="text-[#8E9DB1] block">{item.id}</span>
                            <span className="text-[#4A607C]">{item.asset}</span>
                          </div>
                          <span className="flex items-center gap-1" style={{ color: item.color }}>
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Provenance Timeline */}
                  <div>
                    <span className="font-mono text-[8.5px] text-[#4A607C] uppercase tracking-wider block mb-2">
                      Provenance Timeline
                    </span>
                    <div className="space-y-2">
                      {[
                        { label: "Origin",   status: "Verified",  color: "#27E7A3" },
                        { label: "Transit",  status: "In Route",  color: "#18D8E8" },
                        { label: "Port",     status: "Pending",   color: "#4A607C" },
                        { label: "Delivery", status: "Awaiting",  color: "#4A607C" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[9px]">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: item.color }}
                          />
                          <span className="text-[#8E9DB1] w-12">{item.label}</span>
                          <span style={{ color: item.color }}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
