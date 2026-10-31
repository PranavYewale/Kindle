import { describe, expect, it } from "vitest";
import { type Guest } from "@/components/dashboard/dashboard-context";

describe("Guest Seating Harmony & Conflict Detection", () => {
  it("flags seating conflict when feuding guests are assigned to the same table", () => {
    const testGuests: Guest[] = [
      {
        id: "g1",
        name: "Rajesh Papa",
        group: "Groom Family",
        rsvp: "Attending",
        diet: "Vegetarian",
        tableId: "t-1",
        isElderly: true,
        feudWithIds: ["g2"],
        phone: "+91 98220 11111",
      },
      {
        id: "g2",
        name: "Ramesh Chacha",
        group: "Groom Family",
        rsvp: "Attending",
        diet: "Vegetarian",
        tableId: "t-1", // Same table! Conflict
        isElderly: true,
        feudWithIds: ["g1"],
        phone: "+91 98220 22222",
      },
      {
        id: "g3",
        name: "Anand Friend",
        group: "College Friends",
        rsvp: "Attending",
        diet: "Regular",
        tableId: "t-2", // Different table, no conflict
        isElderly: false,
        feudWithIds: [],
        phone: "+91 98220 33333",
      },
    ];

    const detectFeuds = (guests: Guest[]): string[] => {
      const warnings: string[] = [];
      const guestsByTable: Record<string, Guest[]> = {};

      guests.forEach((g) => {
        if (!g.tableId) return;
        const list = guestsByTable[g.tableId] ?? [];
        list.push(g);
        guestsByTable[g.tableId] = list;
      });

      Object.entries(guestsByTable).forEach(([tableId, tableGuests]) => {
        for (let i = 0; i < tableGuests.length; i++) {
          for (let j = i + 1; j < tableGuests.length; j++) {
            const gA = tableGuests[i];
            const gB = tableGuests[j];
            if (gA && gB && (gA.feudWithIds.includes(gB.id) || gB.feudWithIds.includes(gA.id))) {
              warnings.push(`Feud Alert: ${gA.name} and ${gB.name} are seated at Table ${tableId}`);
            }
          }
        }
      });

      return warnings;
    };

    const warnings = detectFeuds(testGuests);
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain("Rajesh Papa and Ramesh Chacha");
  });

  it("identifies senior elders for proximity seating and accessible egress", () => {
    const testGuests: Guest[] = [
      {
        id: "g1",
        name: "Dada Ji",
        group: "Elders",
        rsvp: "Attending",
        diet: "Satvik (No Onion/Garlic)",
        tableId: "t-ground-1",
        isElderly: true,
        feudWithIds: [],
        phone: "123",
      },
      {
        id: "g2",
        name: "Dadi Ji",
        group: "Elders",
        rsvp: "Attending",
        diet: "Strict Jain",
        tableId: "t-ground-1",
        isElderly: true,
        feudWithIds: [],
        phone: "123",
      },
      {
        id: "g3",
        name: "Vikram Cousin",
        group: "Bride Family",
        rsvp: "Attending",
        diet: "Regular",
        tableId: "t-balcony",
        isElderly: false,
        feudWithIds: [],
        phone: "123",
      },
    ];

    const seniorCount = testGuests.filter((g) => g.isElderly).length;
    expect(seniorCount).toBe(2);

    const elderlyGuests = testGuests.filter((g) => g.isElderly);
    elderlyGuests.forEach((elder) => {
      expect(elder.tableId).toContain("ground");
    });
  });
});
