import React from "react";
import { useDashboard } from "./dashboard-context";
import {
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Wallet,
  Calendar,
  Building,
} from "lucide-react";

export function WhatIfSimulator() {
  const {
    lang,
    simGuests,
    setSimGuests,
    simBudget,
    setSimBudget,
    applySimulationToMaster,
    simDeltas,
    totalBudget,
  } = useDashboard();

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <SlidersHorizontal className="size-3.5" />
            <span>{lang === "hi" ? "लाइव कैलकुलेटर" : "Live Budget Calculator"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "मेहमान व बजट कैलकुलेटर" : "Guest & Budget Calculator"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "मेहमानों की संख्या या बजट स्लाइडर को हिलाकर देखें कि कैटरिंग और वेन्यू खर्च पर क्या असर पड़ेगा। पसंद आने पर ही इसे मुख्य प्लान में सेव करें।"
              : "Adjust guest count and budget sliders to see how catering and venue costs change before making any final changes to your main plan."}
          </p>
        </div>

        {/* Apply Action */}
        <button
          onClick={applySimulationToMaster}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition"
        >
          <Sparkles className="size-4" />
          <span>
            {lang === "hi"
              ? "यह परिदृश्य मास्टर प्लान में लागू करें"
              : "Apply Scenario to Master Plan"}
          </span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Guest Slider Card */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-display font-bold text-base">
              <Users className="size-4 text-primary" />
              <span>Simulated Guest Count</span>
            </div>
            <span className="font-display text-2xl font-bold text-primary">
              {simGuests} <span className="text-xs font-normal text-muted-foreground">guests</span>
            </span>
          </div>

          <input
            type="range"
            min={30}
            max={1500}
            step={10}
            value={simGuests}
            onChange={(e) => setSimGuests(Number(e.target.value))}
            className="w-full accent-primary h-2 cursor-pointer rounded-lg bg-muted"
          />

          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>Intimate (30)</span>
            <span>Current Benchmark (400)</span>
            <span>Mega Gala (1,500)</span>
          </div>
        </div>

        {/* Budget Slider Card */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-display font-bold text-base">
              <Wallet className="size-4 text-primary" />
              <span>Simulated Total Budget</span>
            </div>
            <span className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {inr(simBudget)}
            </span>
          </div>

          <input
            type="range"
            min={200000}
            max={10000000}
            step={50000}
            value={simBudget}
            onChange={(e) => setSimBudget(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 cursor-pointer rounded-lg bg-muted"
          />

          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>₹2,00,000</span>
            <span>₹25,00,000 (Current)</span>
            <span>₹1,00,00,000</span>
          </div>
        </div>
      </div>

      {/* Calculated Diff Engine Output Cards */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base font-bold text-foreground">
          {lang === "hi"
            ? "लाइव डिफ गणना परिणाम (Live Diff Analysis)"
            : "Live Diff Calculation Output"}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Delta 1: Guests */}
          <div className="rounded-2xl border bg-muted/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Guest Count Delta
            </span>
            <p className="font-display text-2xl font-bold text-foreground mt-2">
              {simDeltas.guestDiff >= 0 ? `+${simDeltas.guestDiff}` : simDeltas.guestDiff}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Relative to 400 baseline</p>
          </div>

          {/* Delta 2: Catering Impact */}
          <div className="rounded-2xl border bg-muted/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Catering Financial Impact
            </span>
            <p
              className={`font-display text-2xl font-bold mt-2 ${
                simDeltas.cateringDiff > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {simDeltas.cateringDiff >= 0
                ? `+${inr(simDeltas.cateringDiff)}`
                : inr(simDeltas.cateringDiff)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">At ₹450 / plate index</p>
          </div>

          {/* Delta 3: Venue Upgrade Alert */}
          <div className="rounded-2xl border bg-muted/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Venue Capacity Trigger
            </span>
            <p className="font-display text-base font-bold text-foreground mt-2">
              {simDeltas.venueUpgradeNotice ? "Expansion Required" : "Capacity OK"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {simGuests > 450 ? "Triggers Lawn / Annex B" : "Within Regency Hall limits"}
            </p>
          </div>

          {/* Delta 4: Buffer Weeks */}
          <div className="rounded-2xl border bg-muted/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suggested Buffer
            </span>
            <p className="font-display text-2xl font-bold text-foreground mt-2">
              +{simDeltas.bufferWeeksDelta} weeks
            </p>
            <p className="text-xs text-muted-foreground mt-1">For extra fittings & favours</p>
          </div>
        </div>

        {/* Upgrade alert notification if applicable */}
        {simDeltas.venueUpgradeNotice && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                Venue Threshold Trigger
              </p>
              <p className="text-amber-800 dark:text-amber-300 text-xs">
                {simDeltas.venueUpgradeNotice}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
