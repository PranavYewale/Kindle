import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDashboard, eventThemes } from "./dashboard-context";
import {
  Mail,
  Send,
  Paperclip,
  Check,
  Share2,
  Sparkles,
  UploadCloud,
  X,
  MessageSquare,
  Calendar,
  MapPin,
  Heart,
  Cake,
  Building2,
  PartyPopper,
  FileCheck,
  Trash2,
  Settings,
  Key,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GuestInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGuestId?: string | null;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function GuestInvitationModal({
  isOpen,
  onClose,
  targetGuestId,
}: GuestInvitationModalProps) {
  const { eventName, eventType, eventCity, eventDate, guests, venueZones, lang } = useDashboard();

  const [mounted, setMounted] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string>(
    targetGuestId || (guests[0]?.id ?? ""),
  );
  const [inviteMode, setInviteMode] = useState<"default" | "custom_pdf">("default");
  const [attachedPdf, setAttachedPdf] = useState<{
    name: string;
    size: string;
    base64?: string | undefined;
    type?: string | undefined;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [customNote, setCustomNote] = useState("");

  // Gmail SMTP Key & Configuration state
  const [gmailUser, setGmailUser] = useState("");
  const [gmailPass, setGmailPass] = useState("");
  const [senderName, setSenderName] = useState(eventName);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [savedSmtpNotice, setSavedSmtpNotice] = useState(false);

  // Email sending state
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    // Load persisted SMTP credentials from localStorage if present
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("kindle_gmail_user") || "";
      const storedPass = localStorage.getItem("kindle_gmail_pass") || "";
      const storedName = localStorage.getItem("kindle_sender_name") || eventName;
      if (storedUser) setGmailUser(storedUser);
      if (storedPass) setGmailPass(storedPass);
      if (storedName) setSenderName(storedName);
      if (!storedUser || !storedPass) {
        // Automatically reveal SMTP config if not configured yet
        setShowSmtpConfig(true);
      }
    }
  }, [eventName]);

  const defaultGuest = guests[0] ?? {
    id: "g-default",
    name: "Esteemed Guest",
    diet: "Regular",
    group: "Friends & Family",
    rsvp: "Pending" as const,
    tableId: "",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98200 00000",
  };
  const currentGuest = guests.find((g) => g.id === selectedGuestId) ?? defaultGuest;
  const assignedTable = venueZones.find((z) => z.id === currentGuest.tableId);

  useEffect(() => {
    if (targetGuestId) {
      setSelectedGuestId(targetGuestId);
    } else if (guests.length > 0 && guests[0] && !selectedGuestId) {
      setSelectedGuestId(guests[0].id);
    }
  }, [targetGuestId, guests, selectedGuestId]);

  // Update default recipient email when selected guest changes
  useEffect(() => {
    if (currentGuest) {
      const cleanName = currentGuest.name.toLowerCase().replace(/[^a-z0-9]/g, ".");
      setRecipientEmail(`${cleanName}@gmail.com`);
      setEmailStatus("idle");
      setEmailMessage("");
    }
  }, [selectedGuestId, currentGuest]);

  if (!mounted || !isOpen) return null;

  const fallbackTheme = eventThemes["Wedding"]!;
  const activeTheme = eventThemes[eventType] ?? fallbackTheme;

  const handleSaveSmtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("kindle_gmail_user", gmailUser.trim());
      localStorage.setItem("kindle_gmail_pass", gmailPass.trim());
      localStorage.setItem("kindle_sender_name", senderName.trim());
      setSavedSmtpNotice(true);
      setTimeout(() => setSavedSmtpNotice(false), 2500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.includes(",") ? result.split(",")[1] : result;
        setAttachedPdf({
          name: file.name,
          size: `${sizeMb} MB`,
          base64: base64Data,
          type: file.type || "application/pdf",
        });
        setInviteMode("custom_pdf");
      };
      reader.readAsDataURL(file);
    }
  };

  const getPersonalizedInviteText = () => {
    if (!currentGuest) return "";
    const gName = currentGuest.name;
    const gDiet = currentGuest.diet;
    const tableInfo = assignedTable ? ` (Reserved: ${assignedTable.name})` : "";
    const pdfNote = attachedPdf
      ? `\n📎 Official Invitation Card Attached: ${attachedPdf.name}`
      : "";

    return [
      `🙏 Namaste ${gName}!`,
      ``,
      `You are most cordially invited to celebrate with us at:`,
      `👑 ${eventName.toUpperCase()}`,
      `"${activeTheme.quote}"`,
      ``,
      `📅 Date: ${eventDate}`,
      `📍 Location: ${eventCity}${tableInfo}`,
      `🍽️ Your Reserved Catering Preference: ${gDiet}`,
      customNote ? `\n💬 Personal Note: ${customNote}` : "",
      pdfNote,
      ``,
      `To confirm your RSVP, simply reply directly to this email or send us a message.`,
      ``,
      `With warm regards,`,
      `The Family of ${eventName}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const inviteText = getPersonalizedInviteText();

  // Send real email via backend Gmail SMTP API
  const handleRealEmailSend = async () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      setEmailStatus("error");
      setEmailMessage("Please enter a valid guest recipient email address.");
      return;
    }

    if (!gmailUser || !gmailPass) {
      setShowSmtpConfig(true);
      setEmailStatus("error");
      setEmailMessage("Please enter your Gmail address and 16-character App Password below first.");
      return;
    }

    // Save credentials to localStorage
    handleSaveSmtp();

    setEmailStatus("sending");
    setEmailMessage("Connecting to Gmail SMTP and dispatching email...");

    const htmlContent = `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0b0a0f;margin:0;padding:36px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:580px;background-color:#15131c;border:1px solid #2e283b;border-radius:26px;overflow:hidden;box-shadow:0 16px 50px rgba(0,0,0,0.7);">
              <!-- Top Visual Header Image -->
              <tr>
                <td style="padding:0;line-height:0;">
                  <img src="${activeTheme.bgImage}" alt="${escapeHtml(eventName)}" width="580" style="width:100%;max-height:220px;object-fit:cover;display:block;border-bottom:1px solid #2e283b;filter:brightness(0.55);" />
                </td>
              </tr>

              <!-- Main Card Body -->
              <tr>
                <td style="padding:32px 28px 36px 28px;text-align:center;">
                  
                  <!-- Event Pill Badge -->
                  <div style="display:inline-block;background-color:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:50px;padding:6px 20px;font-size:11px;font-weight:700;letter-spacing:2px;color:#f8fafc;text-transform:uppercase;">
                    ❤️ ${escapeHtml(activeTheme.label)}
                  </div>

                  <!-- Auspicious Gold Serif Lead-in -->
                  <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#f59e0b;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;font-weight:600;margin:18px 0 8px 0;">
                    CORDIALLY REQUEST THE PLEASURE OF YOUR COMPANY
                  </p>

                  <!-- Event Title -->
                  <h1 style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;margin:0 0 8px 0;line-height:1.2;">
                    ${escapeHtml(eventName)}
                  </h1>

                  <!-- Subtitle Quote -->
                  <p style="font-size:13px;color:#94a3b8;margin:0 0 24px 0;line-height:1.5;">
                    ${escapeHtml(activeTheme.quote)}
                  </p>

                  <!-- Guest Spotlight Box -->
                  <div style="background-color:#1e1a27;border:1px solid #373047;border-radius:20px;padding:22px 20px;text-align:center;margin:0 auto 24px auto;">
                    <p style="font-size:10px;font-family:monospace;letter-spacing:2px;color:#fbbf24;text-transform:uppercase;font-weight:bold;margin:0 0 6px 0;">
                      SPECIALLY CURATED FOR
                    </p>
                    <h2 style="font-size:24px;font-weight:800;color:#ffffff;margin:0 0 12px 0;">
                      ${escapeHtml(currentGuest.name)}
                    </h2>
                    <div style="text-align:center;">
                      <span style="display:inline-block;background-color:#131118;border:1px solid #3c344d;border-radius:50px;padding:6px 16px;font-size:12px;font-weight:600;color:#e2e8f0;margin:3px;">
                        🍽️ ${escapeHtml(currentGuest.diet)} Diet Reserved
                      </span>
                      ${assignedTable ? `<span style="display:inline-block;background-color:#131118;border:1px solid #3c344d;border-radius:50px;padding:6px 16px;font-size:12px;font-weight:600;color:#f59e0b;margin:3px;">🪑 Table: ${escapeHtml(assignedTable.name)}</span>` : ""}
                    </div>
                  </div>

                  <!-- Date & Venue Dual Box Grid -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 auto 24px auto;">
                    <tr>
                      <td width="50%" style="padding-right:8px;vertical-align:top;">
                        <div style="background-color:#1c1925;border:1px solid #2e283b;border-radius:16px;padding:14px 16px;text-align:left;">
                          <span style="font-size:10px;font-weight:bold;color:#ea580c;text-transform:uppercase;letter-spacing:1px;display:block;">
                            📅 DATE
                          </span>
                          <p style="margin:4px 0 0 0;font-size:14px;font-weight:bold;color:#ffffff;">
                            ${escapeHtml(eventDate)}
                          </p>
                        </div>
                      </td>
                      <td width="50%" style="padding-left:8px;vertical-align:top;">
                        <div style="background-color:#1c1925;border:1px solid #2e283b;border-radius:16px;padding:14px 16px;text-align:left;">
                          <span style="font-size:10px;font-weight:bold;color:#ea580c;text-transform:uppercase;letter-spacing:1px;display:block;">
                            📍 CITY / VENUE
                          </span>
                          <p style="margin:4px 0 0 0;font-size:14px;font-weight:bold;color:#ffffff;">
                            ${escapeHtml(eventCity)}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Optional Personal Message Note -->
                  ${
                    customNote
                      ? `
                    <div style="background-color:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:14px;padding:16px;margin:0 auto 24px auto;text-align:left;color:#fbbf24;font-size:13px;line-height:1.5;">
                      <strong style="display:block;margin-bottom:4px;text-transform:uppercase;font-size:10px;letter-spacing:1px;color:#f59e0b;">Personal Note:</strong>
                      ${escapeHtml(customNote)}
                    </div>
                  `
                      : ""
                  }

                  <!-- Attached PDF Callout -->
                  ${
                    attachedPdf
                      ? `
                    <div style="background-color:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:14px;padding:14px 18px;margin:0 auto 24px auto;text-align:center;color:#93c5fd;font-size:12px;font-weight:600;">
                      📎 <strong>${escapeHtml(attachedPdf.name)}</strong> is attached directly to this email
                    </div>
                  `
                      : ""
                  }

                  <!-- Anti-Spam RSVP Reply Action Button -->
                  <div style="padding:10px 0 12px 0;">
                    <a href="mailto:${gmailUser}?subject=RSVP%20Confirmation%20for%20${encodeURIComponent(eventName)}&body=Dear%20${encodeURIComponent(senderName || eventName)}%2C%0A%0AI%20am%20delighted%20to%20confirm%20my%20attendance%20for%20${encodeURIComponent(currentGuest.name)}!%0A%0ALooking%20forward%20to%20celebrating%20together." style="display:inline-block;background-color:#ea580c;color:#ffffff;padding:15px 36px;border-radius:14px;font-weight:700;font-size:14px;text-decoration:none;box-shadow:0 4px 18px rgba(234,88,12,0.4);letter-spacing:0.3px;">
                      ✨ Reply to Confirm Your RSVP
                    </a>
                  </div>

                  <p style="margin:8px 0 0 0;font-size:12px;color:#64748b;">
                    Or simply reply directly to this email to confirm your presence.
                  </p>
                </td>
              </tr>

              <!-- Card Footer -->
              <tr>
                <td style="background-color:#0f0e14;border-top:1px solid #231f2c;padding:18px 24px;text-align:center;font-size:11px;color:#64748b;line-height:1.5;">
                  Personal Invitation sent by <strong>${escapeHtml(senderName || eventName)}</strong> (&lt;${gmailUser}&gt;).<br/>
                  Created with Kindle Event Studio · Zero-Panic Family Command
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    const attachmentsPayload = attachedPdf?.base64
      ? [
          {
            filename: attachedPdf.name,
            content: attachedPdf.base64,
            encoding: "base64",
            contentType: attachedPdf.type || "application/pdf",
          },
        ]
      : undefined;

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `Wedding & Event Invitation: ${eventName} (${eventDate})`,
          text: inviteText,
          html: htmlContent,
          smtp: {
            user: gmailUser.trim(),
            pass: gmailPass.trim(),
            fromName: senderName.trim(),
          },
          attachments: attachmentsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to deliver email through Gmail SMTP.");
      }

      setEmailStatus("success");
      setEmailMessage(`✅ Email delivered successfully to ${recipientEmail} from ${gmailUser}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setEmailStatus("error");
      setEmailMessage(
        `❌ SMTP Error: ${msg}. If using Gmail, make sure 2-Step Verification is ON and use a 16-character App Password (not your normal password).`,
      );
    }
  };

  const handleWhatsAppSend = () => {
    const cleanPhone = currentGuest?.phone ? currentGuest.phone.replace(/[^0-9]/g, "") : "";
    const encoded = encodeURIComponent(inviteText);
    const url =
      cleanPhone.length >= 10
        ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
        : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitation-modal-title"
      aria-describedby="invitation-modal-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-enter"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border bg-card p-6 sm:p-8 shadow-2xl text-foreground space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
              <h2
                id="invitation-modal-title"
                className="font-display text-lg sm:text-xl font-bold text-foreground"
              >
                {lang === "hi"
                  ? "अतिथि निमंत्रण पत्र भेजें (Gmail SMTP व WhatsApp)"
                  : "Send Official Guest Invitations"}
              </h2>
              <p id="invitation-modal-desc" className="text-xs text-muted-foreground">
                Sends live emails directly from your Gmail account via SMTP & WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmtpConfig(!showSmtpConfig)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                showSmtpConfig
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
              title="Configure Gmail SMTP Key"
            >
              <Key className="size-3.5 text-primary" />
              <span>Gmail SMTP Key</span>
              {showSmtpConfig ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Gmail SMTP Configuration Drawer */}
        {showSmtpConfig && (
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 space-y-3 transition-all animate-enter">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h4 className="font-display text-sm font-bold text-foreground">
                  Your Gmail SMTP Credentials (Sends directly from your inbox)
                </h4>
              </div>
              {savedSmtpNotice && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="size-3.5" /> Credentials Saved!
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              To send emails directly from your personal Gmail address, generate a 16-character{" "}
              <strong>App Password</strong> in your Google Account:
              <br />
              <span className="text-[11px] font-mono text-foreground mt-0.5 inline-block">
                Google Account &rarr; Security &rarr; 2-Step Verification &rarr; App Passwords (e.g.
                &quot;abcd efgh ijkl mnop&quot;)
              </span>
            </p>

            <form onSubmit={handleSaveSmtp} className="grid gap-3 sm:grid-cols-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  Your Gmail Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  Gmail App Password (16-chars)
                </label>
                <input
                  type="password"
                  required
                  placeholder="abcd efgh ijkl mnop"
                  value={gmailPass}
                  onChange={(e) => setGmailPass(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono text-foreground"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  Display Sender Name
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="e.g. Rohan & Ananya"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs text-foreground"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Guest Selector & Mode Switches */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Guest Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Select Recipient Guest
            </label>
            <select
              value={selectedGuestId}
              onChange={(e) => setSelectedGuestId(e.target.value)}
              className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40"
            >
              {guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.group}) — {g.diet} [{g.rsvp}]
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Email Address Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Guest Email Address (For Direct Dispatch)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="guest@gmail.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full rounded-xl border bg-background pl-9 pr-3.5 py-2.5 text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>

        {/* Invitation Style Toggle */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
            Invitation Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setInviteMode("default")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                inviteMode === "default"
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>Default {eventType} Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setInviteMode("custom_pdf")}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                inviteMode === "custom_pdf"
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Paperclip className="size-3.5" />
              <span>Attach Custom PDF</span>
            </button>
          </div>
        </div>

        {/* Custom PDF Upload Area */}
        {inviteMode === "custom_pdf" && (
          <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 sm:p-5 transition-all">
            {attachedPdf ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <FileCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{attachedPdf.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      PDF Ready to attach · {attachedPdf.size}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedPdf(null)}
                  className="rounded-xl border bg-card p-2 text-destructive hover:bg-destructive/10"
                  title="Remove PDF"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 py-3 text-center">
                <UploadCloud className="size-8 text-primary animate-bounce" />
                <span className="text-xs font-bold text-foreground">
                  Click to Browse or Drag & Drop Wedding/Event Invitation PDF
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Supports .pdf, .png, .jpg (Max 15MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {/* Live Invitation Card Showcase */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Live Themed Invitation Card Preview ({eventType})
          </label>

          <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-lg text-white">
            <img
              src={activeTheme.bgImage}
              alt={eventType}
              className="absolute inset-0 h-full w-full object-cover brightness-[0.38] scale-105 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

            <div className="relative z-10 p-6 sm:p-8 space-y-5 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                {eventType === "Wedding" ? (
                  <Heart className="size-3.5 fill-current text-rose-400" />
                ) : eventType === "Birthday" ? (
                  <Cake className="size-3.5 text-amber-400" />
                ) : eventType === "Community Festival" ? (
                  <Building2 className="size-3.5 text-orange-400" />
                ) : (
                  <PartyPopper className="size-3.5 text-yellow-400" />
                )}
                <span>{activeTheme.label}</span>
              </div>

              <div>
                <p className="text-xs font-serif italic tracking-widest text-amber-200/90 uppercase">
                  Cordially Request The Pleasure Of Your Company
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white drop-shadow-md">
                  {eventName}
                </h3>
                <p className="text-xs text-white/80 mt-1 max-w-lg mx-auto">{activeTheme.quote}</p>
              </div>

              {currentGuest && (
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md inline-block max-w-md w-full">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                    Specially Curated For
                  </span>
                  <p className="font-display text-base font-bold text-white mt-0.5">
                    {currentGuest.name}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[11px] text-white/90">
                    <span className="rounded-full bg-black/40 px-2.5 py-0.5 border border-white/20">
                      🍽️ {currentGuest.diet} Diet Reserved
                    </span>
                    {assignedTable && (
                      <span className="rounded-full bg-black/40 px-2.5 py-0.5 border border-white/20">
                        🪑 Table: {assignedTable.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-left pt-1 max-w-md mx-auto">
                <div className="rounded-xl bg-black/40 border border-white/10 p-2.5 flex items-center gap-2.5 backdrop-blur-sm">
                  <Calendar className="size-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-white/60">Date</p>
                    <p className="text-xs font-bold text-white truncate">{eventDate}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-black/40 border border-white/10 p-2.5 flex items-center gap-2.5 backdrop-blur-sm">
                  <MapPin className="size-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-white/60">City / Venue</p>
                    <p className="text-xs font-bold text-white truncate">{eventCity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Custom Note Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Optional Personal Message / Note
          </label>
          <input
            type="text"
            placeholder="e.g. Please join us for Sangeet cocktails at 7 PM sharp! Looking forward to seeing you."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full rounded-xl border bg-background px-3.5 py-2 text-xs text-foreground focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Email Sending Status Feedback Banner */}
        {emailStatus !== "idle" && (
          <div
            className={`rounded-2xl border p-4 text-xs font-medium flex items-center gap-2.5 transition-all ${
              emailStatus === "sending"
                ? "border-primary/30 bg-primary/10 text-primary"
                : emailStatus === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {emailStatus === "sending" ? (
              <Loader2 className="size-4 animate-spin shrink-0" />
            ) : emailStatus === "success" ? (
              <Check className="size-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span className="leading-relaxed">{emailMessage}</span>
          </div>
        )}

        {/* Action Buttons: Real Gmail SMTP Send & WhatsApp Direct Send */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Sender: <strong className="text-foreground">{gmailUser || "Gmail SMTP not set"}</strong>{" "}
            &rarr; Recipient: <strong className="text-foreground">{recipientEmail}</strong>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Real Gmail SMTP Send Button */}
            <button
              onClick={handleRealEmailSend}
              disabled={emailStatus === "sending"}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition active:scale-95 disabled:opacity-50"
            >
              {emailStatus === "sending" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              <span>
                {emailStatus === "sending" ? "Sending via Gmail..." : "Send Email via Gmail SMTP"}
              </span>
            </button>

            {/* WhatsApp Direct Send */}
            <button
              onClick={handleWhatsAppSend}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition active:scale-95"
            >
              <MessageSquare className="size-4" />
              <span>Send WhatsApp</span>
            </button>

            {/* Copy Invite Text */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              {copied ? (
                <Check className="size-4 text-emerald-500" />
              ) : (
                <Share2 className="size-4" />
              )}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
