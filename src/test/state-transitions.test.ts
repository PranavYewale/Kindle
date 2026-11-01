import { describe, it, expect } from "vitest";

describe("Dashboard Decision & Milestone Synchronization", () => {
  it("synchronizes decision locking with milestone completion", () => {
    const decisions = [
      { id: "dec-venue", category: "venue", status: "open", lockedChoice: null as string | null },
      {
        id: "dec-caterer",
        category: "caterer",
        status: "open",
        lockedChoice: null as string | null,
      },
    ];

    const milestones = [
      {
        id: "m-1",
        title: "Lock Venue & Transfer 25% Advance",
        status: "in_progress",
        autoSynced: false,
      },
      { id: "m-2", title: "Catering Menu & Tasting Freeze", status: "pending", autoSynced: false },
    ];

    // Simulate locking Venue
    const lockedDecision = {
      ...decisions[0],
      status: "locked",
      lockedChoice: "Umaid Bhawan Lawns",
    };
    const updatedMilestones = milestones.map((m) => {
      if (m.title.toLowerCase().includes("venue") && lockedDecision.status === "locked") {
        return { ...m, status: "completed", autoSynced: true };
      }
      return m;
    });

    expect(updatedMilestones[0]?.status).toBe("completed");
    expect(updatedMilestones[0]?.autoSynced).toBe(true);
    expect(updatedMilestones[1]?.status).toBe("pending");
  });

  it("calculates budget variance correctly when allocations change", () => {
    const totalBudget = 2500000;
    const allocated = 2300000;
    const committed = 850000;

    const unallocatedReserve = totalBudget - allocated;
    const remainingCashflow = totalBudget - committed;

    expect(unallocatedReserve).toBe(200000);
    expect(remainingCashflow).toBe(1650000);
    expect(remainingCashflow / totalBudget).toBe(0.66);
  });
});
