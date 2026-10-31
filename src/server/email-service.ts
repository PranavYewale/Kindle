import nodemailer from "nodemailer";

// Strict email regex validation (RFC 5322 compliant subset)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Sanitizes headers to prevent SMTP header injection attacks (CR/LF injection)
 */
function sanitizeHeader(input: string, maxLength = 250): string {
  return input
    .replace(/[\r\n\t]/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes sensitive credentials from error messages to prevent leakage
 */
function sanitizeErrorMessage(msg: string, secret?: string): string {
  let cleaned = msg;
  if (secret && secret.length >= 4) {
    cleaned = cleaned.replaceAll(secret, "********");
  }
  return cleaned;
}

export async function handleSendEmailRequest(request: Request): Promise<Response> {
  // 1. Method verification
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 2. Parse request body safely
    let body: {
      to?: string;
      subject?: string;
      text?: string;
      html?: string;
      smtp?: {
        user?: string;
        pass?: string;
        fromName?: string;
      };
      attachments?: Array<{
        filename?: string;
        content?: string;
        encoding?: string;
        contentType?: string;
      }>;
    };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return new Response(JSON.stringify({ error: "Malformed JSON payload." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { to, subject, text, html, smtp, attachments } = body;

    const rawUser = smtp?.user || process.env["GMAIL_USER"] || "";
    const rawPass = (smtp?.pass || process.env["GMAIL_APP_PASSWORD"] || "").replace(/\s+/g, "");
    const rawFromName = smtp?.fromName || "Kindle Event Host";

    // 3. Validation & sanitization
    if (!rawUser || !rawPass) {
      return new Response(
        JSON.stringify({
          error:
            "Gmail SMTP credentials missing. Please provide your Gmail address and 16-character App Password.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!to || typeof to !== "string") {
      return new Response(JSON.stringify({ error: "Recipient email address is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleanTo = sanitizeHeader(to.trim());
    if (!EMAIL_REGEX.test(cleanTo)) {
      return new Response(JSON.stringify({ error: `Invalid recipient email format: ${cleanTo}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleanUser = sanitizeHeader(rawUser.trim());
    if (!EMAIL_REGEX.test(cleanUser)) {
      return new Response(
        JSON.stringify({ error: `Invalid sender Gmail address format: ${cleanUser}` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const cleanSubject = sanitizeHeader(subject || "Event Invitation", 150);
    const cleanFromName = sanitizeHeader(rawFromName, 80);

    // Payload size guardrails
    const safeText = (text || "").slice(0, 50000);
    const safeHtml = (html || "").slice(0, 100000);

    // Clean attachments if provided (e.g. uploaded invitation PDF)
    const cleanAttachments = Array.isArray(attachments)
      ? attachments
          .filter((att) => att && typeof att.content === "string")
          .map((att) => ({
            filename: sanitizeHeader(att.filename || "Event_Invitation.pdf", 100),
            content: att.content as string,
            encoding: (att.encoding as "base64" | undefined) || "base64",
            contentType: att.contentType || "application/pdf",
          }))
      : undefined;

    // 4. Configure Nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL port 465 for Gmail
      auth: {
        user: cleanUser,
        pass: rawPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
    });

    // 5. Anti-Spam compliant headers & clean dispatch
    const info = await transporter.sendMail({
      from: `"${cleanFromName}" <${cleanUser}>`,
      replyTo: `"${cleanFromName}" <${cleanUser}>`,
      to: cleanTo,
      subject: cleanSubject,
      text: safeText,
      html:
        safeHtml ||
        `<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">${safeText.replace(/\n/g, "<br/>")}</div>`,
      headers: {
        "X-Mailer": "Kindle Private Invitation Mailer",
        Precedence: "personal",
        "Auto-Submitted": "no",
      },
      attachments: cleanAttachments,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        envelope: info.envelope,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : String(err);
    const sanitizedMsg = sanitizeErrorMessage(rawMsg);
    console.error("Failed to dispatch email via Gmail SMTP:", sanitizedMsg);

    return new Response(
      JSON.stringify({
        error: sanitizedMsg || "Failed to dispatch email via Gmail SMTP.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
