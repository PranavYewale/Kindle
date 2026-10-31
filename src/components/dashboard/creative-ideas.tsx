import React, { useState } from "react";
import { useDashboard, type CreativeIdea } from "./dashboard-context";
import {
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Filter,
  DollarSign,
  Heart,
  Tag,
} from "lucide-react";

const categories = ["All", "Themes", "Menus", "Decors", "Entertainment", "Activities"] as const;

export function CreativeIdeas() {
  const { lang, ideas, toggleBookmarkIdea } = useDashboard();
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  const filteredIdeas = ideas.filter((idea) => {
    if (onlyBookmarked && !idea.bookmarked) return false;
    if (selectedCategory === "All") return true;
    return idea.category === selectedCategory;
  });

  const bookmarkedCount = ideas.filter((i) => i.bookmarked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Lightbulb className="size-3.5" />
            <span>
              {lang === "hi"
                ? "25 अनुकूलित रचनात्मक विचार"
                : "25 Curated Creative Indian Event Concepts"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi"
              ? "रचनात्मक प्रेरणा और बुकमार्क"
              : "Curated Themes, Menus & Entertainment"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "थीम्स, मेनू, सजावट, मनोरंजन और गतिविधियों के 25 चुनिंदा विचार। सीधे बुकमार्क करें और अपने इवेंट प्लान में सुरक्षित करें।"
              : "25 handcrafted ideas customized for Pune wedding celebrations with direct bookmarking to your master brief."}
          </p>
        </div>

        {/* Bookmarked Count Pill */}
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
          <BookmarkCheck className="size-5 text-primary" />
          <div className="text-xs">
            <p className="font-bold text-foreground">{bookmarkedCount} of 25 Bookmarked</p>
            <p className="text-muted-foreground">Saved to master proposal brief</p>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyBookmarked(!onlyBookmarked)}
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            onlyBookmarked
              ? "border-primary bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Bookmark className="size-3.5" />
          <span>{onlyBookmarked ? "Show All (25)" : `Show Bookmarked (${bookmarkedCount})`}</span>
        </button>
      </div>

      {/* 25 Ideas Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => {
          return (
            <div
              key={idea.id}
              className={`group flex flex-col justify-between overflow-hidden rounded-3xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg ${
                idea.bookmarked ? "border-primary ring-1 ring-primary/30" : "border-border"
              }`}
            >
              <div>
                {/* Image preview with tag overlay */}
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                    {idea.category} · {idea.tag}
                  </span>
                  <button
                    onClick={() => toggleBookmarkIdea(idea.id)}
                    className={`absolute top-3 right-3 grid size-8 place-items-center rounded-full backdrop-blur-md transition ${
                      idea.bookmarked
                        ? "bg-primary text-white shadow-md"
                        : "bg-black/50 text-white/80 hover:bg-black/80 hover:text-white"
                    }`}
                    title="Bookmark this idea"
                  >
                    <Bookmark className="size-4 fill-current" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display text-base font-bold text-foreground leading-snug">
                    {lang === "hi" ? idea.titleHi : idea.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t p-5 pt-3 text-xs">
                <span className="font-mono font-bold text-primary">Est. {idea.estCost}</span>
                <button
                  onClick={() => toggleBookmarkIdea(idea.id)}
                  className={`font-semibold hover:underline ${
                    idea.bookmarked
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {idea.bookmarked ? "✓ Saved to Plan" : "+ Bookmark Idea"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
