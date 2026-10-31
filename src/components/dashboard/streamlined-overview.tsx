import React, { useState } from "react";
import { useDashboard, eventThemes } from "./dashboard-context";
import { ReadinessRing } from "./readiness-ring";
import { RealtimeDecisionAudit } from "./realtime-decision-audit";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Wallet,
  Building,
  ChevronRight,
  Flame,
  GitBranch,
  UtensilsCrossed,
  Heart,
  Cake,
  Building2,
  PartyPopper,
  Music,
  Check,
  Layers,
  Activity,
  Landmark,
  Utensils,
  Mail,
  Flower2,
  Crown,
  FileText,
} from "lucide-react";

export function StreamlinedOverview() {
  const {
    lang,
    decisions,
    lockDecision,
    categories,
    totalBudget,
    totalCommitted,
    totalPaid,
    milestones,
    guests,
    risks,
    setActiveTab,
    daysRemaining,
    eventName,
    eventCity,
    eventDate,
    eventType,
    setIsWizardOpen,
    isDossierOpen,
    setIsDossierOpen,
    dietCounts,
  } = useDashboard();

  const fallbackTheme = eventThemes["Wedding"]!;
  const activeTheme = eventThemes[eventType] ?? fallbackTheme;

  // Top priority decision
  const priorityDecision =
    decisions
      .filter((d) => d.lockedOptionId === null)
      .sort((a, b) => b.costOfDelay - a.costOfDelay)[0] || decisions[0];

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const budgetSpentPct = Math.round((totalCommitted / totalBudget) * 100);
  const attendingGuests = guests.filter((g) => g.rsvp === "Attending").length;
  const pendingGuests = guests.filter((g) => g.rsvp === "Pending").length;
  const mitigatedRisksCount = risks.filter((r) => r.mitigated).length;

  const completedMilestones = milestones.filter((m) => m.status === "completed").length;
  const timelineProgressPct = Math.round(
    (completedMilestones / Math.max(1, milestones.length)) * 100,
  );

  // Total dietary plate calculation for segmented bar
  const totalDiets = Object.values(dietCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8 animate-enter">
      {/* Top Banner / Event Pulse Customised by Event Type */}
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-card via-card to-accent/30 p-6 shadow-sm md:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${activeTheme.badgeColor}`}
              >
                {eventType === "Wedding" ? (
                  <Heart className="size-3.5 fill-current" />
                ) : eventType === "Birthday" ? (
                  <Cake className="size-3.5" />
                ) : eventType === "Community Festival" ? (
                  <Building2 className="size-3.5" />
                ) : (
                  <PartyPopper className="size-3.5" />
                )}
                <span>{activeTheme.label}</span>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-medium">
                {eventCity} · {eventDate}
              </span>
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {eventName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl italic">
                "{activeTheme.quote}" — {daysRemaining} days remaining until celebration.
              </p>
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition active:scale-95"
              >
                <Sparkles className="size-3.5" />
                <span>
                  {lang === "hi" ? "इवेंट स्टोरी विज़ार्ड खोलें" : "Customize Event (Story Wizard)"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition"
              >
                <GitBranch className="size-3.5 text-secondary" />
                <span>{lang === "hi" ? "समयरेखा देखें" : "View Timeline"}</span>
              </button>

              <button
                onClick={() => setIsDossierOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs"
              >
                <FileText className="size-3.5 text-primary" />
                <span>
                  {lang === "hi" ? "मास्टर डॉसियर (प्रिंट/पीडीएफ)" : "Print Master Dossier"}
                </span>
              </button>
            </div>
          </div>

          {/* Readiness Ring Showcase */}
          <div className="flex items-center gap-5 rounded-3xl border bg-card/90 p-5 backdrop-blur-md shadow-sm shrink-0">
            <ReadinessRing size={96} strokeWidth={9} />
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "hi" ? "तैयारी का स्कोर" : "Readiness Score"}
              </p>
              <p className="font-display text-base font-bold text-foreground">
                {lang === "hi" ? "सब कुछ समय पर है" : "Everything on Track"}
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>35% Decisions · 35% Paid</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>20% RSVPs · 10% Backup Plans</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TIMELINE & PROGRESS INFOGRAPHIC SECTION ================= */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              <Activity className="size-3.5" />
              <span>{lang === "hi" ? "इवेंट टाइमलाइन व प्रगति" : "Event Timeline & Progress"}</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              {lang === "hi" ? "इवेंट चरण व मुख्य पड़ाव" : "Event Stages & Key Milestones"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-muted/60 px-4 py-2 text-right">
              <span className="font-display text-2xl font-bold text-primary">
                {timelineProgressPct}%
              </span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">
                {lang === "hi" ? "पूर्ण" : "Completed"}
              </span>
            </div>
            <button
              onClick={() => setActiveTab("timeline")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition"
            >
              <span>{lang === "hi" ? "पूरी टाइमलाइन खोलें" : "Open Timeline"}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Milestone Path Track (Clean horizontal connected track matching user design) */}
        <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>{lang === "hi" ? "मुख्य मील का पत्थर अनुक्रम" : "Key Milestone Roadmap"}</span>
            </span>
            <span className="text-xs font-mono font-bold text-primary">
              T-{daysRemaining} Days to Go
            </span>
          </div>

          <div className="overflow-x-auto py-4 scrollbar-none">
            <div className="min-w-[680px] max-w-4xl mx-auto px-4">
              <div className="relative flex items-start justify-between">
                {/* Background Connecting Line */}
                <div className="absolute left-8 right-8 top-6 -translate-y-1/2 h-[3px] bg-border z-0" />
                {/* Active Progress Line (teal from Node 1 to Node 2) */}
                <div className="absolute left-8 top-6 -translate-y-1/2 h-[3px] bg-teal-800 dark:bg-teal-600 z-0 w-[18%]" />

                {/* Node 1: Now */}
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="size-12 rounded-full bg-teal-800 text-white flex items-center justify-center shadow-md">
                    <Check className="size-6 stroke-[2.5]" />
                  </div>
                  <span className="mt-2.5 text-sm font-bold text-foreground">Now</span>
                  <span className="text-xs text-muted-foreground">Oct 2026</span>
                </div>

                {/* Node 2: Book Venue */}
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="size-12 rounded-full bg-[#d9822b] text-white flex items-center justify-center shadow-md ring-4 ring-[#d9822b]/20">
                    <Landmark className="size-5" />
                  </div>
                  <span className="mt-2.5 text-sm font-bold text-foreground">
                    {eventType === "Wedding"
                      ? "Book Venue"
                      : eventType === "Birthday"
                        ? "Reserve Lounge"
                        : eventType === "Community Festival"
                          ? "Book Grounds"
                          : "Book Banquet"}
                  </span>
                  <span className="text-xs text-muted-foreground">14 Nov 2026</span>
                </div>

                {/* Node 3: Finalize Caterer */}
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="size-12 rounded-full border-2 border-border bg-card text-muted-foreground flex items-center justify-center shadow-sm">
                    <Utensils className="size-5" />
                  </div>
                  <span className="mt-2.5 text-sm font-bold text-foreground">
                    {eventType === "Wedding"
                      ? "Finalize Caterer"
                      : eventType === "Birthday"
                        ? "Catering & Cake"
                        : eventType === "Community Festival"
                          ? "Langar & Stalls"
                          : "Gourmet Menu"}
                  </span>
                  <span className="text-xs text-muted-foreground">20 Nov 2026</span>
                </div>

                {/* Node 4: Send Invites */}
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="size-12 rounded-full border-2 border-border bg-card text-muted-foreground flex items-center justify-center shadow-sm">
                    <Mail className="size-5" />
                  </div>
                  <span className="mt-2.5 text-sm font-bold text-foreground">Send Invites</span>
                  <span className="text-xs text-muted-foreground">10 Dec 2026</span>
                </div>

                {/* Node 5: Mehendi / Cultural */}
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="size-12 rounded-full border-2 border-border bg-card text-muted-foreground flex items-center justify-center shadow-sm">
                    <Flower2 className="size-5" />
                  </div>
                  <span className="mt-2.5 text-sm font-bold text-foreground">
                    {eventType === "Wedding"
                      ? "Mehendi"
                      : eventType === "Birthday"
                        ? "Decor & DJ"
                        : eventType === "Community Festival"
                          ? "Sound & Lights"
                          : "Vows & Memory"}
                  </span>
                  <span className="text-xs text-muted-foreground">22 Jan 2027</span>
                </div>

                {/* Node 6: Big Day / Wedding Day */}
                <div className="relative z-10 flex flex-col items-center text-center w-24">
                  <div className="size-12 rounded-full border-2 border-border bg-card text-muted-foreground flex items-center justify-center shadow-sm">
                    {eventType === "Wedding" ? (
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="8" cy="12" r="5" />
                        <circle cx="16" cy="12" r="5" />
                      </svg>
                    ) : eventType === "Birthday" ? (
                      <PartyPopper className="size-5" />
                    ) : (
                      <Crown className="size-5" />
                    )}
                  </div>
                  <span className="mt-2.5 text-sm font-bold text-foreground">
                    {eventType === "Wedding"
                      ? "Wedding Day"
                      : eventType === "Birthday"
                        ? "Birthday Bash"
                        : eventType === "Community Festival"
                          ? "Festival Day"
                          : "Jubilee Day"}
                  </span>
                  <span className="text-xs text-muted-foreground">24 Jan 2027</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Milestone Timeline Stream Preview */}
        <div className="rounded-2xl border bg-muted/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>
                Active Milestone Sequence ({completedMilestones}/{milestones.length} Done)
              </span>
            </span>
            <span className="text-xs font-mono font-bold text-primary">
              T-{daysRemaining} Days to Go
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.slice(0, 4).map((m, idx) => (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-xl border bg-card p-4 transition hover:border-primary/40 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary">
                      T-{m.daysToGo}d
                    </span>
                  </div>
                  <h5 className="font-display text-sm font-bold text-foreground line-clamp-1">
                    {m.title}
                  </h5>
                  <p className="text-xs text-muted-foreground">Due: {m.date}</p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
                  <span>
                    Owner: <strong className="text-foreground">{m.owner.split(" ")[0]}</strong>
                  </span>
                  <span className="capitalize font-semibold text-primary">
                    {m.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Budget */}
        <div
          onClick={() => setActiveTab("budget")}
          className="group cursor-pointer rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lang === "hi" ? "बजट प्रतिबद्धता" : "Committed Budget"}
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl font-bold tracking-tight text-foreground">
              {inr(totalCommitted)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {budgetSpentPct}% of {inr(totalBudget)} allocation
            </p>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                budgetSpentPct > 85 ? "bg-amber-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(100, budgetSpentPct)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Decisions */}
        <div
          onClick={() => setActiveTab("decisions")}
          className="group cursor-pointer rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lang === "hi" ? "अनिर्णित निर्णय" : "Pending Decisions"}
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl font-bold tracking-tight text-foreground">
              {decisions.filter((d) => !d.lockedOptionId).length} / {decisions.length}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5 flex items-center gap-1">
              <Clock className="size-3" />{" "}
              {lang === "hi" ? "शीर्ष निर्णय पर ध्यान दें" : "Action required within 48h"}
            </p>
          </div>
          <div className="mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 font-medium">
            <span>{lang === "hi" ? "निर्णय कतार देखें" : "View Decision Queue"}</span>
            <ChevronRight className="size-3" />
          </div>
        </div>

        {/* Metric 3: Guests */}
        <div
          onClick={() => setActiveTab("guests")}
          className="group cursor-pointer rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lang === "hi" ? "अतिथि पुष्टि (RSVP)" : "Confirmed RSVPs"}
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl font-bold tracking-tight text-foreground">
              {attendingGuests}{" "}
              <span className="text-sm font-normal text-muted-foreground">attending</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pendingGuests} invitations awaiting reply
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
              6 Diets Categorized
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center ml-auto">
              <ChevronRight className="size-3" />
            </span>
          </div>
        </div>

        {/* Metric 4: Murphy Shield */}
        <div
          onClick={() => setActiveTab("murphy")}
          className="group cursor-pointer rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lang === "hi" ? "मर्फी शील्ड (जोखिम)" : "Murphy Shield"}
            </span>
            <div className="grid size-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl font-bold tracking-tight text-foreground">
              {mitigatedRisksCount} / {risks.length}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              8 Pre-Costed Plan B cards active
            </p>
          </div>
          <div className="mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 font-medium">
            <span>{lang === "hi" ? "जोखिम पूर्वाभ्यास देखें" : "Explore Risk Rehearsals"}</span>
            <ChevronRight className="size-3" />
          </div>
        </div>
      </div>

      {/* ================= INFOGRAPHICS WATERFALL & DIETARY BREAKDOWN ================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Infographic 1: Dietary Stacked Pill Bar */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="size-4 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Dietary Diversity Infographic
              </h3>
            </div>
            <span className="text-xs font-semibold text-primary">Zero Kitchen Mix-ups</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Segmented plate distribution preventing cross-contamination in kitchen bays:
          </p>

          {/* Segmented Color Bar */}
          <div className="h-4 w-full flex overflow-hidden rounded-full bg-muted">
            <div
              style={{ width: `${(dietCounts["Strict Jain"] / totalDiets) * 100}%` }}
              className="bg-amber-500 transition-all"
              title="Strict Jain"
            />
            <div
              style={{ width: `${(dietCounts["Satvik (No Onion/Garlic)"] / totalDiets) * 100}%` }}
              className="bg-orange-500 transition-all"
              title="Satvik"
            />
            <div
              style={{ width: `${(dietCounts["Vegetarian"] / totalDiets) * 100}%` }}
              className="bg-emerald-500 transition-all"
              title="Vegetarian"
            />
            <div
              style={{ width: `${(dietCounts["Halal"] / totalDiets) * 100}%` }}
              className="bg-blue-500 transition-all"
              title="Halal"
            />
            <div
              style={{ width: `${(dietCounts["Vegan"] / totalDiets) * 100}%` }}
              className="bg-teal-500 transition-all"
              title="Vegan"
            />
            <div
              style={{ width: `${(dietCounts["Regular"] / totalDiets) * 100}%` }}
              className="bg-indigo-500 transition-all"
              title="Regular"
            />
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Jain ({dietCounts["Strict Jain"]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-orange-500" />
              <span>Satvik ({dietCounts["Satvik (No Onion/Garlic)"]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Veg ({dietCounts["Vegetarian"]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Halal ({dietCounts["Halal"]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-teal-500" />
              <span>Vegan ({dietCounts["Vegan"]})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-indigo-500" />
              <span>Regular ({dietCounts["Regular"]})</span>
            </div>
          </div>
        </div>

        {/* Infographic 2: Budget Waterfall & Cash Flow Balance */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-emerald-500" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Budget Waterfall & Exact Envelopes
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              100% Balanced
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Committed Deals:</span>
              <span className="font-mono font-bold text-foreground">
                {inr(totalCommitted)} ({budgetSpentPct}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(100, budgetSpentPct)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Cash Paid Balances:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {inr(totalPaid)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalPaid / totalBudget) * 100)}%` }}
              />
            </div>

            <div className="rounded-2xl border bg-muted/20 p-3 flex items-center justify-between text-xs mt-2">
              <span className="text-muted-foreground">Uncommitted Buffer:</span>
              <span className="font-mono font-bold text-foreground">
                {inr(totalBudget - totalCommitted)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight on #1 Priority Decision */}
      {priorityDecision && (
        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-primary">Priority Decision</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground">{priorityDecision.category}</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {priorityDecision.priceSpikeWarning}
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">
                {priorityDecision.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Deciding today protects your quoted rate and confirms bookings for downstream
                vendors.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("decisions")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
            >
              <span>Review Options & Lock</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* Timing & Impact Strip */}
          <RealtimeDecisionAudit decision={priorityDecision} />
        </div>
      )}
    </div>
  );
}
