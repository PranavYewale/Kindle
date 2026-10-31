import { describe, expect, it } from "vitest";
import { handleSendEmailRequest } from "@/server/email-service";

describe("Email Service & Security Guardrails", () => {
  it("rejects non-POST HTTP methods with 405 Method Not Allowed", async () => {
    const request = new Request("http://localhost/api/send-email", {
      method: "GET",
    });

    const response = await handleSendEmailRequest(request);
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.error).toContain("Method not allowed");
  });

  it("rejects requests missing Gmail SMTP credentials with 400", async () => {
    const request = new Request("http://localhost/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "guest@example.com",
        subject: "Invitation",
        text: "Please join us",
      }),
    });

    const response = await handleSendEmailRequest(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Gmail SMTP credentials missing");
  });

  it("rejects invalid or malformed recipient email addresses with 400", async () => {
    const request = new Request("http://localhost/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "invalid-email-address",
        subject: "Invitation",
        text: "Please join us",
        smtp: {
          user: "host@gmail.com",
          pass: "abcdefghijklmnop",
        },
      }),
    });

    const response = await handleSendEmailRequest(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Invalid recipient email format");
  });

  it("rejects malformed JSON payload with 400", async () => {
    const request = new Request("http://localhost/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "this is not valid json",
    });

    const response = await handleSendEmailRequest(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Malformed JSON payload");
  });

  it("rejects missing recipient email address with 400", async () => {
    const request = new Request("http://localhost/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Invitation",
        text: "Please join us",
        smtp: {
          user: "host@gmail.com",
          pass: "abcdefghijklmnop",
        },
      }),
    });

    const response = await handleSendEmailRequest(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Recipient email address is required");
  });
});
