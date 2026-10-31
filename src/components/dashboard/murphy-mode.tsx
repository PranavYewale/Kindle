import React, { useState } from "react";
import { useDashboard } from "./dashboard-context";
import {
  ShieldAlert,
  ShieldCheck,
  CloudRain,
  UtensilsCrossed,
  VolumeX,
  Music,
  Zap,
  Scissors,
  HeartPulse,
  Bus,
  Check,
  AlertTriangle,
  User,
  MapPin,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  CloudRain,
  UtensilsCrossed,
  VolumeX,
  Music,
  Zap,
  Scissors,
  HeartPulse,
  Bus,
};

const riskImages: Record<string, string> = {
  r1: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=700&q=80",
  r2: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=700&q=80",
  r3: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
  r4: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=700&q=80",
  r5: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=700&q=80",
  r6: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80",
  r7: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80",
  r8: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80",
};

export function MurphyMode() {
  const { lang, risks, toggleRiskMitigation, eventCity } = useDashboard();
  const [filter, setFilter] = useState<"all" | "pending" | "mitigated">("all");

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const totalReserveCost = risks.reduce((sum, r) => sum + r.reserveCost, 0);
  const mitigatedCount = risks.filter((r) => r.mitigated).length;
  const score = Math.round((mitigatedCount / risks.length) * 100);

  const filteredRisks = risks.filter((r) => {
    if (filter === "pending") return !r.mitigated;
    if (filter === "mitigated") return r.mitigated;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldAlert className="size-3.5" />
            <span>
              {lang === "hi" ? "आपातकालीन बैकअप योजनाएं" : "Contingency & Emergency Protocols"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi"
              ? "8 अप्रत्याशित जोखिम और तैयार प्लान बी समाधान"
              : "8 Unforeseen Contingencies & Ready Plan B Solutions"}
          </h1>
          <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
            {lang === "hi"
              ? "मौसम, बिजली, खाना, वेंडर बैकआउट या ध्वनि नियमों के लिए पहले से तैयार समाधान, नामित इंचार्ज और आरक्षित बजट।"
              : "Pre-engineered risk mitigations with designated owners, execution triggers, and dedicated contingency funds."}
          </p>
        </div>

        {/* Resilience Score Card */}
        <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4 shrink-0">
          <div className="grid size-14 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-display text-xl font-bold">
            {score}%
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-foreground text-xs uppercase tracking-wider">
              {lang === "hi" ? "सुरक्षा ढाल स्कोर" : "Resilience Rating"}
            </p>
            <p className="text-xs text-muted-foreground">
              {mitigatedCount} of {risks.length} Protocols Secured
            </p>
            <p className="font-mono text-xs text-primary font-bold">
              Reserve: {inr(totalReserveCost)}
            </p>
          </div>
        </div>
      </div>

      {/* Local Planning Conditions Strip */}
      <div className="rounded-xl border bg-card p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">
              {lang === "hi"
                ? "स्थानीय शहर की स्थितियां व नियम"
                : "Local Event Conditions & Ordinances"}
            </h3>
            <span className="text-xs text-muted-foreground">({eventCity})</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Clear skies · 10:00 PM sound ordinance in effect
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground block">Forecast Viability</span>
            <p className="text-muted-foreground leading-relaxed">
              27°C with under 10% precipitation probability. Outdoor lawn viable.
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground block">Acoustic Curfew</span>
            <p className="text-muted-foreground leading-relaxed">
              10:00 PM municipal volume threshold. Silent disco headsets staged.
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground block">Guest & Parking Buffer</span>
            <p className="text-muted-foreground leading-relaxed">
              180 vehicle valet staging capacity with rapid buffer kitchen protocol.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            {lang === "hi" ? "योजनाएं" : "Backup Plans"}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {filteredRisks.length} of {risks.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Plans
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "pending"
                ? "bg-amber-500 text-white shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Needs Action ({risks.filter((r) => !r.mitigated).length})
          </button>
          <button
            onClick={() => setFilter("mitigated")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === "mitigated"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Secured ({mitigatedCount})
          </button>
        </div>
      </div>

      {/* 8 Plan B Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredRisks.map((risk) => {
          const Icon = iconMap[risk.icon] || ShieldAlert;
          return (
            <div
              key={risk.id}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                risk.mitigated
                  ? "border-emerald-500/35 bg-card shadow-sm hover:border-emerald-500/50"
                  : "border-border/80 bg-card shadow-sm hover:border-primary/40 hover:shadow-md"
              }`}
            >
              {/* Professional Photo Header */}
              <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-muted/40">
                <img
                  src={riskImages[risk.id] || riskImages["r1"]}
                  alt={risk.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />

                {/* Top Badge Bar */}
                <div className="absolute top-3 inset-x-3.5 flex items-center justify-between">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                      risk.severity === "critical"
                        ? "bg-rose-600 text-white"
                        : risk.severity === "high"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-800/80 text-white"
                    }`}
                  >
                    {risk.severity} Severity
                  </span>

                  {/* Mitigation Toggle Button */}
                  <button
                    onClick={() => toggleRiskMitigation(risk.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition shadow-sm backdrop-blur-md cursor-pointer ${
                      risk.mitigated
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-card/95 hover:bg-card text-foreground border border-border"
                    }`}
                  >
                    {risk.mitigated ? (
                      <>
                        <Check className="size-3.5" />
                        <span>Plan B Secured</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="size-3.5 text-amber-500" />
                        <span>Mark Plan B Ready</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Photo Caption / Indicator */}
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div
                    className={`grid size-9 place-items-center rounded-xl shadow-xs backdrop-blur-md ${
                      risk.mitigated
                        ? "bg-emerald-600 text-white"
                        : "bg-card/95 text-foreground border border-border"
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-white drop-shadow-sm">
                    {risk.mitigated ? "Mitigation Active" : "Action Pending"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    {risk.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mt-2 font-normal">
                    {risk.description}
                  </p>
                </div>

                {/* Structured Protocol Panel */}
                <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1.5 font-medium mb-1">
                        <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                        Trigger Condition
                      </span>
                      <p className="font-semibold text-foreground text-xs leading-snug">
                        {risk.triggerCondition}
                      </p>
                    </div>

                    <div>
                      <span className="text-muted-foreground flex items-center gap-1.5 font-medium mb-1">
                        <User className="size-3.5 text-primary shrink-0" />
                        Assigned Owner
                      </span>
                      <p className="font-semibold text-foreground text-xs leading-snug">
                        {risk.owner}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-2.5 text-xs">
                    <span className="text-muted-foreground font-medium">Contingency Reserve:</span>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {inr(risk.reserveCost)}
                    </span>
                  </div>

                  {/* Plan B Highlight Container */}
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 text-xs sm:text-[13px] text-foreground leading-relaxed">
                    <span className="font-bold text-primary mr-1.5 uppercase tracking-wide text-[11px] block sm:inline">
                      Plan B Protocol:
                    </span>
                    <span>{risk.planB}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
