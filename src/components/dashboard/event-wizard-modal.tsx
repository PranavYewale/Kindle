import React, { useState, useEffect } from "react";
import { useDashboard } from "./dashboard-context";
import { ThemeToggle } from "../theme-toggle";
import type { ExtendedEventPlanConfig } from "../../lib/ai-planner";
import {
  Sparkles,
  MapPin,
  Users,
  Wallet,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Flame,
  ArrowRight,
  CheckCircle2,
  Heart,
  Cake,
  Building2,
  PartyPopper,
  UtensilsCrossed,
  Music,
  Camera,
  Crown,
  Shirt,
  Calendar,
  Clock,
  ShieldAlert,
  Gift,
  Video,
  Trees,
  Globe,
  Languages,
  Scroll,
  Layers,
  ChevronDown,
  Lock,
} from "lucide-react";

const chapters = [
  { id: 1, name: "Universal Essentials", subtitle: "Core Required Event Parameters" },
  { id: 2, name: "Event-Specific Blueprint", subtitle: "Tailored to Your Celebration Type" },
  { id: 3, name: "Refined Vision & Preferences", subtitle: "Recommended & Optional Touches" },
  { id: 4, name: "Celebration Master Dossier", subtitle: "Your Bespoke Plan Is Sealed" },
];

const celebrationTypes = [
  {
    id: "Wedding",
    tagline: "A Sacred Union of Souls & Families",
    title: "Royal Wedding Ceremony",
    desc: "Auspicious muhurats, sacred pheras around holy agni, energetic sangeet rhythms, and multi-day family bonding.",
    icon: Heart,
    bgImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    defaultBride: "Ananya",
    defaultGroom: "Rohit",
    defaultBudget: 2500000,
    defaultGuests: 380,
  },
  {
    id: "Birthday",
    tagline: "A Milestone Celebration of Life",
    title: "Milestone Jubilee Birthday",
    desc: "Golden memories, generational blessings, childhood friends reunion, and unforgettable late-night laughter.",
    icon: Cake,
    bgImage:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    defaultPerson: "Kabir",
    defaultMilestone: "25th Milestone",
    defaultBudget: 450000,
    defaultGuests: 120,
  },
  {
    id: "Community Festival",
    tagline: "Our People Rising Together",
    title: "Community Mela & Gala",
    desc: "Vibrant artisanal stalls, open community kitchens (langar/prasad), cultural stage dances, and spirited collective joy.",
    icon: Building2,
    bgImage:
      "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1200&q=80",
    defaultOrg: "Grand Society Diwali Mahotsav & Mela",
    defaultBudget: 850000,
    defaultGuests: 650,
  },
  {
    id: "Anniversary",
    tagline: "Honouring Decades of Enduring Love",
    title: "Silver / Golden Jubilee Vows",
    desc: "Revisiting vows, toasts by children and grandchildren, nostalgic photo walls, and intimate candlelight dining.",
    icon: PartyPopper,
    bgImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    defaultCouple: "Rajesh & Sunita",
    defaultMilestone: "25th Silver Jubilee",
    defaultBudget: 1200000,
    defaultGuests: 180,
  },
  {
    id: "Family Reunion",
    tagline: "Honouring Our Roots & Generations",
    title: "Grand Family Reunion & Homecoming",
    desc: "Multi-generation bonding, ancestral stories, childhood recipe recreations, and outdoor clan sports.",
    icon: Users,
    bgImage:
      "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80",
    defaultClan: "The Mehra Clan",
    defaultBudget: 600000,
    defaultGuests: 95,
  },
];

const visualDestinations = [
  {
    city: "Pune, Maharashtra",
    subtitle: "Peshwai Heritage & Scenic Lawns",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Jaipur, Rajasthan",
    subtitle: "Royal Palaces & Torched Forts",
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Mumbai, Maharashtra",
    subtitle: "Cosmopolitan Seafront Luxury",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Goa, Coastline",
    subtitle: "Beachfront Sands & Sunset Parties",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Delhi NCR",
    subtitle: "Imperial Grandeur & Sprawling Estates",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Udaipur, Rajasthan",
    subtitle: "Floating Lake Palaces & Lanterns",
    image:
      "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80",
  },
];

const weddingFunctionsCatalog = [
  {
    name: "Haldi",
    desc: "Auspicious turmeric, fresh marigold petals & laughter",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mehendi",
    desc: "Artisanal henna drapes, folk songs & fragrant mogra",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sangeet",
    desc: "Electric dance performances, concert sound & DJ beats",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Wedding Ceremony",
    desc: "Sacred Vedic pheras around holy fire under royal mandap",
    image:
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Reception",
    desc: "Grand palatial gala banquet, toasts & musical orchestra",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Cocktail Party",
    desc: "Sunset mixology, ambient lounge lighting & acoustic sets",
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
  },
];

const weddingStylesVisual = [
  {
    id: "traditional",
    name: "Traditional Vedic",
    subtitle: "Pure rituals, brass urlis & sacred chanting",
    image:
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "modern",
    name: "Modern Minimalist",
    subtitle: "Chic botanical florals & contemporary arches",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "fusion",
    name: "Grand Fusion",
    subtitle: "Regal palace opulence meets luxury cocktail glamour",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80",
  },
];

const birthdayThemesVisual = [
  {
    name: "Retro Neon Disco & Sunset Lounge",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Great Gatsby Vintage Glamour",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Bollywood Superstar Extravaganza",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80",
  },
];

const birthdayCakesVisual = [
  {
    name: "3-Tier Belgian Dark Chocolate Truffle",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Artisanal Custom Fondant Sculpted",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Fresh Exotic Berry & Gold Leaf Tart",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80",
  },
];

const communityVisualCards = [
  {
    title: "Artisanal Craft & Game Stalls",
    desc: "Colorful regional kiosks & community fun zone",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Grand Food Court & Prasad Kitchen",
    desc: "Free community langar and multi-cuisine stalls",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Main Cultural Stage Troupe",
    desc: "Traditional folk dancers, dhol tasha & live band",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80",
  },
];

const anniversaryStylesVisual = [
  {
    id: "grand",
    title: "Candlelight Palatial Banquet",
    desc: "Regal ballroom, champagne toasts & chandelier lights",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "intimate",
    title: "Fairy Lights Garden Soirée",
    desc: "Intimate family gathering under glowing botanical canopies",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "traditional",
    title: "Vedic Temple Blessings & Feast",
    desc: "Sacred pooja, silver thali dining & generational blessings",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80",
  },
];

const reunionSettingsVisual = [
  {
    id: "farmhouse",
    title: "Heritage Farmhouse & Sprawling Greens",
    desc: "Expansive lawns, private pool, orchard trees & cricket field",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "resort",
    title: "Hill Station Mountain Resort",
    desc: "Panoramic valley views, multiple villa suites & misty evenings",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "lakeside",
    title: "Peaceful Lakeside Retreat Villa",
    desc: "Waterfront gazebos, bonfire deck & calm morning reflections",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=80",
  },
];

const venueStylesVisual = [
  {
    name: "Palace Lawns",
    subtitle: "Regal open-air stone courtyards & central fountains",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "5-Star Heritage Banquet",
    subtitle: "Crystal chandeliers, grand foyer & climate-controlled luxury",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Beachfront Resort",
    subtitle: "Golden coastal sunsets, palm lanterns & ocean breeze",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Heritage Farmhouse",
    subtitle: "10-acre private estate with swimming pool & orchard lawns",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=500&q=80",
  },
];

const grandeurPillars = [
  {
    id: "catering",
    title: "Artisanal Gastronomy & Feasts",
    subtitle: "Live chaat counters, regional delicacies & Satvik/Jain bays",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
    icon: UtensilsCrossed,
  },
  {
    id: "venue",
    title: "Palatial Architecture & Ambience",
    subtitle: "Floral installations, atmospheric elevation & grand stage",
    image:
      "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=400&q=80",
    icon: Crown,
  },
  {
    id: "photo",
    title: "Cinematic 4K Motion & Drone",
    subtitle: "Next-day teaser reels, RAW archive & heirloom albums",
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80",
    icon: Camera,
  },
  {
    id: "music",
    title: "Line-Array Acoustics & DJ",
    subtitle: "Concert sound, intelligent beam lighting & cold pyros",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    icon: Music,
  },
  {
    id: "attire",
    title: "Couture Styling & Safa Artists",
    subtitle: "Vanity styling & ceremonial handloom safa draping",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
    icon: Shirt,
  },
  {
    id: "entertainment",
    title: "Theatrical Entries & Live Troupes",
    subtitle: "Puneri Dhol flashmob, acoustic raags & caricature artists",
    image:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80",
    icon: Sparkles,
  },
];

export function EventWizardModal() {
  const {
    isWizardOpen,
    setIsWizardOpen,
    generateAndLoadCustomPlan,
    eventType: plannedEventType,
    eventName: plannedEventName,
    eventCity: plannedEventCity,
    eventDate: plannedEventDate,
    totalBudget: plannedBudget,
    guests: plannedGuestsList,
  } = useDashboard();

  const plannedGuests = plannedGuestsList?.length;

  const [currentChapter, setCurrentChapter] = useState<number>(1);

  // 1. UNIVERSAL REQUIRED
  const [selectedType, setSelectedType] = useState<string>("Wedding");
  const [eventName, setEventName] = useState<string>("Rohit & Ananya's Royal Wedding");
  const [city, setCity] = useState<string>("Pune, Maharashtra");
  const [customCity, setCustomCity] = useState<string>("");
  const [estimatedDate, setEstimatedDate] = useState<string>("2026-12-18");
  const [guestCount, setGuestCount] = useState<number>(380);
  const [totalBudget, setTotalBudget] = useState<number>(2500000);

  // UNIVERSAL RECOMMENDED
  const [durationDays, setDurationDays] = useState<number>(3);
  const [venuePreference, setVenuePreference] = useState<string>("Palace Lawns");
  const [indoorOutdoor, setIndoorOutdoor] = useState<
    "indoor" | "outdoor" | "both" | "open_air_lawn"
  >("both");
  const [themeStyle, setThemeStyle] = useState<string>("Royal Heritage & Peshwai Elegance");
  const [priorities, setPriorities] = useState<string[]>(["catering", "venue", "photo"]);

  // UNIVERSAL OPTIONAL
  const [dateFlexibility, setDateFlexibility] = useState<
    "exact" | "flexible_weekend" | "flexible_month" | "anytime"
  >("exact");
  const [preferredLanguage, setPreferredLanguage] = useState<string>("English");
  const [specialRequirements, setSpecialRequirements] = useState<string>("");
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");

  // 2. EVENT-SPECIFIC QUESTIONS
  // Wedding
  const [brideName, setBrideName] = useState<string>("Ananya");
  const [groomName, setGroomName] = useState<string>("Rohit");
  const [weddingDate, setWeddingDate] = useState<string>("2026-12-18");
  const [functionsCount, setFunctionsCount] = useState<number>(4);
  const [weddingFunctions, setWeddingFunctions] = useState<string[]>([
    "Haldi",
    "Mehendi",
    "Sangeet",
    "Wedding Ceremony",
    "Reception",
  ]);
  const [weddingStyle, setWeddingStyle] = useState<"traditional" | "modern" | "fusion">(
    "traditional",
  );
  const [mandapRequired, setMandapRequired] = useState<boolean>(true);
  const [cateringPreference, setCateringPreference] = useState<
    "pure_veg" | "multi_cuisine" | "regional_authentic" | "satvik_jain"
  >("regional_authentic");
  const [baraatArrangements, setBaraatArrangements] = useState<string>(
    "Royal Dhol Tasha & Vintage Open Car",
  );
  const [muhuratTimings, setMuhuratTimings] = useState<string>(
    "Morning 11:18 AM Auspicious Muhurat",
  );
  const [photographyPreference, setPhotographyPreference] = useState<string>(
    "Cinematic 4K Drone + Instagram Reels",
  );
  const [familyTraditions, setFamilyTraditions] = useState<string>(
    "Antarpat Shlokas & Akshata Blessings",
  );

  // Birthday
  const [birthdayPersonName, setBirthdayPersonName] = useState<string>("Kabir");
  const [ageMilestone, setAgeMilestone] = useState<string>("25th");
  const [celebrationType, setCelebrationType] = useState<"surprise" | "planned">("surprise");
  const [partyTheme, setPartyTheme] = useState<string>("Retro Neon Disco & Sunset Lounge");
  const [cakePreference, setCakePreference] = useState<string>(
    "3-Tier Belgian Dark Chocolate Truffle",
  );
  const [entertainmentPreference, setEntertainmentPreference] = useState<string>(
    "Live Concert DJ, Laser Sound & Standup Host",
  );
  const [hasMemoryWall, setHasMemoryWall] = useState<boolean>(true);
  const [hasVideoMontage, setHasVideoMontage] = useState<boolean>(true);
  const [specialPerformances, setSpecialPerformances] = useState<string>(
    "Childhood Friends Flashmob Dance",
  );
  const [personalizedGifts, setPersonalizedGifts] = useState<string>(
    "Custom Engraved Keepsake Bottles",
  );

  // Community Mela
  const [isPublic, setIsPublic] = useState<"public" | "private" | "society">("public");
  const [maxCrowd, setMaxCrowd] = useState<number>(1200);
  const [eventDuration, setEventDuration] = useState<string>("Full Day (9:00 AM - 10:30 PM)");
  const [stallCount, setStallCount] = useState<number>(28);
  const [foodArrangements, setFoodArrangements] = useState<string>(
    "Community Langar / Mahaprasad + Multi-vendor Food Court",
  );
  const [culturalPerformances, setCulturalPerformances] = useState<string>(
    "Traditional Folk Dance, Dhol Tasha & School Bands",
  );
  const [hasSponsors, setHasSponsors] = useState<boolean>(true);
  const [volunteerCount, setVolunteerCount] = useState<number>(45);
  const [stallCategories, setStallCategories] = useState<string[]>([
    "Artisanal Handicrafts",
    "Organic Food",
    "Kids Fun Zone",
  ]);
  const [chiefGuests, setChiefGuests] = useState<string>(
    "Local Dignitaries & Respected Community Elders",
  );
  const [communityActivities, setCommunityActivities] = useState<string>(
    "Rangoli Competition, Diya Lighting & Lucky Draw",
  );
  const [fundraisingGoal, setFundraisingGoal] = useState<string>(
    "Community Heritage Restoration Fund",
  );

  // Anniversary
  const [coupleNames, setCoupleNames] = useState<string>("Rajesh & Sunita");
  const [anniversaryMilestone, setAnniversaryMilestone] = useState<string>("25th Silver Jubilee");
  const [vowRenewal, setVowRenewal] = useState<boolean>(true);
  const [anniversaryStyle, setAnniversaryStyle] = useState<
    "intimate" | "grand" | "cocktail" | "traditional"
  >("grand");
  const [familyParticipation, setFamilyParticipation] = useState<string>(
    "Toasts by Children & Grandchildren + Choreo Dance",
  );
  const [dinnerPreference, setDinnerPreference] = useState<string>(
    "Sitdown 5-Course Silver Banquet",
  );
  const [hasMemoryVideo, setHasMemoryVideo] = useState<boolean>(true);
  const [hasSpeeches, setHasSpeeches] = useState<boolean>(true);
  const [hasPhotoTimeline, setHasPhotoTimeline] = useState<boolean>(true);
  const [musicalTribute, setMusicalTribute] = useState<string>(
    "Live Golden Era Retro Classics & Saxophone",
  );

  // Reunion
  const [familyName, setFamilyName] = useState<string>("The Mehra Clan");
  const [expectedFamiliesCount, setExpectedFamiliesCount] = useState<number>(14);
  const [reunionDuration, setReunionDuration] = useState<string>(
    "3 Days (Friday Evening to Sunday Night)",
  );
  const [generationCount, setGenerationCount] = useState<number>(4);
  const [settingPreference, setSettingPreference] = useState<
    "farmhouse" | "resort" | "home" | "lakeside"
  >("farmhouse");
  const [familyActivities, setFamilyActivities] = useState<string[]>([
    "Clan Cricket Tournament",
    "Ancestral Recipe Cook-off",
    "Generational Antakshari",
    "Bonfire Story Circle",
  ]);
  const [accommodationRequired, setAccommodationRequired] = useState<boolean>(true);
  const [familyTreeDisplay, setFamilyTreeDisplay] = useState<boolean>(true);
  const [clanMerchandise, setClanMerchandise] = useState<boolean>(true);
  const [familyTournament, setFamilyTournament] = useState<string>(
    "Clan Cup Gully Cricket & Badminton League",
  );
  const [overseasLivestream, setOverseasLivestream] = useState<boolean>(true);

  // Genesis State
  const [genesisPhase, setGenesisPhase] = useState<number>(0);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isExitingToDashboard, setIsExitingToDashboard] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const hasLaunchedRef = React.useRef<boolean>(false);

  useEffect(() => {
    if (!isWizardOpen) {
      setCurrentChapter(1);
      setIsSynthesizing(false);
      setGenesisPhase(0);
      setIsExitingToDashboard(false);
      setCountdown(5);
      hasLaunchedRef.current = false;
    } else {
      // Sync with currently planned event
      if (plannedEventType) {
        setSelectedType(plannedEventType);
      }
      if (plannedEventName) {
        setEventName(plannedEventName);
      }
      if (plannedEventCity) {
        setCity(plannedEventCity);
      }
      if (plannedEventDate) {
        setEstimatedDate(plannedEventDate);
      }
      if (plannedBudget) {
        setTotalBudget(plannedBudget);
      }
      if (plannedGuests) {
        setGuestCount(plannedGuests);
      }

      if (typeof window !== "undefined") {
        const regName = sessionStorage.getItem("kindle_registered_name");
        if (regName && regName.trim()) {
          const trimmed = regName.trim();
          setBrideName(trimmed);
          setEventName(`${trimmed}'s Celebration`);
          sessionStorage.removeItem("kindle_registered_name");
        }
      }
    }
  }, [
    isWizardOpen,
    plannedEventType,
    plannedEventName,
    plannedEventCity,
    plannedEventDate,
    plannedBudget,
    plannedGuests,
  ]);

  // Direct Auto-Launch after 5 seconds in Chapter 4
  useEffect(() => {
    if (currentChapter === 4 && isWizardOpen) {
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timer = setTimeout(() => {
        handleLaunchDashboard();
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [currentChapter, isWizardOpen]);

  if (!isWizardOpen) return null;

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const handleSelectEventType = (typeId: string) => {
    setSelectedType(typeId);
    const matched = celebrationTypes.find((c) => c.id === typeId);
    if (!matched) return;

    if (typeId === "Wedding") {
      setEventName("Rohit & Ananya's Royal Wedding");
      setTotalBudget(matched.defaultBudget);
      setGuestCount(matched.defaultGuests);
    } else if (typeId === "Birthday") {
      setEventName(`${birthdayPersonName}'s ${ageMilestone} Birthday Gala`);
      setTotalBudget(matched.defaultBudget);
      setGuestCount(matched.defaultGuests);
    } else if (typeId === "Community Festival") {
      setEventName("Grand Society Diwali Mahotsav & Mela");
      setTotalBudget(matched.defaultBudget);
      setGuestCount(matched.defaultGuests);
    } else if (typeId === "Anniversary") {
      setEventName(`${coupleNames}'s ${anniversaryMilestone} Celebration`);
      setTotalBudget(matched.defaultBudget);
      setGuestCount(matched.defaultGuests);
    } else if (typeId === "Family Reunion") {
      setEventName(`${familyName} Grand Homecoming & Reunion`);
      setTotalBudget(matched.defaultBudget);
      setGuestCount(matched.defaultGuests);
    }
  };

  const togglePriority = (id: string) => {
    if (priorities.includes(id)) {
      setPriorities(priorities.filter((p) => p !== id));
    } else {
      if (priorities.length < 3) {
        setPriorities([...priorities, id]);
      }
    }
  };

  const toggleWeddingFunction = (func: string) => {
    if (weddingFunctions.includes(func)) {
      setWeddingFunctions(weddingFunctions.filter((f) => f !== func));
    } else {
      setWeddingFunctions([...weddingFunctions, func]);
    }
  };

  const handleStartGenesis = () => {
    setCurrentChapter(4);
    setIsSynthesizing(true);
    setGenesisPhase(1);

    setTimeout(() => setGenesisPhase(2), 650);
    setTimeout(() => setGenesisPhase(3), 1350);
    setTimeout(() => setGenesisPhase(4), 2100);
    setTimeout(() => setGenesisPhase(5), 2900);
  };

  const handleLaunchDashboard = () => {
    if (hasLaunchedRef.current) return;
    hasLaunchedRef.current = true;
    setIsExitingToDashboard(true);

    const payload: ExtendedEventPlanConfig = {
      eventType: selectedType,
      title: eventName,
      city: customCity.trim() || city,
      date: estimatedDate,
      guestCount,
      totalBudget,
      durationDays,
      venuePreference,
      indoorOutdoor,
      themeStyle,
      priorities,
      dateFlexibility,
      preferredLanguage,
      specialRequirements,
      additionalInstructions,
    };

    if (selectedType === "Wedding") {
      payload.wedding = {
        brideName,
        groomName,
        weddingDate: estimatedDate,
        functionsCount,
        functions: weddingFunctions,
        style: weddingStyle,
        mandapRequired,
        cateringPreference,
        baraatArrangements,
        muhuratTimings,
        photographyPreference,
        familyTraditions,
      };
    } else if (selectedType === "Birthday") {
      payload.birthday = {
        birthdayPersonName,
        ageMilestone,
        celebrationType,
        partyTheme,
        cakePreference,
        entertainmentPreference,
        memoryWall: hasMemoryWall,
        videoMontage: hasVideoMontage,
        specialPerformances,
        personalizedGifts,
      };
    } else if (selectedType === "Community Festival") {
      payload.community = {
        isPublic,
        maxCrowd,
        eventDuration,
        stallCount,
        foodArrangements,
        culturalPerformances,
        hasSponsors,
        volunteerCount,
        stallCategories,
        chiefGuests,
        communityActivities,
        fundraisingGoal,
      };
    } else if (selectedType === "Anniversary") {
      payload.anniversary = {
        coupleNames,
        milestone: anniversaryMilestone,
        vowRenewal,
        celebrationStyle: anniversaryStyle,
        familyParticipation,
        dinnerPreference,
        memoryVideo: hasMemoryVideo,
        familySpeeches: hasSpeeches,
        photoTimeline: hasPhotoTimeline,
        musicalTribute,
      };
    } else if (selectedType === "Family Reunion") {
      payload.reunion = {
        familyName,
        expectedFamiliesCount,
        reunionDuration,
        generationCount,
        settingPreference,
        familyActivities,
        accommodationRequired,
        familyTreeDisplay,
        clanMerchandise,
        familyTournament,
        overseasLivestream,
      };
    }

    setTimeout(() => {
      generateAndLoadCustomPlan(payload);
      setIsWizardOpen(false);
    }, 700);
  };

  const getBackground = () => {
    const matched = celebrationTypes.find((c) => c.id === selectedType);
    return (
      matched?.bgImage ||
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80"
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground font-sans transition-all duration-700 ${
        isExitingToDashboard ? "scale-105 opacity-0 blur-md" : "scale-100 opacity-100"
      }`}
    >
      {/* Dynamic Background with Both Light and Dark Theme Adaptation */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          key={selectedType}
          src={getBackground()}
          alt="Backdrop"
          className="h-full w-full object-cover transition-opacity duration-1000 ease-in-out scale-105 opacity-15 dark:opacity-20 filter brightness-90 dark:brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/80" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex h-20 shrink-0 items-center justify-between border-b border-border/70 bg-background/80 px-6 sm:px-10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary via-primary to-amber-500 text-primary-foreground shadow-md shadow-primary/20">
            <Scroll className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
                Chapter {currentChapter} of 4
              </span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs font-medium text-muted-foreground">
                {chapters[currentChapter - 1]?.name}
              </span>
            </div>
            <h2 className="font-display text-base sm:text-xl font-bold text-foreground leading-tight">
              {chapters[currentChapter - 1]?.subtitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-4 py-1.5 text-xs font-sans text-muted-foreground">
            <span>Selected Event:</span>
            <strong className="text-foreground font-display font-bold">{selectedType}</strong>
          </div>

          {/* Theme Toggle in Modal Header */}
          <ThemeToggle className="size-9 grid place-items-center rounded-full border border-border/80 bg-card hover:bg-muted" />

          <button
            onClick={() => setIsWizardOpen(false)}
            className="grid size-9 place-items-center rounded-full border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition"
            title="Close Setup Wizard"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      {/* Fluid Progress Line */}
      <div className="relative z-20 h-1.5 w-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-primary to-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${(currentChapter / 4) * 100}%` }}
        />
      </div>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-8 sm:px-10 lg:px-16 scrollbar-thin scrollbar-thumb-muted-foreground/20">
        <div className="mx-auto max-w-5xl">
          {/* =========================================================================
              CHAPTER 1: UNIVERSAL REQUIRED QUESTIONS
          ========================================================================= */}
          {currentChapter === 1 && (
            <div className="space-y-8 animate-enter">
              <div className="rounded-2xl border border-primary/25 bg-primary/5 dark:bg-primary/10 p-5 sm:p-6 backdrop-blur-md flex items-start gap-4 shadow-sm">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Flame className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                    Universal Event Foundations
                    <span className="rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-xs px-2.5 py-0.5 border border-red-500/30 font-semibold uppercase">
                      Required
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Select your celebration type and fundamental parameters. In the next step,
                    Kindle AI curates your event-specific options.
                  </p>
                </div>
              </div>

              {/* 1. Event Type Selection (PHOTO CARDS) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    1. Select Event Type
                  </label>
                  <span className="text-xs text-primary font-semibold">
                    {celebrationTypes.find((c) => c.id === selectedType)?.title}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {celebrationTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectEventType(type.id)}
                        className={`text-left rounded-2xl border overflow-hidden transition-all duration-300 relative group flex flex-col cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-lg shadow-primary/15 ring-2 ring-primary scale-[1.01]"
                            : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/40 shadow-xs"
                        }`}
                      >
                        {/* High-res Photo Thumbnail */}
                        <div className="relative h-32 w-full overflow-hidden">
                          <img
                            src={type.bgImage}
                            alt={type.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                          <div className="absolute top-3 right-3">
                            {isSelected && (
                              <div className="size-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                                <Check className="size-3.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2.5 left-3.5 flex items-center gap-2 text-white">
                            <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-400">
                              <Icon className="size-4" />
                            </div>
                            <span className="text-xs font-sans font-medium text-white/90">
                              {type.tagline}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-display font-bold text-foreground text-base">
                              {type.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                              {type.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Base: ₹{(type.defaultBudget / 100000).toFixed(0)} Lakhs</span>
                            <span className="font-medium text-foreground">
                              {type.defaultGuests} Guests
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Destination / City */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    2. City / Destination <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Active:{" "}
                    <strong className="text-foreground font-semibold">
                      {customCity.trim() || city}
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {visualDestinations.map((dest) => {
                    const isSelected = city === dest.city && !customCity;
                    return (
                      <button
                        key={dest.city}
                        type="button"
                        onClick={() => {
                          setCity(dest.city);
                          setCustomCity("");
                        }}
                        className={`text-left rounded-xl border overflow-hidden transition relative group ${
                          isSelected
                            ? "border-primary ring-2 ring-primary shadow-md shadow-primary/15 scale-[1.02]"
                            : "border-border/80 opacity-80 hover:opacity-100 hover:border-foreground/30 bg-card"
                        }`}
                      >
                        <div className="relative h-20 w-full overflow-hidden">
                          <img
                            src={dest.image}
                            alt={dest.city}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              <Check className="size-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-card/90">
                          <h5 className="font-display font-bold text-xs text-foreground truncate">
                            {dest.city.split(",")[0]}
                          </h5>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {dest.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Or enter custom city (e.g. Alibaug, Mussoorie, Bengaluru, London)..."
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full h-12 rounded-xl border border-input bg-card pl-10 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Event Name, Date, Guests, Budget (PROFESSIONAL EXECUTIVE INPUTS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    3. Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Rohit & Ananya's Royal Wedding"
                    className="w-full h-12 rounded-xl border border-input bg-card px-4 text-sm sm:text-base font-medium text-foreground placeholder:text-muted-foreground/60 shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    4. Estimated Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      value={estimatedDate}
                      onChange={(e) => setEstimatedDate(e.target.value)}
                      className="w-full h-12 rounded-xl border border-input bg-card pl-10 pr-4 text-sm sm:text-base font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    5. Guests Count <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      step={10}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full h-12 rounded-xl border border-input bg-card pl-10 pr-4 text-sm sm:text-base font-display font-bold text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Budget Slider & Quick Selection */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                      6. Total Budget (INR ₹) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Rupee-exact allocation calculated across 12 authentic expenditure categories
                    </p>
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                    {inr(totalBudget)}
                  </div>
                </div>

                <input
                  type="range"
                  min={200000}
                  max={10000000}
                  step={50000}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full accent-primary h-2.5 bg-muted rounded-lg cursor-pointer"
                />

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/60">
                  {[500000, 1000000, 2500000, 5000000, 7500000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setTotalBudget(b)}
                      className={`text-xs font-display px-3.5 py-1.5 rounded-lg border transition ${
                        totalBudget === b
                          ? "border-primary text-primary bg-primary/10 dark:bg-primary/20 font-bold shadow-xs"
                          : "border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      ₹{(b / 100000).toFixed(0)} Lakhs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CHAPTER 2: EVENT-SPECIFIC BLUEPRINT
          ========================================================================= */}
          {currentChapter === 2 && (
            <div className="space-y-8 animate-enter">
              <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-5 sm:p-6 backdrop-blur-md flex items-start gap-4 shadow-sm">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground shadow-sm">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display uppercase tracking-widest text-secondary font-bold">
                      Specialized Blueprint
                    </span>
                    <span className="rounded-full bg-muted text-muted-foreground text-[10px] px-2.5 py-0.5">
                      Tailored for: {selectedType}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {selectedType === "Wedding" && "💍 Royal Wedding Ceremony Blueprint"}
                    {selectedType === "Birthday" && "🎂 Milestone Jubilee Birthday Blueprint"}
                    {selectedType === "Community Festival" && "🎪 Community Mela & Gala Blueprint"}
                    {selectedType === "Anniversary" && "🥂 Silver / Golden Jubilee Vows Blueprint"}
                    {selectedType === "Family Reunion" && "🏡 Grand Family Reunion Blueprint"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    These specific questions configure authentic vendor decisions, ceremonial
                    schedules, and floor plans.
                  </p>
                </div>
              </div>

              {/* --- WEDDING SPECIFIC --- */}
              {selectedType === "Wedding" && (
                <div className="space-y-6">
                  {/* Required */}
                  <div className="rounded-2xl border border-red-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block pb-2 border-b border-border/60">
                      Priority: Required
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Bride's Name *
                        </label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Groom's Name *
                        </label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Number of Functions *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={7}
                          value={functionsCount}
                          onChange={(e) => setFunctionsCount(Number(e.target.value))}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-display font-bold text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Functions Selection with Visual Cards */}
                  <div className="rounded-2xl border border-amber-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Priority: Recommended (Select Wedding Functions)
                      </span>
                      <span className="text-xs text-muted-foreground font-sans">
                        {weddingFunctions.length} Selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {weddingFunctionsCatalog.map((fn) => {
                        const active = weddingFunctions.includes(fn.name);
                        return (
                          <button
                            key={fn.name}
                            type="button"
                            onClick={() => toggleWeddingFunction(fn.name)}
                            className={`rounded-xl border overflow-hidden text-left relative group transition ${
                              active
                                ? "border-primary ring-2 ring-primary shadow-md shadow-primary/15 scale-[1.02]"
                                : "border-border/80 opacity-80 hover:opacity-100 bg-background"
                            }`}
                          >
                            <div className="relative h-20 w-full overflow-hidden">
                              <img
                                src={fn.image}
                                alt={fn.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                              {active && (
                                <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                  <Check className="size-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <div className="p-2.5 bg-card">
                              <h5 className="font-display font-bold text-xs text-foreground truncate">
                                {fn.name}
                              </h5>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {fn.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Style and Catering Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Ceremony Style
                        </label>
                        <select
                          value={weddingStyle}
                          onChange={(e) =>
                            setWeddingStyle(e.target.value as "traditional" | "modern" | "fusion")
                          }
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="traditional">Traditional Vedic</option>
                          <option value="modern">Modern Minimalist</option>
                          <option value="fusion">Grand Fusion / Contemporary</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Catering Preference
                        </label>
                        <select
                          value={cateringPreference}
                          onChange={(e) =>
                            setCateringPreference(
                              e.target.value as
                                "pure_veg" | "multi_cuisine" | "regional_authentic" | "satvik_jain",
                            )
                          }
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="regional_authentic">Regional Authentic Specialties</option>
                          <option value="pure_veg">100% Pure Vegetarian Royal Feast</option>
                          <option value="satvik_jain">
                            Strict Jain / Satvik Segregated Counters
                          </option>
                          <option value="multi_cuisine">Multi-Cuisine Royal Spread</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Optional */}
                  <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground block pb-2 border-b border-border/60">
                      Priority: Optional (Fine Traditions & Logistics)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Baraat Arrangements
                        </label>
                        <input
                          type="text"
                          value={baraatArrangements}
                          onChange={(e) => setBaraatArrangements(e.target.value)}
                          placeholder="e.g. Royal Dhol Tasha & Vintage Open Car"
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Muhurat Timings
                        </label>
                        <input
                          type="text"
                          value={muhuratTimings}
                          onChange={(e) => setMuhuratTimings(e.target.value)}
                          placeholder="e.g. Morning 11:18 AM Auspicious Window"
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- BIRTHDAY SPECIFIC --- */}
              {selectedType === "Birthday" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-red-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block pb-2 border-b border-border/60">
                      Priority: Required
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Birthday Person's Name *
                        </label>
                        <input
                          type="text"
                          value={birthdayPersonName}
                          onChange={(e) => setBirthdayPersonName(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Age / Milestone *
                        </label>
                        <input
                          type="text"
                          value={ageMilestone}
                          onChange={(e) => setAgeMilestone(e.target.value)}
                          placeholder="e.g. 1st, 18th, 21st, 25th, 50th"
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-display font-bold text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block pb-2 border-b border-border/60">
                      Priority: Recommended (Theme & Cake)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Party Theme
                        </label>
                        <input
                          type="text"
                          value={partyTheme}
                          onChange={(e) => setPartyTheme(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Cake Preference
                        </label>
                        <input
                          type="text"
                          value={cakePreference}
                          onChange={(e) => setCakePreference(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- COMMUNITY FESTIVAL SPECIFIC --- */}
              {selectedType === "Community Festival" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-red-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block pb-2 border-b border-border/60">
                      Priority: Required
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Event Access *
                        </label>
                        <select
                          value={isPublic}
                          onChange={(e) =>
                            setIsPublic(e.target.value as "public" | "private" | "society")
                          }
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="public">Open Public Celebration</option>
                          <option value="society">Society / Residents Only</option>
                          <option value="private">Ticketed / Private Gala</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Expected Max Crowd *
                        </label>
                        <input
                          type="number"
                          value={maxCrowd}
                          onChange={(e) => setMaxCrowd(Number(e.target.value))}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-display font-bold text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Event Duration *
                        </label>
                        <input
                          type="text"
                          value={eventDuration}
                          onChange={(e) => setEventDuration(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- ANNIVERSARY SPECIFIC --- */}
              {selectedType === "Anniversary" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-red-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block pb-2 border-b border-border/60">
                      Priority: Required
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Couple's Names *
                        </label>
                        <input
                          type="text"
                          value={coupleNames}
                          onChange={(e) => setCoupleNames(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Milestone *
                        </label>
                        <select
                          value={anniversaryMilestone}
                          onChange={(e) => setAnniversaryMilestone(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="25th Silver Jubilee">
                            25th Silver Jubilee (25 Years)
                          </option>
                          <option value="30th Pearl Anniversary">
                            30th Pearl Anniversary (30 Years)
                          </option>
                          <option value="40th Ruby Jubilee">40th Ruby Jubilee (40 Years)</option>
                          <option value="50th Golden Jubilee">
                            50th Golden Jubilee (50 Years)
                          </option>
                          <option value="60th Diamond Jubilee">
                            60th Diamond Jubilee (60 Years)
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- FAMILY REUNION SPECIFIC --- */}
              {selectedType === "Family Reunion" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-red-500/25 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block pb-2 border-b border-border/60">
                      Priority: Required
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Clan Name *
                        </label>
                        <input
                          type="text"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Expected Families Count *
                        </label>
                        <input
                          type="number"
                          value={expectedFamiliesCount}
                          onChange={(e) => setExpectedFamiliesCount(Number(e.target.value))}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-display font-bold text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80 block">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={reunionDuration}
                          onChange={(e) => setReunionDuration(e.target.value)}
                          className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              CHAPTER 3: UNIVERSAL RECOMMENDED & OPTIONAL
          ========================================================================= */}
          {currentChapter === 3 && (
            <div className="space-y-8 animate-enter">
              <div className="rounded-2xl border border-amber-500/30 bg-card p-5 sm:p-6 shadow-xs">
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs px-2.5 py-0.5 border border-amber-500/30 font-semibold uppercase">
                    Recommended
                  </span>
                  Physical Ambience & Venue Architecture
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select your physical venue setting and priorities to guide the virtual venue
                  layout and budget optimizer.
                </p>

                {/* Venue Visual Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {venueStylesVisual.map((v) => {
                    const isSelected = venuePreference === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setVenuePreference(v.name)}
                        className={`rounded-xl border overflow-hidden text-left relative transition ${
                          isSelected
                            ? "border-primary ring-2 ring-primary shadow-md shadow-primary/15 scale-[1.02]"
                            : "border-border/80 opacity-80 hover:opacity-100 bg-background"
                        }`}
                      >
                        <div className="relative h-24 w-full">
                          <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                          {isSelected && (
                            <div className="absolute top-2 right-2 size-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              <Check className="size-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 bg-card">
                          <h5 className="font-display font-bold text-xs text-foreground">
                            {v.name}
                          </h5>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">
                            {v.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block">
                      Event Duration
                    </label>
                    <select
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value={1}>1 Day (Single Day Ceremony)</option>
                      <option value={2}>2 Days (Weekend Celebration)</option>
                      <option value={3}>3 Days (Grand Multi-Day Feast)</option>
                      <option value={4}>4 Days (Royal Extended Festivities)</option>
                      <option value={5}>5+ Days (Full Week Celebration)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block">
                      Indoor / Outdoor Ambience
                    </label>
                    <select
                      value={indoorOutdoor}
                      onChange={(e) =>
                        setIndoorOutdoor(
                          e.target.value as "indoor" | "outdoor" | "both" | "open_air_lawn",
                        )
                      }
                      className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value="both">Hybrid (AC Ballroom + Open Lawn)</option>
                      <option value="indoor">100% Indoor Air-Conditioned</option>
                      <option value="outdoor">Open-Air Lawns Under Auspicious Stars</option>
                      <option value="open_air_lawn">Covered German Hangar Canopy</option>
                    </select>
                  </div>
                </div>

                {/* Top 3 Priorities Selection */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Top 3 Priorities (Weights Budget Allocator)
                    </label>
                    <span className="text-xs font-display text-primary font-bold">
                      {priorities.length}/3 selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {grandeurPillars.map((p) => {
                      const active = priorities.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePriority(p.id)}
                          className={`rounded-xl border overflow-hidden text-left flex items-center gap-3 transition ${
                            active
                              ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-sm ring-1 ring-primary"
                              : "border-border/80 bg-background hover:bg-muted/40"
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className="size-16 object-cover shrink-0"
                          />
                          <div className="p-2 flex-1">
                            <h4 className="font-display text-xs font-bold text-foreground">
                              {p.title}
                            </h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {p.subtitle}
                            </p>
                          </div>
                          {active && (
                            <div className="mr-3 size-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-xs">
                              <Check className="size-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Optional Section */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <span className="rounded-full bg-muted text-muted-foreground text-xs px-2.5 py-0.5 border border-border/80 font-semibold uppercase">
                    Optional
                  </span>
                  Special Requirements & Vision
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block">
                      Date Flexibility
                    </label>
                    <select
                      value={dateFlexibility}
                      onChange={(e) =>
                        setDateFlexibility(
                          e.target.value as
                            "exact" | "flexible_weekend" | "flexible_month" | "anytime",
                        )
                      }
                      className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value="exact">Strict Exact Date (No shifting)</option>
                      <option value="flexible_weekend">Flexible within +/- 1 Weekend</option>
                      <option value="flexible_month">Flexible within the Month</option>
                      <option value="anytime">Anytime during peak season</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block">
                      Preferred Language
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">हिंदी (Hindi)</option>
                      <option value="Marathi">मराठी (Marathi)</option>
                      <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                      <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block">
                      Special Requirements (Accessibility, Dietary, Green/Eco)
                    </label>
                    <input
                      type="text"
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      placeholder="e.g. 100% Wheelchair accessible, Zero single-use plastic, Separate Satvik Jain kitchen"
                      className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground/80 block">
                      Additional Directives & Family Vision
                    </label>
                    <textarea
                      rows={2}
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      placeholder="Share any heirloom memories, specific song preferences, or unique family dynamics..."
                      className="w-full p-4 rounded-xl border border-input bg-background text-sm font-medium text-foreground shadow-xs focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CHAPTER 4: MASTER CELEBRATION DOSSIER UNVEILING
          ========================================================================= */}
          {currentChapter === 4 && (
            <div className="space-y-6 animate-enter max-w-3xl mx-auto py-4">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-xs font-display font-semibold text-amber-600 dark:text-amber-400 shadow-sm">
                  <Flame className="size-3.5 text-primary" />
                  Kindle Bespoke Concierge
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  Crafting Your Master Celebration Dossier
                </h3>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto font-sans leading-relaxed">
                  Curating every ceremonial ritual, rupee-exact treasury allocation, and vendor
                  milestone with bespoke precision.
                </p>
              </div>

              {/* Master Photographic Dossier Showcase */}
              <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl backdrop-blur-xl">
                <div className="relative h-44 sm:h-52 w-full overflow-hidden">
                  <img
                    src={getBackground()}
                    alt="Master Dossier Backdrop"
                    className="h-full w-full object-cover transition-transform duration-1000 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-display font-bold text-amber-400 border border-amber-500/30">
                      {selectedType}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                    <div>
                      <span className="text-[11px] font-sans uppercase tracking-widest text-white/75">
                        Official Celebration Dossier
                      </span>
                      <h4 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                        {eventName}
                      </h4>
                    </div>
                    <div className="font-display text-lg sm:text-xl font-extrabold text-amber-400 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-500/40 shadow-lg">
                      {inr(totalBudget)}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Event Parameter Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                    <div className="rounded-2xl border border-border/80 bg-muted/40 p-3">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Destination
                      </span>
                      <strong className="text-foreground font-display text-sm">
                        {customCity.trim() || city}
                      </strong>
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/40 p-3">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Celebration Date
                      </span>
                      <strong className="text-foreground font-display text-sm">
                        {estimatedDate}
                      </strong>
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/40 p-3">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Esteemed Guests
                      </span>
                      <strong className="text-foreground font-display text-sm">
                        {guestCount} Guests
                      </strong>
                    </div>
                    <div className="rounded-2xl border border-border/80 bg-muted/40 p-3">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Duration
                      </span>
                      <strong className="text-foreground font-display text-sm">
                        {durationDays} Days Festivity
                      </strong>
                    </div>
                  </div>

                  {/* Curated Milestone Checkpoints */}
                  <div className="space-y-3 pt-2">
                    <div
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-500 ${
                        genesisPhase >= 1
                          ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`size-5 shrink-0 ${genesisPhase >= 1 ? "text-emerald-500" : "text-muted-foreground/40"}`}
                      />
                      <div className="flex-1">
                        <h5 className="font-display font-bold text-xs sm:text-sm">
                          Auspicious Muhurats & Ceremonies Itinerary
                        </h5>
                        <p className="text-[11px] text-muted-foreground">
                          Traditions, functions schedule & vendor briefing finalized
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-500 ${
                        genesisPhase >= 2
                          ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`size-5 shrink-0 ${genesisPhase >= 2 ? "text-emerald-500" : "text-muted-foreground/40"}`}
                      />
                      <div className="flex-1">
                        <h5 className="font-display font-bold text-xs sm:text-sm">
                          Rupee-Exact Treasury & Priority Allocation
                        </h5>
                        <p className="text-[11px] text-muted-foreground">
                          12 itemized budget categories weighted by your top priorities
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-500 ${
                        genesisPhase >= 3
                          ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`size-5 shrink-0 ${genesisPhase >= 3 ? "text-emerald-500" : "text-muted-foreground/40"}`}
                      />
                      <div className="flex-1">
                        <h5 className="font-display font-bold text-xs sm:text-sm">
                          Venue Architecture & Seating Harmony
                        </h5>
                        <p className="text-[11px] text-muted-foreground">
                          {venuePreference} layout, dining capacity & ceremony zones active
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-500 ${
                        genesisPhase >= 4
                          ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`size-5 shrink-0 ${genesisPhase >= 4 ? "text-emerald-500" : "text-muted-foreground/40"}`}
                      />
                      <div className="flex-1">
                        <h5 className="font-display font-bold text-xs sm:text-sm">
                          Contingency Shields & Day-of Live Execution
                        </h5>
                        <p className="text-[11px] text-muted-foreground">
                          Murphy-mode risk mitigations & minute-by-minute timeline locked
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5-Second Auto-Direct Countdown & Instant CTA */}
                  <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-foreground">
                        <span className="font-sans font-medium flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                          Unveiling your celebration dashboard in{" "}
                          <strong className="font-display text-amber-600 dark:text-amber-400 text-sm">
                            {countdown}s
                          </strong>
                          ...
                        </span>
                        <span className="text-[10px] text-muted-foreground font-sans">
                          Directing automatically
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-primary to-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                          style={{ width: `${Math.min(100, ((5 - countdown) / 5) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLaunchDashboard}
                      className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-amber-500 px-6 py-3 text-xs sm:text-sm font-display font-bold text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 transition transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Enter Dashboard Now
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation Bar */}
      {currentChapter < 4 && (
        <footer className="relative z-20 flex h-20 shrink-0 items-center justify-between border-t border-border/70 bg-background/80 px-6 sm:px-10 backdrop-blur-xl">
          <button
            type="button"
            disabled={currentChapter === 1}
            onClick={() => setCurrentChapter((c) => Math.max(1, c - 1))}
            className="flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs sm:text-sm font-display font-medium text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition shadow-xs"
          >
            <ChevronLeft className="size-4" />
            Previous Chapter
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline font-sans">
              Step {currentChapter} of 4
            </span>
            {currentChapter < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentChapter((c) => Math.min(4, c + 1))}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-display font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition"
              >
                Next Step
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartGenesis}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-amber-500 px-6 py-2.5 text-xs sm:text-sm font-display font-bold text-primary-foreground shadow-md shadow-primary/25 hover:shadow-primary/40 transition"
              >
                <Sparkles className="size-4" />
                Generate Master Blueprint
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
