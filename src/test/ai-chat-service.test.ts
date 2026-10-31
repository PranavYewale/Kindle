import { describe, it, expect } from "vitest";
import { handleChatRequest, cleanApiKey, detectProvider } from "../server/ai-chat-service";

describe("AI Chat Service (/api/chat)", () => {
  it("cleans quotes and common environment prefixes from api keys", () => {
    expect(cleanApiKey('"AIzaSy12345"')).toBe("AIzaSy12345");
    expect(cleanApiKey("'AIzaSy12345'")).toBe("AIzaSy12345");
    expect(cleanApiKey("GEMINI_API_KEY=AIzaSy12345")).toBe("AIzaSy12345");
    expect(cleanApiKey("GROQ_API_KEY=gsk_12345")).toBe("gsk_12345");
    expect(cleanApiKey("OPENROUTER_API_KEY=sk-or-v1-12345")).toBe("sk-or-v1-12345");
    expect(cleanApiKey("Bearer sk-12345")).toBe("sk-12345");
  });

  it("accurately detects free and paid AI providers from key prefixes", () => {
    expect(detectProvider("gsk_test_1234567890")).toBe("groq");
    expect(detectProvider("sk-or-v1-test-key")).toBe("openrouter");
    expect(detectProvider("AIzaSyTest123456789")).toBe("gemini");
    expect(detectProvider("sk-proj-test123456789")).toBe("openai");
    expect(detectProvider("")).toBe("none");
  });

  it("answers natural greetings without repeating the tip loop", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hello, how can you help me?",
        eventContext: { eventName: "Aarav & Meera's Wedding", guestCount: 350 },
      }),
    });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain("Namaste");
    expect(data.reply).toContain("Kindle AI Copilot");
  });

  it("rejects non-POST requests with 405 Method Not Allowed", async () => {
    const req = new Request("http://localhost:3000/api/chat", { method: "GET" });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(405);
  });

  it("rejects empty message with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "   " }),
    });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(400);
  });

  it("generates contextual budget responses based on event parameters", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What is my total budget and committed spend?",
        eventContext: {
          eventName: "Aarav & Meera's Wedding",
          totalBudget: 4850000,
          totalCommitted: 3120000,
        },
      }),
    });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reply).toContain("31,20,000");
    expect(data.actionTab).toBe("budget");
  });

  it("calculates dietary plate buffer for Jain and Satvik guests", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "How many Jain and Satvik plates do we have?",
        eventContext: {
          dietCounts: {
            "Strict Jain": 42,
            "Satvik (No Onion/Garlic)": 18,
          },
        },
      }),
    });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reply).toContain("42 Strict Jain");
    expect(data.reply).toContain("18 Satvik");
    expect(data.actionTab).toBe("guests");
  });

  it("provides Murphy sound curfew mitigation on curfew inquiries", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What is the plan if police enforce the 10 PM sound curfew?",
      }),
    });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reply).toContain("Murphy Card #3");
    expect(data.reply).toContain("Silent Disco");
    expect(data.actionTab).toBe("murphy");
  });

  it("provides day-of cascade delay guidance when delayed", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "We are running 20 minutes late with the procession.",
      }),
    });
    const res = await handleChatRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reply).toContain("Day-Of Execution Mode");
    expect(data.actionTab).toBe("dayof");
  });
});
