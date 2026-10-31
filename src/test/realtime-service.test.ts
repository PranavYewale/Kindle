import { describe, it, expect } from "vitest";
import { getLocalRealtimeAudit } from "../lib/realtime-service";
import { handleRealtimeAuditRequest } from "../server/realtime-audit-service";

describe("Real-Time Audit Service (/api/realtime-audit)", () => {
  it("computes dynamic delay penalty and hours remaining in getLocalRealtimeAudit", () => {
    const audit = getLocalRealtimeAudit({
      decisionId: "d1",
      decisionTitle: "Heritage Palace Lawn Hold",
      category: "Venue & Lawns",
      eventCity: "Pune, Maharashtra",
      penaltyPerDay: 5000,
      urgencyDays: 2,
    });

    expect(audit.decisionId).toBe("d1");
    expect(audit.hoursUntilExpiry).toBeGreaterThan(0);
    expect(audit.marketDemandStatus).toBe("PEAK_CRITICAL");
    expect(audit.consequencesIfIgnored.financial).toContain("Saturday hold token");
    expect(audit.consequencesIfIgnored.operational).toContain("stage fabrication");
    expect(audit.consequencesIfIgnored.vendorQuality).toContain("sound cutoffs");
  });

  it("customizes real-time consequence analysis for catering decisions", () => {
    const audit = getLocalRealtimeAudit({
      decisionId: "d2",
      decisionTitle: "Royal Rajasthani & Continental Banquet Tasting",
      category: "Catering & Banquets",
      eventCity: "Jaipur, Rajasthan",
      penaltyPerDay: 4000,
      urgencyDays: 3,
    });

    expect(audit.marketDemandStatus).toBe("HIGH");
    expect(audit.cityDemandHeadline).toContain("Jaipur");
    expect(audit.consequencesIfIgnored.financial).toContain("ingredient price escalation");
  });

  it("rejects non-POST requests with 405 Method Not Allowed", async () => {
    const req = new Request("http://localhost:3000/api/realtime-audit", { method: "GET" });
    const res = await handleRealtimeAuditRequest(req);
    expect(res.status).toBe(405);
  });

  it("rejects missing decisionTitle with 400 Bad Request", async () => {
    const req = new Request("http://localhost:3000/api/realtime-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "Venue" }),
    });
    const res = await handleRealtimeAuditRequest(req);
    expect(res.status).toBe(400);
  });

  it("returns real-time audit payload successfully on valid request", async () => {
    const req = new Request("http://localhost:3000/api/realtime-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decisionId: "d1",
        decisionTitle: "Grand Ballroom Booking",
        category: "Venue",
        eventCity: "Mumbai",
        urgencyDays: 2,
        penaltyPerDay: 6000,
      }),
    });
    const res = await handleRealtimeAuditRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.marketDemandStatus).toBeDefined();
    expect(data.consequencesIfIgnored).toBeDefined();
    expect(data.consequencesIfIgnored.financial).toBeDefined();
    expect(data.hoursUntilExpiry).toBeGreaterThan(0);
  });
});
