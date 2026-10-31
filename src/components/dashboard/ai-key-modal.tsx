import React, { useState } from "react";
import { useDashboard } from "./dashboard-context";
import {
  X,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function AiKeyModal() {
  const { apiKey, setApiKey, isAiKeyModalOpen, setIsAiKeyModalOpen, lang } = useDashboard();
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  if (!isAiKeyModalOpen) return null;

  // Auto-detect provider by prefix
  const detectedProvider = inputValue.startsWith("gsk_")
    ? "Groq Cloud (Meta LLaMA 3.3 70B - 100% Free)"
    : inputValue.startsWith("sk-or-")
      ? "OpenRouter (Free Open Models)"
      : inputValue.startsWith("AIza")
        ? "Google Gemini 1.5"
        : inputValue.startsWith("sk-")
          ? "OpenAI (GPT-4o Mini)"
          : inputValue.length > 15
            ? "Custom API Key"
            : null;

  const handleSave = () => {
    let clean = inputValue.trim();
    clean = clean.replace(/^["']|["']$/g, "").trim();
    clean = clean
      .replace(
        /^(?:GROQ_API_KEY\s*=\s*|OPENROUTER_API_KEY\s*=\s*|GEMINI_API_KEY\s*=\s*|VITE_GEMINI_API_KEY\s*=\s*|OPENAI_API_KEY\s*=\s*|Bearer\s+)/i,
        "",
      )
      .trim();
    setInputValue(clean);
    setApiKey(clean);
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleClear = () => {
    setInputValue("");
    setApiKey("");
    setTestStatus("idle");
    setTestMessage("");
  };

  const handleTestConnection = async () => {
    let keyToTest = inputValue.trim() || apiKey;
    keyToTest = keyToTest.replace(/^["']|["']$/g, "").trim();
    keyToTest = keyToTest
      .replace(
        /^(?:GROQ_API_KEY\s*=\s*|OPENROUTER_API_KEY\s*=\s*|GEMINI_API_KEY\s*=\s*|VITE_GEMINI_API_KEY\s*=\s*|OPENAI_API_KEY\s*=\s*|Bearer\s+)/i,
        "",
      )
      .trim();

    setTestStatus("testing");
    setTestMessage("Testing AI connection...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(keyToTest ? { "x-api-key": keyToTest } : {}),
        },
        body: JSON.stringify({
          message:
            "Ping test. Please reply in one short friendly sentence confirming you are online.",
          apiKey: keyToTest,
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        if (data.source === "groq-ai") {
          setTestStatus("success");
          setTestMessage(
            "Connected to Groq Cloud (Meta LLaMA 3.3 70B)! Ultra-fast 100% Free AI is active.",
          );
        } else if (data.source === "openrouter-ai") {
          setTestStatus("success");
          setTestMessage("Connected to OpenRouter Free! Live open-source AI is active.");
        } else if (data.source === "gemini-ai") {
          setTestStatus("success");
          setTestMessage("Connected to Google Gemini 1.5! Live AI intelligence is active.");
        } else if (data.source === "openai-ai") {
          setTestStatus("success");
          setTestMessage("Connected to OpenAI! Live generative AI is active.");
        } else if (data.source === "provider-error") {
          setTestStatus("error");
          setTestMessage(data.reply || data.error);
        } else {
          if (keyToTest) {
            setTestStatus("error");
            setTestMessage(
              data.error ||
                "Key was not accepted by the AI provider. Please verify your key at https://console.groq.com/keys",
            );
          } else {
            setTestStatus("success");
            setTestMessage("Connected to Kindle Event Engine (Server Heuristic Mode).");
          }
        }
      } else {
        setTestStatus("error");
        setTestMessage(data.error || "Failed to reach AI service. Please verify your API key.");
      }
    } catch (err) {
      setTestStatus("error");
      setTestMessage("Network error while connecting to /api/chat. Check your connection.");
    }
  };

  const copyEnvSnippet = () => {
    const keyName = inputValue.startsWith("gsk_")
      ? "GROQ_API_KEY="
      : inputValue.startsWith("sk-or-")
        ? "OPENROUTER_API_KEY="
        : "GEMINI_API_KEY=";
    navigator.clipboard.writeText(keyName + (inputValue || "your_api_key_here"));
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-enter">
      <div className="relative w-full max-w-xl rounded-3xl border bg-card p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#f97316] via-[#fb923c] to-[#14b8a6] text-white shadow-sm">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                {lang === "hi" ? "मुफ़्त एआई कुंजी सेटिंग्स" : "Free AI Engine & API Key Setup"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Power Kindle Chatbot with Free Groq (LLaMA 3.3 70B), Gemini, or OpenRouter
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiKeyModalOpen(false)}
            className="grid size-8 place-items-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Free Provider Recommendations */}
        <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
              <Zap className="size-4 text-primary fill-primary" />
              Recommended: 100% Free Groq API Key (No Credit Card)
            </span>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-md"
            >
              <span>Get Free Groq Key</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            GroqCloud offers <strong>100% free</strong> access to Meta's flagship{" "}
            <strong>LLaMA 3.3 70B</strong> with no billing or credit card required. Sign in with
            Google, tap <em>Create API Key</em>, and paste your{" "}
            <code className="font-mono text-primary font-bold">gsk_...</code> key below!
          </p>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Key Input */}
          <div className="rounded-2xl border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                Paste Your Free API Key
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  OpenRouter Free
                </a>
                <span>·</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground hover:underline"
                >
                  Google Gemini
                </a>
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                placeholder="Paste gsk_... (Groq) or AIzaSy... (Gemini) or sk-or-... (OpenRouter)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-11 rounded-xl border bg-background px-3.5 pr-20 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  title={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            {/* Provider Auto-Detection Pill */}
            {detectedProvider && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="size-3.5 text-primary" />
                <span>Detected Provider: {detectedProvider}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-2xs active:scale-95"
                >
                  Save API Key
                </button>
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-xl border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === "testing"}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition shadow-2xs disabled:opacity-50"
              >
                <Cpu className="size-3.5 text-primary" />
                <span>{testStatus === "testing" ? "Testing..." : "Test Connection"}</span>
              </button>
            </div>

            {/* Test Status Feedback */}
            {testStatus === "success" && (
              <div className="flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight font-medium">{testMessage}</p>
              </div>
            )}
            {testStatus === "error" && (
              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-destructive">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight font-medium">{testMessage}</p>
              </div>
            )}
          </div>

          {/* Method 2: Environment Variable (.env) */}
          <div className="rounded-2xl border bg-muted/20 p-4 space-y-2">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-muted-foreground" />
              Optional: Project Root (.env) Setup
            </span>
            <div className="flex items-center justify-between rounded-xl bg-background border px-3 py-2 font-mono text-[11px] text-foreground">
              <span>
                GROQ_API_KEY=
                {inputValue.startsWith("gsk_")
                  ? `${inputValue.substring(0, 10)}...`
                  : "gsk_your_free_key"}
              </span>
              <button
                type="button"
                onClick={copyEnvSnippet}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline ml-2"
              >
                {copiedEnv ? <Check className="size-3" /> : <Copy className="size-3" />}
                <span>{copiedEnv ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Supported free keys: <code className="font-mono">GROQ_API_KEY</code>,{" "}
              <code className="font-mono">OPENROUTER_API_KEY</code>, or{" "}
              <code className="font-mono">GEMINI_API_KEY</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end border-t pt-3">
          <button
            type="button"
            onClick={() => setIsAiKeyModalOpen(false)}
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background hover:bg-foreground/90 transition shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
