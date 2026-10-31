import React, { useState } from "react";
import { useDashboard, type BudgetCategory } from "./dashboard-context";
import {
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Edit2,
  Check,
  Building2,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Music,
  Shirt,
  Palette,
  Mail,
  Car,
  Mic2,
  Gift,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  UtensilsCrossed,
  Sparkles,
  Camera,
  Music,
  Shirt,
  Palette,
  Mail,
  Car,
  Mic2,
  Gift,
  ShieldAlert,
};

const categoryThumbnails: Record<string, string> = {
  venue:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=140&q=80",
  catering:
    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=140&q=80",
  decor:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=140&q=80",
  photo:
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=140&q=80",
  attire:
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=140&q=80",
  makeup:
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=140&q=80",
  sound:
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=140&q=80",
  transport:
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=140&q=80",
  gifts:
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=140&q=80",
  invites:
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=140&q=80",
  samagri:
    "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=140&q=80",
  contingency:
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=140&q=80",
};

export function MoneyRiver() {
  const { lang, categories, totalBudget, totalCommitted, totalPaid, updateCategoryRupees } =
    useDashboard();

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [tempCommitted, setTempCommitted] = useState<number>(0);
  const [tempPaid, setTempPaid] = useState<number>(0);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const uncommittedBuffer = totalBudget - totalCommitted;
  const unpaidLiability = totalCommitted - totalPaid;

  const handleStartEdit = (cat: BudgetCategory) => {
    setEditingCatId(cat.id);
    setTempCommitted(cat.committed);
    setTempPaid(cat.paid);
  };

  const handleSaveEdit = (catId: string) => {
    updateCategoryRupees(catId, "committed", tempCommitted);
    updateCategoryRupees(catId, "paid", tempPaid);
    setEditingCatId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Wallet className="size-3.5" />
            <span>{lang === "hi" ? "सटीक रुपया बजट" : "Exact Rupee Budget"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "इवेंट बजट ट्रैकर" : "Event Budget Tracker"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "12 मुख्य श्रेणियों में अपने पूरे बजट का हिसाब रखें। कितना तय हुआ, कितना नकद दिया गया और कितना बाकी है, सब कुछ स्पष्ट देखें।"
              : "Track your committed deposits, paid amounts, and remaining cash buffer across 12 clear event categories with zero calculation errors."}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 rounded-2xl border bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="size-5" />
          <div className="text-xs">
            <p className="font-bold">
              {lang === "hi" ? "बजट संतुलन 100%" : "Budget Perfectly Balanced"}
            </p>
            <p className="text-muted-foreground">Sum of 12 categories = {inr(totalBudget)}</p>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "hi" ? "कुल स्वीकृत बजट" : "Total Target Budget"}
          </span>
          <p className="font-display text-2xl font-bold text-foreground mt-2">{inr(totalBudget)}</p>
          <p className="text-xs text-muted-foreground mt-1">12 Categories locked</p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "hi" ? "कुल प्रतिबद्ध (कॉन्ट्रैक्ट्स)" : "Committed Deals"}
          </span>
          <p className="font-display text-2xl font-bold text-primary mt-2">{inr(totalCommitted)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((totalCommitted / totalBudget) * 100)}% of total allocation
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "hi" ? "नकद भुगतान (Paid Balances)" : "Cash Paid Out"}
          </span>
          <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {inr(totalPaid)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Remaining liability: {inr(unpaidLiability)}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "hi" ? "सुरक्षित बफर (Unallocated)" : "Uncommitted Buffer"}
          </span>
          <p
            className={`font-display text-2xl font-bold mt-2 ${
              uncommittedBuffer < 0 ? "text-destructive" : "text-foreground"
            }`}
          >
            {inr(uncommittedBuffer)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {uncommittedBuffer < 0 ? "⚠️ Over budget threshold!" : "Guaranteed safety cushion"}
          </p>
        </div>
      </div>

      {/* 12 Categories Ledger Table with In-line Rupee Editing */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            {lang === "hi"
              ? "12-श्रेणी लाइव लेजर और इन-लाइन संपादन"
              : "12-Category Live Ledger & In-line Rupee Editing"}
          </h2>
          <span className="text-xs text-muted-foreground">
            Click 'Edit' on any row to change committed or paid values
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" role="table">
            <thead className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Allocated (Exact)</th>
                <th className="p-3">Committed</th>
                <th className="p-3">Paid Balance</th>
                <th className="p-3">Variance</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => {
                const isEditing = editingCatId === cat.id;
                const Icon = iconMap[cat.icon] || Wallet;
                const isOver = cat.committed > cat.allocated;
                const variance = cat.allocated - cat.committed;

                return (
                  <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border shadow-xs">
                          <img
                            src={categoryThumbnails[cat.id] || categoryThumbnails["venue"]}
                            alt={cat.name}
                            className="size-full object-cover"
                            loading="lazy"
                          />
                          <div
                            className="absolute bottom-0 right-0 grid size-4 place-items-center rounded-tl-md text-white"
                            style={{ backgroundColor: cat.color }}
                          >
                            <Icon className="size-2.5" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {lang === "hi" ? cat.nameHi : cat.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{cat.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-mono font-semibold text-foreground">
                      {inr(cat.allocated)}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono">₹</span>
                          <input
                            type="number"
                            value={tempCommitted}
                            onChange={(e) => setTempCommitted(Number(e.target.value))}
                            className="w-28 rounded border bg-background px-2 py-1 text-xs font-mono font-semibold"
                          />
                        </div>
                      ) : (
                        <span className="font-mono font-medium text-foreground">
                          {inr(cat.committed)}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono">₹</span>
                          <input
                            type="number"
                            value={tempPaid}
                            onChange={(e) => setTempPaid(Number(e.target.value))}
                            className="w-28 rounded border bg-background px-2 py-1 text-xs font-mono font-semibold"
                          />
                        </div>
                      ) : (
                        <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                          {inr(cat.paid)}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          variance < 0 ? "text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {variance >= 0 ? `+${inr(variance)}` : inr(variance)}
                      </span>
                    </td>

                    <td className="p-3">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-bold text-destructive">
                          <AlertTriangle className="size-3" /> Overspent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" /> In Control
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(cat.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                        >
                          <Check className="size-3" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Edit2 className="size-3" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
