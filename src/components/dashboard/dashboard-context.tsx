import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { getPresetForEventType } from "./event-presets-data";
import { type ExtendedEventPlanConfig, generatePersonalizedPlan } from "../../lib/ai-planner";

export type Language = "en" | "hi";

export type PersonaRole = "Owner" | "Planner" | "Viewer" | "Vendor";

export interface Persona {
  id: string;
  name: string;
  relation: string;
  role: PersonaRole;
  avatar: string;
}

export interface DecisionOption {
  id: string;
  name: string;
  vendorName: string;
  price: number;
  rating: number;
  pros: string[];
  cons: string[];
  aiRecommended?: boolean;
  votes: number;
  image: string;
}

export interface Decision {
  id: string;
  title: string;
  category: string;
  costOfDelay: number; // calculated score
  penaltyPerDay: number;
  urgencyDays: number;
  priceSpikeWarning: string;
  downstreamImpacts: number;
  options: DecisionOption[];
  lockedOptionId: string | null;
  lockedAt?: string | undefined;
}

export interface MilestoneTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  daysToGo: number;
  category: string;
  phase: "foundation" | "production" | "crunch" | "celebration";
  owner: string;
  ownerAvatar?: string;
  highImpact: boolean;
  status: "completed" | "in_progress" | "pending";
  dependentIds: string[];
  description?: string;
  autoCompleted?: boolean | undefined;
}

export interface BudgetCategory {
  id: string;
  name: string;
  nameHi: string;
  allocated: number;
  committed: number;
  paid: number;
  icon: string;
  color: string;
}

export interface VenueZone {
  id: string;
  name: string;
  type: "mandap" | "dining" | "buffet" | "bar" | "dance" | "dj" | "photo" | "gate" | "restroom";
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  shape: "pill" | "circle" | "rect";
  color: string;
  capacity?: number | undefined;
  tableNumber?: number | undefined;
  seatedGuestIds?: string[] | undefined;
}

export type DietaryType =
  "Strict Jain" | "Satvik (No Onion/Garlic)" | "Vegetarian" | "Halal" | "Vegan" | "Regular";

export interface Guest {
  id: string;
  name: string;
  group: "Bride Family" | "Groom Family" | "College Friends" | "Office Colleagues" | "Elders";
  rsvp: "Attending" | "Pending" | "Declined";
  diet: DietaryType;
  tableId: string;
  isElderly: boolean;
  feudWithIds: string[];
  phone: string;
}

export interface MurphyRisk {
  id: string;
  title: string;
  description: string;
  triggerCondition: string;
  owner: string;
  reserveCost: number;
  mitigated: boolean;
  severity: "high" | "medium" | "critical";
  planB: string;
  icon: string;
  titleHi?: string | undefined;
}

export interface EventSpot {
  id: string;
  name: string;
  category: "venue" | "hotel" | "ceremony" | "transport" | "afterparty" | "parking";
  lat: number;
  lng: number;
  address: string;
  capacityOrRooms?: string;
  contactPerson?: string;
  phone?: string;
  notes?: string;
  isPrimary?: boolean;
}

export interface CulturalCeremony {
  id: string;
  name: string;
  nameHi: string;
  tradition: string;
  muhuratWindow: string;
  description: string;
  keyItems: string[];
  scheduledTime: string;
  status: "done" | "upcoming" | "next";
}

export interface CreativeIdea {
  id: string;
  category: "Themes" | "Menus" | "Decors" | "Entertainment" | "Activities";
  title: string;
  titleHi: string;
  description: string;
  estCost: string;
  bookmarked: boolean;
  tag: string;
  image: string;
}

export interface ExpenseTransfer {
  from: string;
  to: string;
  amount: number;
}

export const eventThemes: Record<
  string,
  {
    type: string;
    label: string;
    labelHi: string;
    bgImage: string;
    ambientGradient: string;
    accentColor: string;
    badgeColor: string;
    icon: string;
    quote: string;
    tagline: string;
  }
> = {
  Wedding: {
    type: "Wedding",
    label: "Royal Wedding Ceremony",
    labelHi: "शाही विवाह समारोह",
    bgImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
    ambientGradient: "from-amber-500/15 via-rose-500/5 to-transparent",
    accentColor: "#f59e0b",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    icon: "Heart",
    quote: "Two souls uniting under auspicious stars & Vedic blessings",
    tagline: "Sacred Pheras & Sangeet Gala",
  },
  Birthday: {
    type: "Birthday",
    label: "Milestone Birthday Gala",
    labelHi: "भव्य जन्मदिन उत्सव",
    bgImage:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=80",
    ambientGradient: "from-purple-500/15 via-pink-500/5 to-transparent",
    accentColor: "#a855f7",
    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    icon: "Cake",
    quote: "A joyful celebration of laughter, friends, and another glorious year",
    tagline: "Party Beats, Live Counters & Return Gifts",
  },
  "Community Festival": {
    type: "Community Festival",
    label: "Community Mela & Mahotsav",
    labelHi: "भव्य सामुदायिक मेला व महोत्सव",
    bgImage:
      "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1920&q=80",
    ambientGradient: "from-orange-500/15 via-amber-500/5 to-transparent",
    accentColor: "#f97316",
    badgeColor: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
    icon: "Building2",
    quote: "Our people rising together in collective celebration & prasad",
    tagline: "Live Cultural Stage, Stalls & Community Feast",
  },
  Anniversary: {
    type: "Anniversary",
    label: "Silver & Golden Jubilee Gala",
    labelHi: "रजत व स्वर्ण जयंती समारोह",
    bgImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80",
    ambientGradient: "from-amber-400/15 via-yellow-500/5 to-transparent",
    accentColor: "#eab308",
    badgeColor: "bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-400/30",
    icon: "PartyPopper",
    quote: "Honouring decades of enduring devotion, family, and shared triumphs",
    tagline: "Candlelight Dinner, Nostalgic Reels & Family Toasts",
  },
  "Family Reunion": {
    type: "Family Reunion",
    label: "Family Reunion & Homecoming",
    labelHi: "पारिवारिक मिलन व गृहआगमन",
    bgImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80",
    ambientGradient: "from-emerald-500/15 via-teal-500/5 to-transparent",
    accentColor: "#10b981",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    icon: "Users",
    quote: "Generations uniting under one roof to cherish roots and shared history",
    tagline: "Generational Feast, Bonfire & Heritage Stories",
  },
};

export type EventPlanConfig = ExtendedEventPlanConfig;

interface DashboardContextType {
  lang: Language;
  setLang: (l: Language) => void;
  activePersona: Persona;
  setActivePersona: (p: Persona) => void;
  personas: Persona[];

  // Event meta
  eventType: string;
  eventName: string;
  eventCity: string;
  eventDate: string;
  setEventDate: (date: string) => void;
  updateEventDate: (date: string) => void;
  daysRemaining: number;

  // Questionnaire / Setup Wizard
  isWizardOpen: boolean;
  setIsWizardOpen: (open: boolean) => void;
  isDossierOpen: boolean;
  setIsDossierOpen: (open: boolean) => void;
  generateAndLoadCustomPlan: (config: EventPlanConfig) => void;
  resetToSamplePlan: () => void;
  switchEventTypePreset: (
    type: "Wedding" | "Birthday" | "Community Festival" | "Anniversary" | "Family Reunion" | string,
  ) => void;

  // AI Key & Modal
  apiKey: string;
  setApiKey: (key: string) => void;
  isAiKeyModalOpen: boolean;
  setIsAiKeyModalOpen: (open: boolean) => void;

  // 1. Decisions
  decisions: Decision[];
  lockDecision: (decisionId: string, optionId: string | null) => void;
  readinessPercentage: number;
  confettiTrigger: number;

  // 2. Timeline
  milestones: MilestoneTask[];
  updateMilestoneDate: (id: string, newDate: string) => void;
  toggleMilestoneStatus: (id: string) => void;
  setMilestoneStatus: (id: string, status: "completed" | "in_progress" | "pending") => void;
  shiftDownstreamDays: (fromMilestoneId: string, daysShift: number) => void;
  addMilestone: (milestone: Omit<MilestoneTask, "id">) => void;
  deleteMilestone: (id: string) => void;
  hasCongestionAlert: boolean;
  congestionMessage: string;

  // 3. Budget
  categories: BudgetCategory[];
  totalBudget: number;
  totalCommitted: number;
  totalPaid: number;
  updateCategoryRupees: (id: string, field: "committed" | "paid", value: number) => void;

  // 4. Venue & Map Spots
  venueZones: VenueZone[];
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  updateZonePosition: (id: string, x: number, y: number) => void;
  nudgeZone: (id: string, dx: number, dy: number) => void;
  activePreset: string;
  applyPreset: (presetName: string) => void;
  eventSpots: EventSpot[];
  setEventSpots: React.Dispatch<React.SetStateAction<EventSpot[]>>;
  addEventSpot: (spot: Omit<EventSpot, "id">) => void;
  removeEventSpot: (id: string) => void;
  updateEventSpot: (id: string, updates: Partial<EventSpot>) => void;

  // 5. Guests
  guests: Guest[];
  addGuest: (guest: Omit<Guest, "id">) => void;
  updateGuestRsvp: (id: string, rsvp: Guest["rsvp"]) => void;
  assignGuestTable: (guestId: string, tableId: string) => void;
  dietCounts: Record<DietaryType, number>;
  rsvpCounts: { Attending: number; Pending: number; Declined: number };
  harmonyAlerts: string[];

  // 6. What-if Simulator
  simGuests: number;
  setSimGuests: (n: number) => void;
  simBudget: number;
  setSimBudget: (n: number) => void;
  applySimulationToMaster: () => void;
  simDeltas: {
    guestDiff: number;
    cateringDiff: number;
    venueUpgradeNotice: string | null;
    bufferWeeksDelta: number;
  };

  // 7. Murphy risks
  risks: MurphyRisk[];
  toggleRiskMitigation: (id: string) => void;

  // 8. Cultural packs
  activeCulture: string;
  setActiveCulture: (c: string) => void;
  culturalCeremonies: Record<string, CulturalCeremony[]>;

  // 9. Day of execution
  dayOfSchedule: Array<{
    id: string;
    time: string;
    title: string;
    owner: string;
    status: "completed" | "current" | "upcoming";
    phone: string;
  }>;
  apply20MinDelay: () => void;

  // 10. Wrap & Debt transfers
  expenseTransfers: ExpenseTransfer[];

  // 11. Creative ideas
  ideas: CreativeIdea[];
  toggleBookmarkIdea: (id: string) => void;

  // Active navigation tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const personasList: Persona[] = [
  {
    id: "p1",
    name: "Priya Sharma",
    relation: "Chief Planner",
    role: "Owner",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "p2",
    name: "Aarav Mehra",
    relation: "Groom",
    role: "Planner",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "p3",
    name: "Meera Sen",
    relation: "Bride",
    role: "Planner",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "p4",
    name: "Rajesh Mehra (Papa)",
    relation: "Family Elder",
    role: "Viewer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "p5",
    name: "Suresh (Royal Decor)",
    relation: "Decor Partner",
    role: "Vendor",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
];

export const initialDecisions: Decision[] = [
  {
    id: "dec-1",
    title: "Saturday Evening Mandap Slot Confirmation",
    category: "Venue & Lawns",
    costOfDelay: 94,
    penaltyPerDay: 28500,
    urgencyDays: 2,
    priceSpikeWarning: "+12% price spike if Saturday slot hold expires in 36h",
    downstreamImpacts: 5,
    lockedOptionId: null,
    options: [
      {
        id: "opt-1a",
        name: "Emerald Green Palace Lawns",
        vendorName: "Grand Palace Resorts",
        price: 780000,
        rating: 4.9,
        pros: ["Spacious 600-capacity lawn", "Mandap lighting included", "Separate baraat gate"],
        cons: ["Requires private valet permit", "10:30 PM strict music cutoff"],
        aiRecommended: true,
        votes: 4,
        image:
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "opt-1b",
        name: "The Grand Regency Heritage Hall",
        vendorName: "Regency Hospitality",
        price: 850000,
        rating: 4.7,
        pros: ["Fully air-conditioned indoor mandap", "In-house generator backup", "5 green rooms"],
        cons: ["No live open flame tandoor inside", "18% fixed banquet service fee"],
        aiRecommended: false,
        votes: 1,
        image:
          "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    id: "dec-2",
    title: "Master Banquet & Live Counters Catering Contract",
    category: "Food & Catering",
    costOfDelay: 88,
    penaltyPerDay: 19000,
    urgencyDays: 4,
    priceSpikeWarning: "Ingredients rate lock expires Friday (+₹85/plate surge)",
    downstreamImpacts: 4,
    lockedOptionId: null,
    options: [
      {
        id: "opt-2a",
        name: "Royal Rasoi & Authentic Jain Gourmet",
        vendorName: "Chef Hemant Mehta",
        price: 680000,
        rating: 4.95,
        pros: [
          "Dedicated separate kitchen for Jain/Satvik",
          "16 live chat & dessert counters",
          "Tasting session praised by elders",
        ],
        cons: ["Advance deposit non-refundable after 15 days"],
        aiRecommended: true,
        votes: 5,
        image:
          "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "opt-2b",
        name: "Spice Symphony Catering Studio",
        vendorName: "Symphony Banquets",
        price: 720000,
        rating: 4.6,
        pros: ["Continental + Pan Asian fusion spread", "Cocktail bar bites included"],
        cons: ["Higher rate for separate Jain counters (+₹180/plate)"],
        aiRecommended: false,
        votes: 0,
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    id: "dec-3",
    title: "Cinematic 4K Drone & Candid Wedding Photo Team",
    category: "Photography & Cinematography",
    costOfDelay: 76,
    penaltyPerDay: 12000,
    urgencyDays: 6,
    priceSpikeWarning: "Top studio booking window closes this week (+₹25,000 surge)",
    downstreamImpacts: 3,
    lockedOptionId: null,
    options: [
      {
        id: "opt-3a",
        name: "Lumiere Tales Wedding Cinema",
        vendorName: "Director Shrikant & Team",
        price: 240000,
        rating: 4.9,
        pros: [
          "Dual 4K cinema cameras + licensed drone",
          "Next-day teaser reel for Instagram",
          "Uncompressed RAW footage delivery",
        ],
        cons: ["Requires travel & stay for 4 crew members"],
        aiRecommended: true,
        votes: 3,
        image:
          "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "opt-3b",
        name: "Eternal Moments Photography",
        vendorName: "Vikram Malhotra Visuals",
        price: 290000,
        rating: 4.7,
        pros: ["Includes pre-wedding shoot in Lonavala", "3 luxury leather albums"],
        cons: ["Teaser turnaround takes 14 days"],
        aiRecommended: false,
        votes: 1,
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    id: "dec-4",
    title: "Sangeet Sound Reinforcement & Stage Lighting Rig",
    category: "Sound, Lights & DJ",
    costOfDelay: 68,
    penaltyPerDay: 8500,
    urgencyDays: 9,
    priceSpikeWarning: "Line array speaker truss requires 3 weeks lead booking",
    downstreamImpacts: 2,
    lockedOptionId: null,
    options: [
      {
        id: "opt-4a",
        name: "Bassline Acoustics & Intelligent DMX Beams",
        vendorName: "DJ Sunny & Production",
        price: 165000,
        rating: 4.8,
        pros: [
          "JBL VTX Line array system",
          "Cold fire pyrotechnics for couple entry",
          "Direct sound-mixer recorder",
        ],
        cons: ["Requires 63A 3-phase venue power hookup"],
        aiRecommended: true,
        votes: 3,
        image:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
      },
      {
        id: "opt-4b",
        name: "Star Audio & Retro Bollywood DJ Setup",
        vendorName: "DJ Rahul",
        price: 130000,
        rating: 4.4,
        pros: ["Pocket friendly", "Includes smoke machine"],
        cons: ["Older speakers without digital sound delay control"],
        aiRecommended: false,
        votes: 1,
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
];

export const initialMilestones: MilestoneTask[] = [
  {
    id: "m-1",
    title: "Lock Venue & Transfer 25% Advance",
    date: "2026-11-05",
    daysToGo: 6,
    category: "Venue & Lawns",
    phase: "foundation",
    owner: "Priya (Lead Planner)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "in_progress",
    dependentIds: ["m-2", "m-3", "m-4"],
    description:
      "Signs contract for 600-capacity lawn, locks Saturday slot hold, and secures valet gate clearances.",
  },
  {
    id: "m-2",
    title: "Mandap Decor Blueprint Sign-off",
    date: "2026-11-07",
    daysToGo: 8,
    category: "Decor & Floral",
    phase: "foundation",
    owner: "Meera (Bride)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "pending",
    dependentIds: ["m-5"],
    description:
      "Finalizes 3D renders for hanging rajnigandha floral arches, phera seating, and stage elevation.",
  },
  {
    id: "m-3",
    title: "Catering Menu & Tasting Freeze",
    date: "2026-11-08",
    daysToGo: 9,
    category: "Food & Catering",
    phase: "foundation",
    owner: "Papa (Rajesh)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "pending",
    dependentIds: ["m-6"],
    description:
      "Family taste verification for pure Satvik delicacies, Jain live chaat counter, and 3-tier sweets spread.",
  },
  {
    id: "m-4",
    title: "Sound & DJ Generator Clearance",
    date: "2026-11-09",
    daysToGo: 10,
    category: "Sound, Lights & DJ",
    phase: "foundation",
    owner: "Aarav (Groom)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "pending",
    dependentIds: [],
    description:
      "Line-array truss inspection, 63A 3-phase venue hookup test, and police 10 PM sound curfew protocol.",
  },
  {
    id: "m-5",
    title: "Floral Orders & Mandap Fabrication",
    date: "2026-11-18",
    daysToGo: 19,
    category: "Decor & Floral",
    phase: "production",
    owner: "Suresh (Royal Decor)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    highImpact: false,
    status: "pending",
    dependentIds: ["m-7"],
    description:
      "Wholesale fresh marigold and lotus procurement from market plus wooden pillar carpentry check.",
  },
  {
    id: "m-6",
    title: "Jain & Satvik Counter Segregation Audit",
    date: "2026-11-22",
    daysToGo: 23,
    category: "Food & Catering",
    phase: "production",
    owner: "Papa (Rajesh)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "pending",
    dependentIds: [],
    description:
      "Separate kitchen vessel verification, root-vegetable-free spice pantry audit, and dedicated service staff.",
  },
  {
    id: "m-7",
    title: "Final Venue Dry Run & Sound Check",
    date: "2026-12-08",
    daysToGo: 39,
    category: "Execution & Tech",
    phase: "crunch",
    owner: "Priya (Lead Planner)",
    ownerAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "pending",
    dependentIds: ["m-8"],
    description:
      "Full lighting beam test, cold pyrotechnics dry run, generator cutover test (<3s), and priest walk-through.",
  },
  {
    id: "m-8",
    title: "GRAND WEDDING & RECEPTION CELEBRATION",
    date: "2026-12-12",
    daysToGo: 43,
    category: "Celebration",
    phase: "celebration",
    owner: "All Family & Teams",
    ownerAvatar:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=160&q=80",
    highImpact: true,
    status: "pending",
    dependentIds: [],
    description:
      "The big celebration! Baraat entry, Jaimala on central stage, auspicious pheras, and 400-guest gala banquet.",
  },
];

export const initial12Categories: BudgetCategory[] = [
  {
    id: "c1",
    name: "Venue & Lawns",
    nameHi: "स्थान और लॉन",
    allocated: 780000,
    committed: 780000,
    paid: 250000,
    icon: "Building2",
    color: "#6366f1",
  },
  {
    id: "c2",
    name: "Food & Catering",
    nameHi: "खान-पान और कैटरिंग",
    allocated: 680000,
    committed: 650000,
    paid: 200000,
    icon: "UtensilsCrossed",
    color: "#f97316",
  },
  {
    id: "c3",
    name: "Decor, Floral & Mandap",
    nameHi: "सजावट और मंडप",
    allocated: 320000,
    committed: 310000,
    paid: 100000,
    icon: "Sparkles",
    color: "#ec4899",
  },
  {
    id: "c4",
    name: "Photography & Cinema",
    nameHi: "फोटोग्राफी और सिनेमा",
    allocated: 240000,
    committed: 240000,
    paid: 80000,
    icon: "Camera",
    color: "#06b6d4",
  },
  {
    id: "c5",
    name: "Sound, Lights & DJ",
    nameHi: "साउंड, लाइट्स और डीजे",
    allocated: 165000,
    committed: 165000,
    paid: 50000,
    icon: "Music",
    color: "#8b5cf6",
  },
  {
    id: "c6",
    name: "Attire & Styling",
    nameHi: "पारंपरिक पोशाक और स्टाइल",
    allocated: 110000,
    committed: 95000,
    paid: 60000,
    icon: "Shirt",
    color: "#10b981",
  },
  {
    id: "c7",
    name: "Mehendi & Makeup",
    nameHi: "मेहंदी और मेकअप",
    allocated: 45000,
    committed: 45000,
    paid: 20000,
    icon: "Palette",
    color: "#f43f5e",
  },
  {
    id: "c8",
    name: "Invitations & Stationery",
    nameHi: "निमंत्रण पत्र",
    allocated: 25000,
    committed: 22000,
    paid: 22000,
    icon: "Mail",
    color: "#eab308",
  },
  {
    id: "c9",
    name: "Logistics & Valet",
    nameHi: "लॉजिस्टिक्स और वैलेट",
    allocated: 40000,
    committed: 35000,
    paid: 15000,
    icon: "Car",
    color: "#64748b",
  },
  {
    id: "c10",
    name: "Entertainment & Artists",
    nameHi: "मनोरंजन और कलाकार",
    allocated: 35000,
    committed: 30000,
    paid: 10000,
    icon: "Mic2",
    color: "#3b82f6",
  },
  {
    id: "c11",
    name: "Gifts & Favours",
    nameHi: "उपहार और भेंट",
    allocated: 30000,
    committed: 25000,
    paid: 12000,
    icon: "Gift",
    color: "#14b8a6",
  },
  {
    id: "c12",
    name: "Emergency Reserve Buffer",
    nameHi: "आपातकालीन आरक्षित निधि",
    allocated: 30000,
    committed: 0,
    paid: 0,
    icon: "ShieldAlert",
    color: "#d97706",
  },
];

export const initialVenueZones: VenueZone[] = [
  {
    id: "z-mandap",
    name: "Stage & Holy Mandap",
    type: "mandap",
    x: 40,
    y: 8,
    width: 22,
    height: 15,
    shape: "pill",
    color: "rgba(245, 158, 11, 0.95)",
    capacity: 20,
  },
  {
    id: "z-t1",
    name: "Table 1 (Family Elders)",
    type: "dining",
    x: 12,
    y: 35,
    width: 14,
    height: 14,
    shape: "circle",
    color: "rgba(13, 148, 136, 0.95)",
    tableNumber: 1,
    capacity: 8,
    seatedGuestIds: ["g1", "g2", "g3", "g4"],
  },
  {
    id: "z-t2",
    name: "Table 2 (Bride Family)",
    type: "dining",
    x: 30,
    y: 35,
    width: 14,
    height: 14,
    shape: "circle",
    color: "rgba(13, 148, 136, 0.95)",
    tableNumber: 2,
    capacity: 8,
    seatedGuestIds: ["g5", "g6"],
  },
  {
    id: "z-t3",
    name: "Table 3 (Groom Family)",
    type: "dining",
    x: 58,
    y: 35,
    width: 14,
    height: 14,
    shape: "circle",
    color: "rgba(13, 148, 136, 0.95)",
    tableNumber: 3,
    capacity: 8,
    seatedGuestIds: ["g7", "g8"],
  },
  {
    id: "z-t4",
    name: "Table 4 (College Friends)",
    type: "dining",
    x: 76,
    y: 35,
    width: 14,
    height: 14,
    shape: "circle",
    color: "rgba(13, 148, 136, 0.95)",
    tableNumber: 4,
    capacity: 8,
    seatedGuestIds: ["g9", "g10", "g11"],
  },
  {
    id: "z-dance",
    name: "Dance Floor & Sangeet Ring",
    type: "dance",
    x: 36,
    y: 55,
    width: 28,
    height: 18,
    shape: "rect",
    color: "rgba(168, 85, 247, 0.9)",
  },
  {
    id: "z-dj",
    name: "DJ Console & Sound Mixer",
    type: "dj",
    x: 40,
    y: 76,
    width: 20,
    height: 9,
    shape: "rect",
    color: "rgba(99, 102, 241, 0.95)",
  },
  {
    id: "z-buffet",
    name: "Live Food Buffets & Chaat",
    type: "buffet",
    x: 4,
    y: 65,
    width: 24,
    height: 15,
    shape: "rect",
    color: "rgba(249, 115, 22, 0.95)",
  },
  {
    id: "z-bar",
    name: "Welcome Drink Bar & Mocktails",
    type: "bar",
    x: 72,
    y: 65,
    width: 24,
    height: 15,
    shape: "rect",
    color: "rgba(59, 130, 246, 0.95)",
  },
  {
    id: "z-photo",
    name: "Photo Wall & Floral Scrapbook",
    type: "photo",
    x: 78,
    y: 12,
    width: 18,
    height: 14,
    shape: "rect",
    color: "rgba(244, 63, 94, 0.9)",
  },
  {
    id: "z-gate",
    name: "Main Welcome Gate & Valet Drop",
    type: "gate",
    x: 36,
    y: 91,
    width: 28,
    height: 7,
    shape: "pill",
    color: "rgba(16, 185, 129, 0.95)",
  },
  {
    id: "z-restroom",
    name: "Restrooms & Green Rooms",
    type: "restroom",
    x: 4,
    y: 12,
    width: 18,
    height: 14,
    shape: "rect",
    color: "rgba(100, 116, 139, 0.95)",
  },
];

export const initialGuests: Guest[] = [
  {
    id: "g1",
    name: "Dadaji Mohanlal Mehra",
    group: "Elders",
    rsvp: "Attending",
    diet: "Satvik (No Onion/Garlic)",
    tableId: "z-t1",
    isElderly: true,
    feudWithIds: [],
    phone: "+91 98220 11223",
  },
  {
    id: "g2",
    name: "Dadi Shanti Mehra",
    group: "Elders",
    rsvp: "Attending",
    diet: "Satvik (No Onion/Garlic)",
    tableId: "z-t1",
    isElderly: true,
    feudWithIds: [],
    phone: "+91 98220 11224",
  },
  {
    id: "g3",
    name: "Rajesh Mehra (Papa)",
    group: "Elders",
    rsvp: "Attending",
    diet: "Vegetarian",
    tableId: "z-t1",
    isElderly: false,
    feudWithIds: ["g6"],
    phone: "+91 98200 44556",
  },
  {
    id: "g4",
    name: "Sunita Mehra (Mummy)",
    group: "Elders",
    rsvp: "Attending",
    diet: "Vegetarian",
    tableId: "z-t1",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98200 44557",
  },
  {
    id: "g5",
    name: "Kishore Sen (Bride Father)",
    group: "Bride Family",
    rsvp: "Attending",
    diet: "Vegetarian",
    tableId: "z-t2",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98190 22334",
  },
  {
    id: "g6",
    name: "Ramesh Mehra (Chacha)",
    group: "Groom Family",
    rsvp: "Attending",
    diet: "Vegetarian",
    tableId: "z-t3",
    isElderly: false,
    feudWithIds: ["g3"],
    phone: "+91 98210 55667",
  },
  {
    id: "g7",
    name: "Kavita Sen (Masi)",
    group: "Bride Family",
    rsvp: "Attending",
    diet: "Strict Jain",
    tableId: "z-t2",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98230 66778",
  },
  {
    id: "g8",
    name: "Vikram Kothari (Uncle)",
    group: "Groom Family",
    rsvp: "Attending",
    diet: "Strict Jain",
    tableId: "z-t3",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98450 77889",
  },
  {
    id: "g9",
    name: "Rohan Deshmukh",
    group: "College Friends",
    rsvp: "Attending",
    diet: "Regular",
    tableId: "z-t4",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98900 88990",
  },
  {
    id: "g10",
    name: "Tanvi Bhatt",
    group: "College Friends",
    rsvp: "Attending",
    diet: "Vegan",
    tableId: "z-t4",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98700 99001",
  },
  {
    id: "g11",
    name: "Farhan Qureshi",
    group: "College Friends",
    rsvp: "Attending",
    diet: "Halal",
    tableId: "z-t4",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98600 11223",
  },
  {
    id: "g12",
    name: "Sneha Roy",
    group: "Office Colleagues",
    rsvp: "Pending",
    diet: "Vegetarian",
    tableId: "",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98300 22334",
  },
  {
    id: "g13",
    name: "Anish Verma",
    group: "Office Colleagues",
    rsvp: "Pending",
    diet: "Regular",
    tableId: "",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98110 33445",
  },
  {
    id: "g14",
    name: "Manish Agarwal",
    group: "Groom Family",
    rsvp: "Declined",
    diet: "Strict Jain",
    tableId: "",
    isElderly: false,
    feudWithIds: [],
    phone: "+91 98220 55443",
  },
];

export const initialRisks: MurphyRisk[] = [
  {
    id: "r1",
    title: "Outdoor Rainstorm or Sudden High Winds",
    description: "Unseasonal tropical shower on open-air reception lawn.",
    triggerCondition: "Barometer drop or Pune IMD rain alert >40%",
    owner: "Priya (Planner)",
    reserveCost: 22000,
    mitigated: true,
    severity: "high",
    planB: "Pre-contracted German waterproof canopy hold; 45-min rapid deployment crew on standby.",
    icon: "CloudRain",
  },
  {
    id: "r2",
    title: "Food Shortage / Surprise Guest Surge (+50 people)",
    description: "Unregistered cousins and plus-ones push dinner turnout above 420.",
    triggerCondition: "Live valet car count crosses 180 vehicles",
    owner: "Papa (Rajesh)",
    reserveCost: 28000,
    mitigated: true,
    severity: "high",
    planB:
      "Caterer buffer contract active (+60 portions baseline ingredients prepped, 20-min emergency hot tawa pulao & paratha turnaround).",
    icon: "UtensilsCrossed",
  },
  {
    id: "r3",
    title: "Police Noise Curfew at 10:00 PM",
    description: "Outdoor lawn decibel sensors trigger municipal warning.",
    triggerCondition: "Clock hits 09:45 PM during Sangeet peak",
    owner: "Aarav (Groom)",
    reserveCost: 0,
    mitigated: true,
    severity: "critical",
    planB:
      "Silent Disco wireless headphone sets for 150 guests or smooth switch into Soundproof Regency Banquets Hall B.",
    icon: "VolumeX",
  },
  {
    id: "r4",
    title: "DJ / Master of Ceremonies No-Show",
    description: "DJ caught in expressway landslide or health emergency.",
    triggerCondition: "Check-in not verified by 04:00 PM",
    owner: "Rohan (Friend)",
    reserveCost: 15000,
    mitigated: true,
    severity: "medium",
    planB:
      "Backup resident DJ Rohit on 2-hour standby; master 8-hour lossless high-energy wedding playlist preloaded on iPad + analog mixer.",
    icon: "Music",
  },
  {
    id: "r5",
    title: "Electricity Cutoff / Sudden Power Outage",
    description:
      "City electricity grid failure, transformer trip or sudden load shedding during pheras, stage entry, or dinner.",
    triggerCondition: "Grid voltage drop below 190V or line cut",
    owner: "Suresh (Power & Electric Lead)",
    reserveCost: 22000,
    mitigated: true,
    severity: "critical",
    planB:
      "Dual 125 kVA Silent Soundproof Diesel Generators on Auto-Mains Failure (AMF) synchronizer switch (<3 second auto cutover). 450-liter diesel reserve secured on-site with certified electric technician on active stage standby.",
    icon: "Zap",
  },
  {
    id: "r6",
    title: "Attire Tears, Zipper Failures or Turmeric Stains",
    description: "Heavy bridal lehenga hook tears or haldi splashes on sherwani.",
    triggerCondition: "Day-of bridal suite wardrobe distress",
    owner: "Meera (Bride)",
    reserveCost: 4500,
    mitigated: true,
    severity: "medium",
    planB:
      "Bridal SOS emergency vanity trunk with industrial steam iron, heavy-duty safety pins, colourless stain remover pens, and matching embroidery thread.",
    icon: "Scissors",
  },
  {
    id: "r7",
    title: "Medical Emergency or Elder Heat Exhaustion",
    description: "Dehydration or hypertension episode among senior grandparents.",
    triggerCondition: "Elder dizziness or pulse fluctuation",
    owner: "Dr. Kothari (Family)",
    reserveCost: 8000,
    mitigated: false,
    severity: "high",
    planB:
      "Air-conditioned rest lounge with rehydration electrolytes, digital BP monitor, portable oxygen can, and tie-up with local clinic (6 mins away).",
    icon: "HeartPulse",
  },
  {
    id: "r8",
    title: "Airport Guest Shuttle Highway Bottleneck",
    description: "Flight batch delayed by 90 minutes.",
    triggerCondition: "Flight radar delay notification",
    owner: "Aarav (Groom)",
    reserveCost: 9000,
    mitigated: false,
    severity: "medium",
    planB:
      "Second on-call 17-seater Tempo Traveller dispatched directly via alternate bypass route.",
    icon: "Bus",
  },
];

export const initialCulturalCeremonies: Record<string, CulturalCeremony[]> = {
  maharashtrian: [
    {
      id: "m-c1",
      name: "Sakharpuda (Ring & Sugar Ceremony)",
      nameHi: "साखरपुडा",
      tradition: "Maharashtrian",
      muhuratWindow: "09:15 AM - 10:30 AM",
      description: "Official engagement; exchange of silver cone of sugar, saree, and gold ring.",
      keyItems: ["Silver Sakharpuda cone", "Paithani Saree", "Coconuts & Betel leaves"],
      scheduledTime: "09:30 AM",
      status: "done",
    },
    {
      id: "m-c2",
      name: "Kelvan (Pre-wedding Family Feast)",
      nameHi: "केळवण",
      tradition: "Maharashtrian",
      muhuratWindow: "12:30 PM - 03:00 PM",
      description: "Intimate family blessing luncheon hosted by maternal uncles.",
      keyItems: ["Ukadiche Modak", "Alu Vadi", "Gold coin gift"],
      scheduledTime: "01:00 PM",
      status: "done",
    },
    {
      id: "m-c3",
      name: "Antarpat & Mangalashtak",
      nameHi: "अंतरपाट व मंगलाष्टक",
      tradition: "Maharashtrian",
      muhuratWindow: "11:18 AM Exact Auspicious Muhurat",
      description: "Sacred silk cloth held between couple as auspicious shlokas are chanted.",
      keyItems: ["Silk Antarpat cloth", "Akshata (sacred unbroken rice)", "Varmala"],
      scheduledTime: "11:15 AM",
      status: "next",
    },
    {
      id: "m-c4",
      name: "Saptapadi & Kanyadaan",
      nameHi: "सप्तपदी व कन्यादान",
      tradition: "Maharashtrian",
      muhuratWindow: "12:00 PM - 01:15 PM",
      description: "Seven sacred vows around holy Agni followed by betel nut phera.",
      keyItems: ["Agni kund", "Havan samagri", "Puffed rice (Laja)"],
      scheduledTime: "12:10 PM",
      status: "upcoming",
    },
    {
      id: "m-c5",
      name: "Traditional Puran Poli Feast",
      nameHi: "पुरणपोळी महाभोज",
      tradition: "Maharashtrian",
      muhuratWindow: "01:30 PM Onwards",
      description:
        "Authentic celebratory banquet with Katachi Amti, Puran Poli and fragrant saffron ghee.",
      keyItems: ["Pure Desi Ghee", "Hot Katachi Amti", "Papad & Koshimbir"],
      scheduledTime: "01:30 PM",
      status: "upcoming",
    },
  ],
  gujarati: [
    {
      id: "g-c1",
      name: "Mandap Mahurat & Ganesh Sthapana",
      nameHi: "મંડપ મુહૂર્ત",
      tradition: "Gujarati",
      muhuratWindow: "08:30 AM - 10:00 AM",
      description: "Sanctification of wedding grounds and prayers to Lord Ganesha.",
      keyItems: ["Clay pot", "Turmeric roots", "Red thread (Mauli)"],
      scheduledTime: "08:45 AM",
      status: "upcoming",
    },
    {
      id: "g-c2",
      name: "Rocking Garba & Raas Sanji Night",
      nameHi: "ગરબા રાસ નાઇટ",
      tradition: "Gujarati",
      muhuratWindow: "07:30 PM - 11:30 PM",
      description: "Electrifying folk dance with ornate wooden dandiyas and live dhol rhythm.",
      keyItems: ["150 Pairs wooden Dandiyas", "Fafda-Jalebi live station", "LED Garba floor"],
      scheduledTime: "07:30 PM",
      status: "upcoming",
    },
    {
      id: "g-c3",
      name: "Ponkvu & Jaimala Welcome",
      nameHi: "પોંખવું",
      tradition: "Gujarati",
      muhuratWindow: "10:30 AM - 11:15 AM",
      description: "Mother-in-law playful nose-pinching welcome with pestle and butter-churner.",
      keyItems: ["Sambhela (Pestle)", "Pauva & Curd", "Kanku plate"],
      scheduledTime: "10:45 AM",
      status: "upcoming",
    },
    {
      id: "g-c4",
      name: "Royal Undhiyu & Jain Buffet",
      nameHi: "ઊંધિયું જૈન ભોજન",
      tradition: "Gujarati",
      muhuratWindow: "01:00 PM Onwards",
      description: "Surti Undhiyu feast with strictly root-free Jain variations and Basundi.",
      keyItems: ["Surti Papdi", "Methi Muthiya", "Kesar Pista Basundi"],
      scheduledTime: "01:00 PM",
      status: "upcoming",
    },
  ],
  punjabi: [
    {
      id: "p-c1",
      name: "Chooda & Kaleere Ceremony",
      nameHi: "चूड़ा और कलीरे",
      tradition: "Punjabi",
      muhuratWindow: "09:00 AM - 10:30 AM",
      description:
        "Maternal uncles bathe red chooda in milk; sister-in-laws tie auspicious golden kaleere.",
      keyItems: ["21 Ivory red bangles", "Subah milk bowl", "Gold coconut kaleere"],
      scheduledTime: "09:30 AM",
      status: "upcoming",
    },
    {
      id: "p-c2",
      name: "Rocking Sangeet & Jaago Night",
      nameHi: "जागो और संगीत",
      tradition: "Punjabi",
      muhuratWindow: "07:00 PM - 11:30 PM",
      description: "Decorated brass pots with glowing candles carried with spirited boliyan.",
      keyItems: ["Brass Jaago pot with LED lights", "Chhadi stick with bells", "Live Dhol beats"],
      scheduledTime: "08:00 PM",
      status: "upcoming",
    },
    {
      id: "p-c3",
      name: "Anand Karaj (Holy Gurdwara Vows)",
      nameHi: "आनंद कारज",
      tradition: "Punjabi",
      muhuratWindow: "10:00 AM - 12:00 PM",
      description: "Four sacred Laavan circumambulations around Guru Granth Sahib.",
      keyItems: ["Head coverings (Rumaal)", "Palla shawl", "Karah Prashad"],
      scheduledTime: "10:30 AM",
      status: "upcoming",
    },
    {
      id: "p-c4",
      name: "Amritsari Kulcha & Tandoori Feast",
      nameHi: "अमृतसरी कुलचा व दावत",
      tradition: "Punjabi",
      muhuratWindow: "01:00 PM Onwards",
      description:
        "Live clay tandoors with stuffed chur-chur kulchas, Dal Makhani and Pista Kulfi.",
      keyItems: ["Clay Tandoor station", "White butter", "Matka Kulfi"],
      scheduledTime: "01:00 PM",
      status: "upcoming",
    },
  ],
  south_indian: [
    {
      id: "s-c1",
      name: "Vratham & Kasi Yatra",
      nameHi: "काशी यात्रा",
      tradition: "South Indian",
      muhuratWindow: "07:00 AM - 08:30 AM",
      description:
        "Groom sets out for Varanasi pilgrimage; bride's father persuades him to choose married life.",
      keyItems: ["Bamboo umbrella", "Walking stick", "Bhagavad Gita booklet"],
      scheduledTime: "07:30 AM",
      status: "upcoming",
    },
    {
      id: "s-c2",
      name: "Oonjal (Swing Ritual)",
      nameHi: "ऊँजल (झूला)",
      tradition: "South Indian",
      muhuratWindow: "08:45 AM - 09:30 AM",
      description: "Couple rocks gently on decorated floral swing as women sing blessing melodies.",
      keyItems: ["Floral wooden swing", "Milk and banana balls", "Coloured rice balls"],
      scheduledTime: "09:00 AM",
      status: "upcoming",
    },
    {
      id: "s-c3",
      name: "Muhurtham & Mangalya Dharanam",
      nameHi: "मुहूर्तम व ताली",
      tradition: "South Indian",
      muhuratWindow: "09:45 AM - 10:45 AM",
      description: "Three sacred knots tied on yellow turmeric cord with Nadaswaram crescendos.",
      keyItems: ["Gold Thali (Mangalsutra)", "Yellow thread", "Koorai silk saree"],
      scheduledTime: "10:15 AM",
      status: "upcoming",
    },
    {
      id: "s-c4",
      name: "Grand Banana Leaf Sadhya",
      nameHi: "केले के पत्ते पर सद्या",
      tradition: "South Indian",
      muhuratWindow: "12:00 PM Onwards",
      description: "24-item traditional feast served sequentially on fresh plantain leaves.",
      keyItems: ["Fresh cut plantain leaves", "Avial, Sambar & Rasam", "Paal Payasam"],
      scheduledTime: "12:30 PM",
      status: "upcoming",
    },
  ],
  muslim: [
    {
      id: "mu-c1",
      name: "Manjha & Mehendi Night",
      nameHi: "मांझा और मेहंदी",
      tradition: "Muslim",
      muhuratWindow: "06:30 PM - 09:30 PM",
      description:
        "Turmeric paste application with lively family geet and intricate Arabic mehendi.",
      keyItems: ["Fresh henna cones", "Yellow floral jewellery", "Attar perfume"],
      scheduledTime: "07:00 PM",
      status: "upcoming",
    },
    {
      id: "mu-c2",
      name: "Nikah Contract & Ijab-e-Qubool",
      nameHi: "निकाह अनुबंध",
      tradition: "Muslim",
      muhuratWindow: "11:00 AM - 12:30 PM",
      description: "Recitation of Quranic verses, agreement of Mahr, and signing the Nikahnama.",
      keyItems: ["Calligraphed Nikahnama", "Pen with feather quill", "Mahr tokens"],
      scheduledTime: "11:30 AM",
      status: "upcoming",
    },
    {
      id: "mu-c3",
      name: "Walima Reception & Dum Biryani",
      nameHi: "वलीमा दावत",
      tradition: "Muslim",
      muhuratWindow: "07:30 PM Onwards",
      description:
        "Grand celebratory dinner with authentic slow-cooked dum biryani, haleem, and shahi tukda.",
      keyItems: ["Copper Handi pots", "Shahi Tukda", "Kashmiri Kahwa samovar"],
      scheduledTime: "08:00 PM",
      status: "upcoming",
    },
  ],
  western: [
    {
      id: "w-c1",
      name: "Exchange of Vows & Rings",
      nameHi: "विवाह प्रतिज्ञा व अंगूठी",
      tradition: "Western Civil",
      muhuratWindow: "04:30 PM - 05:30 PM",
      description: "Personal vow recital under floral arch followed by exchange of platinum bands.",
      keyItems: ["Handmade vow books", "Velvet ring box", "White petal baskets"],
      scheduledTime: "05:00 PM",
      status: "upcoming",
    },
    {
      id: "w-c2",
      name: "Champagne Toast & Speeches",
      nameHi: "शैम्पेन टोस्ट",
      tradition: "Western Civil",
      muhuratWindow: "06:00 PM - 07:00 PM",
      description: "Best man and maid of honour toasts followed by sparkling flute clinking.",
      keyItems: ["Crystal flutes", "Non-alcoholic sparkling cider", "Wireless microphone"],
      scheduledTime: "06:15 PM",
      status: "upcoming",
    },
    {
      id: "w-c3",
      name: "First Dance & Tiered Cake Cutting",
      nameHi: "प्रथम नृत्य व केक",
      tradition: "Western Civil",
      muhuratWindow: "07:30 PM - 08:30 PM",
      description:
        "Couple's romantic waltz on low-lying cloud fog followed by 3-tier Belgian truffle cake.",
      keyItems: ["3-Tier wedding cake", "Silver cake cutter", "Low fog machine"],
      scheduledTime: "07:45 PM",
      status: "upcoming",
    },
  ],
};

export const initialIdeas: CreativeIdea[] = [
  {
    id: "i1",
    category: "Themes",
    title: "Royal Peshwai & Maratha Heritage",
    titleHi: "शाही पेशवाई व मराठा विरासत",
    description:
      "Antique brass samai lamps, royal orange and gold drapery, and trumpet Tutari welcomes for the bride and groom.",
    estCost: "₹45,000",
    bookmarked: true,
    tag: "Traditional",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i2",
    category: "Menus",
    title: "Live Artisanal Chaat Street & Kulhad Chai",
    titleHi: "लाइव चाट गली और कुल्हड़ चाय",
    description:
      "Interactive Delhi-style papdi chaat, palak patta crisps, and smoky terracotta kulhad masala chai brewed fresh.",
    estCost: "₹35,000",
    bookmarked: true,
    tag: "Foodie Favourite",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i3",
    category: "Decors",
    title: "Floating Marigold & Candle Waterbody",
    titleHi: "तैरती गेंदा माला व जलकुंड",
    description:
      "Submerged brass urli bowls with fragrant orange marigolds and scented beeswax floating diyas along the entrance path.",
    estCost: "₹22,000",
    bookmarked: false,
    tag: "Eco Elegant",
    image:
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i4",
    category: "Entertainment",
    title: "Interactive Dhol & Brass Band Flashmob",
    titleHi: "ढोल व ब्रास बैंड फ्लैशमब",
    description:
      "Surprise crescendo entry where 8 traditional Puneri dhol drummers energize the dance floor during Sangeet climax.",
    estCost: "₹28,000",
    bookmarked: true,
    tag: "High Energy",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i5",
    category: "Activities",
    title: "Retro Polaroid Scrapbook Corner",
    titleHi: "रेट्रो पोलरॉइड स्क्रैपबुक कोना",
    description:
      "Instant vintage cameras on wooden easels with metallic gel pens for guests to snap selfies and paste personal blessings.",
    estCost: "₹14,000",
    bookmarked: true,
    tag: "Keepsake",
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i6",
    category: "Themes",
    title: "Boho-Chic Botanical Sunset Lawn",
    titleHi: "बोहो-चिक सूर्यास्त लॉन",
    description:
      "Rattan lanterns, pampas grass arches, eucalyptus foliage runners, and warm fairy lights as the sun sets.",
    estCost: "₹55,000",
    bookmarked: false,
    tag: "Modern Pastel",
    image:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i7",
    category: "Menus",
    title: "Liquid Nitrogen Kulfi & Paan Station",
    titleHi: "नाइट्रोजन कुल्फी व पान स्टेशन",
    description:
      "Spectacular misty theatrical station serving flash-frozen malai kulfi bites and chocolate-dipped meetha paan.",
    estCost: "₹38,000",
    bookmarked: false,
    tag: "Sweet Climax",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i8",
    category: "Decors",
    title: "Geometric Mandap with Hanging Tuberoses",
    titleHi: "क्यूबिक मंडप व रजनीगंधा झालर",
    description:
      "Clean brass square pillar structure draped with dense cascading rajnigandha strands that scent the entire hall.",
    estCost: "₹65,000",
    bookmarked: false,
    tag: "Aromatherapy",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i9",
    category: "Entertainment",
    title: "Caricature Artist with Digital Tablet",
    titleHi: "डिजिटल लाइव कार्टूनिस्ट",
    description:
      "Fast 2-minute live digital caricatures airdropped or WhatsApped instantly with event logo watermark.",
    estCost: "₹18,000",
    bookmarked: false,
    tag: "Crowd Pleaser",
    image:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i10",
    category: "Activities",
    title: "Spice Blending Station Return Gift",
    titleHi: "मसाला ब्लेंडिंग उपहार स्टेशन",
    description:
      "Earthy wooden pantry where guests curate their bespoke jar of chai masala or garam masala with custom name tags.",
    estCost: "₹24,000",
    bookmarked: false,
    tag: "Memorable Favours",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i11",
    category: "Themes",
    title: "Starry Night Mirror Gazebo",
    titleHi: "तारों भरी रात व दर्पण मंडप",
    description:
      "Mirrored glass aisle surrounded by 2,000 starry micro-LED fiber optics that twinkle like constellations.",
    estCost: "₹80,000",
    bookmarked: false,
    tag: "Fairytale",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i12",
    category: "Menus",
    title: "Zero-Waste Farm-to-Table Salad & Hummus Bar",
    titleHi: "खेत से थाली तक ताज़ा बार",
    description:
      "Hydroponic microgreens, freshly churned beetroot hummus, seed crackers and edible nasturtium flowers.",
    estCost: "₹30,000",
    bookmarked: false,
    tag: "Health Forward",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i13",
    category: "Decors",
    title: "Terracotta Bell Chime Canopy",
    titleHi: "मिट्टी की घंटियां व झूमर",
    description:
      "Cluster of 300 earthen bells hung above the banquet aisle creating gentle melodic chimes with evening breeze.",
    estCost: "₹19,000",
    bookmarked: false,
    tag: "Rustic Warmth",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i14",
    category: "Entertainment",
    title: "Sufi & Acoustic Flute Ensemble",
    titleHi: "सूफी व बांसुरी जुगलबंदी",
    description:
      "Soulful dusk performance playing semi-classical raags as guests take their seats for the pheras.",
    estCost: "₹32,000",
    bookmarked: false,
    tag: "Soulful",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i15",
    category: "Activities",
    title: "Family Trivia & Kahoot Game Screen",
    titleHi: "पारिवारिक प्रश्नोत्तरी खेल",
    description:
      "Big screen 15-minute trivia quiz about bride and groom love story played simultaneously on guests' smartphones.",
    estCost: "₹8,000",
    bookmarked: false,
    tag: "Ice Breaker",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i16",
    category: "Themes",
    title: "South Indian Temple Grandeur",
    titleHi: "दक्षिण भारतीय मंदिर स्थापत्य",
    description:
      "Carved Chettinad wooden pillars, brass kuthuvillaku lamps, and vibrant banana trunks lining sacred portals.",
    estCost: "₹60,000",
    bookmarked: false,
    tag: "Classical",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i17",
    category: "Menus",
    title: "Live Wood-Fired Neapolitan Pizza Kiln",
    titleHi: "लकड़ी की भट्टी वाला लाइव पिज़्ज़ा",
    description:
      "Artisan sourdough crusts, San Marzano tomatoes, and burrata pulled right before guests for late night cravings.",
    estCost: "₹42,000",
    bookmarked: false,
    tag: "Late Night Bite",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i18",
    category: "Decors",
    title: "Bougainvillea Archway Pergola",
    titleHi: "बोगनवेलिया फूलों का मंडप",
    description:
      "Deep magenta and paper-pink natural bougainvillea vines interwoven on arched iron trellis.",
    estCost: "₹36,000",
    bookmarked: false,
    tag: "Vibrant Flora",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i19",
    category: "Entertainment",
    title: "Cold Pyrotechnic Sparkler Tunnel",
    titleHi: "कोल्ड फायर स्पार्कलर सुरंग",
    description:
      "Smoke-free indoor safe cold fire sparks framing the couple as they step onto the reception stage.",
    estCost: "₹26,000",
    bookmarked: false,
    tag: "Grand Entry",
    image:
      "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i20",
    category: "Activities",
    title: "Customised Perfume & Ittar Bar",
    titleHi: "कस्टम इत्र व खुशबू बार",
    description:
      "Niche perfumer blending miniature bottles with notes of sandalwood, rose, vetiver (khus), and amber.",
    estCost: "₹34,000",
    bookmarked: false,
    tag: "Luxury Touch",
    image:
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i21",
    category: "Themes",
    title: "Contemporary Minimalist Monogram",
    titleHi: "मिनिमलिस्ट ब्लैक-व्हाइट मोनोग्राम",
    description:
      "Sleek matte monochrome lines, geometric brass accents, and bespoke typography lighting.",
    estCost: "₹40,000",
    bookmarked: false,
    tag: "Modern Chic",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i22",
    category: "Menus",
    title: "Gujarati Farsan & Jalebi Rabdi Live Counter",
    titleHi: "गरमा-गरम फरसाण व जलेबी रबड़ी",
    description:
      "Crisp spiral jalebis fried in pure ghee paired with thick slow-simmered saffron rabdi.",
    estCost: "₹25,000",
    bookmarked: false,
    tag: "Heritage Dessert",
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i23",
    category: "Decors",
    title: "Upcycled Brass Urli & Candle Steps",
    titleHi: "पीतल की उरली व दीप सोपान",
    description:
      "Step tier decor featuring vintage brass cookware filled with water, floating rose petals, and warm votives.",
    estCost: "₹18,000",
    bookmarked: false,
    tag: "Timeless",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i24",
    category: "Entertainment",
    title: "Laser Mapping Projection on Mandap Pillars",
    titleHi: "थ्री-डी लेजर मैपिंग प्रोजेक्शन",
    description:
      "Animated spiritual motifs, floral vines, and personalized couple monogram projected with pin-point precision.",
    estCost: "₹48,000",
    bookmarked: false,
    tag: "High Tech",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "i25",
    category: "Activities",
    title: "Bespoke Calligraphy Wishing Stones",
    titleHi: "कैलिग्राफी शुभकामना शिलाएं",
    description:
      "Smooth river stones inscribed with handwritten blessings from guests sealed into an heirloom glass vase.",
    estCost: "₹9,500",
    bookmarked: false,
    tag: "Keepsake Art",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80",
  },
];

export const initialEventSpots: EventSpot[] = [
  {
    id: "spot-1",
    name: "The Oxford Golf Resort & Palace Lawns",
    category: "venue",
    lat: 18.514,
    lng: 73.77,
    address: "Bavdhan, Pune, Maharashtra 411021",
    capacityOrRooms: "650 Guests Capacity",
    contactPerson: "Mahesh Deshmukh (Venue Mgr)",
    phone: "+91 98220 11223",
    notes: "Main wedding mandap, dining banquet, and sunset sangeet lawn",
    isPrimary: true,
  },
  {
    id: "spot-2",
    name: "JW Marriott Hotel Senapati Bapat Rd",
    category: "hotel",
    lat: 18.532,
    lng: 73.829,
    address: "Senapati Bapat Rd, Shivajinagar, Pune 411053",
    capacityOrRooms: "50 Luxury Rooms Reserved",
    contactPerson: "Pooja Kulkarni (Front Desk)",
    phone: "+91 98220 44556",
    notes: "Out-of-town elders and maternal family stay",
  },
  {
    id: "spot-3",
    name: "Alandi Sacred Mandap Ghats",
    category: "ceremony",
    lat: 18.675,
    lng: 73.899,
    address: "Alandi Dehu Phata, Pune 412105",
    capacityOrRooms: "120 Family Members",
    contactPerson: "Pandit Joshi Guruji",
    phone: "+91 98221 77889",
    notes: "Traditional morning pre-wedding Ganesh Pujan and blessings",
  },
  {
    id: "spot-4",
    name: "Pune Airport (PNQ) - Guest Shuttle Hub",
    category: "transport",
    lat: 18.5822,
    lng: 73.9197,
    address: "New Airport Rd, Lohegaon, Pune 411032",
    capacityOrRooms: "3 AC Coaches Dedicated",
    contactPerson: "Suresh Cab Coordinator",
    phone: "+91 98222 33445",
    notes: "Airport pickup at Terminal 1 Arrivals for outstation guests",
  },
  {
    id: "spot-5",
    name: "Sky Lounge & Cocktail Terrace",
    category: "afterparty",
    lat: 18.5362,
    lng: 73.894,
    address: "Lane 6, Koregaon Park, Pune 411001",
    capacityOrRooms: "150 Friends Capacity",
    contactPerson: "DJ Kabir Event Host",
    phone: "+91 98224 88990",
    notes: "Post-reception late night after-party with youth crew",
  },
];

export const initialDayOfSchedule = [
  {
    id: "d1",
    time: "07:00 AM",
    title: "Priest & Mandap Sthapana arrival",
    owner: "Papa (Rajesh)",
    status: "completed" as const,
    phone: "+91 98200 44556",
  },
  {
    id: "d2",
    time: "08:30 AM",
    title: "Bridal Makeup & Hair styling begins",
    owner: "Meera (Bride)",
    status: "completed" as const,
    phone: "+91 98190 22334",
  },
  {
    id: "d3",
    time: "10:30 AM",
    title: "Groom Safa (Turban) tying ceremony",
    owner: "Aarav (Groom)",
    status: "current" as const,
    phone: "+91 98220 11223",
  },
  {
    id: "d4",
    time: "11:15 AM",
    title: "Baraat Procession & Dhol Entry",
    owner: "Rohan (Friend)",
    status: "upcoming" as const,
    phone: "+91 98900 88990",
  },
  {
    id: "d5",
    time: "11:45 AM",
    title: "Jaimala (Garland Exchange) on Stage",
    owner: "Priya (Planner)",
    status: "upcoming" as const,
    phone: "+91 98200 99887",
  },
  {
    id: "d6",
    time: "12:15 PM",
    title: "Sacred Pheras & Mangalashtak",
    owner: "Priest Joshi",
    status: "upcoming" as const,
    phone: "+91 98221 44332",
  },
  {
    id: "d7",
    time: "01:15 PM",
    title: "Grand Banquet Luncheon opening",
    owner: "Catering Head Hemant",
    status: "upcoming" as const,
    phone: "+91 98233 55667",
  },
  {
    id: "d8",
    time: "03:30 PM",
    title: "Bidai & Family Blessings",
    owner: "Sunita (Mummy)",
    status: "upcoming" as const,
    phone: "+91 98200 44557",
  },
];

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [personas, setPersonas] = useState<Persona[]>(personasList);
  const [activePersona, setActivePersona] = useState<Persona>(personasList[0] as Persona);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Event Meta
  const [eventType, setEventType] = useState<string>("Wedding");
  const [eventName, setEventName] = useState<string>("Aarav & Meera's Royal Wedding");
  const [eventCity, setEventCity] = useState<string>("Pune, Maharashtra");
  const [eventDate, setEventDate] = useState<string>("12 Dec 2026");
  const [daysRemaining, setDaysRemaining] = useState<number>(43);

  // Wizard Modal
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // AI Key & Modal state
  const [apiKey, setApiKeyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kindle_gemini_api_key");
      if (stored) return stored;
    }
    const envKey =
      (typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env["VITE_GROQ_API_KEY"] as string | undefined) ||
          (import.meta.env["VITE_OPENROUTER_API_KEY"] as string | undefined) ||
          (import.meta.env["VITE_GEMINI_API_KEY"] as string | undefined) ||
          (import.meta.env["VITE_OPENAI_API_KEY"] as string | undefined)
        : "") || "";
    return envKey.trim();
  });
  const [isAiKeyModalOpen, setIsAiKeyModalOpen] = useState<boolean>(false);

  const setApiKey = (key: string) => {
    const cleanKey = key.trim();
    setApiKeyState(cleanKey);
    if (typeof window !== "undefined") {
      if (cleanKey) {
        localStorage.setItem("kindle_gemini_api_key", cleanKey);
      } else {
        localStorage.removeItem("kindle_gemini_api_key");
      }
    }
  };

  // Automatically open Plan Wizard if registered or navigated with ?wizard=true
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const wizardParam = urlParams.get("wizard") === "true";
      const sessionFlag = sessionStorage.getItem("kindle_open_wizard") === "true";
      if (wizardParam || sessionFlag) {
        setIsWizardOpen(true);
        sessionStorage.removeItem("kindle_open_wizard");
      }
    }
  }, []);

  // Decisions state
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);

  // Milestones state
  const [milestones, setMilestones] = useState<MilestoneTask[]>(initialMilestones);

  // Budget state
  const [categories, setCategories] = useState<BudgetCategory[]>(initial12Categories);

  // Venue state
  const [venueZones, setVenueZones] = useState<VenueZone[]>(initialVenueZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string>("Traditional Mandap & Banquet");

  // Real Map Event Spots state
  const [eventSpots, setEventSpots] = useState<EventSpot[]>(initialEventSpots);

  const addEventSpot = (spotData: Omit<EventSpot, "id">) => {
    const newSpot: EventSpot = {
      ...spotData,
      id: `spot-${Date.now()}`,
    };
    setEventSpots((prev) => [newSpot, ...prev]);
  };

  const removeEventSpot = (id: string) => {
    setEventSpots((prev) => prev.filter((s) => s.id !== id));
  };

  const updateEventSpot = (id: string, updates: Partial<EventSpot>) => {
    setEventSpots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Guests state
  const [guests, setGuests] = useState<Guest[]>(initialGuests);

  // What-if simulator
  const [simGuests, setSimGuests] = useState<number>(400);
  const [simBudget, setSimBudget] = useState<number>(2500000);

  // Risks state
  const [risks, setRisks] = useState<MurphyRisk[]>(initialRisks);

  // Cultural state
  const [activeCulture, setActiveCulture] = useState<string>("maharashtrian");
  const [culturalCeremonies, setCulturalCeremonies] =
    useState<Record<string, CulturalCeremony[]>>(initialCulturalCeremonies);

  // Day-of state
  const [dayOfSchedule, setDayOfSchedule] = useState(initialDayOfSchedule);

  // Ideas state
  const [ideas, setIdeas] = useState<CreativeIdea[]>(initialIdeas);

  // DYNAMIC PLAN GENERATOR from questionnaire, AI service & presets
  const generateAndLoadCustomPlan = (config: EventPlanConfig) => {
    // 1. Synthesize fully tailored event plan using neural heuristics
    const plan = generatePersonalizedPlan(config);

    setEventType(plan.eventType);
    setEventName(plan.eventName);
    setEventCity(plan.eventCity);
    setEventDate(plan.eventDate);
    setDaysRemaining(plan.daysRemaining);
    setActiveCulture(plan.tradition);
    setSimGuests(plan.guestCount);
    setSimBudget(plan.totalBudget);

    // Load authentic customized components
    setDecisions(plan.decisions);
    setCategories(plan.categories);
    setMilestones(plan.milestones);
    setVenueZones(plan.venueZones);
    setGuests(plan.guests);
    setRisks(plan.risks);
    setCulturalCeremonies(plan.culturalCeremonies);
    setDayOfSchedule(plan.dayOfSchedule);
    setIdeas(plan.ideas);
    setEventSpots(plan.eventSpots);
    setPersonas(plan.personas);
    if (plan.personas && plan.personas[0]) {
      setActivePersona(plan.personas[0]);
    }

    setConfettiTrigger((c) => c + 1);
    setIsWizardOpen(false);

    // 2. Optionally attempt background AI server enhancement if running with online endpoint
    if (typeof window !== "undefined" && typeof window.fetch === "function") {
      fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.plan && data.source === "gemini-ai") {
            // Apply refined AI model generated plan
            const aiPlan = data.plan;
            if (aiPlan.decisions) setDecisions(aiPlan.decisions);
            if (aiPlan.milestones) setMilestones(aiPlan.milestones);
            if (aiPlan.categories) setCategories(aiPlan.categories);
          }
        })
        .catch(() => {
          // graceful offline fallback already satisfied by generatePersonalizedPlan
        });
    }
  };

  const resetToSamplePlan = () => {
    setEventType("Wedding");
    setEventName("Aarav & Meera's Royal Wedding");
    setEventCity("Pune, Maharashtra");
    setEventDate("12 Dec 2026");
    setDaysRemaining(43);
    setCategories(initial12Categories);
    setMilestones(initialMilestones);
    setVenueZones(initialVenueZones);
    setGuests(initialGuests);
    setDecisions(initialDecisions);
    setRisks(initialRisks);
    setActiveCulture("maharashtrian");
    setCulturalCeremonies(initialCulturalCeremonies);
    setDayOfSchedule(initialDayOfSchedule);
    setIdeas(initialIdeas);
    setEventSpots(initialEventSpots);
    setPersonas(personasList);
    if (personasList[0]) {
      setActivePersona(personasList[0]);
    }
    setSimGuests(400);
    setSimBudget(2500000);
    setConfettiTrigger((c) => c + 1);
  };

  const switchEventTypePreset = (
    type: "Wedding" | "Birthday" | "Community Festival" | "Anniversary" | "Family Reunion" | string,
  ) => {
    if (type === "Birthday") {
      generateAndLoadCustomPlan({
        eventType: "Birthday",
        title: "Kabir's 25th Milestone Birthday Bash",
        hosts: "Kabir & Friends",
        city: "Mumbai, Maharashtra",
        date: "2026-11-28",
        guestCount: 120,
        totalBudget: 450000,
        tradition: "western",
        venueStyle: "Rooftop Lounge & Poolside Deck",
        priorities: ["catering", "music", "decor"],
      });
    } else if (type === "Community Festival") {
      generateAndLoadCustomPlan({
        eventType: "Community Festival",
        title: "Grand Society Diwali Mahotsav & Mela",
        hosts: "Andheri West Committee",
        city: "Mumbai, Maharashtra",
        date: "2026-11-14",
        guestCount: 650,
        totalBudget: 850000,
        tradition: "gujarati",
        venueStyle: "Community Amphitheatre & Lawns",
        priorities: ["catering", "venue", "entertainment"],
      });
    } else if (type === "Anniversary") {
      generateAndLoadCustomPlan({
        eventType: "Anniversary",
        title: "Rajesh & Sunita's 30th Pearl Anniversary Gala",
        hosts: "Rajesh & Sunita",
        city: "Jaipur, Rajasthan",
        date: "2026-12-20",
        guestCount: 180,
        totalBudget: 1250000,
        tradition: "punjabi",
        venueStyle: "Heritage Palace Courtyard & Banquets",
        priorities: ["venue", "catering", "photo"],
      });
    } else if (type === "Family Reunion") {
      generateAndLoadCustomPlan({
        eventType: "Family Reunion",
        title: "Mehra Clan Grand Heritage Homecoming",
        hosts: "The Mehra Clan Elders",
        city: "Pune, Maharashtra",
        date: "2026-12-26",
        guestCount: 150,
        totalBudget: 600000,
        tradition: "punjabi",
        venueStyle: "Heritage Farmhouse Estate & Lawns",
        priorities: ["venue", "catering", "entertainment"],
      });
    } else {
      resetToSamplePlan();
    }
  };

  // 1. Lock Decision with celebration (or unlock if optionId is empty) & smart milestone auto-completion
  const lockDecision = (decisionId: string, optionId: string | null) => {
    const finalOptionId = optionId && optionId.trim() ? optionId.trim() : null;
    setDecisions((prev) =>
      prev.map((d) => {
        if (d.id !== decisionId) return d;
        if (finalOptionId) {
          return {
            ...d,
            lockedOptionId: finalOptionId,
            lockedAt: new Date().toISOString(),
          };
        }
        return {
          ...d,
          lockedOptionId: null,
          lockedAt: undefined,
        };
      }),
    );

    if (finalOptionId) {
      setConfettiTrigger((c) => c + 1);

      // Auto-complete corresponding milestone when key decision is locked
      setMilestones((prev) =>
        prev.map((m) => {
          const isVenueMatch =
            (decisionId === "dec-1" || decisionId.toLowerCase().includes("venue")) &&
            (m.id === "m-1" ||
              m.category.toLowerCase().includes("venue") ||
              m.title.toLowerCase().includes("venue"));
          const isCateringMatch =
            (decisionId === "dec-2" || decisionId.toLowerCase().includes("catering")) &&
            (m.id === "m-3" ||
              m.category.toLowerCase().includes("catering") ||
              m.category.toLowerCase().includes("food") ||
              m.title.toLowerCase().includes("cater"));
          const isDjMatch =
            (decisionId === "dec-4" ||
              decisionId.toLowerCase().includes("dj") ||
              decisionId.toLowerCase().includes("sound")) &&
            (m.id === "m-4" ||
              m.category.toLowerCase().includes("sound") ||
              m.title.toLowerCase().includes("dj") ||
              m.title.toLowerCase().includes("sound"));
          const isPhotoMatch =
            (decisionId === "dec-3" || decisionId.toLowerCase().includes("photo")) &&
            (m.category.toLowerCase().includes("photo") || m.title.toLowerCase().includes("photo"));

          if (isVenueMatch || isCateringMatch || isDjMatch || isPhotoMatch) {
            return {
              ...m,
              status: "completed" as const,
              autoCompleted: true,
            };
          }
          return m;
        }),
      );
    } else {
      // If decision was unlocked, revert auto-completed milestone back
      setMilestones((prev) =>
        prev.map((m) => {
          const isVenueMatch =
            (decisionId === "dec-1" || decisionId.toLowerCase().includes("venue")) &&
            (m.id === "m-1" ||
              m.category.toLowerCase().includes("venue") ||
              m.title.toLowerCase().includes("venue"));
          const isCateringMatch =
            (decisionId === "dec-2" || decisionId.toLowerCase().includes("catering")) &&
            (m.id === "m-3" ||
              m.category.toLowerCase().includes("catering") ||
              m.category.toLowerCase().includes("food") ||
              m.title.toLowerCase().includes("cater"));
          const isDjMatch =
            (decisionId === "dec-4" ||
              decisionId.toLowerCase().includes("dj") ||
              decisionId.toLowerCase().includes("sound")) &&
            (m.id === "m-4" ||
              m.category.toLowerCase().includes("sound") ||
              m.title.toLowerCase().includes("dj") ||
              m.title.toLowerCase().includes("sound"));
          const isPhotoMatch =
            (decisionId === "dec-3" || decisionId.toLowerCase().includes("photo")) &&
            (m.category.toLowerCase().includes("photo") || m.title.toLowerCase().includes("photo"));

          if ((isVenueMatch || isCateringMatch || isDjMatch || isPhotoMatch) && m.autoCompleted) {
            return {
              ...m,
              status: m.id === "m-1" ? ("in_progress" as const) : ("pending" as const),
              autoCompleted: false,
            };
          }
          return m;
        }),
      );
    }
  };

  // Readiness Ring calculation:
  // locked decisions (35%), vendors contracted/paid (35%), RSVPs received (20%), risks mitigated (10%)
  const readinessPercentage = useMemo(() => {
    const lockedDecCount = decisions.filter((d) => d.lockedOptionId !== null).length;
    const decWeight = (lockedDecCount / decisions.length) * 35;

    const paidCategories = categories.filter((c) => c.paid > 0).length;
    const vendorWeight = (paidCategories / categories.length) * 35;

    const respondedGuests = guests.filter((g) => g.rsvp !== "Pending").length;
    const rsvpWeight = (respondedGuests / guests.length) * 20;

    const mitigatedRisks = risks.filter((r) => r.mitigated).length;
    const riskWeight = (mitigatedRisks / risks.length) * 10;

    return Math.min(100, Math.round(decWeight + vendorWeight + rsvpWeight + riskWeight));
  }, [decisions, categories, guests, risks]);

  // 2. Timeline cascading reflow & congestion alert
  const updateMilestoneDate = (id: string, newDate: string) => {
    setMilestones((prev) => {
      const target = prev.find((m) => m.id === id);
      if (!target) return prev;
      const oldTime = new Date(target.date).getTime();
      const newTime = new Date(newDate).getTime();
      const diffDays = Math.round((newTime - oldTime) / (1000 * 60 * 60 * 24));

      return prev.map((m) => {
        if (m.id === id) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const targetD = new Date(newDate);
          targetD.setHours(0, 0, 0, 0);
          const computedDaysToGo = !isNaN(targetD.getTime())
            ? Math.max(0, Math.round((targetD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
            : Math.max(0, m.daysToGo + diffDays);

          return { ...m, date: newDate, daysToGo: computedDaysToGo };
        }
        if (target.dependentIds.includes(m.id)) {
          const mDate = new Date(m.date);
          mDate.setDate(mDate.getDate() + diffDays);
          return {
            ...m,
            date: mDate.toISOString().slice(0, 10),
            daysToGo: Math.max(0, m.daysToGo + diffDays),
          };
        }
        return m;
      });
    });
  };

  const toggleMilestoneStatus = (id: string) => {
    setMilestones((prev) => {
      const target = prev.find((m) => m.id === id);
      const willBeCompleted = target ? target.status !== "completed" : false;
      if (willBeCompleted) {
        setConfettiTrigger((c) => c + 1);
      }
      return prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          status: willBeCompleted ? ("completed" as const) : ("pending" as const),
          autoCompleted: false,
        };
      });
    });
  };

  const setMilestoneStatus = (id: string, status: "completed" | "in_progress" | "pending") => {
    if (status === "completed") {
      setConfettiTrigger((c) => c + 1);
    }
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, autoCompleted: false } : m)),
    );
  };

  const updateEventDate = (newDateStr: string) => {
    const parsed = new Date(newDateStr);
    if (!isNaN(parsed.getTime())) {
      const formatted = parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      setEventDate(formatted);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(parsed);
      target.setHours(0, 0, 0, 0);
      const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(1, diffDays));
      setMilestones((prev) =>
        prev.map((m) => {
          if (m.phase === "celebration" || m.id === "m-8") {
            return {
              ...m,
              date: newDateStr.length === 10 ? newDateStr : parsed.toISOString().slice(0, 10),
              daysToGo: Math.max(1, diffDays),
            };
          }
          return m;
        }),
      );
    } else {
      setEventDate(newDateStr);
    }
  };

  const shiftDownstreamDays = (fromMilestoneId: string, daysShift: number) => {
    setMilestones((prev) => {
      const target = prev.find((m) => m.id === fromMilestoneId);
      if (!target) return prev;
      return prev.map((m) => {
        if (target.dependentIds.includes(m.id)) {
          const d = new Date(m.date);
          d.setDate(d.getDate() + daysShift);
          return {
            ...m,
            date: d.toISOString().slice(0, 10),
            daysToGo: Math.max(0, m.daysToGo + daysShift),
          };
        }
        return m;
      });
    });
  };

  const addMilestone = (milestoneData: Omit<MilestoneTask, "id">) => {
    const newM: MilestoneTask = {
      ...milestoneData,
      id: `m-custom-${Date.now()}`,
    };
    setMilestones((prev) =>
      [...prev, newM].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    );
  };

  const deleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Amber Congestion Heat Alert: detects if 3+ high-impact tasks cluster within 4 days
  const { hasCongestionAlert, congestionMessage } = useMemo(() => {
    const highTasks = [...milestones]
      .filter((m) => m.highImpact)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (let i = 0; i < highTasks.length - 2; i++) {
      const t1 = highTasks[i];
      const t2 = highTasks[i + 1];
      const t3 = highTasks[i + 2];
      if (t1 && t2 && t3) {
        const d1 = new Date(t1.date).getTime();
        const d3 = new Date(t3.date).getTime();
        const diffDays = Math.round((d3 - d1) / (1000 * 60 * 60 * 24));
        if (diffDays <= 4) {
          return {
            hasCongestionAlert: true,
            congestionMessage: `Congestion Alert: 3 high-impact tasks ("${t1.title}", "${t2.title}", "${t3.title}") cluster within ${diffDays} days! Consider cascading schedule to prevent team burnout.`,
          };
        }
      }
    }
    return { hasCongestionAlert: false, congestionMessage: "" };
  }, [milestones]);

  // 3. Exact Rupee calculations
  const totalBudget = useMemo(
    () => categories.reduce((sum, c) => sum + c.allocated, 0),
    [categories],
  );
  const totalCommitted = useMemo(
    () => categories.reduce((sum, c) => sum + c.committed, 0),
    [categories],
  );
  const totalPaid = useMemo(() => categories.reduce((sum, c) => sum + c.paid, 0), [categories]);

  const updateCategoryRupees = (id: string, field: "committed" | "paid", value: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: Math.max(0, Math.round(value)) } : c)),
    );
  };

  // 4. Venue operations
  const updateZonePosition = (id: string, x: number, y: number) => {
    setVenueZones((prev) =>
      prev.map((z) =>
        z.id === id
          ? { ...z, x: Math.max(0, Math.min(85, x)), y: Math.max(0, Math.min(85, y)) }
          : z,
      ),
    );
  };

  const nudgeZone = (id: string, dx: number, dy: number) => {
    setVenueZones((prev) =>
      prev.map((z) =>
        z.id === id
          ? { ...z, x: Math.max(0, Math.min(85, z.x + dx)), y: Math.max(0, Math.min(85, z.y + dy)) }
          : z,
      ),
    );
  };

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    if (presetName === "Outdoor Lawn & Sangeet") {
      setVenueZones((prev) =>
        prev.map((z) => {
          if (z.id === "z-mandap")
            return { ...z, x: 40, y: 12, shape: "rect", color: "rgba(234, 88, 12, 0.95)" };
          if (z.id === "z-dance") return { ...z, x: 30, y: 38, width: 40, height: 26 };
          if (z.id === "z-t1") return { ...z, x: 8, y: 25 };
          if (z.id === "z-t2") return { ...z, x: 8, y: 45 };
          if (z.id === "z-t3") return { ...z, x: 80, y: 25 };
          if (z.id === "z-t4") return { ...z, x: 80, y: 45 };
          return z;
        }),
      );
    } else if (presetName === "Intimate Lounge & Cocktail") {
      setVenueZones((prev) =>
        prev.map((z) => {
          if (z.id === "z-bar") return { ...z, x: 38, y: 15, width: 24, height: 16 };
          if (z.id === "z-dance") return { ...z, x: 35, y: 48, width: 30, height: 20 };
          if (z.id === "z-mandap") return { ...z, x: 75, y: 12, width: 18, height: 12 };
          return z;
        }),
      );
    } else {
      setVenueZones(initialVenueZones);
    }
  };

  // 5. Guests & Harmony
  const addGuest = (newG: Omit<Guest, "id">) => {
    const id = `g-${Date.now()}`;
    setGuests((prev) => [...prev, { ...newG, id }]);
  };

  const updateGuestRsvp = (id: string, rsvp: Guest["rsvp"]) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, rsvp } : g)));
  };

  const assignGuestTable = (guestId: string, tableId: string) => {
    setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...g, tableId } : g)));
    setVenueZones((prev) =>
      prev.map((z) => {
        if (z.id === tableId) {
          const current = z.seatedGuestIds || [];
          return { ...z, seatedGuestIds: Array.from(new Set([...current, guestId])) };
        }
        return { ...z, seatedGuestIds: (z.seatedGuestIds || []).filter((id) => id !== guestId) };
      }),
    );
  };

  const dietCounts = useMemo(() => {
    const counts: Record<DietaryType, number> = {
      "Strict Jain": 0,
      "Satvik (No Onion/Garlic)": 0,
      Vegetarian: 0,
      Halal: 0,
      Vegan: 0,
      Regular: 0,
    };
    guests.forEach((g) => {
      if (counts[g.diet] !== undefined) {
        counts[g.diet]++;
      }
    });
    return counts;
  }, [guests]);

  const rsvpCounts = useMemo(() => {
    const res = { Attending: 0, Pending: 0, Declined: 0 };
    guests.forEach((g) => {
      res[g.rsvp]++;
    });
    return res;
  }, [guests]);

  // Harmony algorithm check: feud separation & elder accessibility
  const harmonyAlerts = useMemo(() => {
    const alerts: string[] = [];
    guests.forEach((g1) => {
      g1.feudWithIds.forEach((fId) => {
        const fGuest = guests.find((x) => x.id === fId);
        if (fGuest && g1.tableId && fGuest.tableId && g1.tableId === fGuest.tableId) {
          alerts.push(
            `Relationship Conflict: ${g1.name} and ${fGuest.name} are both assigned to ${g1.tableId}! Separate them into different tables.`,
          );
        }
      });
    });
    guests
      .filter((g) => g.isElderly)
      .forEach((elder) => {
        if (elder.tableId !== "z-t1" && elder.tableId !== "") {
          alerts.push(
            `Accessibility Warning: Elderly guest ${elder.name} is placed at ${elder.tableId}. Recommended: Table 1 (Ground level, closest to restrooms).`,
          );
        }
      });
    return Array.from(new Set(alerts));
  }, [guests]);

  // 6. What-if simulator Diff Engine
  const simDeltas = useMemo(() => {
    const guestDiff = simGuests - 400;
    const cateringDiff = guestDiff * 450;
    let venueUpgradeNotice: string | null = null;
    if (simGuests > 450) {
      venueUpgradeNotice = `Guest count (${simGuests}) exceeds standard hall threshold. Upgrade to Grand Lawn or Annex B required (+₹1,20,000 venue deposit).`;
    }
    const bufferWeeksDelta = guestDiff > 30 ? Math.ceil(guestDiff / 30) : 0;
    return { guestDiff, cateringDiff, venueUpgradeNotice, bufferWeeksDelta };
  }, [simGuests]);

  const applySimulationToMaster = () => {
    const diff = simDeltas.cateringDiff;
    setCategories((prev) =>
      prev.map((c) => (c.id === "c2" ? { ...c, allocated: c.allocated + diff } : c)),
    );
    if (simDeltas.bufferWeeksDelta > 0) {
      setMilestones((prev) => [
        ...prev,
        {
          id: `m-buffer-${Date.now()}`,
          title: `Extra ${simDeltas.bufferWeeksDelta} weeks buffer for +${simDeltas.guestDiff} guests fitting & favours`,
          date: "2026-11-28",
          daysToGo: 29,
          category: "Buffer",
          phase: "crunch",
          owner: "Lead Planner",
          highImpact: false,
          status: "pending",
          dependentIds: [],
        },
      ]);
    }
    alert(
      `Applied! Master plan updated: Catering budget adjusted by ${diff >= 0 ? "+" : ""}₹${diff.toLocaleString("en-IN")}, guest benchmark set to ${simGuests}.`,
    );
  };

  // 7. Murphy risks
  const toggleRiskMitigation = (id: string) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, mitigated: !r.mitigated } : r)));
  };

  // 9. Day of execution
  const apply20MinDelay = () => {
    setDayOfSchedule((prev) =>
      prev.map((item) => {
        if (item.status === "completed") return item;
        const parts = item.time.split(" ");
        const timePart = parts[0] || "12:00";
        const ampm = parts[1] || "PM";
        const timeSubParts = timePart.split(":");
        let h = parseInt(timeSubParts[0] || "12", 10);
        let m = parseInt(timeSubParts[1] || "00", 10) + 20;
        if (m >= 60) {
          m -= 60;
          h += 1;
          if (h > 12) h = 1;
        }
        const newTime = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
        return { ...item, time: newTime };
      }),
    );
  };

  // 10. Wrap & Debt Transfers
  const expenseTransfers: ExpenseTransfer[] = useMemo(() => {
    return [
      { from: "Priya Sharma", to: "Rajesh Mehra (Papa)", amount: 125000 },
      { from: "Aarav Mehra", to: "Rajesh Mehra (Papa)", amount: 50000 },
      { from: "Aarav Mehra", to: "Meera Sen", amount: 5000 },
    ];
  }, []);

  // 11. Ideas bookmarking
  const toggleBookmarkIdea = (id: string) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, bookmarked: !i.bookmarked } : i)));
  };

  return (
    <DashboardContext.Provider
      value={{
        lang,
        setLang,
        activePersona,
        setActivePersona,
        personas: personasList,
        eventType,
        eventName,
        eventCity,
        eventDate,
        setEventDate,
        updateEventDate,
        daysRemaining,
        isWizardOpen,
        setIsWizardOpen,
        isDossierOpen,
        setIsDossierOpen,
        generateAndLoadCustomPlan,
        resetToSamplePlan,
        switchEventTypePreset,
        apiKey,
        setApiKey,
        isAiKeyModalOpen,
        setIsAiKeyModalOpen,
        decisions,
        lockDecision,
        readinessPercentage,
        confettiTrigger,
        milestones,
        updateMilestoneDate,
        toggleMilestoneStatus,
        setMilestoneStatus,
        shiftDownstreamDays,
        addMilestone,
        deleteMilestone,
        hasCongestionAlert,
        congestionMessage,
        categories,
        totalBudget,
        totalCommitted,
        totalPaid,
        updateCategoryRupees,
        venueZones,
        selectedZoneId,
        setSelectedZoneId,
        updateZonePosition,
        nudgeZone,
        activePreset,
        applyPreset,
        eventSpots,
        setEventSpots,
        addEventSpot,
        removeEventSpot,
        updateEventSpot,
        guests,
        addGuest,
        updateGuestRsvp,
        assignGuestTable,
        dietCounts,
        rsvpCounts,
        harmonyAlerts,
        simGuests,
        setSimGuests,
        simBudget,
        setSimBudget,
        applySimulationToMaster,
        simDeltas,
        risks,
        toggleRiskMitigation,
        activeCulture,
        setActiveCulture,
        culturalCeremonies,
        dayOfSchedule,
        apply20MinDelay,
        expenseTransfers,
        ideas,
        toggleBookmarkIdea,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
