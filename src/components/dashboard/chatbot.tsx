import React, { useState, useRef, useEffect } from "react";
import { useDashboard } from "./dashboard-context";
import {
  Flame,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  KeyRound,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actionTab?: string | undefined;
  actionLabel?: string | undefined;
  source?: string | undefined;
}

const initialBotMessages: ChatMessage[] = [
  {
    id: "m-0",
    sender: "bot",
    text: "Namaste! I'm Kindle Assistant, your AI event copilot. I am synced directly with your event plans, guest seating, budget allocations, and Murphy contingency cards. Ask me anything or tap one of the quick suggestions below!",
    timestamp: "Just now",
  },
];

const promptChips = [
  {
    label: "💰 Negotiate caterer quote",
    query: "Draft a WhatsApp negotiation counter-offer for our banquet catering quote.",
    tab: "quotes",
  },
  {
    label: "🔇 Check 10 PM sound curfew",
    query: "What is our Murphy Plan B if police enforce the 10:00 PM sound curfew during Sangeet?",
    tab: "murphy",
  },
  {
    label: "🥗 Calculate Jain diet buffer",
    query:
      "How many Strict Jain and Satvik plates do we have, and what kitchen buffer is recommended?",
    tab: "guests",
  },
  {
    label: "⚡ Run 20-min late delay",
    query: "We are running behind schedule. How do I cascade all ceremony times forward?",
    tab: "dayof",
  },
];

function renderInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex =
    /(\*\*\*([^*]+)\*\*\*)|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-bold italic text-foreground">
          {match[2]}
        </strong>,
      );
    } else if (match[4]) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {match[4]}
        </strong>,
      );
    } else if (match[6]) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground">
          {match[6]}
        </strong>,
      );
    } else if (match[8]) {
      parts.push(
        <em key={match.index} className="italic text-foreground/90">
          {match[8]}
        </em>,
      );
    } else if (match[10]) {
      parts.push(
        <em key={match.index} className="italic text-foreground/90">
          {match[10]}
        </em>,
      );
    } else if (match[12]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary break-all [overflow-wrap:anywhere]"
        >
          {match[12]}
        </code>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function FormattedMarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let codeBlock: { lang: string; lines: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === "ul") {
        blocks.push(
          <ul
            key={`ul-${blocks.length}`}
            className="my-1.5 ml-4 list-disc space-y-1 min-w-0 max-w-full"
          >
            {currentList.items.map((item, i) => (
              <li key={i} className="leading-relaxed break-words [overflow-wrap:anywhere]">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>,
        );
      } else {
        blocks.push(
          <ol
            key={`ol-${blocks.length}`}
            className="my-1.5 ml-4 list-decimal space-y-1 min-w-0 max-w-full"
          >
            {currentList.items.map((item, i) => (
              <li key={i} className="leading-relaxed break-words [overflow-wrap:anywhere]">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>,
        );
      }
      currentList = null;
    }
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]!;
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushList();
      if (codeBlock) {
        blocks.push(
          <pre
            key={`code-${blocks.length}`}
            className="my-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/40 p-2.5 font-mono text-[11px] text-amber-200"
          >
            <code>{codeBlock.lines.join("\n")}</code>
          </pre>,
        );
        codeBlock = null;
      } else {
        codeBlock = { lang: trimmed.slice(3).trim(), lines: [] };
      }
      continue;
    }

    if (codeBlock) {
      codeBlock.lines.push(line);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      blocks.push(
        <h4
          key={`h4-${idx}`}
          className="mt-2 mb-1 font-display font-bold text-foreground text-xs uppercase tracking-wider break-words [overflow-wrap:anywhere]"
        >
          {renderInlineMarkdown(trimmed.slice(4))}
        </h4>,
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push(
        <h3
          key={`h3-${idx}`}
          className="mt-2.5 mb-1 font-display font-bold text-foreground text-sm break-words [overflow-wrap:anywhere]"
        >
          {renderInlineMarkdown(trimmed.slice(3))}
        </h3>,
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      blocks.push(
        <h2
          key={`h2-${idx}`}
          className="mt-2.5 mb-1 font-display font-bold text-foreground text-sm sm:text-base break-words [overflow-wrap:anywhere]"
        >
          {renderInlineMarkdown(trimmed.slice(2))}
        </h2>,
      );
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[1] || "");
      continue;
    }

    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numberMatch[2] || "");
      continue;
    }

    if (!trimmed) {
      flushList();
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${idx}`} className="my-1 leading-relaxed break-words [overflow-wrap:anywhere]">
        {renderInlineMarkdown(trimmed)}
      </p>,
    );
  }

  flushList();

  if (codeBlock) {
    blocks.push(
      <pre
        key={`code-${blocks.length}`}
        className="my-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-black/40 p-2.5 font-mono text-[11px] text-amber-200"
      >
        <code>{codeBlock.lines.join("\n")}</code>
      </pre>,
    );
  }

  return (
    <div className="space-y-1 text-xs text-foreground/90 min-w-0 max-w-full break-words [overflow-wrap:anywhere]">
      {blocks}
    </div>
  );
}

export function ChatBot() {
  const {
    lang,
    setActiveTab,
    dietCounts,
    totalBudget,
    totalCommitted,
    eventName,
    eventType,
    eventCity,
    eventDate,
    daysRemaining,
    guests,
    decisions,
    activeTab,
    apiKey,
    setIsAiKeyModalOpen,
  } = useDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialBotMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Prepare full conversation history for AI context
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

    // Event Context for contextual responses
    const eventContext = {
      eventType,
      eventName,
      eventCity,
      eventDate,
      daysRemaining,
      guestCount: guests.length,
      totalBudget,
      totalCommitted,
      dietCounts,
      lockedDecisionsCount: decisions.filter((d) => Boolean(d.lockedOptionId)).length,
      totalDecisionsCount: decisions.length,
      activeTab,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-key": apiKey } : {}),
        },
        body: JSON.stringify({
          message: q,
          history: historyPayload,
          eventContext,
          apiKey: apiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: data.reply || "I have noted that for your event plan.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionTab: data.actionTab,
          actionLabel: data.actionLabel,
          source: data.source,
        },
      ]);
    } catch (err) {
      console.warn("Failed to reach /api/chat, falling back to local heuristic response:", err);
      // Graceful local heuristic fallback
      let fallbackText =
        "I'm keeping track of your event timeline and milestones. Lock decisions early in the Key Decisions tab to secure vendor pricing.";
      let tab: string | undefined = undefined;
      let label: string | undefined = undefined;

      const lower = q.toLowerCase();
      if (lower.includes("budget") || lower.includes("money") || lower.includes("spent")) {
        fallbackText = `Your current event budget has ₹${totalCommitted.toLocaleString("en-IN")} committed out of ₹${totalBudget.toLocaleString("en-IN")} allocated across categories.`;
        tab = "budget";
        label = "View Money River Ledger →";
      } else if (lower.includes("jain") || lower.includes("diet") || lower.includes("plate")) {
        fallbackText = `You currently have ${dietCounts["Strict Jain"]} Strict Jain plates and ${dietCounts["Satvik (No Onion/Garlic)"]} Satvik plates registered in the Guest Pulse list.`;
        tab = "guests";
        label = "Inspect Dietary Breakdown →";
      } else if (lower.includes("quote") || lower.includes("vendor") || lower.includes("gst")) {
        fallbackText = `Vendor quotes should always be checked for unquoted GST (18%) and mandatory service charges before releasing advance payments.`;
        tab = "quotes";
        label = "Open Quote Cruncher →";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionTab: tab,
          actionLabel: label,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (Right Bottom) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-secondary p-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-primary/30"
            aria-label="Open Kindle AI Chat"
          >
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-white" />
            </span>
            <Flame
              className="size-5.5 text-white shrink-0 transition-transform group-hover:scale-110"
              aria-hidden
            />
            <span className="hidden font-display text-sm font-bold md:inline pr-1">
              {lang === "hi" ? "किंडल एआई चैट" : "Ask Kindle AI"}
            </span>
          </button>
        )}
      </div>

      {/* Slide-out / Pop-up Chatbot Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[580px] w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl backdrop-blur-xl animate-enter">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-card to-accent/30 p-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Flame className="size-4.5 text-primary" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-foreground truncate">
                    Kindle AI Copilot
                  </h3>
                  <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary shrink-0">
                    AI PRO
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">Synced with {eventName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* API Key Connection Button */}
              <button
                onClick={() => setIsAiKeyModalOpen(true)}
                className={`flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold transition shadow-2xs ${
                  apiKey
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                }`}
                title="Configure Free AI Key"
              >
                <KeyRound className="size-3 shrink-0" />
                <span className="hidden sm:inline">
                  {apiKey
                    ? apiKey.startsWith("gsk_")
                      ? "Groq Free Active"
                      : apiKey.startsWith("sk-or-")
                        ? "OpenRouter Active"
                        : "AI Active"
                    : "Add Free Key"}
                </span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="grid size-8 place-items-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
                title="Close Chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 text-xs custom-scrollbar"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 min-w-0 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    m.sender === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                  }`}
                >
                  {m.sender === "user" ? (
                    <User className="size-3.5" />
                  ) : (
                    <Bot className="size-3.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 max-w-[84%] space-y-1.5">
                  <div
                    className={`rounded-2xl p-3 leading-relaxed break-words [overflow-wrap:anywhere] overflow-hidden ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-xs whitespace-pre-wrap text-xs"
                        : "bg-muted/60 text-foreground border rounded-bl-xs"
                    }`}
                  >
                    {m.sender === "user" ? (
                      <span className="break-words [overflow-wrap:anywhere]">{m.text}</span>
                    ) : (
                      <FormattedMarkdownMessage content={m.text} />
                    )}
                  </div>

                  {m.actionTab && (
                    <button
                      onClick={() => {
                        setActiveTab(m.actionTab!);
                        setIsOpen(false);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-lg"
                    >
                      <span>{m.actionLabel || "View in Dashboard →"}</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-2 px-1">
                    <p className="text-[9px] text-muted-foreground">{m.timestamp}</p>
                    {m.source === "groq-ai" && (
                      <span className="text-[9px] font-semibold text-primary flex items-center gap-0.5">
                        <Sparkles className="size-2.5" /> LLaMA 3.3 (Groq Free)
                      </span>
                    )}
                    {m.source === "openrouter-ai" && (
                      <span className="text-[9px] font-semibold text-primary flex items-center gap-0.5">
                        <Sparkles className="size-2.5" /> OpenRouter Free
                      </span>
                    )}
                    {m.source === "gemini-ai" && (
                      <span className="text-[9px] font-semibold text-primary flex items-center gap-0.5">
                        <Sparkles className="size-2.5" /> Gemini 1.5
                      </span>
                    )}
                    {(m.source === "gemini-error" || m.source === "provider-error") && (
                      <button
                        type="button"
                        onClick={() => setIsAiKeyModalOpen(true)}
                        className="text-[9px] font-semibold text-destructive hover:underline flex items-center gap-0.5"
                      >
                        Fix Key in Settings →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] italic p-2">
                <Sparkles className="size-3 animate-spin text-primary" />
                <span>Kindle Copilot is thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t bg-muted/20 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
              Quick Suggestions:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {promptChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip.query)}
                  className="shrink-0 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Box */}
          <div className="border-t p-3 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={lang === "hi" ? "कोई भी प्रश्न पूछें..." : "Ask Kindle AI anything..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
              <button
                type="submit"
                className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-2xs"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
