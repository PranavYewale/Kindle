import React, { useState } from "react";
import { useDashboard, type DecisionOption } from "./dashboard-context";
import { ReadinessRing } from "./readiness-ring";
import { RealtimeDecisionAudit } from "./realtime-decision-audit";
import {
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  TrendingUp,
  Zap,
  Info,
} from "lucide-react";

export function DecisionQueue() {
  const { lang, decisions, lockDecision, readinessPercentage, eventName } = useDashboard();

  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "locked">("pending");

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const filteredDecisions = decisions
    .filter((d) => {
      if (selectedFilter === "pending") return !d.lockedOptionId;
      if (selectedFilter === "locked") return Boolean(d.lockedOptionId);
      return true;
    })
    .sort((a, b) => {
      // Pending first, then sorted by Cost of Delay
      if (!a.lockedOptionId && b.lockedOptionId) return -1;
      if (a.lockedOptionId && !b.lockedOptionId) return 1;
      return b.costOfDelay - a.costOfDelay;
    });

  return (
    <div className="space-y-6">
      {/* Header with Readiness Ring & Formula Explain */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Zap className="size-3.5 fill-primary" />
            <span>
              {lang === "hi" ? "जरूरी व उच्च-प्राथमिकता निर्णय" : "Urgent Decisions & Price Risks"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "मुख्य निर्णय (Key Decisions)" : "Key Decisions to Make"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lang === "hi"
              ? "200-कार्यों की लंबी चेकलिस्ट के तनाव को भूल जाएं। यहां केवल वही 3-5 निर्णय दिखाए गए हैं जिनपर जल्द फैसला लेना जरूरी है ताकि दाम न बढ़ें और तारीखें सुरक्षित रहें।"
              : "Instead of an overwhelming 200-task checklist, here are the top decisions that need your attention right now before vendor prices go up or slots get booked."}
          </p>
        </div>

        {/* Readiness Ring Card */}
        <div className="flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-card to-accent/20 p-5 shadow-sm">
          <ReadinessRing size={92} strokeWidth={9} />
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {lang === "hi" ? "तैयारी का रिंग" : "Readiness Ring"}
            </p>
            <p className="font-display text-base font-bold text-foreground">
              {readinessPercentage}% Complete
            </p>
            <p className="text-xs text-muted-foreground">
              35% Decisions · 35% Contracts · 20% RSVPs · 10% Risk
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-4">
        {(["pending", "all", "locked"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition ${
              selectedFilter === filter
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {filter === "pending"
              ? lang === "hi"
                ? `लंबित निर्णय (${decisions.filter((d) => !d.lockedOptionId).length})`
                : `Active Decisions (${decisions.filter((d) => !d.lockedOptionId).length})`
              : filter === "locked"
                ? lang === "hi"
                  ? `लॉक किए गए (${decisions.filter((d) => d.lockedOptionId).length})`
                  : `Locked Choices (${decisions.filter((d) => d.lockedOptionId).length})`
                : lang === "hi"
                  ? "सभी निर्णय"
                  : "All Decisions"}
          </button>
        ))}
      </div>

      {/* Decision Cards List */}
      <div className="space-y-6">
        {filteredDecisions.map((decision, index) => {
          const isLocked = Boolean(decision.lockedOptionId);
          return (
            <div
              key={decision.id}
              className={`relative overflow-hidden rounded-3xl border transition-all ${
                isLocked
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                  : "border-border bg-card shadow-sm hover:border-primary/30"
              }`}
            >
              {/* Card Header Bar */}
              <div className="border-b p-5 sm:p-6 bg-muted/20">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-primary">#{index + 1}</span>
                      <span className="text-muted-foreground/60">·</span>
                      <span className="font-medium text-muted-foreground">{decision.category}</span>
                      <span className="text-muted-foreground/60">·</span>
                      {isLocked ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Locked
                        </span>
                      ) : (
                        <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="size-3" /> {decision.urgencyDays} Days Left
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      {decision.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-right">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Cost of delay</span>
                      <strong className="text-foreground font-mono text-sm">
                        {inr(decision.penaltyPerDay)}/day
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Timing & Vendor Hold Context */}
                {!isLocked && <RealtimeDecisionAudit decision={decision} />}
              </div>

              {/* Options Grid */}
              <div className="p-5 sm:p-6 grid gap-6 md:grid-cols-2">
                {decision.options.map((option) => {
                  const isThisOptionLocked = decision.lockedOptionId === option.id;
                  return (
                    <div
                      key={option.id}
                      className={`group/opt relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all ${
                        isThisOptionLocked
                          ? "border-emerald-500 bg-card ring-2 ring-emerald-500/30 shadow-md"
                          : isLocked
                            ? "border-border/60 bg-muted/15 opacity-75 hover:opacity-100 shadow-xs"
                            : "border-border bg-card/60 hover:border-primary/40 hover:bg-card shadow-xs"
                      }`}
                    >
                      {/* Option Header Photo Banner for Instant Visual Recognition */}
                      <div className="relative h-36 w-full overflow-hidden border-b bg-muted/40 shrink-0">
                        <img
                          src={option.image}
                          alt={option.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/opt:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                        {isThisOptionLocked ? (
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                            <CheckCircle2 className="size-3.5" />
                            <span>Confirmed Choice</span>
                          </div>
                        ) : isLocked ? (
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white/80 backdrop-blur-md">
                            <span>Alternative Option</span>
                          </div>
                        ) : option.aiRecommended ? (
                          <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-md backdrop-blur-md">
                            <Sparkles className="size-3" />
                            <span>AI Recommended Best Value</span>
                          </div>
                        ) : null}

                        <div className="absolute bottom-2.5 right-3 rounded-xl border border-white/20 bg-black/70 px-3 py-1 font-display text-sm font-bold text-white backdrop-blur-md shadow-xs">
                          {inr(option.price)}
                          <span className="text-[10px] font-normal text-white/70 ml-1">all-in</span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-display text-base font-bold text-foreground leading-snug break-words">
                                {option.name}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {option.vendorName}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                              <Star className="size-3 fill-amber-500" />
                              <span>{option.rating}</span>
                              <span className="text-[11px] text-muted-foreground ml-1">
                                ({option.votes} votes)
                              </span>
                            </div>
                          </div>

                          {/* Pros & Cons */}
                          <div className="space-y-2 border-t pt-3 text-xs">
                            <div className="space-y-1">
                              {option.pros.map((pro, pIdx) => (
                                <p
                                  key={pIdx}
                                  className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400 break-words"
                                >
                                  <ThumbsUp className="size-3 shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </p>
                              ))}
                            </div>
                            <div className="space-y-1">
                              {option.cons.map((con, cIdx) => (
                                <p
                                  key={cIdx}
                                  className="flex items-start gap-1.5 text-muted-foreground break-words"
                                >
                                  <ThumbsDown className="size-3 shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Lock Choice Action cleanly inside padded container */}
                        <div className="mt-5 border-t pt-4">
                          {isThisOptionLocked ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4 shrink-0" /> Locked & Confirmed
                              </span>
                              <button
                                type="button"
                                onClick={() => lockDecision(decision.id, null)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition"
                              >
                                <Unlock className="size-3" />
                                Unlock to change
                              </button>
                            </div>
                          ) : isLocked ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs text-muted-foreground font-medium">
                                Alternative (Not chosen)
                              </span>
                              <button
                                type="button"
                                onClick={() => lockDecision(decision.id, option.id)}
                                className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition shadow-2xs"
                              >
                                <span>Switch to this</span>
                                <ArrowRight className="size-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => lockDecision(decision.id, option.id)}
                              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-primary/20 active:scale-95"
                            >
                              <Lock className="size-3.5" />
                              <span>Lock Choice & Claim Price Guarantee</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
