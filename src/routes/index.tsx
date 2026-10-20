import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Flame, Check, ArrowRight, SlidersHorizontal, CloudRain, HeartHandshake, FileSearch, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import dashboard from "@/assets/dashboard.jpg";

const faqs = [
  ["Does it replace a wedding planner?", "No. It covers the planning work you would do yourself, and it produces a brief you can hand to a planner."],
  ["Where do the price estimates come from?", "From city-tier benchmark ranges for each category, adjusted for your guest count and season. You can overwrite every number."],
  ["Who can see my guest list?", "Only members you invite. RSVP links show a guest only their own response."],
  ["Does it work in Hindi?", "The interface and generated messages are available in English and Hindi."],
  ["Can I use it offline?", "Day-Of Mode works without a connection once the plan is loaded."],
];

const TITLE = "Kindle — Plan the whole celebration in one evening";
const DESC = "Enter date, city, guests and budget. Kindle returns a dated timeline, line-item budget and vendor checklist in about 2 minutes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }),
      },
    ],
  }),
  component: Index,
});

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const d = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("theme", d ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}

function Cta({ children = "Start planning free" }: { children?: string }) {
  return (
    <a href="#pricing" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      {children} <ArrowRight className="size-4" />
    </a>
  );
}

const featureSections = [
  ["Try changing your mind", "Add 40 guests and see the bill before you tell anyone.", "Move a slider. Catering, venue size and timeline update in under 3 seconds, with a line-by-line difference.", "+40 guests = +₹1.8L catering · venue upgrade · +2 buffer weeks"],
  ["Murphy Mode", "Eight things that could go wrong at your event, each with a Plan B.", "Kindle reads your venue type, season and guest mix, then lists the failures that are most likely for you. Each comes with a trigger, a person responsible and a cost.", "Rain on outdoor sangeet → move to banquet hall B · Owner: Kabir · ₹35,000"],
  ["Built around how your family celebrates", "Rituals, diets and timings handled from the first draft.", "Choose a tradition and enter your muhurat. The timeline respects it. The catering plan separates Jain, halal, vegetarian and no-onion-garlic counts so the caterer gets one correct number per diet.", "Jain 42 · Halal 18 · Vegetarian 210 · No onion-garlic 25"],
  ["Quotes in, comparison out", "Upload three caterer quotes. See which one is cheapest once service charge and overtime are counted.", "Kindle pulls out every line item, flags the extras that are easy to miss and drafts a negotiation message you can send on WhatsApp.", "Hidden: 10% service charge, ₹8,000 overtime after 11 pm"],
  ["One plan, the whole family", "Parents, cousins and the planner all see the same plan.", "Give each person a role. Put two venues up for a vote. The result stays on the page, so nobody has to scroll through a 400-message group chat to find it.", "Venue vote: Lawns 5 · Banquet 2 — decided"],
];

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function FeatureCard({ span, icon: Icon, k, children }: { span: string; icon: LucideIcon; k: string[]; children: ReactNode }) {
  return (
    <article className={`reveal group flex flex-col rounded-3xl border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 ${span}`}>
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary transition group-hover:rotate-6 group-hover:scale-110"><Icon className="size-5" aria-hidden /></span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-secondary">{k[0]}</p>
      <h3 className="mt-2 text-2xl leading-tight">{k[1]}</h3>
      <p className="mt-3 text-muted-foreground">{k[2]}</p>
      <div className="mt-auto rounded-2xl bg-muted p-4 pt-4">{children}</div>
    </article>
  );
}

function WhatIf() {
  const [g, setG] = useState(400);
  const extra = g - 400;
  return (
    <div>
      <label htmlFor="guests" className="flex justify-between text-sm font-medium"><span>Guests</span><span className="font-display text-lg">{g}</span></label>
      <input id="guests" type="range" min={300} max={600} step={10} value={g} onChange={(e) => setG(+e.target.value)} className="mt-2 w-full accent-primary" />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-background/70 p-2"><div className="text-xs text-muted-foreground">Catering</div><div className="font-semibold">{extra >= 0 ? "+" : "−"}₹{Math.abs(extra * 4500).toLocaleString("en-IN")}</div></div>
        <div className="rounded-lg bg-background/70 p-2"><div className="text-xs text-muted-foreground">Venue</div><div className="font-semibold">{g > 450 ? "Upgrade" : "OK"}</div></div>
        <div className="rounded-lg bg-background/70 p-2"><div className="text-xs text-muted-foreground">Buffer</div><div className="font-semibold">+{Math.max(0, Math.round(extra / 20))} wks</div></div>
      </div>
    </div>
  );
}

function Index() {
  useReveal();
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:p-2">Skip to content</a>
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4" aria-label="Main">
          <a href="#" className="flex items-center gap-2 font-display text-2xl font-semibold"><Flame className="size-6 text-primary" aria-hidden />Kindle</a>
          <div className="ml-6 hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <a href="#pricing" className="hidden text-sm font-medium sm:inline">Log in</a>
            <a href="#pricing" className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Start planning</a>
          </div>
        </nav>
      </header>

      <main id="main">
        <section className="glow-hero relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -left-20 top-20 size-72 animate-blob rounded-full bg-primary/20 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-10 top-60 size-80 animate-blob rounded-full bg-secondary/20 blur-3xl [animation-delay:-7s]" />
          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 text-center md:pt-28">
            <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] md:text-7xl">Plan the whole celebration in <em className="text-primary">one evening.</em></h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">Enter the date, city, guest count and budget. Kindle returns a dated 90-day timeline, a line-item budget and a vendor checklist in about 2 minutes.</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Cta />
              <a href="#dashboard" className="rounded-full border px-6 py-3 font-medium hover:bg-muted">See a sample wedding plan</a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No card needed. Plans for 50 to 1,500 guests.</p>
            <img src={dashboard} width={1600} height={933} alt="Kindle dashboard showing the Decision Queue, wedding timeline and budget flow for a 400-guest wedding in Pune" className="reveal mx-auto mt-14 rounded-2xl border shadow-2xl shadow-foreground/10" fetchPriority="high" />
            <p className="mt-8 text-sm tracking-wide text-muted-foreground">Used to plan 1,200+ events across 14 cities.</p>
            <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
              <div className="flex w-max animate-marquee gap-10 font-display text-xl text-muted-foreground">
                {[0, 1].flatMap((n) => ["Weddings", "Birthdays", "Sangeet", "Mehendi", "Reunions", "College fests", "Fundraisers", "Society festivals"].map((t) => <span key={n + t}>✦ {t}</span>))}
              </div>
            </div>
            <div aria-hidden className="river mx-auto mt-8 h-1 max-w-md rounded-full" />
          </div>
        </section>

        <section className="border-y bg-card py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="reveal text-3xl font-semibold md:text-4xl">What you get after two minutes</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {[["40–90", "dated tasks, each with an owner field"], ["12", "budget categories that add up to your total, to the rupee"], ["1", "vendor checklist with the questions to ask before you pay a deposit"], ["25", "personalised ideas for theme, menu, decor and entertainment"]].map(([n, t]) => (
                <div key={t} className="reveal border-t-2 border-primary pt-4">
                  <div className="font-display text-4xl text-primary">{n}</div>
                  <p className="mt-2 text-muted-foreground">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="dashboard" className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">The dashboard tells you what to decide next</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">Your next decision, ranked by what it costs to wait.</h2>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Most planners list 200 tasks and leave you to sort them. Kindle shows the 3 to 5 decisions that matter this week, with a recommended option and the date after which prices usually rise.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[["Venue", "Book by 14 Nov or lose the Saturday slot. Prices typically rise 12% after that."], ["Caterer", "Decide by 20 Nov. Tasting slots fill four weeks out."], ["Photographer", "Decide by 28 Nov. Your top pick has two dates left in February."]].map(([h, b], i) => (
              <div key={h} className="reveal rounded-xl border bg-card p-6">
                <div className="text-xs font-semibold text-muted-foreground">#{i + 1} in queue</div>
                <h3 className="mt-2 text-2xl font-semibold">{h}</h3>
                <p className="mt-2 text-muted-foreground">{b}</p>
                <span className="mt-4 inline-block rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">Decide</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Decision Queue, Time River and Money River on one screen.</p>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="reveal mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Features</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Everything a family needs, nothing it has to sort out alone.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-6">
            <FeatureCard span="md:col-span-4" icon={SlidersHorizontal} k={featureSections[0]}>
              <WhatIf />
            </FeatureCard>
            <FeatureCard span="md:col-span-2" icon={CloudRain} k={featureSections[1]}>
              <ul className="space-y-2 text-sm">
                {["Rain on outdoor sangeet", "Caterer under-delivers", "DJ no-show"].map((r, i) => (
                  <li key={r} className="flex items-center gap-2 rounded-lg bg-background/70 px-3 py-2">
                    <span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" style={{ animationDelay: `${i * 0.4}s` }} /><span className="relative size-2.5 rounded-full bg-primary" /></span>
                    {r}<span className="ml-auto whitespace-nowrap text-xs text-secondary">Plan B ready</span>
                  </li>
                ))}
              </ul>
            </FeatureCard>
            <FeatureCard span="md:col-span-2" icon={HeartHandshake} k={featureSections[2]}>
              <div className="space-y-2 text-sm">
                {[["Jain", 42], ["Halal", 18], ["Vegetarian", 210], ["No onion-garlic", 25]].map(([l, n]) => (
                  <div key={l as string}><div className="flex justify-between"><span>{l}</span><span className="font-semibold">{n}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-background/70"><div className="h-full animate-grow rounded-full bg-secondary" style={{ width: `${((n as number) / 210) * 100}%` }} /></div></div>
                ))}
              </div>
            </FeatureCard>
            <FeatureCard span="md:col-span-2" icon={FileSearch} k={featureSections[3]}>
              <div className="space-y-2 text-sm">
                {[["Caterer A", "₹4.2L", false], ["Caterer B", "₹3.9L", true], ["Caterer C", "₹4.6L", false]].map(([n, p, best]) => (
                  <div key={n as string} className={`flex justify-between rounded-lg px-3 py-2 ${best ? "bg-primary text-primary-foreground" : "bg-background/70"}`}><span>{n}</span><span className="font-semibold">{p}{best ? " · best" : ""}</span></div>
                ))}
              </div>
            </FeatureCard>
            <FeatureCard span="md:col-span-2" icon={Users} k={featureSections[4]}>
              <div className="flex -space-x-3">
                {["M", "P", "K", "A", "R"].map((c, i) => (
                  <span key={c} className="flex size-11 animate-float items-center justify-center rounded-full border-2 border-card bg-accent font-semibold text-accent-foreground" style={{ animationDelay: `${i * 0.3}s` }}>{c}</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Venue vote: Lawns 5 · Banquet 2 — decided</p>
            </FeatureCard>
          </div>
        </section>

        <section id="how" className="border-y bg-card py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-4xl font-semibold">How it works</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-4">
              {["Answer 8 questions about your event.", "Review the plan Kindle drafts.", "Book vendors from the checklist and log payments.", "On the day, open Day-Of Mode. It works offline."].map((s, i) => (
                <li key={s} className="reveal">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">{i + 1}</span>
                  <p className="mt-4 text-lg">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-4xl px-6 py-24">
          <h2 className="reveal text-center text-4xl font-semibold">Pay once per event. No subscription.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { name: "Free", price: "₹0", items: ["1 event", "Full AI plan", "Budget tracker", "10 AI regenerations per month"] },
              { name: "Plus", price: "₹499 / event", items: ["Unlimited regenerations", "What-If Simulator", "Quote Cruncher", "Murphy Mode", "Family Room with 10 members", "PDF export"], hi: true },
            ].map((p) => (
              <div key={p.name} className={`reveal rounded-2xl border p-8 ${p.hi ? "border-primary bg-card shadow-xl shadow-primary/10" : ""}`}>
                <h3 className="text-2xl font-semibold">{p.name}</h3>
                <div className="mt-2 font-display text-4xl">{p.price}</div>
                <ul className="mt-6 space-y-3">
                  {p.items.map((i) => <li key={i} className="flex gap-2"><Check className="size-5 shrink-0 text-secondary" aria-hidden />{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="text-4xl font-semibold">Questions</h2>
          <div className="mt-8 divide-y border-y">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="cursor-pointer list-none text-lg font-medium">{q}</summary>
                <p className="mt-3 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="glow-hero border-t py-24 text-center">
          <h2 className="reveal mx-auto max-w-3xl px-6 text-4xl font-semibold md:text-5xl">Your date is fixed. Your plan can be ready tonight.</h2>
          <div className="mt-8"><Cta /></div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-8 text-sm text-muted-foreground">
          <span className="font-display text-lg text-foreground">Kindle</span>
          {["Product", "Privacy", "Terms", "Contact", "Accessibility statement"].map((l) => <a key={l} href="#" className="hover:text-foreground">{l}</a>)}
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
      </footer>
    </div>
  );
}
