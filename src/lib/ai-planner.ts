import type {
  Decision,
  MilestoneTask,
  BudgetCategory,
  VenueZone,
  Guest,
  MurphyRisk,
  CulturalCeremony,
  CreativeIdea,
  EventSpot,
  Persona,
} from "../components/dashboard/dashboard-context";
import type { EventPresetBundle } from "../components/dashboard/event-presets-data";
import {
  royalWeddingPreset,
  birthdayPreset,
  communityFestivalPreset,
  anniversaryPreset,
  familyReunionPreset,
  getPresetForEventType,
} from "../components/dashboard/event-presets-data";

export interface ExtendedEventPlanConfig {
  // 1. Universal Required
  eventType:
    "Wedding" | "Birthday" | "Community Festival" | "Anniversary" | "Family Reunion" | string;
  title: string;
  city: string;
  date: string; // YYYY-MM-DD
  guestCount: number;
  totalBudget: number;

  // Universal Recommended
  durationDays?: number; // 1 to 7
  venuePreference?: string;
  indoorOutdoor?: "indoor" | "outdoor" | "both" | "open_air_lawn";
  themeStyle?: string;
  priorities?: string[]; // e.g. ["catering", "venue", "photo"]

  // Universal Optional
  dateFlexibility?: "exact" | "flexible_weekend" | "flexible_month" | "anytime";
  preferredLanguage?: string;
  specialRequirements?: string;
  additionalInstructions?: string;

  // 2. Event-Specific Questions
  // Royal Wedding Ceremony
  wedding?: {
    brideName: string;
    groomName: string;
    weddingDate?: string;
    functionsCount?: number;
    functions?: string[]; // Haldi, Mehendi, Sangeet, Wedding Ceremony, Reception
    style?: "traditional" | "modern" | "fusion";
    mandapRequired?: boolean;
    cateringPreference?: "pure_veg" | "multi_cuisine" | "regional_authentic" | "satvik_jain";
    baraatArrangements?: string;
    muhuratTimings?: string;
    photographyPreference?: string;
    familyTraditions?: string;
  };

  // Milestone Jubilee Birthday
  birthday?: {
    birthdayPersonName: string;
    ageMilestone: string; // e.g. "18th", "21st", "50th"
    celebrationType?: "surprise" | "planned";
    partyTheme?: string;
    cakePreference?: string;
    entertainmentPreference?: string;
    memoryWall?: boolean;
    videoMontage?: boolean;
    specialPerformances?: string;
    personalizedGifts?: string;
  };

  // Community Mela & Gala
  community?: {
    isPublic: "public" | "private" | "society";
    maxCrowd: number;
    eventDuration: string;
    stallCount?: number;
    foodArrangements?: string;
    culturalPerformances?: string;
    hasSponsors?: boolean;
    volunteerCount?: number;
    stallCategories?: string[];
    chiefGuests?: string;
    communityActivities?: string;
    fundraisingGoal?: string;
  };

  // Silver / Golden Jubilee Vows
  anniversary?: {
    coupleNames: string;
    milestone: string; // "25th Silver", "40th Ruby", "50th Golden"
    vowRenewal?: boolean;
    celebrationStyle?: "intimate" | "grand" | "cocktail" | "traditional";
    familyParticipation?: string;
    dinnerPreference?: string;
    memoryVideo?: boolean;
    familySpeeches?: boolean;
    photoTimeline?: boolean;
    musicalTribute?: string;
  };

  // Grand Family Reunion & Homecoming
  reunion?: {
    familyName: string;
    expectedFamiliesCount: number;
    reunionDuration: string;
    generationCount?: number;
    settingPreference?: "farmhouse" | "resort" | "home" | "lakeside";
    familyActivities?: string[];
    accommodationRequired?: boolean;
    familyTreeDisplay?: boolean;
    clanMerchandise?: boolean;
    familyTournament?: string;
    overseasLivestream?: boolean;
  };

  // Legacy compatibility fields
  hosts?: string;
  tradition?: string;
  venueStyle?: string;
}

/**
 * Intelligent Neural Heuristic Generator
 * Dynamically synthesizes a bespoke dashboard dataset matching all inputs.
 */
export function generatePersonalizedPlan(config: ExtendedEventPlanConfig): EventPresetBundle {
  const basePreset = getPresetForEventType(config.eventType) || royalWeddingPreset;
  const eventType = config.eventType || "Wedding";
  const finalBudget = Math.max(50000, Number(config.totalBudget) || basePreset.totalBudget);
  const finalGuests = Math.max(10, Number(config.guestCount) || basePreset.guestCount);
  const finalCity = config.city?.trim() || basePreset.eventCity;
  const finalDate = config.date || basePreset.eventDate;

  // Calculate days remaining
  const targetTime = new Date(finalDate).getTime();
  const nowTime = new Date().getTime();
  const daysDiff = Math.max(1, Math.round((targetTime - nowTime) / (1000 * 60 * 60 * 24)));

  // Resolve Primary Host Name / Protagonist
  let resolvedHosts = config.hosts || "";
  let resolvedEventName = config.title?.trim() || "";

  if (eventType === "Wedding") {
    const bride = config.wedding?.brideName?.trim() || "Ananya";
    const groom = config.wedding?.groomName?.trim() || "Rohit";
    resolvedHosts = `${groom} & ${bride}`;
    if (!resolvedEventName) {
      resolvedEventName = `${resolvedHosts}'s Royal Wedding`;
    }
  } else if (eventType === "Birthday") {
    const star = config.birthday?.birthdayPersonName?.trim() || "Kabir";
    const milestone = config.birthday?.ageMilestone?.trim() || "25th";
    resolvedHosts = `${star} (${milestone} Milestone)`;
    if (!resolvedEventName) {
      resolvedEventName = `${star}'s ${milestone} Birthday Celebration`;
    }
  } else if (eventType === "Community Festival") {
    const org = config.title?.trim() || "Grand Society Diwali Mahotsav & Mela";
    resolvedHosts = "Organizing Committee";
    resolvedEventName = org;
  } else if (eventType === "Anniversary") {
    const couple = config.anniversary?.coupleNames?.trim() || "Rajesh & Sunita";
    const milestone = config.anniversary?.milestone?.trim() || "30th Anniversary";
    resolvedHosts = `${couple} (${milestone})`;
    if (!resolvedEventName) {
      resolvedEventName = `${couple}'s ${milestone} Celebration`;
    }
  } else if (eventType === "Family Reunion") {
    const clan = config.reunion?.familyName?.trim() || "The Mehra Clan";
    resolvedHosts = clan;
    if (!resolvedEventName) {
      resolvedEventName = `${clan} Grand Homecoming & Reunion`;
    }
  } else {
    resolvedHosts = config.hosts?.trim() || "Host Committee";
    if (!resolvedEventName) resolvedEventName = `${resolvedHosts} Celebration`;
  }

  // 1. DYNAMIC BUDGET RE-WEIGHTING BY PRIORITIES
  const priorityWeights: Record<string, number> = {
    catering: 1.35,
    venue: 1.3,
    photo: 1.25,
    music: 1.2,
    entertainment: 1.2,
    attire: 1.15,
    decor: 1.25,
    hospitality: 1.2,
  };

  const chosenPriorities =
    config.priorities && config.priorities.length > 0
      ? config.priorities
      : ["catering", "venue", "photo"];

  // Re-weight categories
  const rawCategories = basePreset.categories.map((c) => {
    let weight = 1.0;
    const lowerName = c.name.toLowerCase();
    for (const prio of chosenPriorities) {
      if (lowerName.includes(prio.toLowerCase())) {
        weight = priorityWeights[prio] || 1.2;
        break;
      }
    }
    return { ...c, baseAlloc: c.allocated * weight };
  });

  const sumBase = rawCategories.reduce((acc, c) => acc + c.baseAlloc, 0);
  let allocatedSum = 0;

  const scaledCategories: BudgetCategory[] = rawCategories.map((c, i) => {
    let amount = Math.floor((c.baseAlloc / sumBase) * finalBudget);
    if (i === rawCategories.length - 1) {
      amount = finalBudget - allocatedSum;
    } else {
      allocatedSum += amount;
    }
    return {
      id: c.id,
      name: c.name,
      nameHi: c.nameHi,
      allocated: amount,
      committed: Math.floor(amount * 0.35),
      paid: Math.floor(amount * 0.12),
      icon: c.icon,
      color: c.color,
    };
  });

  // 2. DYNAMIC TIMELINE GENERATION
  const targetDateObj = new Date(finalDate);
  const formatDate = (daysBefore: number): string => {
    const d = new Date(targetDateObj);
    d.setDate(d.getDate() - daysBefore);
    return d.toISOString().slice(0, 10);
  };

  const synthesizedMilestones: MilestoneTask[] = basePreset.milestones.map((m, idx) => {
    const offset = Math.max(
      1,
      Math.round(
        (daysDiff * (basePreset.milestones.length - idx)) / (basePreset.milestones.length + 1),
      ),
    );
    let title = m.title;

    // Inject personalized context into milestone titles
    if (eventType === "Wedding" && config.wedding) {
      if (idx === 0) title = `Finalize ${config.venuePreference || "Palace Venue"} & Sign Contract`;
      if (idx === 1)
        title = `Mandap Fabrication & ${config.wedding.style === "modern" ? "Modern Floral" : "Vedic Marigold"} Styling`;
      if (idx === 2)
        title = `Tasting Session for ${config.wedding.cateringPreference?.replace("_", " ") || "Feast"} Menu`;
      if (idx === 3)
        title = `Choreography for ${config.wedding.functions?.join(" & ") || "Sangeet"} Night`;
    } else if (eventType === "Birthday" && config.birthday) {
      if (idx === 0)
        title = `Book ${config.venuePreference || "Party Lounge"} & Confirm ${config.birthday.partyTheme || "Theme"}`;
      if (idx === 1)
        title = `Order ${config.birthday.cakePreference || "Designer Cake"} & Secret Midnight Reveal Prep`;
      if (idx === 2)
        title = config.birthday.videoMontage
          ? "Collect Family Clips for Nostalgia Montage"
          : "Curate Birthday Playlist & Entertainment";
      if (idx === 3)
        title = `Confirm ${config.birthday.entertainmentPreference || "Live DJ & Sound"} Acoustics`;
    } else if (eventType === "Community Festival" && config.community) {
      if (idx === 0)
        title = `Police, Fire & Municipal Permissions for ${config.community.maxCrowd}+ Guests`;
      if (idx === 1)
        title = `Allocate ${config.community.stallCount || 28} Artisanal Stalls & Stage Rigging`;
      if (idx === 2)
        title = `Volunteer Briefing (${config.community.volunteerCount || 45} Marshals)`;
      if (idx === 3)
        title = `Sound Check for ${config.community.culturalPerformances || "Cultural Stage"}`;
    } else if (eventType === "Anniversary" && config.anniversary) {
      if (idx === 0)
        title = `Reserve ${config.venuePreference || "Heritage Banquet"} for ${config.anniversary.milestone}`;
      if (idx === 1)
        title = config.anniversary.vowRenewal
          ? "Order Garlands & Re-vow Ceremony Script"
          : "Curate Memory Photo Timeline & Stage";
      if (idx === 2)
        title = `Tasting Session for ${config.anniversary.dinnerPreference?.replace("_", " ") || "Silver Gala"} Dinner`;
      if (idx === 3) title = "Family Video Speeches & Nostalgia Reel Assembly";
    } else if (eventType === "Family Reunion" && config.reunion) {
      if (idx === 0)
        title = `Confirm ${config.reunion.settingPreference || "Heritage Farmhouse"} Booking & Rooms`;
      if (idx === 1)
        title = config.reunion.familyTreeDisplay
          ? "Design Multi-Generational Family Tree Banner"
          : "Order Clan Custom Souvenirs";
      if (idx === 2)
        title = `Organize Clan Tournament (${config.reunion.familyTournament || "Cricket & Antakshari"})`;
      if (idx === 3)
        title = config.reunion.overseasLivestream
          ? "Setup High-Speed 4K Livestream for NRI Relatives"
          : "Grand Generational Potluck Finalization";
    }

    return {
      ...m,
      title,
      date: formatDate(offset),
      daysToGo: offset,
    };
  });

  // 3. DYNAMIC VENUE ZONES
  const tableCapacity = Math.max(6, Math.round(finalGuests / 10));
  const venueZones: VenueZone[] = basePreset.venueZones.map((z) => {
    let name = z.name;
    if (eventType === "Wedding" && z.type === "mandap") {
      name =
        config.wedding?.mandapRequired === false
          ? "Vow Stage & Backdrop"
          : `${resolvedHosts.split(" & ")[0] || "Bridal"} Mandap`;
    } else if (eventType === "Birthday") {
      if (z.type === "mandap")
        name = `${config.birthday?.birthdayPersonName || "Kabir"}'s Cake Stage`;
      if (z.type === "photo")
        name = config.birthday?.memoryWall ? "Memory Wall & Polaroids" : "Neon Photo Booth";
    } else if (eventType === "Community Festival") {
      if (z.type === "mandap") name = "Main Cultural Amphitheatre";
      if (z.type === "photo") name = "Community Heritage Photo Wall";
    } else if (eventType === "Anniversary") {
      if (z.type === "mandap") name = "Vow Renewal Stage";
      if (z.type === "photo") name = "Silver Memories Gallery";
    } else if (eventType === "Family Reunion") {
      if (z.type === "mandap") name = "Clan Storytelling & Elders Gazebo";
      if (z.type === "photo") name = "Generational Family Tree Wall";
    }

    return {
      ...z,
      name,
      capacity: z.type === "dining" ? tableCapacity : z.capacity,
    };
  });

  // 4. DYNAMIC HIGH-STAKES DECISIONS
  const customizedDecisions: Decision[] = basePreset.decisions.map((d, idx) => {
    let title = d.title;
    const priceSpikeWarning = d.priceSpikeWarning;

    if (eventType === "Wedding" && config.wedding) {
      if (idx === 0) {
        title = `${resolvedHosts}: Mandap Floral Styling & ${config.wedding.mandapRequired === false ? "Contemporary Arch" : "Sacred Agni Canopy"}`;
      } else if (idx === 1) {
        title = `${config.wedding.cateringPreference?.toUpperCase() || "GOURMET"} Live Chaat & Royal Feast Caterer`;
      }
    } else if (eventType === "Birthday" && config.birthday) {
      if (idx === 0) {
        title = `${config.birthday.birthdayPersonName}'s ${config.birthday.cakePreference || "Designer Cake"} & Midnight Sparklers`;
      } else if (idx === 1) {
        title = `${config.birthday.partyTheme || "Theme"} Lounge Lighting & Sound Architecture`;
      }
    } else if (eventType === "Community Festival" && config.community) {
      if (idx === 0) {
        title = `Central Amphitheatre Sound Rigging & ${config.community.culturalPerformances || "Folk Troupe"} Production`;
      } else if (idx === 1) {
        title = `Artisanal Stalls Layout (${config.community.stallCount || 25} Kiosks) & Food Court Sanitization`;
      }
    } else if (eventType === "Anniversary" && config.anniversary) {
      if (idx === 0) {
        title = `${resolvedHosts}: ${config.anniversary.milestone} Candlelight Banquet & ${config.anniversary.dinnerPreference || "Silver Service"}`;
      } else if (idx === 1) {
        title = config.anniversary.vowRenewal
          ? `${resolvedHosts} Floral Arch Vow Renewal & Champagne Flutes`
          : `${resolvedHosts} Family Memory Montage & Stage Acoustics`;
      }
    } else if (eventType === "Family Reunion" && config.reunion) {
      if (idx === 0) {
        title = `${config.reunion.familyName} Clan Feast & Outdoor Bonfire Setting`;
      } else if (idx === 1) {
        title = `Clan Tournament Ground & ${config.reunion.familyTournament || "Cricket Pitch"} Fabrication`;
      }
    }

    return {
      ...d,
      title,
      priceSpikeWarning,
    };
  });

  // 5. TAILORED RISKS (Murphy Mode)
  const isOutdoor =
    config.indoorOutdoor === "outdoor" ||
    config.indoorOutdoor === "both" ||
    config.indoorOutdoor === "open_air_lawn";
  const tailoredRisks: MurphyRisk[] = basePreset.risks.map((r, idx) => {
    if (idx === 0 && isOutdoor) {
      return {
        ...r,
        title: "Sudden Unseasonal Downpour over Outdoor Zones",
        titleHi: "खुले मैदान में अचानक असमय बारिश",
        description: `Rapid 30-minute waterproof german hangar canopy cover deployable over ${finalGuests} guests and live food stalls.`,
        costImpact: Math.floor(finalBudget * 0.04),
      };
    }
    if (eventType === "Community Festival" && idx === 1) {
      return {
        ...r,
        title: `Crowd Surge Beyond Expected ${config.community?.maxCrowd || finalGuests} Attendance`,
        titleHi: "अपेक्षित से अधिक भारी भीड़ का आगमन",
        description:
          "Deploy secondary perimeter barricades and dispatch reserve buffet stations to maintain smooth entry flow.",
        costImpact: Math.floor(finalBudget * 0.03),
      };
    }
    if (eventType === "Birthday" && idx === 1 && config.birthday?.videoMontage) {
      return {
        ...r,
        title: "Projector Audio-Sync Failure During Surprise Video",
        titleHi: "सरप्राइज वीडियो के दौरान तकनीकी खराबी",
        description:
          "Pre-load offline dual HDMI mirrored laptops with dedicated 3.5mm direct line-in to main mixer.",
        costImpact: 8000,
      };
    }
    return r;
  });

  // 6. TAILORED DAY-OF SCHEDULE
  const synthesizedDayOf = basePreset.dayOfSchedule.map((slot, idx) => {
    let title = slot.title;
    if (eventType === "Wedding" && config.wedding?.functions) {
      if (idx === 1 && config.wedding.functions.includes("Haldi"))
        title = "Haldi & Floral Phoolon Ki Holi Ceremony";
      if (idx === 2 && config.wedding.functions.includes("Sangeet"))
        title = "Sangeet Dance Performances & Cocktail Dinner";
      if (idx === 3)
        title = `Grand Baraat Entry with ${config.wedding.baraatArrangements || "Dhol Procession"}`;
      if (idx === 4)
        title = `Auspicious Pheras & Varmala (${config.wedding.muhuratTimings || "Auspicious Muhurat"})`;
    } else if (eventType === "Birthday" && config.birthday) {
      if (idx === 0) title = "Lounge Decor, Neon Lights & Sound Check";
      if (idx === 1)
        title = `Guest Welcome & Welcome Mocktails for ${config.birthday.birthdayPersonName}'s Celebration`;
      if (idx === 2)
        title = config.birthday.videoMontage
          ? "Screening of Childhood Nostalgia Video Reel"
          : "Opening Dance Floor Beats";
      if (idx === 3)
        title = `Grand Midnight Cake Cutting (${config.birthday.cakePreference || "Designer Cake"}) with Cold Pyros`;
      if (idx === 4) title = "Live DJ Dance Sets & Late Night Snack Counters";
    } else if (eventType === "Community Festival" && config.community) {
      if (idx === 0)
        title = `Vendor Stall Power & Sanitation Inspection (${config.community.stallCount || 25} Stalls)`;
      if (idx === 1) title = "Inaugural Diya Lighting by Chief Guests & Organizing Committee";
      if (idx === 2) title = `Artisanal Mela Exhibition & Community Fun Stalls Open`;
      if (idx === 3)
        title = `Stage Performances: ${config.community.culturalPerformances || "Folk Dances & School Bands"}`;
      if (idx === 4) title = "Grand Community Mahaprasad / Food Court Dinner & Fireworks";
    } else if (eventType === "Anniversary" && config.anniversary) {
      if (idx === 0) title = "Acoustic String Ensemble & Photo Timeline Gallery Ready";
      if (idx === 1) title = `Welcome of Honorable Couple ${resolvedHosts}`;
      if (idx === 2)
        title = config.anniversary.vowRenewal
          ? "Revisiting Sacred Vows & Garlands Exchange"
          : "Children & Grandchildren Nostalgic Speeches";
      if (idx === 3) title = "Champagne Toast & 25-Year Retrospective Film";
      if (idx === 4) title = "Candlelight Banquet Dinner with Retro Golden Classics";
    } else if (eventType === "Family Reunion" && config.reunion) {
      if (idx === 0) title = "Clan Registration, Welcome Kits & Custom T-Shirt Handout";
      if (idx === 1) title = "Generational Breakfast & Unveiling of the Family Tree";
      if (idx === 2)
        title = `Inter-Branch Tournament: ${config.reunion.familyTournament || "Clan Gully Cricket Match"}`;
      if (idx === 3)
        title = config.reunion.overseasLivestream
          ? "Global Zoom/4K Livestream Toast with NRI Cousins"
          : "Family Talent Show & Childhood Stories";
      if (idx === 4) title = "Open-Air Bonfire Dinner, Barbecue & Generational Antakshari";
    }
    return { ...slot, title };
  });

  // 7. TAILORED MAP SPOTS (Set city address)
  const synthesizedSpots: EventSpot[] = basePreset.eventSpots.map((spot) => {
    return {
      ...spot,
      address: spot.address.includes(",")
        ? `${spot.address.split(",")[0]}, ${finalCity}`
        : `${spot.address}, ${finalCity}`,
    };
  });

  return {
    ...basePreset,
    eventType,
    eventName: resolvedEventName,
    eventCity: finalCity,
    eventDate: finalDate,
    daysRemaining: daysDiff,
    guestCount: finalGuests,
    totalBudget: finalBudget,
    tradition: config.tradition || basePreset.tradition,
    venueStyle: config.venuePreference || config.venueStyle || basePreset.venueStyle,
    categories: scaledCategories,
    milestones: synthesizedMilestones,
    venueZones,
    decisions: customizedDecisions,
    risks: tailoredRisks,
    dayOfSchedule: synthesizedDayOf,
    eventSpots: synthesizedSpots,
  };
}
