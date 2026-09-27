"use client";

import * as React from "react";

interface PreloaderProps {
  /** Minimum display duration in milliseconds. Defaults to 4000ms (4 seconds). */
  minDurationMs?: number;
}

const PHASES = [
  { threshold: 0, text: "Initializing Walmart Enterprise Core..." },
  { threshold: 25, text: "Connecting to Multi-Store Grid (120 Global Locations)..." },
  { threshold: 55, text: "Synchronizing General Ledger & Real-Time Inventory..." },
  { threshold: 85, text: "Establishing High-Availability Session..." },
  { threshold: 98, text: "Workspace Ready. Launching..." }
];

export function Preloader({ minDurationMs = 4000 }: PreloaderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState(PHASES[0].text);

  React.useEffect(() => {
    setMounted(true);

    const startTime = Date.now();
    const intervalMs = 25; // 40 updates per second for super smooth progress

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      setProgress(rawPct);

      // Determine active status message based on current percentage
      for (let i = PHASES.length - 1; i >= 0; i--) {
        if (rawPct >= PHASES[i].threshold) {
          setStatusText(PHASES[i].text);
          break;
        }
      }

      if (elapsed >= minDurationMs) {
        clearInterval(timer);
        setProgress(100);
        setStatusText("Workspace Ready. Launching...");
        // Start smooth fade-out
        setIsFadingOut(true);
        // Unmount after fade-out transition finishes
        const unmountTimer = setTimeout(() => {
          setIsVisible(false);
        }, 700);
        return () => clearTimeout(unmountTimer);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [minDurationMs]);

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Application loading"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071120] text-white transition-all duration-700 select-none ${
        isFadingOut ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0071CE]/25 to-[#FFC220]/20 rounded-full blur-[140px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Walmart Spark Logo with Breathing & Rotation Aura */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          {/* Outer Rotating Glow Ring */}
          <div className="absolute inset-0 rounded-full border border-[#FFC220]/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-2 rounded-full border border-dashed border-[#0071CE]/40 animate-[spin_20s_linear_infinite_reverse]" />

          {/* Glowing Walmart Spark SVG */}
          <div className="relative w-16 h-16 transition-transform duration-500 hover:scale-105 animate-[pulse_2s_ease-in-out_infinite]">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_0_24px_rgba(255,194,32,0.85)]"
            >
              <g fill="#FFC220">
                {/* Top */}
                <path d="M44.5 4 C44.5 1.8 46.3 0 48.5 0 L51.5 0 C53.7 0 55.5 1.8 55.5 4 L55.5 30 C55.5 32.2 53.7 34 51.5 34 L48.5 34 C46.3 34 44.5 32.2 44.5 30 Z" />
                {/* Bottom */}
                <path d="M44.5 70 C44.5 67.8 46.3 66 48.5 66 L51.5 66 C53.7 66 55.5 67.8 55.5 70 L55.5 96 C55.5 98.2 53.7 100 51.5 100 L48.5 100 C46.3 100 44.5 98.2 44.5 96 Z" />
                {/* Top-Right (60 deg) */}
                <g transform="rotate(60 50 50)">
                  <path d="M44.5 4 C44.5 1.8 46.3 0 48.5 0 L51.5 0 C53.7 0 55.5 1.8 55.5 4 L55.5 30 C55.5 32.2 53.7 34 51.5 34 L48.5 34 C46.3 34 44.5 32.2 44.5 30 Z" />
                </g>
                {/* Bottom-Right (120 deg) */}
                <g transform="rotate(120 50 50)">
                  <path d="M44.5 4 C44.5 1.8 46.3 0 48.5 0 L51.5 0 C53.7 0 55.5 1.8 55.5 4 L55.5 30 C55.5 32.2 53.7 34 51.5 34 L48.5 34 C46.3 34 44.5 32.2 44.5 30 Z" />
                </g>
                {/* Bottom-Left (240 deg) */}
                <g transform="rotate(240 50 50)">
                  <path d="M44.5 4 C44.5 1.8 46.3 0 48.5 0 L51.5 0 C53.7 0 55.5 1.8 55.5 4 L55.5 30 C55.5 32.2 53.7 34 51.5 34 L48.5 34 C46.3 34 44.5 32.2 44.5 30 Z" />
                </g>
                {/* Top-Left (300 deg) */}
                <g transform="rotate(300 50 50)">
                  <path d="M44.5 4 C44.5 1.8 46.3 0 48.5 0 L51.5 0 C53.7 0 55.5 1.8 55.5 4 L55.5 30 C55.5 32.2 53.7 34 51.5 34 L48.5 34 C46.3 34 44.5 32.2 44.5 30 Z" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Enterprise Brand Header */}
        <div className="space-y-1 mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Walmart
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-[#0071CE]/30 border border-[#0071CE]/60 text-[#71C5FF]">
              Enterprise ERP
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Global Retail Operations Platform
          </p>
        </div>

        {/* Sleek Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mb-3 border border-slate-700/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#0071CE] via-[#2F93ED] to-[#FFC220] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(0,113,206,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text & Percentage */}
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-mono">
          <span className="truncate pr-2 text-left font-sans text-slate-300">
            {statusText}
          </span>
          <span className="shrink-0 font-bold text-[#FFC220]">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
