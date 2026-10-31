import type { EventPresetBundle } from "../components/dashboard/event-presets-data";
import { generatePersonalizedPlan, type ExtendedEventPlanConfig } from "../lib/ai-planner";

export { generatePersonalizedPlan, type ExtendedEventPlanConfig };

/**
 * Server endpoint handler for /api/generate-plan
 */
export async function handleGeneratePlanRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const config = (await request.json()) as ExtendedEventPlanConfig;

    if (!config || !config.eventType) {
      return new Response(JSON.stringify({ error: "Missing required configuration fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if external Gemini API key is present
    const geminiApiKey = process.env["GEMINI_API_KEY"] || process.env["VITE_GEMINI_API_KEY"];

    if (geminiApiKey) {
      try {
        const aiResponse = await callGeminiModel(config, geminiApiKey);
        if (aiResponse) {
          return new Response(
            JSON.stringify({ success: true, plan: aiResponse, source: "gemini-ai" }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      } catch (geminiError) {
        console.warn(
          "External Gemini API call failed, gracefully using neural heuristic synthesis engine:",
          geminiError,
        );
      }
    }

    // Neural Heuristics Plan Synthesis
    const synthesizedPlan = generatePersonalizedPlan(config);

    return new Response(
      JSON.stringify({ success: true, plan: synthesizedPlan, source: "neural-synthesizer" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("AI Planner generation failed:", error);
    return new Response(
      JSON.stringify({
        error: "Internal error during plan synthesis",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * Optional helper to query Google Gemini if GEMINI_API_KEY is supplied
 */
async function callGeminiModel(
  config: ExtendedEventPlanConfig,
  apiKey: string,
): Promise<EventPresetBundle | null> {
  const prompt = `You are an elite AI Event Planner. Based on the following event specification, synthesize a customized plan payload:
Event Type: ${config.eventType}
Title: ${config.title}
City: ${config.city}
Date: ${config.date}
Guest Count: ${config.guestCount}
Budget: INR ${config.totalBudget}
Priorities: ${config.priorities?.join(", ") || "Catering, Venue, Photo"}
Specific details: ${JSON.stringify(config.wedding || config.birthday || config.community || config.anniversary || config.reunion || {})}

Return a valid JSON object matching our EventPresetBundle format.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(text) as EventPresetBundle;
    if (parsed.categories && parsed.decisions && parsed.milestones) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}
