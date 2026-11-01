import { describe, it, expect } from "vitest";

interface ParsedInvoiceItem {
  description: string;
  amount: number;
  isFlaggedHiddenFee: boolean;
  category: "base" | "tax" | "surcharge" | "overtime";
}

function parseInvoiceSummary(items: ParsedInvoiceItem[]) {
  const baseTotal = items
    .filter((i) => !i.isFlaggedHiddenFee)
    .reduce((sum, i) => sum + i.amount, 0);
  const hiddenSurcharges = items
    .filter((i) => i.isFlaggedHiddenFee)
    .reduce((sum, i) => sum + i.amount, 0);
  const total = baseTotal + hiddenSurcharges;
  const surchargePercentage = total > 0 ? (hiddenSurcharges / total) * 100 : 0;

  return {
    baseTotal,
    hiddenSurcharges,
    total,
    surchargePercentage: Math.round(surchargePercentage),
  };
}

function generateWhatsAppNegotiationScript(vendorName: string, hiddenFees: number): string {
  return `Namaste ${vendorName} ji, we reviewed the quotation and noticed unexpected surcharges of ₹${hiddenFees.toLocaleString("en-IN")}. As we are finalizing all our vendors this week with immediate advance token payment, could we waive these surcharges for a clean lump-sum contract?`;
}

describe("Quote Cruncher & Vendor Intelligence Engine", () => {
  const mockInvoiceItems: ParsedInvoiceItem[] = [
    {
      description: "Mandap Floral Artistry (Marigold & Orchids)",
      amount: 350000,
      isFlaggedHiddenFee: false,
      category: "base",
    },
    {
      description: "Fairy Lights & Truss Structure",
      amount: 120000,
      isFlaggedHiddenFee: false,
      category: "base",
    },
    {
      description: "Post-Midnight Generator Surcharge",
      amount: 45000,
      isFlaggedHiddenFee: true,
      category: "overtime",
    },
    {
      description: "Mandatory Unloading & Labor Union Handling",
      amount: 25000,
      isFlaggedHiddenFee: true,
      category: "surcharge",
    },
  ];

  it("accurately detects and aggregates hidden vendor surcharges", () => {
    const summary = parseInvoiceSummary(mockInvoiceItems);
    expect(summary.baseTotal).toBe(470000);
    expect(summary.hiddenSurcharges).toBe(70000);
    expect(summary.total).toBe(540000);
    expect(summary.surchargePercentage).toBe(13);
  });

  it("generates polite, persuasive WhatsApp negotiation messages", () => {
    const script = generateWhatsAppNegotiationScript("Sharma Decorators", 70000);
    expect(script).toContain("Namaste Sharma Decorators ji");
    expect(script).toContain("₹70,000");
    expect(script).toContain("advance token payment");
  });
});
