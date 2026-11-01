import React, { useState } from "react";
import { createPortal } from "react-dom";
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
  Circle,
  Pencil,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function toISODate(dateStr: string): string {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shiftISODate(isoStr: string, days: number): string {
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

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
    updateMilestoneDate,
    toggleMilestoneStatus,
    updateEventDate,
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

  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [showAllMilestones, setShowAllMilestones] = useState<boolean>(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [selectedRoadmapNode, setSelectedRoadmapNode] = useState<{
    milestoneId?: string | undefined;
    title: string;
    date: string;
    isEventDate?: boolean | undefined;
  } | null>(null);
  const [nodeEditDate, setNodeEditDate] = useState<string>("");

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
                <span>{lang === "hi" ? "इवेंट कस्टमाइज़ करें" : "Customize Event"}</span>
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

        {/* Milestone Path Track (Clean horizontal connected track with live dates & click-to-edit) */}
        {(() => {
          const node2Milestone =
            milestones.find(
              (m) =>
                m.id === "m-1" ||
                m.category.toLowerCase().includes("venue") ||
                m.title.toLowerCase().includes("venue"),
            ) || milestones[0];

          const node3Milestone =
            milestones.find(
              (m) =>
                m.id === "m-3" ||
                m.category.toLowerCase().includes("catering") ||
                m.category.toLowerCase().includes("food") ||
                m.title.toLowerCase().includes("cater"),
            ) || milestones[2];

          const node4Milestone =
            milestones.find(
              (m) =>
                m.id === "m-4" ||
                m.title.toLowerCase().includes("invite") ||
                m.category.toLowerCase().includes("sound"),
            ) || milestones[3];

          const node5Milestone =
            milestones.find(
              (m) =>
                m.id === "m-7" ||
                m.id === "m-5" ||
                m.phase === "crunch" ||
                m.title.toLowerCase().includes("mehendi") ||
                m.title.toLowerCase().includes("decor"),
            ) || milestones[4];

          const node6Milestone =
            milestones.find((m) => m.phase === "celebration" || m.id === "m-8") ||
            milestones[milestones.length - 1];

          const roadmapNodes = [
            {
              key: "now",
              title: "Now",
              date: "Oct 2026",
              isCompleted: true,
              icon: "check",
            },
            {
              key: "venue",
              milestoneId: node2Milestone?.id,
              title:
                eventType === "Wedding"
                  ? "Book Venue"
                  : eventType === "Birthday"
                    ? "Reserve Lounge"
                    : eventType === "Community Festival"
                      ? "Book Grounds"
                      : "Book Banquet",
              date: node2Milestone ? formatDisplayDate(node2Milestone.date) : "14 Nov 2026",
              isoDate: node2Milestone ? toISODate(node2Milestone.date) : "2026-11-14",
              isCompleted: !!node2Milestone && node2Milestone.status === "completed",
              icon: "landmark",
            },
            {
              key: "caterer",
              milestoneId: node3Milestone?.id,
              title:
                eventType === "Wedding"
                  ? "Finalize Caterer"
                  : eventType === "Birthday"
                    ? "Catering & Cake"
                    : eventType === "Community Festival"
                      ? "Langar & Stalls"
                      : "Gourmet Menu",
              date: node3Milestone ? formatDisplayDate(node3Milestone.date) : "20 Nov 2026",
              isoDate: node3Milestone ? toISODate(node3Milestone.date) : "2026-11-20",
              isCompleted: !!node3Milestone && node3Milestone.status === "completed",
              icon: "utensils",
            },
            {
              key: "invites",
              milestoneId: node4Milestone?.id,
              title: node4Milestone?.title.toLowerCase().includes("invite")
                ? "Send Invites"
                : node4Milestone?.category.includes("Sound")
                  ? "DJ & Sound"
                  : "Send Invites",
              date: node4Milestone ? formatDisplayDate(node4Milestone.date) : "10 Dec 2026",
              isoDate: node4Milestone ? toISODate(node4Milestone.date) : "2026-12-10",
              isCompleted: !!node4Milestone && node4Milestone.status === "completed",
              icon: "mail",
            },
            {
              key: "cultural",
              milestoneId: node5Milestone?.id,
              title:
                eventType === "Wedding"
                  ? "Mehendi"
                  : eventType === "Birthday"
                    ? "Decor & DJ"
                    : eventType === "Community Festival"
                      ? "Sound & Lights"
                      : "Vows & Memory",
              date: node5Milestone ? formatDisplayDate(node5Milestone.date) : "22 Jan 2027",
              isoDate: node5Milestone ? toISODate(node5Milestone.date) : "2027-01-22",
              isCompleted: !!node5Milestone && node5Milestone.status === "completed",
              icon: "flower",
            },
            {
              key: "event_day",
              milestoneId: node6Milestone?.id,
              isEventDate: true,
              title:
                eventType === "Wedding"
                  ? "Wedding Day"
                  : eventType === "Birthday"
                    ? "Birthday Bash"
                    : eventType === "Community Festival"
                      ? "Festival Day"
                      : "Jubilee Day",
              date: formatDisplayDate(eventDate) || "24 Jan 2027",
              isoDate: toISODate(eventDate) || "2027-01-24",
              isCompleted: !!node6Milestone && node6Milestone.status === "completed",
              icon: "crown",
            },
          ];

          const completedCount = roadmapNodes.filter((n) => n.isCompleted).length;
          const progressLinePct =
            completedCount <= 1
              ? 18
              : Math.min(100, Math.round(18 + ((completedCount - 1) / 5) * 82));

          return (
            <div className="rounded-2xl border bg-muted/20 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-primary" />
                  <span>
                    {lang === "hi" ? "मुख्य मील का पत्थर अनुक्रम" : "Key Milestone Roadmap"}
                  </span>
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsDateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-card px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/10 transition shadow-2xs"
                    title="Modify milestone dates or event day"
                  >
                    <Calendar className="size-3" />
                    <span>{lang === "hi" ? "तारीख बदलें" : "Modify Roadmap Dates"}</span>
                  </button>
                  <span className="text-xs font-mono font-bold text-primary">
                    T-{daysRemaining} Days to Go
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto py-4 scrollbar-none">
                <div className="min-w-[680px] max-w-4xl mx-auto px-4">
                  <div className="relative flex items-start justify-between">
                    {/* Background Connecting Line */}
                    <div className="absolute left-8 right-8 top-6 -translate-y-1/2 h-[3px] bg-border z-0" />
                    {/* Dynamic Active Progress Line */}
                    <div
                      className="absolute left-8 top-6 -translate-y-1/2 h-[3px] bg-teal-800 dark:bg-teal-600 z-0 transition-all duration-500"
                      style={{ width: `${progressLinePct}%` }}
                    />

                    {/* Nodes */}
                    {roadmapNodes.map((node, nIdx) => {
                      const isNextUp =
                        !node.isCompleted && (nIdx === 0 || roadmapNodes[nIdx - 1]?.isCompleted);

                      return (
                        <div
                          key={node.key}
                          data-node-key={node.key}
                          onClick={() => {
                            if (node.key === "now") return;
                            setSelectedRoadmapNode({
                              milestoneId: node.milestoneId,
                              title: node.title,
                              date: node.isoDate || toISODate(node.date),
                              isEventDate: node.isEventDate,
                            });
                            setNodeEditDate(node.isoDate || toISODate(node.date));
                          }}
                          className={`relative z-10 flex flex-col items-center text-center w-24 group ${
                            node.key !== "now" ? "cursor-pointer" : ""
                          }`}
                          title={
                            node.key === "now"
                              ? "Starting baseline"
                              : `Click to modify ${node.title} date or status`
                          }
                        >
                          <div
                            className={`size-12 rounded-full flex items-center justify-center shadow-md transition duration-200 group-hover:scale-110 ${
                              node.isCompleted
                                ? "bg-teal-800 dark:bg-teal-700 text-white"
                                : isNextUp
                                  ? "bg-[#d9822b] text-white ring-4 ring-[#d9822b]/20"
                                  : "border-2 border-border bg-card text-muted-foreground shadow-xs"
                            }`}
                          >
                            {node.isCompleted ? (
                              <Check className="size-6 stroke-[2.5]" />
                            ) : node.icon === "landmark" ? (
                              <Landmark className="size-5" />
                            ) : node.icon === "utensils" ? (
                              <Utensils className="size-5" />
                            ) : node.icon === "mail" ? (
                              <Mail className="size-5" />
                            ) : node.icon === "flower" ? (
                              <Flower2 className="size-5" />
                            ) : (
                              <Crown className="size-5" />
                            )}
                          </div>
                          <div className="mt-2.5 flex items-center gap-1 justify-center">
                            <span className="text-sm font-bold text-foreground line-clamp-1">
                              {node.title}
                            </span>
                            {node.key !== "now" && (
                              <Pencil className="size-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground group-hover:text-primary transition font-medium">
                            {node.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Live Milestone Timeline Stream Preview */}
        <div className="rounded-2xl border bg-muted/30 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              <span>
                Active Milestone Sequence ({completedMilestones}/{milestones.length} Done)
              </span>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAllMilestones(!showAllMilestones)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition"
              >
                <span>{showAllMilestones ? "Show Top 4" : `View All (${milestones.length})`}</span>
                {showAllMilestones ? (
                  <ChevronUp className="size-3.5" />
                ) : (
                  <ChevronDown className="size-3.5" />
                )}
              </button>
              <span className="text-xs font-mono font-bold text-primary">
                T-{daysRemaining} Days to Go
              </span>
            </div>
          </div>

          {/* Smart Auto-Completion Tip */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-xs text-muted-foreground flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-primary shrink-0 fill-primary" />
              <span>
                <strong>Smart Auto-Sync Active:</strong> Locking choices in{" "}
                <strong>Key Decisions</strong> (Venue, Catering, Sound) automatically marks linked
                milestones completed. You can also click <strong>Mark Done</strong> or{" "}
                <strong>Edit</strong> due dates anytime.
              </span>
            </div>
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="text-primary font-bold hover:underline shrink-0 text-xs"
            >
              Modify Deadlines →
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(showAllMilestones ? milestones : milestones.slice(0, 4)).map((m, idx) => {
              const isCompleted = m.status === "completed";

              return (
                <div
                  key={m.id}
                  className={`flex flex-col justify-between rounded-xl border p-4 transition shadow-xs ${
                    isCompleted
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>

                        {/* Interactive Complete Toggle Button */}
                        <button
                          onClick={() => toggleMilestoneStatus(m.id)}
                          title={isCompleted ? "Mark incomplete" : "Mark milestone completed"}
                          aria-label={
                            isCompleted
                              ? `Mark milestone ${m.title} as incomplete`
                              : `Mark milestone ${m.title} as completed`
                          }
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition active:scale-95 ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                              : "bg-muted text-muted-foreground border border-border hover:border-primary hover:text-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Circle className="size-3" />
                              <span>Mark Done</span>
                            </>
                          )}
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-primary">
                        T-{m.daysToGo}d
                      </span>
                    </div>

                    <h5
                      className={`font-display text-sm font-bold text-foreground line-clamp-1 transition ${
                        isCompleted ? "line-through opacity-75" : ""
                      }`}
                    >
                      {m.title}
                    </h5>

                    {/* Auto-completed indicator if completed via decision */}
                    {m.autoCompleted && (
                      <div
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5"
                        title="Auto-completed when matching decision was locked in Key Decisions"
                      >
                        <Zap className="size-3 fill-primary text-primary" />
                        <span>Auto-synced with Decision</span>
                      </div>
                    )}

                    {/* Due Date with inline editing */}
                    {editingMilestoneId === m.id ? (
                      <div className="space-y-1.5 pt-1 rounded-lg border bg-muted/40 p-2">
                        <label className="text-[10px] font-bold text-muted-foreground block">
                          Change Deadline:
                        </label>
                        <input
                          type="date"
                          defaultValue={toISODate(m.date)}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateMilestoneDate(m.id, e.target.value);
                            }
                          }}
                          className="w-full rounded-md border bg-background px-2 py-1 text-xs font-mono font-bold"
                        />
                        <div className="flex items-center gap-1 pt-0.5">
                          <button
                            onClick={() => setEditingMilestoneId(null)}
                            className="flex-1 rounded bg-primary py-1 text-[10px] font-bold text-primary-foreground shadow-2xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              updateMilestoneDate(m.id, shiftISODate(toISODate(m.date), 3))
                            }
                            className="rounded border bg-card px-2 py-1 text-[10px] font-semibold hover:bg-muted"
                            title="Shift +3 days"
                          >
                            +3d
                          </button>
                          <button
                            onClick={() =>
                              updateMilestoneDate(m.id, shiftISODate(toISODate(m.date), -3))
                            }
                            className="rounded border bg-card px-2 py-1 text-[10px] font-semibold hover:bg-muted"
                            title="Shift -3 days"
                          >
                            -3d
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-muted-foreground group/date">
                        <p>
                          Due: <strong className="font-mono text-foreground">{m.date}</strong>
                        </p>
                        <button
                          onClick={() => setEditingMilestoneId(m.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline transition"
                          title="Click to modify this milestone's date"
                        >
                          <Pencil className="size-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
                    <span>
                      Owner: <strong className="text-foreground">{m.owner.split(" ")[0]}</strong>
                    </span>
                    <span
                      className={`capitalize font-semibold ${
                        isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-primary"
                      }`}
                    >
                      {m.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MODAL: MODIFY ROADMAP / EVENT DATES ================= */}
      {typeof document !== "undefined" &&
        (isDateModalOpen || selectedRoadmapNode) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-md sm:max-w-lg my-auto rounded-3xl border bg-card p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
              {/* Header (Always pinned at top) */}
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground line-clamp-1">
                    {selectedRoadmapNode
                      ? `Modify Date: ${selectedRoadmapNode.title}`
                      : "Modify Roadmap & Milestone Dates"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsDateModalOpen(false);
                    setSelectedRoadmapNode(null);
                  }}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition"
                  aria-label="Close date modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {selectedRoadmapNode ? (
                /* Single Node Editing */
                <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-0.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">
                      Target Date for {selectedRoadmapNode.title}:
                    </label>
                    <input
                      type="date"
                      value={toISODate(nodeEditDate)}
                      onChange={(e) => setNodeEditDate(e.target.value)}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-mono font-bold"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      Quick Shift:
                    </span>
                    <button
                      type="button"
                      onClick={() => setNodeEditDate(shiftISODate(toISODate(nodeEditDate), -3))}
                      className="rounded-lg border bg-muted px-2 py-1 text-xs font-semibold hover:bg-accent transition"
                    >
                      -3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setNodeEditDate(shiftISODate(toISODate(nodeEditDate), 3))}
                      className="rounded-lg border bg-muted px-2 py-1 text-xs font-semibold hover:bg-accent transition"
                    >
                      +3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setNodeEditDate(shiftISODate(toISODate(nodeEditDate), 7))}
                      className="rounded-lg border bg-muted px-2 py-1 text-xs font-semibold hover:bg-accent transition"
                    >
                      +1 Week
                    </button>
                  </div>

                  {selectedRoadmapNode.milestoneId && (
                    <div className="rounded-xl border bg-muted/20 p-2.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Status:</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedRoadmapNode.milestoneId) {
                            toggleMilestoneStatus(selectedRoadmapNode.milestoneId);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3 py-1.5 text-xs font-bold shadow-2xs hover:bg-muted transition"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        <span>Toggle Complete</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* All Roadmap Dates Table */
                <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-0.5">
                  {/* Event Day */}
                  <div className="rounded-2xl border bg-muted/30 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Crown className="size-4 text-primary" />
                        <span>Main Event Day ({eventType})</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-primary">
                        T-{daysRemaining} Days
                      </span>
                    </div>
                    <input
                      type="date"
                      value={toISODate(eventDate)}
                      onChange={(e) => {
                        if (e.target.value) {
                          updateEventDate(e.target.value);
                        }
                      }}
                      className="w-full rounded-xl border bg-background px-3 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      Individual Milestone Deadlines:
                    </label>
                    <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-1">
                      {milestones.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-xl border bg-card p-2.5 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-foreground line-clamp-1">{m.title}</strong>
                            <button
                              type="button"
                              onClick={() => toggleMilestoneStatus(m.id)}
                              className={`rounded-full px-2 py-0.5 font-bold text-[10px] transition ${
                                m.status === "completed"
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                  : "bg-muted text-muted-foreground border hover:text-foreground"
                              }`}
                            >
                              {m.status === "completed" ? "✓ Done" : "Mark Done"}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              defaultValue={toISODate(m.date)}
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateMilestoneDate(m.id, e.target.value);
                                }
                              }}
                              className="flex-1 rounded-lg border bg-background px-2.5 py-1 text-xs font-mono font-bold"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateMilestoneDate(m.id, shiftISODate(toISODate(m.date), 2))
                              }
                              className="rounded-lg border bg-muted px-2 py-1 text-[11px] font-semibold hover:bg-accent"
                            >
                              +2d
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pinned Action Footer (Always visible, never pushed below screen) */}
              <div className="pt-3 border-t shrink-0 flex gap-2">
                {selectedRoadmapNode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRoadmapNode.isEventDate) {
                          updateEventDate(nodeEditDate);
                        } else if (selectedRoadmapNode.milestoneId && nodeEditDate) {
                          updateMilestoneDate(selectedRoadmapNode.milestoneId, nodeEditDate);
                        }
                        setSelectedRoadmapNode(null);
                      }}
                      className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                    >
                      Save & Update Roadmap
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRoadmapNode(null)}
                      className="rounded-xl border bg-card px-4 py-2.5 text-xs font-semibold hover:bg-muted transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsDateModalOpen(false)}
                    className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

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
