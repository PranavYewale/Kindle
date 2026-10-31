import React, { useState } from "react";
import { useDashboard } from "./dashboard-context";
import {
  FileSearch,
  AlertTriangle,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Percent,
  DollarSign,
  TrendingUp,
  MapPin,
  Zap,
} from "lucide-react";

export function QuoteCruncher() {
  const { lang, eventCity } = useDashboard();

  const [vendorName, setVendorName] = useState("Royal Gourmet Banquets");
  const [advertisedRate, setAdvertisedRate] = useState(450000);
  const [copied, setCopied] = useState(false);

  // Hidden fee calculations
  const gst18 = Math.round(advertisedRate * 0.18);
  const serviceCharge7 = Math.round(advertisedRate * 0.07);
  const overtimeEstimate = 16000; // after 11 PM
  const cartageFee = 12000;
  const trueTotal = advertisedRate + gst18 + serviceCharge7 + overtimeEstimate + cartageFee;
  const hiddenSurgePct = Math.round(((trueTotal - advertisedRate) / advertisedRate) * 100);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const negotiationScript = `Namaste ${vendorName} team,\n\nThank you for the detailed wedding banquet proposal of ${inr(advertisedRate)}.\n\nWhile reviewing the line items, our event audit flagged an unquoted +18% GST (${inr(gst18)}), 7% service fee (${inr(serviceCharge7)}), plus overtime beyond 11 PM (${inr(overtimeEstimate)}), bringing out-of-pocket total to ${inr(trueTotal)} (+${hiddenSurgePct}% spike).\n\nWe have a firm all-inclusive budget of ${inr(advertisedRate + 30000)} inclusive of all taxes, cartage, and sound clearances. If you can lock in this inclusive rate, we are ready to transfer the 25% token advance today.\n\nPlease let us know if we can sign the contract on these terms.\n\nWarm regards,\nEvent Planning Team (via Kindle)`;

  const copyScript = () => {
    navigator.clipboard.writeText(negotiationScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <FileSearch className="size-3.5" />
            <span>
              {lang === "hi" ? "छिपी हुई लागत जांचें" : "Vendor Bill & Hidden Tax Checker"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "वेंडर खर्च और मोलभाव संदेश" : "Vendor Cost Checker & Counter-Offer"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "वेंडर के कोटेशन में छुपे हुए 18% जीएसटी, सर्विस चार्ज और रात के ओवरटाइम को पकड़ें, और व्हाट्सएप पर भेजने के लिए सही मोलभाव संदेश पाएं।"
              : "Spot hidden 18% GST, service fees, and overtime charges in vendor quotes, and get a ready-to-send negotiation message for WhatsApp."}
          </p>
        </div>
      </div>

      {/* Statutory Guidance */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-2 px-1">
        <span>
          Standard Indian catering tax: 18% GST (SAC 9963). Service charges are optional under CCPA
          guidelines.
        </span>
        <span className="text-[11px] font-medium text-foreground hidden sm:inline">
          {eventCity}
        </span>
      </div>

      {/* Simulator Inputs & Like-for-Like Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Parameters */}
        <div className="rounded-3xl border bg-card overflow-hidden shadow-sm space-y-4">
          {/* Visual Header Image for Proposal */}
          <div className="relative h-28 w-full overflow-hidden border-b bg-muted/40">
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"
              alt="Vendor Quote Audit"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <div className="absolute bottom-2.5 left-4 flex items-center gap-2">
              <span className="rounded-lg bg-black/60 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                Invoice Audit
              </span>
              <span className="rounded-lg bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                Hidden Extras Shield
              </span>
            </div>
          </div>

          <div className="p-6 pt-0 space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              {lang === "hi" ? "वेंडर कोटेशन दर्ज करें" : "Vendor Proposal Inputs"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Vendor / Service Name
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  Advertised Base Quote (₹)
                </label>
                <input
                  type="number"
                  step={5000}
                  value={advertisedRate}
                  onChange={(e) => setAdvertisedRate(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Hidden Fee Detector Flags */}
            <div className="border-t pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                <AlertTriangle className="size-3.5" />
                <span>Hidden Extras Detected</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-2.5 border border-destructive/20">
                  <span>Unquoted 18% GST</span>
                  <span className="font-mono font-bold text-destructive">+{inr(gst18)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-2.5 border border-destructive/20">
                  <span>Mandatory 7% Banquet Service Charge</span>
                  <span className="font-mono font-bold text-destructive">
                    +{inr(serviceCharge7)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-2.5 border border-destructive/20">
                  <span>Overtime Surcharge (after 11:00 PM)</span>
                  <span className="font-mono font-bold text-destructive">
                    +{inr(overtimeEstimate)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-destructive/5 p-2.5 border border-destructive/20">
                  <span>Cartage, Freight & Breakage Deposit</span>
                  <span className="font-mono font-bold text-destructive">+{inr(cartageFee)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Like-for-Like Comparison Result */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-foreground">
              {lang === "hi"
                ? "समान आधार पर तुलना (Like-for-Like)"
                : "True Out-Of-Pocket Comparison"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Advertised Quote
                </span>
                <p className="font-display text-2xl font-bold text-foreground mt-2 line-through opacity-70">
                  {inr(advertisedRate)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">"Face value" quote</p>
              </div>

              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
                <span className="text-xs font-semibold text-destructive uppercase">
                  True Out-of-Pocket
                </span>
                <p className="font-display text-2xl font-bold text-destructive mt-2">
                  {inr(trueTotal)}
                </p>
                <p className="text-xs text-destructive font-bold mt-1">
                  +{hiddenSurgePct}% Real Cost Spike
                </p>
              </div>
            </div>
          </div>

          {/* Pre-Drafted WhatsApp Negotiation Script Box */}
          <div className="rounded-2xl border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Send className="size-3.5 text-primary" />
                WhatsApp Counter-Offer Script
              </span>
              <button
                onClick={copyScript}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span>{copied ? "Copied to Clipboard!" : "Copy WhatsApp Script"}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground bg-card p-3 rounded-xl border max-h-44 overflow-y-auto">
              {negotiationScript}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
