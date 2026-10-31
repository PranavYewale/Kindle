import React from "react";
import { useDashboard } from "./dashboard-context";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Check,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

const cultureOptions = [
  {
    id: "maharashtrian",
    label: "Maharashtrian",
    labelHi: "महाराष्ट्रीयन",
    desc: "Sakharpuda, Antarpat & Puran Poli",
  },
  {
    id: "gujarati",
    label: "Gujarati",
    labelHi: "गुजराती",
    desc: "Mandap Mahurat, Garba Night & Undhiyu",
  },
  {
    id: "punjabi",
    label: "Punjabi",
    labelHi: "पंजाबी",
    desc: "Chooda-Kaleere, Jaago & Anand Karaj",
  },
  {
    id: "south_indian",
    label: "South Indian",
    labelHi: "दक्षिण भारतीय",
    desc: "Kasi Yatra, Muhurtham & Sadhya",
  },
  { id: "muslim", label: "Muslim", labelHi: "मुस्लिम", desc: "Manjha, Nikah & Walima Biryani" },
  {
    id: "western",
    label: "Western Civil",
    labelHi: "वेस्टर्न सिविल",
    desc: "Vows, First Dance & Champagne Toast",
  },
];

export function CulturalPacks() {
  const { lang, activeCulture, setActiveCulture, culturalCeremonies } = useDashboard();

  const ceremonies =
    culturalCeremonies[activeCulture] ||
    culturalCeremonies["maharashtrian"] ||
    culturalCeremonies["gujarati"] ||
    culturalCeremonies["western"] ||
    culturalCeremonies["punjabi"] ||
    Object.values(culturalCeremonies)[0] ||
    [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Flame className="size-3.5 fill-amber-500" />
            <span>{lang === "hi" ? "पारंपरिक रस्में व संस्कृति" : "Traditions & Customs"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "रीति-रिवाज व शुभ मुहूर्त" : "Traditions, Customs & Muhurats"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "महाराष्ट्रीयन, गुजराती, पंजाबी, दक्षिण भारतीय, मुस्लिम व वेस्टर्न रीति-रिवाजों की पूरी जानकारी, शुभ मुहूर्त और पूजा सामग्री की चेकलिस्ट।"
              : "Ceremony schedules and samagri item checklists for Maharashtrian, Gujarati, Punjabi, South Indian, Muslim, and Western traditions."}
          </p>
        </div>
      </div>

      {/* Cultural Selection Chips */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {cultureOptions.map((cult) => (
          <button
            key={cult.id}
            onClick={() => setActiveCulture(cult.id)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              activeCulture === cult.id
                ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm"
                : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <p className="font-display text-sm font-bold text-foreground">
              {lang === "hi" ? cult.labelHi : cult.label}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{cult.desc}</p>
          </button>
        ))}
      </div>

      {/* Ritual Sequence Cards */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-foreground">
          {lang === "hi"
            ? "अनुष्ठान अनुक्रम और सामग्री चेकलिस्ट"
            : "Ritual Sequence & Required Samagri"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {ceremonies.map((c, idx) => (
            <div
              key={c.id}
              className={`rounded-3xl border p-6 transition-all ${
                c.status === "done"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : c.status === "next"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-bold text-muted-foreground">
                      Step #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <Sun className="size-3" />
                      {c.muhuratWindow}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-foreground mt-1">
                    {lang === "hi" ? c.nameHi : c.name}
                  </h4>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    c.status === "done"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : c.status === "next"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>
              </div>

              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{c.description}</p>

              {/* Samagri checklist */}
              <div className="mt-4 rounded-2xl border bg-muted/40 p-3.5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Essential Samagri & Items:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {c.keyItems.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1 text-xs text-foreground font-medium"
                    >
                      <Check className="size-3 text-emerald-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
