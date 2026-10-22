import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, LayoutDashboard, Wallet, CalendarDays, ClipboardCheck, Lightbulb, LogOut, Plus, Heart, Cake, Building2, AlertTriangle, Check, type LucideIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — Kindle event planner" },
      { name: "description", content: "See every event's budget, timeline, vendor checklist and ideas at a glance." },
      { property: "og:title", content: "Your dashboard — Kindle event planner" },
      { property: "og:description", content: "All your weddings, birthdays and community events in one view." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const events: { id: string; icon: LucideIcon; name: string; meta: string; budget: number; spent: number; days: number; done: number; tasks: number }[] = [
  { id: "w", icon: Heart, name: "Aarav & Meera's wedding", meta: "400 guests · Pune", budget: 2500000, spent: 1450000, days: 90, done: 24, tasks: 62 },
  { id: "b", icon: Cake, name: "Kabir turns 7", meta: "60 guests · Thane", budget: 45000, spent: 18000, days: 21, done: 9, tasks: 22 },
  { id: "c", icon: Building2, name: "Society Diwali mela", meta: "300 guests · Andheri", budget: 180000, spent: 140000, days: 42, done: 12, tasks: 30 },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const nav: [LucideIcon, string][] = [[LayoutDashboard, "Overview"], [Wallet, "Budget"], [CalendarDays, "Timeline"], [ClipboardCheck, "Vendors"], [Lightbulb, "Ideas"]];

function Dashboard() {
  const [activeId, setActiveId] = useState("w");
  const ev = events.find((e) => e.id === activeId)!;
  const pct = Math.round((ev.spent / ev.budget) * 100);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const vendors = ev.id === "w" ? ["Caterer", "Decorator", "Photographer", "DJ", "Mehendi artist"] : ev.id === "b" ? ["Cake", "Magician", "Return gifts", "Balloon decor"] : ["Tent & sound", "Food stalls", "Lighting", "Permits"];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card p-5 md:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold"><Flame className="size-5 text-primary" aria-hidden />Kindle</Link>
        <nav className="mt-8 grid gap-1 text-sm">
          {nav.map(([I, l], i) => (
            <a key={l} href="#" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i === 0 ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><I className="size-4" aria-hidden />{l}</a>
          ))}
        </nav>
        <Link to="/login" className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><LogOut className="size-4" aria-hidden />Log out</Link>
      </aside>

      <main className="flex-1 p-5 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Good evening,</p>
            <h1 className="text-3xl">Priya 👋</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-lg shadow-primary/25"><Plus className="size-4" aria-hidden />New event</button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Your events">
          {events.map((e) => (
            <button key={e.id} onClick={() => setActiveId(e.id)} className={`rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-0.5 ${e.id === activeId ? "border-primary ring-2 ring-primary/30" : ""}`}>
              <e.icon className="size-5 text-secondary" aria-hidden />
              <p className="mt-3 font-display text-lg font-bold">{e.name}</p>
              <p className="text-sm text-muted-foreground">{e.meta} · {e.days} days to go</p>
            </button>
          ))}
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card title="Budget" icon={Wallet}>
            <p className="font-display text-3xl font-bold">{inr(ev.spent)}</p>
            <p className="text-sm text-muted-foreground">of {inr(ev.budget)} · {pct}% used</p>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted"><div key={ev.id} className={`animate-grow h-full rounded-full ${pct > 75 ? "bg-destructive" : "bg-primary"}`} style={{ width: `${pct}%` }} /></div>
            {pct > 75 && <p className="mt-3 flex items-center gap-2 text-sm text-destructive"><AlertTriangle className="size-4" aria-hidden />Close to the limit — review food stalls</p>}
          </Card>

          <Card title="Timeline" icon={CalendarDays}>
            <p className="font-display text-3xl font-bold">{ev.done}/{ev.tasks}</p>
            <p className="text-sm text-muted-foreground">tasks done</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {["Confirm venue", "Send invites", "Final headcount"].map((t, i) => (
                <li key={t} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2"><span>{t}</span><span className="text-muted-foreground">{Math.max(1, ev.days - 60 + i * 20)}d</span></li>
              ))}
            </ul>
          </Card>

          <Card title="Vendor checklist" icon={ClipboardCheck}>
            <ul className="grid gap-2 text-sm">
              {vendors.map((v) => {
                const k = ev.id + v;
                return (
                  <li key={k}>
                    <button onClick={() => setChecks((c) => ({ ...c, [k]: !c[k] }))} className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-muted">
                      <span className={`grid size-5 place-items-center rounded border ${checks[k] ? "border-primary bg-primary text-primary-foreground" : ""}`}>{checks[k] && <Check className="size-3.5" aria-hidden />}</span>
                      <span className={checks[k] ? "text-muted-foreground line-through" : ""}>{v}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <Card title="Personalised ideas" icon={Lightbulb} className="mt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {(ev.id === "w" ? ["Marathi-English bilingual vows card", "Live chaat counter instead of a 3rd dessert", "Sunset pheras on the lawn"] : ev.id === "b" ? ["Superhero training obstacle course", "DIY cupcake station", "Polaroid return gifts"] : ["Rangoli contest by building wing", "Local home-chef food stalls", "Kids' diya painting corner"]).map((t) => (
              <p key={t} className="rounded-xl border bg-accent/40 p-4 text-sm">{t}</p>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

function Card({ title, icon: I, children, className = "" }: { title: string; icon: LucideIcon; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border bg-card p-5 ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 text-base"><I className="size-4 text-primary" aria-hidden />{title}</h2>
      {children}
    </section>
  );
}
