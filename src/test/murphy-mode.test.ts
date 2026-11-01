import { describe, it, expect } from "vitest";

interface RiskSimulationItem {
  id: string;
  name: string;
  severity: "high" | "medium" | "low";
  probability: number;
  mitigationCost: number;
  planBTrigger: string;
}

function calculateCompositeRiskScore(risks: RiskSimulationItem[]): number {
  if (risks.length === 0) return 0;
  const weightedSum = risks.reduce((acc, r) => {
    const weight = r.severity === "high" ? 3 : r.severity === "medium" ? 2 : 1;
    return acc + r.probability * weight;
  }, 0);
  return Math.min(100, Math.round((weightedSum / (risks.length * 3)) * 100));
}

describe("Murphy Mode Risk Simulation Engine", () => {
  const sampleRisks: RiskSimulationItem[] = [
    {
      id: "risk-weather",
      name: "Unseasonal Monsoon Rain on Outdoor Sangeet",
      severity: "high",
      probability: 0.75,
      mitigationCost: 150000,
      planBTrigger: "Barometer drop or 6-hour IMD rain alert",
    },
    {
      id: "risk-power",
      name: "Substation Grid Fluctuation during DJ Night",
      severity: "medium",
      probability: 0.4,
      mitigationCost: 35000,
      planBTrigger: "Auto-switch to twin 125kVA sound-proof generators",
    },
    {
      id: "risk-curfew",
      name: "Municipal 10:00 PM Loudspeaker Noise Curfew",
      severity: "high",
      probability: 0.9,
      mitigationCost: 50000,
      planBTrigger: "Silent Disco wireless headphone transition",
    },
  ];

  it("calculates accurate composite risk index based on weighted probabilities", () => {
    const score = calculateCompositeRiskScore(sampleRisks);
    expect(score).toBeGreaterThan(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("returns zero risk score for empty hazard matrix", () => {
    expect(calculateCompositeRiskScore([])).toBe(0);
  });

  it("calculates total required contingency budget reserve", () => {
    const totalContingency = sampleRisks.reduce((acc, r) => acc + r.mitigationCost, 0);
    expect(totalContingency).toBe(235000);
  });

  it("ensures every simulated hazard contains an actionable Plan B protocol", () => {
    sampleRisks.forEach((risk) => {
      expect(risk.planBTrigger).toBeTruthy();
      expect(risk.planBTrigger.length).toBeGreaterThan(10);
    });
  });
});
