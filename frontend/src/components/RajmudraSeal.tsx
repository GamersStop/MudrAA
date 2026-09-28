"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface RajmudraSealProps {
  size?: number; // width & height in px
  className?: string;
  glow?: boolean;
  priority?: boolean;
  animate?: boolean;
  interactive?: boolean;
}

export const RajmudraSeal: React.FC<RajmudraSealProps> = ({
  size = 110,
  className = "",
  glow = true,
  priority = false,
  animate = true,
  interactive = true,
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Gentle tilt limited to +/- 8 degrees
    setRotate({
      x: -Math.max(-8, Math.min(8, y / 8)),
      y: Math.max(-8, Math.min(8, x / 8)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center group cursor-pointer ${className}`}
      style={{
        width: size,
        height: size,
        perspective: "800px",
      }}
    >
      {/* Ambient multi-layer background halo */}
      {glow && (
        <>
          <div
            className={`absolute -inset-4 rounded-full blur-2xl pointer-events-none transition-all duration-700 ${
              isHovered ? "opacity-90 scale-110" : "opacity-50 scale-100"
            } ${animate ? "animate-pulse-glow" : ""}`}
            style={{
              background:
                "radial-gradient(circle, rgba(246,183,44,0.55) 0%, rgba(24,216,232,0.2) 45%, rgba(154,101,255,0.12) 65%, transparent 75%)",
            }}
          />
          {/* Subtle gold core halo */}
          <div
            className="absolute inset-0 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,211,90,0.6) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {/* Rotating thin cryptographic orbit ring */}
      {animate && (
        <div className="absolute inset-[-10px] pointer-events-none animate-spin-slow">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(246,183,44,0.22)"
              strokeWidth="0.8"
              strokeDasharray="4 8"
            />
            {/* Diamond markers at 4 compass points */}
            <circle cx="50" cy="2" r="1.5" fill="#FFD35A" opacity="0.7" />
            <circle cx="98" cy="50" r="1.5" fill="#18D8E8" opacity="0.7" />
            <circle cx="50" cy="98" r="1.5" fill="#27E7A3" opacity="0.7" />
            <circle cx="2" cy="50" r="1.5" fill="#9A65FF" opacity="0.7" />
          </svg>
        </div>
      )}

      {/* Counter-rotating inner micro-ring */}
      {animate && (
        <div className="absolute inset-[-4px] pointer-events-none animate-spin-reverse opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(24,216,232,0.25)"
              strokeWidth="0.5"
              strokeDasharray="2 12"
            />
          </svg>
        </div>
      )}

      {/* Outer Ashtakona pulse ring */}
      <div className="absolute inset-[-6px] ashtakona-shape border border-[#F6B72C]/25 group-hover:border-[#F6B72C]/70 group-hover:shadow-[0_0_28px_rgba(246,183,44,0.45)] transition-all duration-300 pointer-events-none" />

      {/* Main Seal Container with Floating Levitation & Interactive Tilt */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-transform ${
          isHovered ? "duration-100 ease-out" : "duration-500 ease-out"
        } ${animate && !isHovered ? "animate-float-slow" : ""}`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.05 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Shimmer light sweep overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
          <div
            className="absolute inset-0 w-[200%] h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 48%, rgba(255,211,90,0.4) 52%, transparent 60%)",
              animation: "shimmer 3s infinite linear",
            }}
          />
        </div>

        {/* Straight front-facing realistic 3D Rajmudra Seal */}
        <Image
          src="/assets/mudraa_logo_seal.png"
          alt="MudrAA Symmetrical Rajmudra Verification Seal"
          fill
          sizes={`${size}px`}
          className="object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] drop-shadow-[0_0_18px_rgba(246,183,44,0.3)] select-none"
          priority={priority}
        />
      </div>
    </div>
  );
};
