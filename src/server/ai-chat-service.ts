export interface ChatMessageItem {
  role: "user" | "model" | "assistant";
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  history?: ChatMessageItem[];
  eventContext?: {
    eventType?: string;
    eventName?: string;
    eventCity?: string;
    eventDate?: string;
    daysRemaining?: number;
    guestCount?: number;
    totalBudget?: number;
    totalCommitted?: number;
    activeCulture?: string;
    dietCounts?: Record<string, number>;
    lockedDecisionsCount?: number;
    totalDecisionsCount?: number;
    unresolvedRisksCount?: number;
    activeTab?: string;
  };
  apiKey?: string;
  provider?: "groq" | "openrouter" | "gemini" | "openai" | "auto";
}

/**
 * Strips quotes, whitespace, and common copy-paste prefixes
 */
export function cleanApiKey(raw?: string): string {
  if (!raw) return "";
  let key = raw.trim();
  key = key.replace(/^["']|["']$/g, "").trim();
  key = key
    .replace(
      /^(?:GROQ_API_KEY\s*=\s*|OPENROUTER_API_KEY\s*=\s*|GEMINI_API_KEY\s*=\s*|VITE_GEMINI_API_KEY\s*=\s*|OPENAI_API_KEY\s*=\s*|Bearer\s+)/i,
      "",
    )
    .trim();
  return key;
}

/**
 * Detects the AI provider based on key format or environment
 */
export function detectProvider(key?: string): "groq" | "openrouter" | "gemini" | "openai" | "none" {
  if (!key) return "none";
  if (key.startsWith("gsk_")) return "groq";
  if (key.startsWith("sk-or-")) return "openrouter";
  if (key.startsWith("AIza")) return "gemini";
  if (key.startsWith("sk-")) return "openai";
  // Default non-sk key to Gemini or Groq
  return key.length > 20 && !key.startsWith("sk-") ? "gemini" : "groq";
}

/**
 * Derives contextual action tab from response text
 */
function extractActionTab(text: string): { actionTab?: string; actionLabel?: string } {
  const lower = text.toLowerCase();
  if (lower.includes("quote") || lower.includes("negotiat") || lower.includes("caterer rate")) {
    return { actionTab: "quotes", actionLabel: "Open Quote Cruncher →" };
  }
  if (
    lower.includes("murphy") ||
    lower.includes("backup") ||
    lower.includes("curfew") ||
    lower.includes("rain")
  ) {
    return { actionTab: "murphy", actionLabel: "Review Murphy Shield →" };
  }
  if (
    lower.includes("diet") ||
    lower.includes("jain") ||
    lower.includes("guest") ||
    lower.includes("rsvp")
  ) {
    return { actionTab: "guests", actionLabel: "View Guest Pulse →" };
  }
  if (lower.includes("budget") || lower.includes("ledger") || lower.includes("treasury")) {
    return { actionTab: "budget", actionLabel: "Open Money River Ledger →" };
  }
  if (lower.includes("schedule") || lower.includes("delay") || lower.includes("timeline")) {
    return { actionTab: "dayof", actionLabel: "Day-Of Execution Mode →" };
  }
  return {};
}

/**
 * Handles incoming POST requests to /api/chat
 */
export async function handleChatRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = (await request.json()) as ChatRequestPayload;
    const userMessage = payload?.message?.trim();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "Message cannot be empty." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Resolve API Keys from client, headers, and server environment
    const clientKey = cleanApiKey(payload.apiKey);
    const headerKey = cleanApiKey(
      request.headers.get("x-groq-key") ||
        request.headers.get("x-openrouter-key") ||
        request.headers.get("x-gemini-key") ||
        request.headers.get("x-api-key") ||
        "",
    );
    const serverGroqKey = cleanApiKey(
      process.env["GROQ_API_KEY"] || process.env["VITE_GROQ_API_KEY"],
    );
    const serverOpenRouterKey = cleanApiKey(
      process.env["OPENROUTER_API_KEY"] || process.env["VITE_OPENROUTER_API_KEY"],
    );
    const serverGeminiKey = cleanApiKey(
      process.env["GEMINI_API_KEY"] || process.env["VITE_GEMINI_API_KEY"],
    );
    const serverOpenAIKey = cleanApiKey(
      process.env["OPENAI_API_KEY"] ||
        process.env["VITE_OPENAI_API_KEY"] ||
        request.headers.get("x-openai-key") ||
        "",
    );

    const effectiveKey = clientKey || headerKey;
    const providerHint = payload.provider || "auto";

    let apiError: string | null = null;

    // 1. GROQ CLOUD (100% Free, Llama 3.3 70B, Ultra Fast)
    const effectiveGroqKey =
      (effectiveKey?.startsWith("gsk_") ? effectiveKey : null) ||
      (providerHint === "groq" ? effectiveKey : null) ||
      serverGroqKey;

    if (effectiveGroqKey) {
      const groqResult = await callGroqChat(
        userMessage,
        payload.history || [],
        payload.eventContext,
        effectiveGroqKey,
      );
      if (groqResult.text) {
        return new Response(
          JSON.stringify({
            success: true,
            reply: groqResult.text,
            actionTab: groqResult.actionTab,
            actionLabel: groqResult.actionLabel,
            source: "groq-ai",
            model: "Meta LLaMA 3.3 70B (Free)",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (groqResult.error) {
        apiError = `Groq Error: ${groqResult.error}`;
      }
    }

    // 2. OPENROUTER (Free Open-Source Models)
    const effectiveOpenRouterKey =
      (effectiveKey?.startsWith("sk-or-") ? effectiveKey : null) ||
      (providerHint === "openrouter" ? effectiveKey : null) ||
      serverOpenRouterKey;

    if (effectiveOpenRouterKey) {
      const orResult = await callOpenRouterChat(
        userMessage,
        payload.history || [],
        payload.eventContext,
        effectiveOpenRouterKey,
      );
      if (orResult.text) {
        return new Response(
          JSON.stringify({
            success: true,
            reply: orResult.text,
            actionTab: orResult.actionTab,
            actionLabel: orResult.actionLabel,
            source: "openrouter-ai",
            model: "Llama 3.1 8B Free",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (orResult.error) {
        apiError = `OpenRouter Error: ${orResult.error}`;
      }
    }

    // 3. GOOGLE GEMINI
    const effectiveGeminiKey =
      (!effectiveKey?.startsWith("gsk_") &&
      !effectiveKey?.startsWith("sk-or-") &&
      !effectiveKey?.startsWith("sk-")
        ? effectiveKey
        : null) ||
      (providerHint === "gemini" ? effectiveKey : null) ||
      serverGeminiKey;

    if (effectiveGeminiKey) {
      const geminiResult = await callGeminiChat(
        userMessage,
        payload.history || [],
        payload.eventContext,
        effectiveGeminiKey,
      );
      if (geminiResult.text) {
        return new Response(
          JSON.stringify({
            success: true,
            reply: geminiResult.text,
            actionTab: geminiResult.actionTab,
            actionLabel: geminiResult.actionLabel,
            source: "gemini-ai",
            model: "Google Gemini 1.5",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (geminiResult.error) {
        apiError = `Gemini Error: ${geminiResult.error}`;
      }
    }

    // 4. OPENAI
    const effectiveOpenAIKey =
      (effectiveKey?.startsWith("sk-") && !effectiveKey?.startsWith("sk-or-")
        ? effectiveKey
        : null) ||
      (providerHint === "openai" ? effectiveKey : null) ||
      serverOpenAIKey;

    if (effectiveOpenAIKey) {
      const openAiReply = await callOpenAIChat(
        userMessage,
        payload.history || [],
        payload.eventContext,
        effectiveOpenAIKey,
      );
      if (openAiReply?.text) {
        const { actionTab, actionLabel } = extractActionTab(openAiReply.text);
        return new Response(
          JSON.stringify({
            success: true,
            reply: openAiReply.text,
            actionTab,
            actionLabel,
            source: "openai-ai",
            model: "GPT-4o Mini",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // 5. If user supplied an active key but the provider failed, return descriptive error
    if (apiError && effectiveKey) {
      return new Response(
        JSON.stringify({
          success: false,
          reply: `⚠️ AI Provider Notice: ${apiError}\n\nTip: You can get a 100% Free Groq Key with no credit card at https://console.groq.com/keys, or use Kindle's built-in event engine.`,
          error: apiError,
          source: "provider-error",
          hasApiKey: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // 6. Smart Contextual Event Assistant Engine (Zero Setup / Free / Fallback)
    const heuristicResponse = generateHeuristicReply(
      userMessage,
      payload.eventContext,
      Boolean(effectiveKey || serverGroqKey || serverGeminiKey),
    );

    return new Response(
      JSON.stringify({
        success: true,
        reply: heuristicResponse.text,
        actionTab: heuristicResponse.actionTab,
        actionLabel: heuristicResponse.actionLabel,
        source: "smart-heuristic",
        hasApiKey: Boolean(effectiveKey || serverGroqKey || serverGeminiKey),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal error processing chat request.",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * Dynamically discovers currently active chat models on the user's Groq account
 */
async function getGroqChatModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const data = (await res.json()) as { data?: Array<{ id: string }> };
      const allIds = data?.data?.map((m) => m.id) || [];
      const chatModels = allIds.filter(
        (id) => !id.includes("whisper") && !id.includes("safeguard") && !id.includes("guard"),
      );
      if (chatModels.length > 0) {
        // Prioritize powerful models like 70b, 8b, 3b, llama, etc.
        return chatModels.sort((a, b) => {
          if (a.includes("70b") || a.includes("versatile")) return -1;
          if (b.includes("70b") || b.includes("versatile")) return 1;
          return 0;
        });
      }
    }
  } catch (err) {
    console.warn("Dynamic Groq model lookup failed:", err);
  }

  // Fallback candidate list with diverse known models
  return [
    "llama-3.3-70b-versatile",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "llama-3.2-3b-preview",
    "llama-3.2-1b-preview",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];
}

/**
 * Invokes GROQ CLOUD API (100% Free, dynamically finds active models)
 */
async function callGroqChat(
  message: string,
  history: ChatMessageItem[],
  ctx?: ChatRequestPayload["eventContext"],
  apiKey?: string,
): Promise<{
  text?: string | undefined;
  actionTab?: string | undefined;
  actionLabel?: string | undefined;
  error?: string | undefined;
}> {
  if (!apiKey) return { error: "No Groq API key provided." };

  const eventSummary = ctx
    ? `
Event Type: ${ctx.eventType || "Wedding"}
Event Title: ${ctx.eventName || "Celebration"}
Location: ${ctx.eventCity || "India"}
Target Date: ${ctx.eventDate || "Upcoming"} (${ctx.daysRemaining || 30} days remaining)
Total Budget: INR ${ctx.totalBudget?.toLocaleString("en-IN") || "25,00,000"}
Committed So Far: INR ${ctx.totalCommitted?.toLocaleString("en-IN") || "0"}
Guest Count: ${ctx.guestCount || 300}
Culture / Tradition: ${ctx.activeCulture || "Indian"}
Dietary Breakdown: ${JSON.stringify(ctx.dietCounts || {})}
Current Active Dashboard Tab: ${ctx.activeTab || "overview"}
`
    : "Event planning consultation in progress.";

  const systemInstruction = `You are Kindle Assistant, an elite, warm, culturally knowledgeable Indian event management AI concierge.
You are helping the user plan their event with deep expertise in Indian weddings, milestone birthdays, community festivals, anniversaries, and family reunions.
Always refer to the user's specific event parameters provided below:
${eventSummary}

Guidelines:
- Be concise, direct, practical, and culturally authentic.
- When answering quotes or negotiations, provide ready-to-copy WhatsApp scripts or firm talking points.
- When answering rituals, explain timings (muhurat), samagri, and coordination steps.
- When answering budgets, give rupee-exact arithmetic.
- If relevant, mention which Kindle dashboard tab will help (e.g. 'Money River', 'Quote Cruncher', 'Murphy Mode', 'Guest Pulse', 'Time River').
- Keep responses within 2 to 4 crisp paragraphs maximum.`;

  const messages = [
    { role: "system", content: systemInstruction },
    ...history.slice(-4).map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  const models = await getGroqChatModels(apiKey);
  let lastErr = "";

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          const { actionTab, actionLabel } = extractActionTab(text);
          return { text, actionTab, actionLabel };
        }
      } else {
        const errText = await response.text();
        try {
          const parsed = JSON.parse(errText);
          lastErr = parsed?.error?.message || `Groq error ${response.status}`;
        } catch {
          lastErr = errText;
        }
      }
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }

  return { error: lastErr || "Failed to reach Groq Cloud API." };
}

/**
 * Invokes OpenRouter API with Free Tier Models
 */
async function callOpenRouterChat(
  message: string,
  history: ChatMessageItem[],
  ctx?: ChatRequestPayload["eventContext"],
  apiKey?: string,
): Promise<{
  text?: string | undefined;
  actionTab?: string | undefined;
  actionLabel?: string | undefined;
  error?: string | undefined;
}> {
  if (!apiKey) return { error: "No OpenRouter API key provided." };

  const systemInstruction = `You are Kindle Assistant, an elite Indian event management AI copilot. Event: ${ctx?.eventName || "Event"} in ${ctx?.eventCity || "India"}. Budget: INR ${ctx?.totalBudget || 2500000}. Guests: ${ctx?.guestCount || 300}. Be concise, practical, and culturally authentic.`;

  const messages = [
    { role: "system", content: systemInstruction },
    ...history.slice(-4).map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  // openrouter/free automatically selects from whichever free models are online
  const freeModels = [
    "openrouter/free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "meta-llama/llama-3.2-1b-instruct:free",
    "google/gemma-2-9b-it:free",
    "mistralai/mistral-7b-instruct:free",
  ];

  let lastErr = "";

  for (const model of freeModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://kindle-events.com",
          "X-Title": "Kindle Event Copilot",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          const { actionTab, actionLabel } = extractActionTab(text);
          return { text, actionTab, actionLabel };
        }
      } else {
        const errText = await response.text();
        try {
          const parsed = JSON.parse(errText);
          lastErr = parsed?.error?.message || `OpenRouter error ${response.status}`;
        } catch {
          lastErr = errText;
        }
      }
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
  }

  return { error: lastErr || "Failed to reach OpenRouter API." };
}

/**
 * Invokes Google Gemini API with multi-model fallback list
 */
async function callGeminiChat(
  message: string,
  history: ChatMessageItem[],
  ctx?: ChatRequestPayload["eventContext"],
  apiKey?: string,
): Promise<{
  text?: string | undefined;
  actionTab?: string | undefined;
  actionLabel?: string | undefined;
  error?: string | undefined;
}> {
  if (!apiKey) return { error: "No API key provided." };

  const eventSummary = ctx
    ? `
Event Type: ${ctx.eventType || "Wedding"}
Event Title: ${ctx.eventName || "Celebration"}
Location: ${ctx.eventCity || "India"}
Target Date: ${ctx.eventDate || "Upcoming"} (${ctx.daysRemaining || 30} days remaining)
Total Budget: INR ${ctx.totalBudget?.toLocaleString("en-IN") || "25,00,000"}
Committed So Far: INR ${ctx.totalCommitted?.toLocaleString("en-IN") || "0"}
Guest Count: ${ctx.guestCount || 300}
Culture / Tradition: ${ctx.activeCulture || "Indian"}
Dietary Breakdown: ${JSON.stringify(ctx.dietCounts || {})}
Current Active Dashboard Tab: ${ctx.activeTab || "overview"}
`
    : "Event planning consultation in progress.";

  const systemInstruction = `You are Kindle Assistant, an elite, warm, culturally knowledgeable Indian event management AI concierge.
You are helping the user plan their event with deep expertise in Indian weddings, milestone birthdays, community festivals, anniversaries, and family reunions.
Always refer to the user's specific event parameters provided below:
${eventSummary}

Guidelines:
- Be concise, direct, practical, and culturally authentic.
- When answering quotes or negotiations, provide ready-to-copy WhatsApp scripts or firm talking points.
- When answering rituals, explain timings (muhurat), samagri, and coordination steps.
- When answering budgets, give rupee-exact arithmetic.
- If relevant, mention which Kindle dashboard tab will help (e.g. 'Money River', 'Quote Cruncher', 'Murphy Mode', 'Guest Pulse', 'Time River').
- Keep responses within 2 to 4 crisp paragraphs maximum.`;

  const historyText = history
    .slice(-4)
    .map((h) => `${h.role === "user" ? "User" : "Kindle"}: ${h.content}`)
    .join("\n");

  const fullPrompt = `${systemInstruction}

${historyText ? `Recent conversation context:\n${historyText}\n` : ""}
User: ${message}
Kindle:`;

  const candidateModels = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-pro",
  ];

  let lastError = "";

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
        apiKey,
      )}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          const { actionTab, actionLabel } = extractActionTab(text);
          return { text, actionTab, actionLabel };
        }
      } else {
        const errorText = await response.text();
        try {
          const parsedError = JSON.parse(errorText);
          lastError = parsedError?.error?.message || `Google API status ${response.status}`;
        } catch {
          lastError = `Google API status ${response.status}: ${errorText.substring(0, 100)}`;
        }

        if (response.status === 400 && lastError.toLowerCase().includes("api key")) {
          return { error: `API Key rejected by Google: ${lastError}` };
        }
      }
    } catch (fetchErr) {
      lastError = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
    }
  }

  return { error: lastError || "Failed to reach Google Gemini API." };
}

/**
 * Invokes OpenAI API if OpenAI key is provided
 */
async function callOpenAIChat(
  message: string,
  history: ChatMessageItem[],
  ctx?: ChatRequestPayload["eventContext"],
  apiKey?: string,
): Promise<{ text: string } | null> {
  if (!apiKey) return null;

  const systemPrompt = `You are Kindle Assistant, an expert Indian event planning AI assistant. Help with budget, vendors, timeline, and emergencies for ${ctx?.eventName || "this event"} in ${ctx?.eventCity || "India"}. Total budget: INR ${ctx?.totalBudget || 2500000}, guests: ${ctx?.guestCount || 300}.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history
      .slice(-4)
      .map((h) => ({ role: h.role === "model" ? "assistant" : h.role, content: h.content })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) return null;

  return { text };
}

/**
 * Heuristic response generator when no API key is set yet or when running offline
 */
function generateHeuristicReply(
  query: string,
  ctx?: ChatRequestPayload["eventContext"],
  hasApiKey = false,
): { text: string; actionTab?: string; actionLabel?: string } {
  const lower = query.toLowerCase();
  const eventName = ctx?.eventName || "your event";
  const city = ctx?.eventCity || "Pune, Maharashtra";
  const budgetStr = ctx?.totalBudget ? `₹${ctx.totalBudget.toLocaleString("en-IN")}` : "₹25,00,000";
  const committedStr = ctx?.totalCommitted
    ? `₹${ctx.totalCommitted.toLocaleString("en-IN")}`
    : "₹9,80,000";
  const guests = ctx?.guestCount || 380;
  const jainCount = ctx?.dietCounts?.["Strict Jain"] || 24;
  const satvikCount = ctx?.dietCounts?.["Satvik (No Onion/Garlic)"] || 18;

  // Greetings
  if (
    lower.startsWith("hi") ||
    lower.startsWith("hello") ||
    lower.startsWith("namaste") ||
    lower.startsWith("hey") ||
    lower === "hi" ||
    lower === "hello"
  ) {
    return {
      text: `Namaste! I'm your Kindle AI Copilot for ${eventName}. We currently have ${guests} guests registered and an allocated budget of ${budgetStr} in ${city}.\n\nHow can I help you right now? You can ask me to draft vendor counter-offers, review emergency backup plans, check dietary buffer counts, or re-balance ceremony timelines.`,
      actionTab: "overview",
      actionLabel: "View Event Overview →",
    };
  }

  // Negotiations & Quotes
  if (
    lower.includes("negotiate") ||
    lower.includes("caterer") ||
    lower.includes("quote") ||
    lower.includes("vendor")
  ) {
    return {
      text: `For ${eventName}, our Quote Cruncher detected unquoted 18% GST and 7% banquet service fees across raw caterer bids. Proposed counter-strategy: Offer a firm all-inclusive rate with an immediate 25% token advance in exchange for locking live chaat counters and complimentary welcome mocktails.`,
      actionTab: "quotes",
      actionLabel: "Open Quote Cruncher →",
    };
  }

  // Sound Curfew & Police / Murphy
  if (
    lower.includes("curfew") ||
    lower.includes("sound") ||
    lower.includes("noise") ||
    lower.includes("police")
  ) {
    return {
      text: `For outdoor venues, local municipal guidelines enforce sound curfews at 10:00 PM. Our pre-costed Murphy Card #3 has 150 wireless Silent Disco headphones on standby, or an instant transition to an indoor acoustic banquet hall.`,
      actionTab: "murphy",
      actionLabel: "Review Murphy Shield Card →",
    };
  }

  // Dietary & Food Buffers
  if (
    lower.includes("jain") ||
    lower.includes("diet") ||
    lower.includes("satvik") ||
    lower.includes("plate")
  ) {
    return {
      text: `You currently have ${jainCount} Strict Jain and ${satvikCount} Satvik guests registered for ${eventName}. We recommend a separate 15-plate hot tawa buffer and clearly marked segregated buffet bays to prevent kitchen cross-contamination.`,
      actionTab: "guests",
      actionLabel: "Inspect Dietary Breakdown →",
    };
  }

  // Delays & Timeline Cascades
  if (
    lower.includes("late") ||
    lower.includes("delay") ||
    lower.includes("schedule") ||
    lower.includes("cascade")
  ) {
    return {
      text: `If you are running behind schedule, tapping 'Running 20 Min Late' in Day-Of Execution Mode will automatically recompute all downstream rituals and generate one-click WhatsApp broadcast alerts for your priest, decorator, and DJ.`,
      actionTab: "dayof",
      actionLabel: "Open Day-Of Execution Mode →",
    };
  }

  // Budget & Spend
  if (
    lower.includes("budget") ||
    lower.includes("spent") ||
    lower.includes("cost") ||
    lower.includes("money")
  ) {
    return {
      text: `For ${eventName}, your committed total is ${committedStr} out of ${budgetStr} across your 12 budget categories. All allocations are tracked rupee-exact with zero discrepancy.`,
      actionTab: "budget",
      actionLabel: "View Money River Ledger →",
    };
  }

  // Decor & Theme
  if (
    lower.includes("decor") ||
    lower.includes("mandap") ||
    lower.includes("flower") ||
    lower.includes("stage") ||
    lower.includes("theme")
  ) {
    return {
      text: `For ${eventName} in ${city}, we recommend coordinating royal marigold and tuberoses with warm fairy light canopies for evening ceremonies. Mandap structures should be contracted at least 4 weeks prior to ensure truss availability.`,
      actionTab: "venue",
      actionLabel: "Open Virtual Venue →",
    };
  }

  // Photo / Video
  if (
    lower.includes("photo") ||
    lower.includes("video") ||
    lower.includes("camera") ||
    lower.includes("reel")
  ) {
    return {
      text: `Top wedding cinematographers in ${city} require booking 3 to 6 months in advance. Ensure your package includes 2 candid photographers, 1 traditional videographer, and drone coverage clearances.`,
      actionTab: "decisions",
      actionLabel: "Review Key Decisions →",
    };
  }

  // Seating & Guests
  if (
    lower.includes("seat") ||
    lower.includes("table") ||
    lower.includes("rsvp") ||
    lower.includes("guest") ||
    lower.includes("family")
  ) {
    return {
      text: `In the Guest Pulse tab, you can assign tables and manage seating harmony scores to avoid awkward seating proximities between estranged family members.`,
      actionTab: "guests",
      actionLabel: "Open Seating & Guest Pulse →",
    };
  }

  const tipText = hasApiKey
    ? `I am synced with all parameters for ${eventName}. Ask me anything about your timeline, vendor pricing, or emergency contingencies!`
    : `Tip: To enable full generative conversational AI on any custom topic, add a free Groq API Key (gsk_...) or Google Gemini key in the AI Settings header.`;

  return {
    text: `I'm analyzing ${eventName} (${guests} guests, ${budgetStr} budget in ${city}). You can ask me to draft vendor counter-offers, review emergency backup plans, check dietary buffer counts, or re-balance your budget.\n\n${tipText}`,
    actionTab: "simulator",
    actionLabel: "Run What-If Simulator →",
  };
}
