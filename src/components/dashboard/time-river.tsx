import React, { useState, useRef } from "react";
import { useDashboard, type MilestoneTask } from "./dashboard-context";
import {
  GitBranch,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Table as TableIcon,
  Layers,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  User,
  Flame,
  ChevronRight,
  Sliders,
  Filter,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export function getMilestoneImage(category: string = "", title: string = ""): string {
  const cat = category.toLowerCase();
  const t = title.toLowerCase();

  if (
    cat.includes("venue") ||
    t.includes("venue") ||
    t.includes("banquet") ||
    t.includes("lawn") ||
    t.includes("hall")
  ) {
    return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"; // Palace Lawns / Banquet
  }
  if (
    cat.includes("food") ||
    cat.includes("catering") ||
    t.includes("tasting") ||
    t.includes("menu") ||
    t.includes("chaat")
  ) {
    return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"; // Gourmet Catering / Tasting
  }
  if (
    cat.includes("decor") ||
    cat.includes("floral") ||
    t.includes("mandap") ||
    t.includes("flower")
  ) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"; // Floral Mandap Decor
  }
  if (
    cat.includes("sound") ||
    cat.includes("dj") ||
    cat.includes("light") ||
    t.includes("sangeet") ||
    t.includes("music")
  ) {
    return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"; // DJ / Stage Lights
  }
  if (
    cat.includes("photo") ||
    cat.includes("cinema") ||
    t.includes("drone") ||
    t.includes("shoot")
  ) {
    return "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80"; // Photography
  }
  if (
    cat.includes("attire") ||
    cat.includes("wardrobe") ||
    t.includes("lehenga") ||
    t.includes("sherwani") ||
    t.includes("fitting")
  ) {
    return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"; // Attire
  }
  if (
    cat.includes("invite") ||
    cat.includes("stationery") ||
    t.includes("card") ||
    t.includes("rsvp")
  ) {
    return "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"; // Invitations
  }
  if (
    cat.includes("priest") ||
    cat.includes("ritual") ||
    t.includes("samagri") ||
    t.includes("pujan") ||
    t.includes("muhurat")
  ) {
    return "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80"; // Traditional Ceremony & Diya
  }
  return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80";
}

export function TimeRiver() {
  const {
    lang,
    milestones,
    updateMilestoneDate,
    toggleMilestoneStatus,
    shiftDownstreamDays,
    addMilestone,
    deleteMilestone,
    hasCongestionAlert,
    congestionMessage,
    daysRemaining,
    eventName,
  } = useDashboard();

  const [viewMode, setViewMode] = useState<"river" | "table">("river");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [newDateVal, setNewDateVal] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMilestoneForm, setNewMilestoneForm] = useState({
    title: "",
    category: "Venue & Lawns",
    date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    owner: "Priya (Planner)",
    highImpact: true,
    description: "",
  });
  const riverScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollRiver = (direction: "left" | "right") => {
    if (riverScrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      riverScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleDateChangeSubmit = (mId: string) => {
    if (newDateVal) {
      updateMilestoneDate(mId, newDateVal);
      setEditingMilestoneId(null);
    }
  };

  const handleCascadeShift = (mId: string, days: number) => {
    shiftDownstreamDays(mId, days);
  };

  const filteredMilestones = milestones.filter((m) => {
    if (selectedPhase === "all") return true;
    return m.phase === selectedPhase;
  });

  return (
    <div className="space-y-8 animate-enter">
      {/* Top Header */}
      <div className="flex flex-col gap-5 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1 text-xs font-semibold text-secondary">
            <GitBranch className="size-4" />
            <span>{lang === "hi" ? "इवेंट टाइमलाइन" : "Event Timeline"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {lang === "hi" ? "इवेंट टाइमलाइन व शेड्यूल" : "Event Timeline & Schedule"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {lang === "hi"
              ? "आज से लेकर मुख्य समारोह तक का स्पष्ट और आसान विज़ुअल रोडमैप। यदि कोई तारीख बदलती है, तो आगे के कार्य अपने आप आगे खिसक जाते हैं।"
              : "Your clear milestone roadmap from today until the celebration. If any date changes, related tasks shift forward automatically to prevent clashes."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition active:scale-95"
          >
            <Plus className="size-4" />
            <span>{lang === "hi" ? "+ नया कार्य जोड़ें" : "+ Add Task"}</span>
          </button>

          {/* View Toggle Controls */}
          <div className="flex items-center gap-1.5 rounded-2xl border bg-muted/40 p-1.5">
            <button
              onClick={() => setViewMode("river")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                viewMode === "river"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="size-4 text-primary" />
              <span>{lang === "hi" ? "विज़ुअल टाइमलाइन" : "Visual Timeline"}</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="size-4 text-secondary" />
              <span>{lang === "hi" ? "तालिका दृश्य" : "Table View"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Amber Congestion Heat Alert Banner */}
      {hasCongestionAlert && (
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="grid size-10 place-items-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-base font-bold text-amber-950 dark:text-amber-200">
                {lang === "hi"
                  ? "व्यस्त दिनों का अलर्ट — एक साथ कई काम"
                  : "Schedule Alert: Multiple Tasks Clustered Together"}
              </h4>
              <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-300/90 leading-relaxed max-w-3xl">
                {congestionMessage}
              </p>
            </div>
          </div>
          <button
            onClick={() => shiftDownstreamDays("m-1", 4)}
            className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-700 transition"
          >
            Auto-Stagger (+4d Reflow)
          </button>
        </div>
      )}

      {/* Phase Filter Tabs & Horizontal Navigation Arrows */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Milestones (Full River)" },
            { id: "foundation", label: "Phase 1: Foundation (60–30d)" },
            { id: "production", label: "Phase 2: Production (30–15d)" },
            { id: "crunch", label: "Phase 3: Final Crunch (14–2d)" },
            { id: "celebration", label: "Phase 4: The Big Day (Day 0)" },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedPhase === phase.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "bg-card border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Scroll Arrows */}
        {viewMode === "river" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
              Glide River:
            </span>
            <button
              onClick={() => scrollRiver("left")}
              className="grid size-10 place-items-center rounded-xl border bg-card text-foreground shadow-sm hover:bg-muted active:scale-95 transition"
              title="Scroll Left"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => scrollRiver("right")}
              className="grid size-10 place-items-center rounded-xl border bg-card text-foreground shadow-sm hover:bg-muted active:scale-95 transition"
              title="Scroll Right"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main River Stream Flow View */}
      {viewMode === "river" ? (
        <div
          ref={riverScrollRef}
          className="relative overflow-x-auto rounded-3xl border bg-card/60 p-6 sm:p-8 shadow-sm no-scrollbar select-none"
        >
          <div className="min-w-[1400px] py-4">
            {/* The Fluid Animated River Stream Bar */}
            <div className="relative mb-14 h-4 w-full rounded-full bg-gradient-to-r from-secondary via-primary to-emerald-500 shadow-inner">
              <div className="absolute inset-0 rounded-full river opacity-75" />
            </div>

            {/* Milestones Horizontal Fluid Cards */}
            <div className="flex items-stretch gap-8">
              {filteredMilestones.map((m, idx) => {
                const isEditing = editingMilestoneId === m.id;
                const isCompleted = m.status === "completed";
                const isInProgress = m.status === "in_progress";

                return (
                  <div
                    key={m.id}
                    className={`group relative flex w-96 min-w-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                      m.highImpact
                        ? "border-primary/50 bg-card shadow-md"
                        : "border-border bg-card shadow-sm"
                    }`}
                  >
                    {/* Glowing Waypoint Node along the River Stream */}
                    <div className="absolute -top-16 left-8 flex flex-col items-center z-20">
                      <button
                        onClick={() => toggleMilestoneStatus(m.id)}
                        title={isCompleted ? "Click to mark incomplete" : "Click to mark complete"}
                        className={`grid size-10 place-items-center rounded-full font-display text-sm font-bold shadow-lg border-2 border-card transition-transform group-hover:scale-110 active:scale-95 cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isInProgress
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse"
                              : "bg-muted text-foreground"
                        }`}
                      >
                        {isCompleted ? "✓" : idx + 1}
                      </button>
                      <div className="h-6 w-0.5 bg-border mt-0.5" />
                    </div>

                    {/* Visual Card Image Header (Instant Visual Recognition) */}
                    <div className="relative h-36 w-full overflow-hidden border-b bg-muted/40">
                      <img
                        src={getMilestoneImage(m.category, m.title)}
                        alt={m.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                      {/* Category Badge overlay on image */}
                      <span className="absolute bottom-2.5 left-3.5 rounded-lg border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
                        {m.category}
                      </span>

                      {/* T-minus countdown & delete button overlay on image */}
                      <div className="absolute bottom-2.5 right-3.5 flex items-center gap-1.5">
                        <div
                          className={`rounded-lg px-2.5 py-0.5 font-mono text-[11px] font-bold backdrop-blur-md shadow-xs ${
                            m.daysToGo <= 7
                              ? "bg-amber-600 text-white font-extrabold"
                              : "border border-white/20 bg-black/60 text-white"
                          }`}
                        >
                          T-{m.daysToGo} Days
                        </div>
                        <button
                          onClick={() => deleteMilestone(m.id)}
                          className="grid size-6 place-items-center rounded-lg bg-black/60 text-white/70 hover:text-rose-400 hover:bg-black/90 transition backdrop-blur-md"
                          title="Delete task"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">
                          {m.title}
                        </h3>
                        {m.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {m.description}
                          </p>
                        )}
                      </div>

                      {/* Date & Owner Specs */}
                      <div className="rounded-2xl border bg-muted/30 p-3.5 space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="size-4 text-primary" />
                            <strong className="text-foreground font-mono">{m.date}</strong>
                          </span>
                          {m.highImpact && (
                            <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                              High Impact
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="text-muted-foreground flex items-center gap-2">
                            {m.ownerAvatar ? (
                              <img
                                src={m.ownerAvatar}
                                alt={m.owner}
                                className="size-5 rounded-full object-cover border"
                              />
                            ) : (
                              <User className="size-4 text-primary" />
                            )}
                            <span className="text-foreground font-semibold">{m.owner}</span>
                          </span>

                          <span className="text-xs text-muted-foreground capitalize font-medium">
                            {m.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      {/* Downstream Dependency Link */}
                      {m.dependentIds.length > 0 && (
                        <div className="rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold text-primary flex items-center gap-1.5">
                          <GitBranch className="size-3.5 shrink-0" />
                          <span>Blocks {m.dependentIds.length} downstream milestones</span>
                        </div>
                      )}
                    </div>

                    {/* Date Adjuster & Cascading Re-flow Engine */}
                    <div className="border-t p-4 sm:p-5 bg-muted/15 rounded-b-3xl">
                      {isEditing ? (
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-muted-foreground block">
                            Select New Date:
                          </label>
                          <input
                            type="date"
                            defaultValue={m.date}
                            onChange={(e) => setNewDateVal(e.target.value)}
                            className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono font-bold"
                          />
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleDateChangeSubmit(m.id)}
                              className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition active:scale-95"
                            >
                              Save & Reflow
                            </button>
                            <button
                              onClick={() => setEditingMilestoneId(null)}
                              className="rounded-xl border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMilestoneStatus(m.id)}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition active:scale-95 ${
                                isCompleted
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                  : "bg-muted text-muted-foreground border hover:text-foreground hover:border-primary"
                              }`}
                            >
                              {isCompleted ? "✓ Completed" : "Mark Done"}
                            </button>
                            <button
                              onClick={() => {
                                setEditingMilestoneId(m.id);
                                setNewDateVal(m.date);
                              }}
                              className="text-xs font-bold text-primary hover:underline py-1"
                            >
                              Edit Deadline
                            </button>
                          </div>

                          {m.dependentIds.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCascadeShift(m.id, 2)}
                                className="rounded-lg border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition shadow-2xs"
                                title="Shift dependent tasks +2 days forward"
                              >
                                +2d Reflow
                              </button>
                              <button
                                onClick={() => handleCascadeShift(m.id, 5)}
                                className="rounded-lg border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition shadow-2xs"
                                title="Shift dependent tasks +5 days forward"
                              >
                                +5d Reflow
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Table View (WCAG 2.2 AA Compliant) with Large, Legible Typography */
        <div className="overflow-x-auto rounded-3xl border bg-card p-6 shadow-sm">
          <table
            className="w-full text-left text-sm sm:text-base"
            role="table"
            aria-label="Milestones Table"
          >
            <thead className="border-b bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4" scope="col">
                  Task / Milestone
                </th>
                <th className="p-4" scope="col">
                  Category
                </th>
                <th className="p-4" scope="col">
                  Date
                </th>
                <th className="p-4" scope="col">
                  Days Left
                </th>
                <th className="p-4" scope="col">
                  Owner
                </th>
                <th className="p-4" scope="col">
                  Impact
                </th>
                <th className="p-4" scope="col">
                  Downstream Cascade
                </th>
                <th className="p-4 text-right" scope="col">
                  Reflow
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredMilestones.map((m) => (
                <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
                  </td>
                  <td className="p-4 text-muted-foreground font-medium">{m.category}</td>
                  <td className="p-4 font-mono font-semibold text-primary">{m.date}</td>
                  <td className="p-4">
                    <span className="rounded-xl bg-muted px-2.5 py-1 font-mono text-xs font-bold">
                      T-{m.daysToGo}d
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-foreground">{m.owner}</td>
                  <td className="p-4">
                    {m.highImpact ? (
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                        High Impact
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-semibold text-primary">
                    {m.dependentIds.length > 0
                      ? `${m.dependentIds.length} dependent tasks`
                      : "None"}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleCascadeShift(m.id, 3)}
                      className="rounded-xl border px-3 py-1.5 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition"
                    >
                      Reflow +3d
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Custom Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-enter">
          <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  {lang === "hi" ? "नया कार्य / मील का पत्थर जोड़ें" : "Add Custom Event Task"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formDate =
                  newMilestoneForm.date ||
                  new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
                const dueTime = new Date(formDate).getTime();
                const nowTime = Date.now();
                const days = Math.max(0, Math.round((dueTime - nowTime) / (1000 * 60 * 60 * 24)));
                addMilestone({
                  title: newMilestoneForm.title,
                  category: newMilestoneForm.category,
                  date: formDate,
                  daysToGo: days,
                  phase:
                    days > 30
                      ? "foundation"
                      : days > 14
                        ? "production"
                        : days > 0
                          ? "crunch"
                          : "celebration",
                  owner: newMilestoneForm.owner,
                  highImpact: newMilestoneForm.highImpact,
                  status: "pending",
                  dependentIds: [],
                  description: newMilestoneForm.description,
                });
                setIsAddModalOpen(false);
                setNewMilestoneForm({
                  title: "",
                  category: "Venue & Lawns",
                  date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
                  owner: "Priya (Planner)",
                  highImpact: true,
                  description: "",
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-foreground mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangeet Choreographer Audition"
                  value={newMilestoneForm.title}
                  onChange={(e) =>
                    setNewMilestoneForm({ ...newMilestoneForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Category</label>
                  <select
                    value={newMilestoneForm.category}
                    onChange={(e) =>
                      setNewMilestoneForm({ ...newMilestoneForm, category: e.target.value })
                    }
                    className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Venue & Lawns">🏰 Venue & Lawns</option>
                    <option value="Food & Catering">🍽️ Food & Catering</option>
                    <option value="Decor & Floral">💐 Decor & Floral</option>
                    <option value="Photo & Cinematography">📸 Photo & Cinema</option>
                    <option value="Attire & Wardrobe">👑 Attire & Wardrobe</option>
                    <option value="Sound, Lights & DJ">🎵 Sound & DJ</option>
                    <option value="Invites & Stationery">💌 Invites & Stationery</option>
                    <option value="Priest & Rituals">🪔 Priest & Rituals</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newMilestoneForm.date}
                    onChange={(e) =>
                      setNewMilestoneForm({ ...newMilestoneForm, date: e.target.value })
                    }
                    className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Responsible Owner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera (Bride)"
                    value={newMilestoneForm.owner}
                    onChange={(e) =>
                      setNewMilestoneForm({ ...newMilestoneForm, owner: e.target.value })
                    }
                    className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMilestoneForm.highImpact}
                      onChange={(e) =>
                        setNewMilestoneForm({ ...newMilestoneForm, highImpact: e.target.checked })
                      }
                      className="size-4 rounded accent-primary"
                    />
                    <span className="font-bold text-foreground">High Impact Task</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">
                  Brief Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Rehearse bride & groom solo entry songs"
                  value={newMilestoneForm.description}
                  onChange={(e) =>
                    setNewMilestoneForm({ ...newMilestoneForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
