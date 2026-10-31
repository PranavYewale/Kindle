import { describe, it, expect } from "vitest";
import {
  generatePersonalizedPlan,
  handleGeneratePlanRequest,
  type ExtendedEventPlanConfig,
} from "../server/ai-planner-service";

describe("AI Planner Service & Neural Generator", () => {
  it("generates a distinct, rupee-exact plan for Royal Wedding", () => {
    const config: ExtendedEventPlanConfig = {
      eventType: "Wedding",
      title: "Dev & Diya's Palatial Wedding",
      city: "Udaipur, Rajasthan",
      date: "2026-12-25",
      guestCount: 450,
      totalBudget: 4000000,
      durationDays: 3,
      venuePreference: "Palace Lawns",
      indoorOutdoor: "both",
      themeStyle: "Royal Rajputana Grandeur",
      priorities: ["catering", "venue", "photo"],
      wedding: {
        brideName: "Diya",
        groomName: "Dev",
        weddingDate: "2026-12-25",
        functionsCount: 5,
        functions: ["Haldi", "Mehendi", "Sangeet", "Wedding Ceremony", "Reception"],
        style: "traditional",
        mandapRequired: true,
        cateringPreference: "regional_authentic",
        baraatArrangements: "Royal elephant & vintage car",
      },
    };

    const plan = generatePersonalizedPlan(config);

    expect(plan.eventType).toBe("Wedding");
    expect(plan.eventName).toBe("Dev & Diya's Palatial Wedding");
    expect(plan.eventCity).toBe("Udaipur, Rajasthan");
    expect(plan.guestCount).toBe(450);
    expect(plan.totalBudget).toBe(4000000);

    // Rupee-exact check
    const sumCategories = plan.categories.reduce((acc, c) => acc + c.allocated, 0);
    expect(sumCategories).toBe(4000000);

    // Decision customization check
    expect(plan.decisions[0]?.title).toContain("Dev & Diya");

    // Milestones check
    expect(plan.milestones.length).toBeGreaterThan(0);
    expect(plan.milestones[0]?.date).toBeDefined();
  });

  it("generates a personalized plan for Milestone Birthday with correct theme and cake", () => {
    const config: ExtendedEventPlanConfig = {
      eventType: "Birthday",
      title: "Rohan's 30th Milestone Extravaganza",
      city: "Bengaluru, Karnataka",
      date: "2026-11-20",
      guestCount: 150,
      totalBudget: 600000,
      priorities: ["music", "catering", "entertainment"],
      birthday: {
        birthdayPersonName: "Rohan",
        ageMilestone: "30th",
        celebrationType: "surprise",
        partyTheme: "Retro Neon 90s",
        cakePreference: "Artisanal Hazelnut Praline",
        entertainmentPreference: "Live Standup & DJ",
        memoryWall: true,
        videoMontage: true,
      },
    };

    const plan = generatePersonalizedPlan(config);

    expect(plan.eventType).toBe("Birthday");
    expect(plan.totalBudget).toBe(600000);

    const sumCategories = plan.categories.reduce((acc, c) => acc + c.allocated, 0);
    expect(sumCategories).toBe(600000);

    // Birthday specific decisions
    expect(plan.decisions[0]?.title).toContain("Rohan");
    expect(plan.decisions[0]?.title).toContain("Artisanal Hazelnut Praline");

    // Memory wall zone
    const photoZone = plan.venueZones.find((z) => z.type === "photo");
    expect(photoZone?.name).toContain("Memory Wall");
  });

  it("generates a Community Festival plan with stall & volunteer parameters", () => {
    const config: ExtendedEventPlanConfig = {
      eventType: "Community Festival",
      title: "Navratri Dandiya Mahotsav 2026",
      city: "Ahmedabad, Gujarat",
      date: "2026-10-15",
      guestCount: 2000,
      totalBudget: 1500000,
      priorities: ["venue", "music", "catering"],
      community: {
        isPublic: "public",
        maxCrowd: 2500,
        eventDuration: "Full Night",
        stallCount: 35,
        culturalPerformances: "Live Raas Garba Troupe",
        volunteerCount: 60,
      },
    };

    const plan = generatePersonalizedPlan(config);

    expect(plan.eventType).toBe("Community Festival");
    const sumCategories = plan.categories.reduce((acc, c) => acc + c.allocated, 0);
    expect(sumCategories).toBe(1500000);

    expect(plan.decisions[0]?.title).toContain("Live Raas Garba Troupe");
    expect(plan.decisions[1]?.title).toContain("35 Kiosks");
  });

  it("generates an Anniversary plan with vow renewal and retro tribute", () => {
    const config: ExtendedEventPlanConfig = {
      eventType: "Anniversary",
      title: "Vikram & Shashi's 50th Golden Jubilee",
      city: "Delhi NCR",
      date: "2026-12-05",
      guestCount: 220,
      totalBudget: 1800000,
      anniversary: {
        coupleNames: "Vikram & Shashi",
        milestone: "50th Golden Jubilee",
        vowRenewal: true,
        dinnerPreference: "Royal Mughlai 5-Course Sitdown",
      },
    };

    const plan = generatePersonalizedPlan(config);

    expect(plan.eventType).toBe("Anniversary");
    const sumCategories = plan.categories.reduce((acc, c) => acc + c.allocated, 0);
    expect(sumCategories).toBe(1800000);
    expect(plan.decisions[0]?.title).toContain("Vikram & Shashi");
  });

  it("generates a Family Reunion plan with clan details", () => {
    const config: ExtendedEventPlanConfig = {
      eventType: "Family Reunion",
      title: "The Sharma Clan Homecoming",
      city: "Lonavala, Maharashtra",
      date: "2026-11-28",
      guestCount: 80,
      totalBudget: 500000,
      reunion: {
        familyName: "The Sharma Clan",
        expectedFamiliesCount: 12,
        reunionDuration: "3 Days",
        familyTournament: "Sharma Premier League Cricket",
      },
    };

    const plan = generatePersonalizedPlan(config);

    expect(plan.eventType).toBe("Family Reunion");
    const sumCategories = plan.categories.reduce((acc, c) => acc + c.allocated, 0);
    expect(sumCategories).toBe(500000);
    expect(plan.decisions[0]?.title).toContain("The Sharma Clan");
  });

  it("handles /api/generate-plan HTTP POST endpoint correctly", async () => {
    const request = new Request("http://localhost:8080/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "Wedding",
        title: "Kunal & Riya's Wedding",
        city: "Mumbai, Maharashtra",
        date: "2026-12-10",
        guestCount: 300,
        totalBudget: 2000000,
        wedding: {
          brideName: "Riya",
          groomName: "Kunal",
        },
      }),
    });

    const response = await handleGeneratePlanRequest(request);
    expect(response.status).toBe(200);

    const data = (await response.json()) as {
      success: boolean;
      plan: { eventName: string; totalBudget: number };
    };
    expect(data.success).toBe(true);
    expect(data.plan.eventName).toBe("Kunal & Riya's Wedding");
    expect(data.plan.totalBudget).toBe(2000000);
  });
});
