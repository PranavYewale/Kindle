import { Link } from "@tanstack/react-router";
import { Flame, Heart, Cake, Building2 } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({ title, sub, children, footer }: { title: string; sub: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="glow-hero relative hidden overflow-hidden bg-muted p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold"><Flame className="size-6 text-primary" aria-hidden />Kindle</Link>
        <div>
          <p className="font-display text-4xl font-bold leading-tight">One calm plan for every celebration.</p>
          <p className="mt-4 max-w-md text-muted-foreground">Budget, timeline, vendor checklist and personalised ideas — for weddings, birthdays and community events.</p>
          <div className="mt-10 grid max-w-md gap-3">
            {[{ i: Heart, t: "Wedding · 400 guests", d: "62 tasks on track" }, { i: Cake, t: "Birthday · 60 guests", d: "Cake order due Friday" }, { i: Building2, t: "Society festival · 300 guests", d: "Budget 78% used" }].map(({ i: I, t, d }, n) => (
              <div key={t} className="animate-float flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm" style={{ animationDelay: `${n * 0.8}s` }}>
                <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground"><I className="size-5" aria-hidden /></span>
                <div><p className="font-medium">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">© Kindle</p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2 font-display text-2xl font-semibold lg:hidden"><Flame className="size-6 text-primary" aria-hidden />Kindle</Link>
          <h1 className="text-3xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{sub}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </main>
    </div>
  );
}

export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <input {...props} className="h-11 rounded-lg border bg-card px-3 text-base font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30" />
    </label>
  );
}

export const submitClass = "h-11 w-full rounded-full bg-primary font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5";
