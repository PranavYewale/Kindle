import { describe, it, expect } from "vitest";
import {
  communityFestivalPreset,
  birthdayPreset,
  anniversaryPreset,
  familyReunionPreset,
  getPresetForEventType,
} from "../components/dashboard/event-presets-data";

describe("Multi-Event Customization & Preset Isolation", () => {
  it("Community Festival preset has zero wedding references in decisions", () => {
    const preset = getPresetForEventType("Community Festival");
    expect(preset).not.toBeNull();
    expect(preset?.eventType).toBe("Community Festival");

    const decisionTitles = preset!.decisions.map((d) => d.title.toLowerCase());
    const allText = JSON.stringify(preset!.decisions).toLowerCase();

    // Must not have wedding artifacts
    expect(allText).not.toContain("mandap");
    expect(allText).not.toContain("baraat");
    expect(allText).not.toContain("lehenga");
    expect(allText).not.toContain("pheras");

    // Must have community festival decisions
    expect(decisionTitles.some((t) => t.includes("audio-visual") || t.includes("stage"))).toBe(
      true,
    );
    expect(
      decisionTitles.some((t) => t.includes("community feast") || t.includes("maha-prasad")),
    ).toBe(true);
    expect(decisionTitles.some((t) => t.includes("municipal") || t.includes("police"))).toBe(true);
  });

  it("Birthday preset is fully customized for milestone birthdays", () => {
    const preset = getPresetForEventType("Birthday");
    expect(preset).not.toBeNull();
    expect(preset?.eventType).toBe("Birthday");

    const allText = JSON.stringify(preset!.decisions).toLowerCase();
    expect(allText).toContain("cake");
    expect(allText).toContain("dj");
    expect(allText).toContain("rooftop");
    expect(allText).not.toContain("mandap");
  });

  it("Anniversary preset is customized for silver/golden vows", () => {
    const preset = getPresetForEventType("Anniversary");
    expect(preset).not.toBeNull();
    expect(preset?.eventType).toBe("Anniversary");

    const allText = JSON.stringify(preset!.decisions).toLowerCase();
    expect(allText).toContain("love story");
    expect(allText).toContain("courtyard");
    expect(allText).not.toContain("mandap");
  });

  it("Budget categories allocated rupee sum matches totalBudget exactly for all presets", () => {
    const presets = [
      communityFestivalPreset,
      birthdayPreset,
      anniversaryPreset,
      familyReunionPreset,
    ];

    for (const p of presets) {
      const sum = p.categories.reduce((acc, c) => acc + c.allocated, 0);
      expect(sum).toBe(p.totalBudget);
    }
  });

  it("All presets provide valid floor plan venue zones", () => {
    const presets = [
      communityFestivalPreset,
      birthdayPreset,
      anniversaryPreset,
      familyReunionPreset,
    ];

    for (const p of presets) {
      expect(p.venueZones.length).toBeGreaterThanOrEqual(6);
      p.venueZones.forEach((z) => {
        expect(z.name).toBeTruthy();
        expect(z.x).toBeGreaterThanOrEqual(0);
        expect(z.y).toBeGreaterThanOrEqual(0);
      });
    }
  });
});
