import React, { useState } from "react";
import { useDashboard, type Persona } from "./dashboard-context";
import {
  Users,
  Vote,
  Shield,
  Eye,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Building,
  Utensils,
  Music,
} from "lucide-react";

interface PollOption {
  id: string;
  title: string;
  votes: number;
  votedBy: string[];
}

interface FamilyPoll {
  id: string;
  category: string;
  question: string;
  options: PollOption[];
}

const initialPolls: FamilyPoll[] = [
  {
    id: "poll-venue",
    category: "Venue Shortlist",
    question: "Final Venue Selection: Lawn vs Air-Conditioned Banquet?",
    options: [
      {
        id: "pv-1",
        title: "Emerald Green Palace Lawns (Open-Air Sunset Mandap)",
        votes: 4,
        votedBy: ["Papa", "Meera", "Aarav", "Priya"],
      },
      {
        id: "pv-2",
        title: "The Grand Regency Heritage Hall (All Indoor AC)",
        votes: 1,
        votedBy: ["Chacha"],
      },
    ],
  },
  {
    id: "poll-menu",
    category: "Dinner Spread",
    question: "Include Live Charcoal Barbecue Counter or Pure Satvik Regional Feast?",
    options: [
      {
        id: "pm-1",
        title: "Pure Satvik & Jain Gourmet with 16 Chaat Counters",
        votes: 5,
        votedBy: ["Papa", "Dadi", "Meera", "Priya", "Aarav"],
      },
      {
        id: "pm-2",
        title: "Continental Fusion Barbecue & Pasta Station",
        votes: 2,
        votedBy: ["Rohan", "Tanvi"],
      },
    ],
  },
];

export function FamilyRoom() {
  const { lang, activePersona, setActivePersona, personas } = useDashboard();
  const [polls, setPolls] = useState<FamilyPoll[]>(initialPolls);

  const castVote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        return {
          ...poll,
          options: poll.options.map((opt) => {
            const hasVoted = opt.votedBy.includes(activePersona.name);
            if (opt.id === optionId) {
              if (hasVoted) return opt; // already voted
              return {
                ...opt,
                votes: opt.votes + 1,
                votedBy: [...opt.votedBy, activePersona.name],
              };
            } else {
              // remove vote from other option if previously voted
              if (hasVoted) {
                return {
                  ...opt,
                  votes: Math.max(0, opt.votes - 1),
                  votedBy: opt.votedBy.filter((n) => n !== activePersona.name),
                };
              }
              return opt;
            }
          }),
        };
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Users className="size-3.5" />
            <span>{lang === "hi" ? "पारिवारिक मतदान" : "Family Voting"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "पारिवारिक मतदान व राय" : "Family Voting & Group Polls"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "व्हाट्सएप ग्रुप की लंबी बहसों को खत्म करें। परिवार के सदस्य वेन्यू, डेकोर और कैटरर पर सीधे वोट करके आसानी से फैसला ले सकते हैं।"
              : "End endless WhatsApp arguments. Let family members vote directly on shortlisted venues, decors, and caterers to make decisions together."}
          </p>
        </div>
      </div>

      {/* Persona Switcher Showcase Bar */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <span>
              {lang === "hi" ? "परिवार के सदस्य के रूप में देखें" : "View as Family Member"}
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Current Role: <strong className="text-foreground">{activePersona.role}</strong>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {personas.map((p) => {
            const isCurrent = activePersona.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="size-10 rounded-full object-cover border"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{p.relation}</p>
                  <span className="inline-block mt-0.5 rounded bg-muted px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
                    {p.role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collaborative Voting Cards */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Vote className="size-5 text-primary" />
          <span>Active Family Polls</span>
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
            return (
              <div key={poll.id} className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {poll.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {totalVotes} total votes cast
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-foreground">
                  {poll.question}
                </h4>

                <div className="space-y-3">
                  {poll.options.map((opt) => {
                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    const hasMyVote = opt.votedBy.includes(activePersona.name);

                    return (
                      <div
                        key={opt.id}
                        className={`rounded-2xl border p-4 transition-all ${
                          hasMyVote
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border bg-card/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-sm text-foreground">{opt.title}</p>
                          <button
                            onClick={() => castVote(poll.id, opt.id)}
                            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                              hasMyVote
                                ? "bg-primary text-primary-foreground"
                                : "border hover:bg-muted"
                            }`}
                          >
                            {hasMyVote ? "✓ Voted" : "Vote"}
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground font-mono">
                            <span>{opt.votes} votes</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Voters chips */}
                        {opt.votedBy.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                            <span>Voted by:</span>
                            {opt.votedBy.map((voter) => (
                              <span key={voter} className="font-medium text-foreground">
                                {voter},
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
