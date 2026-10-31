import React from "react";
import { useDashboard, eventThemes } from "./dashboard-context";

export function DashboardAnimatedBackground() {
  const { eventType } = useDashboard();
  const activeTheme = (eventType && eventThemes[eventType]) ||
    eventThemes["Wedding"] || {
      type: "Wedding",
      label: "Royal Wedding Ceremony",
      labelHi: "शाही विवाह समारोह",
      bgImage:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
      ambientGradient: "from-amber-500/15 via-rose-500/5 to-transparent",
      accentColor: "#f59e0b",
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      icon: "Heart",
      quote: "Two souls uniting under auspicious stars & Vedic blessings",
      tagline: "Sacred Pheras & Sangeet Gala",
    };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* =========================================================================
          1. LIGHT MODE BACKGROUND IMAGE & ATMOSPHERIC PATTERN
          ========================================================================= */}
      <div className="block dark:hidden absolute inset-0 transition-opacity duration-1000">
        {/* Crisp Thematic Background Image with Subtle Blending */}
        <img
          key={`light-${activeTheme.bgImage}`}
          src={activeTheme.bgImage}
          alt=""
          className="h-full w-full object-cover scale-105 opacity-[0.16] filter saturate-125 transition-all duration-1000"
        />

        {/* Soft Warm Radial Vignette to maintain stellar readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 backdrop-blur-[0.5px]" />

        {/* Subtle Decorative Architectural / Dot Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60" />

        {/* Delicate Golden Accent Radiance at the top */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[800px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${activeTheme.accentColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* =========================================================================
          2. DARK MODE BACKGROUND IMAGE & STATIC ELEGANT DEPTH (NO LIVE ANIMATIONS)
          ========================================================================= */}
      <div className="hidden dark:block absolute inset-0 transition-opacity duration-1000">
        {/* Thematic Background Image with Deep Contrast Vignette */}
        <img
          key={`dark-${activeTheme.bgImage}`}
          src={activeTheme.bgImage}
          alt=""
          className="h-full w-full object-cover scale-105 opacity-[0.24] brightness-75 contrast-125 filter transition-all duration-1000"
        />

        {/* Multi-layered Dark Vignette Mask for depth and focus */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, transparent 20%, var(--background) 95%)",
          }}
        />

        {/* Ambient Subtle Grid Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      </div>
    </div>
  );
}
