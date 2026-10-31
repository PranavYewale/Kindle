import React, { useState } from "react";
import { useDashboard } from "./dashboard-context";
import {
  Clock,
  AlertOctagon,
  Send,
  PhoneCall,
  CheckCircle2,
  Check,
  Copy,
  Zap,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  PackageCheck,
  Heart,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

interface SurvivalItem {
  id: string;
  category: "ceremony" | "vanity" | "medical" | "logistics";
  name: string;
  nameHi: string;
  critical: boolean;
}

const defaultSurvivalItems: SurvivalItem[] = [
  {
    id: "s1",
    category: "ceremony",
    name: "Wedding Rings & Mangalsutra Box",
    nameHi: "अंगूठियां और मंगलसूत्र बॉक्स",
    critical: true,
  },
  {
    id: "s2",
    category: "ceremony",
    name: "Shagun Cash Envelopes (10x ₹500/₹2000)",
    nameHi: "शगुन लिफाफे (कैश तैयार)",
    critical: true,
  },
  {
    id: "s3",
    category: "ceremony",
    name: "Sindoor Daani & Silver Coins",
    nameHi: "सिंदूर दानी और चांदी के सिक्के",
    critical: false,
  },
  {
    id: "s4",
    category: "ceremony",
    name: "Fresh Varmala Garlands (Refrigerated)",
    nameHi: "ताजा वरमाला (कोल्ड स्टोरेज में रखी)",
    critical: true,
  },
  {
    id: "s5",
    category: "vanity",
    name: "Assorted Safety Pins & Double-Sided Tape",
    nameHi: "सेफ्टी पिन और ड्रेस टेप",
    critical: true,
  },
  {
    id: "s6",
    category: "vanity",
    name: "Portable Handheld Fabric Steamer",
    nameHi: "पोर्टेबल स्टीमर (कपड़ों की सिलवटें हटाने)",
    critical: false,
  },
  {
    id: "s7",
    category: "vanity",
    name: "Mini Emergency Sewing Kit & Extra Cufflinks",
    nameHi: "इमरजेंसी सिलाई किट और कफ़लिंक",
    critical: false,
  },
  {
    id: "s8",
    category: "vanity",
    name: "Touch-up Makeup Powder & Hair Spray",
    nameHi: "टच-अप मेकअप और हेयर स्प्रे",
    critical: false,
  },
  {
    id: "s9",
    category: "medical",
    name: "ORS / Electral Sachets & Glucose",
    nameHi: "ORS / इलेक्ट्रॉल और ग्लूकोज",
    critical: true,
  },
  {
    id: "s10",
    category: "medical",
    name: "Pain Relief (Crocin/Disprin) & Band-Aids",
    nameHi: "दर्द निवारक दवा और बैंड-एड",
    critical: true,
  },
  {
    id: "s11",
    category: "medical",
    name: "Bride & Groom Straw Water Bottles",
    nameHi: "स्ट्रॉ वाली पानी की बोतलें (लिपस्टिक न बिगड़े)",
    critical: false,
  },
  {
    id: "s12",
    category: "logistics",
    name: "Panditji Dakshina Envelope (Labeled Cash)",
    nameHi: "पंडितजी दक्षिणा लिफाफा",
    critical: true,
  },
  {
    id: "s13",
    category: "logistics",
    name: "Hotel Master Keycard & Room List",
    nameHi: "होटल मास्टर कार्ड और कमरों की सूची",
    critical: true,
  },
  {
    id: "s14",
    category: "logistics",
    name: "Valet Staff & DJ Tip Envelopes",
    nameHi: "वैले और डीजे टिप लिफाफे",
    critical: false,
  },
  {
    id: "s15",
    category: "logistics",
    name: "Sound Curfew Police NOC Printed Copy",
    nameHi: "लाउडस्पीकर अनुमति पुलिस NOC कॉपी",
    critical: true,
  },
];

export function DayOfExecution() {
  const { lang, dayOfSchedule, apply20MinDelay } = useDashboard();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    s1: true,
    s2: true,
    s4: true,
    s5: true,
    s12: true,
  });
  const [survivalCategory, setSurvivalCategory] = useState<
    "all" | "ceremony" | "vanity" | "medical" | "logistics"
  >("all");

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyVendorAlert = (item: (typeof dayOfSchedule)[0]) => {
    const msg = `🚨 WEDDING SCHEDULE UPDATE: We are running 20 minutes behind schedule. Ceremony for "${item.title}" will now commence at ${item.time}. Please adjust stage prep and catering readiness accordingly. Call Chief Planner Priya if urgent.`;
    navigator.clipboard.writeText(msg);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredItems =
    survivalCategory === "all"
      ? defaultSurvivalItems
      : defaultSurvivalItems.filter((i) => i.category === survivalCategory);

  const completedCount = defaultSurvivalItems.filter((i) => checkedItems[i.id]).length;
  const progressPercent = Math.round((completedCount / defaultSurvivalItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* High-Contrast Header */}
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-foreground/20 bg-card p-6 shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-background">
            <Zap className="size-3.5 fill-background" />
            <span>{lang === "hi" ? "कार्यक्रम दिन का लाइव शेड्यूल" : "Event Day Coordinator"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "कार्यक्रम का लाइव शेड्यूल" : "Event Day Live Schedule"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "मोबाइल पर आसानी से दबाने के लिए बड़े बटन। अगर कार्यक्रम में देरी होती है, तो एक क्लिक में आगे का पूरा शेड्यूल आगे बढ़ाएं।"
              : "Big, easy-to-tap buttons designed for mobile use on the event day. If anything runs late, shift the remaining schedule forward with one tap."}
          </p>
        </div>

        {/* 20-Min Late Cascade Button */}
        <button
          onClick={apply20MinDelay}
          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-destructive px-6 py-3.5 text-sm font-bold text-destructive-foreground shadow-lg hover:bg-destructive/90 active:scale-95 transition-all"
        >
          <Clock className="size-5" />
          <span>
            {lang === "hi"
              ? "20 मिनट देरी: पूरा शेड्यूल आगे बढ़ाएं"
              : "Running 20 Min Late (+20 min)"}
          </span>
        </button>
      </div>

      {/* Big Day Essentials & Survival Packing Checklist */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <PackageCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {lang === "hi"
                  ? "शादी के दिन की जरूरी सामग्री (सर्वाइवल किट)"
                  : "Day-Of Essentials & Survival Kit Checklist"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {lang === "hi"
                  ? "होटल रूम या वेन्यू पर कभी न भूलें - अंगूठी, सेफ्टी पिन, नकदी लिफाफे और दवाइयां।"
                  : "Never leave behind in hotel rooms: jewelry, cash envelopes, safety pins, and emergency meds."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-foreground">
                {completedCount} of {defaultSurvivalItems.length} packed
              </span>
              <div className="h-2 w-28 rounded-full bg-muted overflow-hidden mt-1">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {(["all", "ceremony", "vanity", "medical", "logistics"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSurvivalCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                survivalCategory === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "All Items" : cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 pt-1">
          {filteredItems.map((item) => {
            const isDone = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3 rounded-2xl border p-3 cursor-pointer transition-all ${
                  isDone
                    ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-lg border transition-all ${
                    isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-muted-foreground/40 bg-background"
                  }`}
                >
                  {isDone && <Check className="size-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold leading-tight ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {lang === "hi" ? item.nameHi : item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      {item.category}
                    </span>
                    {item.critical && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 px-1.5 py-0.2 text-[9px] font-bold text-red-600 dark:text-red-400">
                        Critical
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Timeline Schedule Cards */}
      <div className="space-y-3">
        <h3 className="font-display text-lg font-bold text-foreground">
          {lang === "hi" ? "आज का समय-सारिणी व वेंडर संपर्क" : "Today's Schedule & Vendor Contacts"}
        </h3>

        <div className="space-y-3">
          {dayOfSchedule.map((item) => {
            const isCompleted = item.status === "completed";
            const isCurrent = item.status === "current";

            return (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-2xl border-2 p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                  isCurrent
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                    : isCompleted
                      ? "border-border bg-muted/40 opacity-75"
                      : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Minimum 44px Touch Target Time Badge */}
                  <div
                    className={`grid min-h-[48px] min-w-[90px] place-items-center rounded-xl font-mono text-sm font-bold shadow-sm ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-muted text-muted-foreground"
                          : "bg-foreground text-background"
                    }`}
                  >
                    {item.time}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-foreground">
                        {item.title}
                      </h4>
                      {isCurrent && (
                        <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary animate-pulse">
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Designated Lead: <strong className="text-foreground">{item.owner}</strong> ·
                      Phone: {item.phone}
                    </p>
                  </div>
                </div>

                {/* Vendor Action Buttons (Min 44px targets) */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${item.phone}`}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border bg-card text-foreground hover:bg-muted"
                    title="Direct Call Lead"
                  >
                    <PhoneCall className="size-4" />
                  </a>

                  <button
                    onClick={() => handleCopyVendorAlert(item)}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted active:scale-95"
                  >
                    {copiedId === item.id ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Send className="size-4 text-primary" />
                    )}
                    <span>{copiedId === item.id ? "Alert Copied!" : "WhatsApp Vendor Alert"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
