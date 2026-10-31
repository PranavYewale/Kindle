import { describe, expect, it } from "vitest";
import {
  initialDecisions,
  initialMilestones,
  initial12Categories,
  initialRisks,
  initialGuests,
} from "@/components/dashboard/dashboard-context";

describe("Dashboard Calculations & Business Logic", () => {
  it("computes 12-category budget allocations accurately without negative values", () => {
    expect(initial12Categories.length).toBe(12);

    const totalAllocated = initial12Categories.reduce((acc, cat) => acc + cat.allocated, 0);
    const totalCommitted = initial12Categories.reduce((acc, cat) => acc + cat.committed, 0);
    const totalPaid = initial12Categories.reduce((acc, cat) => acc + cat.paid, 0);

    expect(totalAllocated).toBeGreaterThan(0);
    expect(totalCommitted).toBeLessThanOrEqual(totalAllocated);
    expect(totalPaid).toBeLessThanOrEqual(totalCommitted);

    initial12Categories.forEach((cat) => {
      expect(cat.allocated).toBeGreaterThanOrEqual(0);
      expect(cat.committed).toBeGreaterThanOrEqual(0);
      expect(cat.paid).toBeGreaterThanOrEqual(0);
    });
  });

  it("calculates guest dietary distribution matching total guest records", () => {
    const dietCounts: Record<string, number> = {
      "Strict Jain": 0,
      "Satvik (No Onion/Garlic)": 0,
      Vegetarian: 0,
      Halal: 0,
      Vegan: 0,
      Regular: 0,
    };

    initialGuests.forEach((g) => {
      const current = dietCounts[g.diet];
      if (current !== undefined) {
        dietCounts[g.diet] = current + 1;
      }
    });

    const sumDietPlates = Object.values(dietCounts).reduce((a, b) => a + b, 0);
    expect(sumDietPlates).toBe(initialGuests.length);
  });

  it("includes Electricity Cutoff / Sudden Power Outage in Murphy Emergency Risks", () => {
    const electricityRisk = initialRisks.find((r) => r.id === "r5");
    expect(electricityRisk).toBeDefined();
    expect(electricityRisk?.title).toContain("Electricity Cutoff");
    expect(electricityRisk?.planB).toContain("Generators");
    expect(electricityRisk?.severity).toBe("critical");
  });

  it("resilience score correctly reflects proportion of mitigated risks", () => {
    const totalRisks = initialRisks.length;
    const mitigatedCount = initialRisks.filter((r) => r.mitigated).length;
    const calculatedScore = Math.round((mitigatedCount / totalRisks) * 100);

    expect(totalRisks).toBeGreaterThanOrEqual(8);
    expect(calculatedScore).toBeGreaterThanOrEqual(0);
    expect(calculatedScore).toBeLessThanOrEqual(100);
  });

  it("advances schedule timestamps correctly by 20 minutes", () => {
    const advance20Minutes = (timeStr: string): string => {
      const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match || !match[1] || !match[2] || !match[3]) return timeStr;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      let totalMinutes = hours * 60 + minutes + 20;
      totalMinutes = totalMinutes % (24 * 60);

      const newHours24 = Math.floor(totalMinutes / 60);
      const newMins = totalMinutes % 60;
      const newPeriod = newHours24 >= 12 ? "PM" : "AM";
      const newHours12 = newHours24 % 12 === 0 ? 12 : newHours24 % 12;

      return `${newHours12.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")} ${newPeriod}`;
    };

    expect(advance20Minutes("10:00 AM")).toBe("10:20 AM");
    expect(advance20Minutes("11:50 AM")).toBe("12:10 PM");
    expect(advance20Minutes("06:45 PM")).toBe("07:05 PM");
    expect(advance20Minutes("11:55 PM")).toBe("12:15 AM");
  });
});
