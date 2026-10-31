import {
  RealtimeAuditRequest,
  RealtimeAuditResult,
  getLocalRealtimeAudit,
} from "../lib/realtime-service";

export async function handleRealtimeAuditRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = (await request.json()) as RealtimeAuditRequest;
    if (!payload?.decisionTitle) {
      return new Response(JSON.stringify({ error: "decisionTitle is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const headerKey = request.headers.get("x-gemini-key") || request.headers.get("x-api-key");
    const clientKey = payload.apiKey?.trim();
    const serverKey = process.env["GEMINI_API_KEY"] || process.env["VITE_GEMINI_API_KEY"];
    const effectiveKey = clientKey || headerKey || serverKey;

    if (effectiveKey && !effectiveKey.startsWith("sk-")) {
      try {
        const geminiResult = await callGeminiForAudit(payload, effectiveKey);
        if (geminiResult) {
          return new Response(JSON.stringify({ success: true, ...geminiResult }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (geminiError) {
        console.warn("Gemini realtime audit failed, falling back to local telemetry:", geminiError);
      }
    }

    // Heuristic real-time telemetry fallback
    const localResult = getLocalRealtimeAudit(payload);
    return new Response(JSON.stringify({ success: true, ...localResult }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to perform real-time audit" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function callGeminiForAudit(
  req: RealtimeAuditRequest,
  apiKey: string,
): Promise<RealtimeAuditResult | null> {
  const prompt = `You are an expert Indian event logistics auditor and market intelligence engine.
Analyze the following pending event decision and generate a real-time consequence & delay analysis:
- Decision: "${req.decisionTitle}"
- Category: "${req.category}"
- City: "${req.eventCity || "Pune, India"}"
- Event Type: "${req.eventType || "Wedding"}"
- Cost of Delay Score: ${req.costOfDelay || 90}/100
- Daily Penalty: ₹${req.penaltyPerDay || 4500}
- Urgency: ${req.urgencyDays || 2} days left until price lock expires.

Return ONLY a valid JSON object matching this exact schema:
{
  "marketDemandStatus": "PEAK_CRITICAL" | "HIGH" | "ELEVATED" | "STABLE",
  "cityDemandHeadline": "One punchy sentence describing current market condition and demand in this city",
  "hoursUntilExpiry": number (between 12 and 48),
  "accruedDelayCost": number (e.g. 15000),
  "dailyPenalty": number,
  "consequencesIfIgnored": {
    "financial": "Specific monetary loss, percentage price hike (+12-18%), or forfeit token",
    "operational": "Specific downstream milestones that freeze or break",
    "vendorQuality": "Specific quality degradation or sub-par backup vendor risk"
  },
  "recommendedAction": "Concrete immediate step to lock and save cost"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      apiKey,
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) return null;

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const parsed = JSON.parse(rawText);
  return {
    decisionId: req.decisionId,
    marketDemandStatus: parsed.marketDemandStatus || "PEAK_CRITICAL",
    cityDemandHeadline: parsed.cityDemandHeadline || `High demand in ${req.eventCity}`,
    hoursUntilExpiry: parsed.hoursUntilExpiry || 36,
    accruedDelayCost: parsed.accruedDelayCost || (req.penaltyPerDay || 4500) * 2,
    dailyPenalty: parsed.dailyPenalty || req.penaltyPerDay || 4500,
    consequencesIfIgnored: {
      financial: parsed.consequencesIfIgnored?.financial || "Contract price hike",
      operational: parsed.consequencesIfIgnored?.operational || "Milestone delays",
      vendorQuality: parsed.consequencesIfIgnored?.vendorQuality || "Secondary backup risk",
    },
    recommendedAction: parsed.recommendedAction || "Lock decision now to avoid price spike.",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    source: "gemini-ai",
  };
}
