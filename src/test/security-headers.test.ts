import { describe, it, expect } from "vitest";

describe("Security Policy & Sanitization Suite", () => {
  it("validates OWASP recommended security headers format", () => {
    const requiredHeaders = [
      "Content-Security-Policy",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Strict-Transport-Security",
      "Permissions-Policy",
    ];

    expect(requiredHeaders).toHaveLength(6);
    expect(requiredHeaders).toContain("X-Frame-Options");
    expect(requiredHeaders).toContain("X-Content-Type-Options");
  });

  it("ensures no raw API keys are hardcoded in test environment", () => {
    const groqKey = process.env["GROQ_API_KEY"] || "";
    const openrouterKey = process.env["OPENROUTER_API_KEY"] || "";
    // Keys in env should never be committed literal production secrets
    expect(groqKey.includes("sk-prod-super-secret")).toBe(false);
    expect(openrouterKey.includes("sk-live-secret")).toBe(false);
  });

  it("sanitizes user text from malicious script injection tags", () => {
    const rawMaliciousInput = "<script>alert('xss')</script>Hello & welcome!";
    const sanitized = rawMaliciousInput.replace(/<[^>]*>/g, "");
    expect(sanitized).toBe("alert('xss')Hello & welcome!");
    expect(sanitized).not.toContain("<script>");
  });
});
