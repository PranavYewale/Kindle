import React, { useEffect, useRef, useState } from "react";
import { useDashboard, type EventSpot } from "./dashboard-context";
import {
  MapPin,
  Building,
  Hotel,
  Car,
  GlassWater,
  Sparkles,
  Plus,
  Trash2,
  Navigation,
  Share2,
  Phone,
  Users,
  Compass,
  Check,
  ExternalLink,
  Layers,
  Search,
  Info,
  Calendar,
  X,
  Crosshair,
} from "lucide-react";

// City center coordinates lookup
export const cityCoordinates: Record<string, [number, number]> = {
  "Pune, Maharashtra": [18.5204, 73.8567],
  "Jaipur, Rajasthan": [26.9124, 75.7873],
  "Udaipur, Rajasthan": [24.5854, 73.7125],
  "Mumbai, Maharashtra": [19.076, 72.8777],
  "Delhi NCR": [28.6139, 77.209],
  "Bengaluru, Karnataka": [12.9716, 77.5946],
  "Goa (Beachfront)": [15.2993, 74.124],
  "Hyderabad, Telangana": [17.385, 78.4867],
};

const categoryConfig = {
  venue: {
    label: "Main Venue / Lawns",
    labelHi: "मुख्य वेन्यू व लॉन",
    icon: Building,
    color: "#d97706", // Amber
    bgClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    badge: "Venue",
  },
  hotel: {
    label: "Guest Hotel & Stay",
    labelHi: "मेहमानों का होटल व आवास",
    icon: Hotel,
    color: "#2563eb", // Blue
    bgClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
    badge: "Hotel",
  },
  ceremony: {
    label: "Ceremony & Mandap",
    labelHi: "रस्में व मंडप स्थल",
    icon: Sparkles,
    color: "#e11d48", // Rose
    bgClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    badge: "Ceremony",
  },
  transport: {
    label: "Airport / Shuttle Hub",
    labelHi: "एयरपोर्ट व शटल पिकअप",
    icon: Car,
    color: "#059669", // Emerald
    bgClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    badge: "Shuttle",
  },
  afterparty: {
    label: "After-Party Lounge",
    labelHi: "आफ्टर-पार्टी लाउंज",
    icon: GlassWater,
    color: "#9333ea", // Purple
    bgClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30",
    badge: "Party",
  },
  parking: {
    label: "Valet & Parking Gate",
    labelHi: "वैले व पार्किंग गेट",
    icon: Navigation,
    color: "#475569", // Slate
    bgClass: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30",
    badge: "Parking",
  },
};

export function EventMapPlanner() {
  const { lang, eventCity, eventName, eventSpots, addEventSpot, removeEventSpot, updateEventSpot } =
    useDashboard();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(eventSpots[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isPinModeActive, setIsPinModeActive] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // New Spot modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newSpotCoords, setNewSpotCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [newSpotForm, setNewSpotForm] = useState({
    name: "",
    category: "venue" as EventSpot["category"],
    address: "",
    capacityOrRooms: "",
    contactPerson: "",
    phone: "",
    notes: "",
  });

  // Calculate distance between two points in km (Haversine formula)
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Find primary venue and primary hotel for transit estimation
  const primaryVenue =
    eventSpots.find((s) => s.category === "venue" && s.isPrimary) ||
    eventSpots.find((s) => s.category === "venue") ||
    eventSpots[0];
  const primaryHotel = eventSpots.find((s) => s.category === "hotel") || eventSpots[1];

  const transitDist =
    primaryVenue && primaryHotel
      ? calculateDistanceKm(primaryHotel.lat, primaryHotel.lng, primaryVenue.lat, primaryVenue.lng)
      : null;

  // Initialize Real Leaflet Map (Browser Only)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Dynamically load leaflet JS
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Determine initial center from event city
      const cityCenter = cityCoordinates[eventCity] || [18.5204, 73.8567];

      // If map is already initialized, just clean up or update view
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }

      // Create Leaflet Map Instance
      const map = L.map(mapContainerRef.current, {
        center: cityCenter,
        zoom: 12,
        zoomControl: false,
      });

      // Add Zoom control in top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add high-resolution clean map tiles (OpenStreetMap - 100% Free & No API Key Required)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Group layer for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      leafletMapRef.current = map;

      // Handle Map Click to Pin New Spot
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        setNewSpotCoords({ lat, lng });
        setNewSpotForm({
          name: "New Event Location",
          category: "venue",
          address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          capacityOrRooms: "200 Guests",
          contactPerson: "",
          phone: "",
          notes: "",
        });
        setIsAddModalOpen(true);
      });

      renderMarkers(L, map, markersLayer);
    }

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [eventCity]);

  // Re-render markers whenever eventSpots changes
  useEffect(() => {
    async function updateMarkers() {
      if (typeof window === "undefined" || !leafletMapRef.current || !markersLayerRef.current)
        return;
      const L = await import("leaflet");
      renderMarkers(L, leafletMapRef.current, markersLayerRef.current);
    }
    updateMarkers();
  }, [eventSpots, selectedSpotId]);

  // Render styled markers with custom HTML DivIcons
  const renderMarkers = (L: any, map: any, layer: any) => {
    layer.clearLayers();

    eventSpots.forEach((spot) => {
      const config = categoryConfig[spot.category] || categoryConfig.venue;
      const isSelected = spot.id === selectedSpotId;

      // Custom styled HTML marker pin
      const iconHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? "44px" : "36px"};
          height: ${isSelected ? "44px" : "36px"};
          background: ${config.color};
          color: white;
          border-radius: 9999px;
          border: 3px solid white;
          box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          cursor: pointer;
          transition: all 0.2s ease;
          ${spot.isPrimary ? "ring: 4px solid rgba(217, 119, 6, 0.4);" : ""}
        ">
          <span style="font-size: ${isSelected ? "18px" : "15px"}; font-weight: bold;">
            ${spot.category === "venue" ? "🏰" : spot.category === "hotel" ? "🏨" : spot.category === "ceremony" ? "🪔" : spot.category === "transport" ? "✈️" : spot.category === "afterparty" ? "🍸" : "🚗"}
          </span>
          ${
            spot.isPrimary
              ? `<span style="position: absolute; -top: 6px; -right: 6px; width: 12px; height: 12px; background: #10b981; border: 2px solid white; border-radius: 9999px;"></span>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: iconHtml,
        iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
        iconAnchor: [isSelected ? 22 : 18, isSelected ? 22 : 18],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

      // Popup content
      const popupHtml = `
        <div style="font-family: inherit; padding: 6px; min-width: 200px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${config.color}20; color: ${config.color}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">
              ${config.badge}
            </span>
            ${spot.isPrimary ? `<span style="font-size: 10px; color: #059669; font-weight: 700;">● PRIMARY</span>` : ""}
          </div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">${spot.name}</h4>
          <p style="margin: 4px 0; font-size: 11px; color: #64748b;">${spot.address}</p>
          ${spot.capacityOrRooms ? `<p style="margin: 4px 0; font-size: 11px; font-weight: 600; color: #d97706;">👥 ${spot.capacityOrRooms}</p>` : ""}
          ${spot.phone ? `<p style="margin: 4px 0; font-size: 11px; color: #334155;">📞 ${spot.phone}</p>` : ""}
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <a href="https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: 700; color: #2563eb; text-decoration: none;">
              Open in Google Maps ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        setSelectedSpotId(spot.id);
      });

      layer.addLayer(marker);
    });
  };

  // Fly to selected spot
  const handleSpotSelect = (spot: EventSpot) => {
    setSelectedSpotId(spot.id);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([spot.lat, spot.lng], 15, {
        duration: 1.2,
      });
    }
  };

  // Save new spot from modal
  const handleSaveNewSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotCoords) return;

    addEventSpot({
      name: newSpotForm.name || "Custom Event Spot",
      category: newSpotForm.category,
      lat: newSpotCoords.lat,
      lng: newSpotCoords.lng,
      address:
        newSpotForm.address || `${newSpotCoords.lat.toFixed(4)}, ${newSpotCoords.lng.toFixed(4)}`,
      capacityOrRooms: newSpotForm.capacityOrRooms,
      contactPerson: newSpotForm.contactPerson,
      phone: newSpotForm.phone,
      notes: newSpotForm.notes,
    });

    setIsAddModalOpen(false);
    setIsPinModeActive(false);
  };

  // Share all spots to WhatsApp
  const handleShareSpotsWhatsApp = () => {
    const lines = [
      `📍 *${eventName} — Key Event Locations & Venues*`,
      `City: ${eventCity}`,
      ``,
      ...eventSpots.map((s, idx) => {
        const cat = categoryConfig[s.category]?.badge || "Spot";
        return `${idx + 1}. *[${cat}] ${s.name}*\n   📍 ${s.address}\n   ${s.capacityOrRooms ? `👥 ${s.capacityOrRooms}\n   ` : ""}🔗 Maps: https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}\n`;
      }),
      `Shared via Kindle Event Studio`,
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Filtered spots list
  const filteredSpots = eventSpots.filter((s) => {
    const matchesCategory = filterCategory === "all" || s.category === filterCategory;
    const matchesSearch =
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Compass className="size-3.5" />
            <span>
              {lang === "hi"
                ? "वास्तविक मैप वेन्यू व स्थान योजना"
                : "Real Interactive Event Map & Venues"}
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
            {lang === "hi" ? "इवेंट स्थल व होटल मैप योजना" : "Event Spots, Venues & Hotel Map"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "मैप पर मुख्य वेन्यू, मेहमानों के ठहरने का होटल, मंडप और एयरपोर्ट शटल पिकअप पॉइंट चुनें या नया स्थान पिन करने के लिए मैप पर क्लिक करें।"
              : "Select and pin key celebration locations on the real map: main venue, guest hotels, sacred mandap, and airport shuttle hubs."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPinModeActive(!isPinModeActive)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
              isPinModeActive
                ? "bg-amber-600 text-white ring-4 ring-amber-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            <Crosshair className="size-4" />
            <span>
              {isPinModeActive
                ? lang === "hi"
                  ? "मैप पर क्लिक करें"
                  : "Click Map to Pin"
                : lang === "hi"
                  ? "नया स्थान पिन करें"
                  : "Pin New Spot"}
            </span>
          </button>

          <button
            onClick={handleShareSpotsWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition shadow-sm"
          >
            {copiedShare ? (
              <Check className="size-4 text-emerald-500" />
            ) : (
              <Share2 className="size-4 text-primary" />
            )}
            <span>
              {copiedShare
                ? lang === "hi"
                  ? "व्हाट्सएप लिंक कॉपी हो गया!"
                  : "Copied Itinerary!"
                : lang === "hi"
                  ? "व्हाट्सएप पर शेयर करें"
                  : "Share on WhatsApp"}
            </span>
          </button>
        </div>
      </div>

      {/* Transit Distance Intelligence Card */}
      {primaryVenue && primaryHotel && transitDist && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border bg-gradient-to-r from-blue-500/10 via-amber-500/10 to-transparent p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/20 text-primary shrink-0">
              <Navigation className="size-4" />
            </div>
            <div>
              <p className="font-bold text-foreground">
                Transit Intel: {primaryHotel.name} ➔ {primaryVenue.name}
              </p>
              <p className="text-muted-foreground mt-0.5">
                Distance: <strong className="text-foreground">{transitDist} km</strong> · Estimated
                Drive:{" "}
                <strong className="text-foreground">
                  ~{Math.round(Number(transitDist) * 2.5)} mins
                </strong>{" "}
                in regular city traffic.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 font-bold text-emerald-700 dark:text-emerald-400">
            Comfortable Shuttle Corridor
          </span>
        </div>
      )}

      {/* Main Map + Side Panel Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Real Leaflet Map Container (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative h-[560px] w-full overflow-hidden rounded-3xl border-2 border-border shadow-md">
            {/* The Map Div */}
            <div ref={mapContainerRef} className="h-full w-full z-10" />

            {/* Pin Mode Active Floating Overlay Banner */}
            {isPinModeActive && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-2xl bg-amber-600 text-white px-4 py-2 text-xs font-bold shadow-xl animate-bounce">
                <MapPin className="size-4" />
                <span>Click anywhere on the map to place a pin!</span>
                <button
                  onClick={() => setIsPinModeActive(false)}
                  className="ml-2 rounded-full bg-white/20 p-1 hover:bg-white/30"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

            {/* Quick Legend at Bottom */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-1.5 rounded-2xl border bg-card/90 p-2 text-[11px] font-bold backdrop-blur-md shadow-md">
              <span className="text-muted-foreground mr-1">Legend:</span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="size-2 rounded-full bg-amber-500" /> Venue
              </span>
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <span className="size-2 rounded-full bg-blue-500" /> Hotel
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="size-2 rounded-full bg-rose-500" /> Mandap
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500" /> Shuttle
              </span>
              <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <span className="size-2 rounded-full bg-purple-500" /> Party
              </span>
            </div>
          </div>
        </div>

        {/* Selected Spots List & Details Panel (1 Col) */}
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="space-y-2.5 rounded-3xl border bg-card p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={
                  lang === "hi" ? "स्थान या पता खोजें..." : "Search spots by name or address..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border bg-muted/30 pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["all", "venue", "hotel", "ceremony", "transport", "afterparty"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition ${
                    filterCategory === cat
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat === "all" ? "All Spots" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Spots Card List */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredSpots.map((spot) => {
              const config = categoryConfig[spot.category] || categoryConfig.venue;
              const isSelected = spot.id === selectedSpotId;

              return (
                <div
                  key={spot.id}
                  onClick={() => handleSpotSelect(spot)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all shadow-xs ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${config.bgClass}`}
                      >
                        {config.badge}
                      </span>
                      {spot.isPrimary && (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.2 text-[9px] font-bold">
                          Primary
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEventSpot(spot.id);
                      }}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md transition"
                      title="Remove spot"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>

                  <h4 className="mt-2 font-display text-sm font-bold text-foreground">
                    {spot.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {spot.address}
                  </p>

                  {spot.capacityOrRooms && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Users className="size-3.5" />
                      <span>{spot.capacityOrRooms}</span>
                    </div>
                  )}

                  {spot.notes && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground italic line-clamp-2">
                      "{spot.notes}"
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px]">
                    {spot.phone ? (
                      <a
                        href={`tel:${spot.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono"
                      >
                        <Phone className="size-3" />
                        <span>{spot.phone}</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                      </span>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <span>Directions</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              );
            })}

            {filteredSpots.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-xs">
                No event spots found for this filter. Click "Pin New Spot" to add one!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Spot Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-enter">
          <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  {lang === "hi" ? "नया स्थान जोड़ें" : "Save Pinned Event Spot"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSpot} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Spot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radisson Blu Luxury Lawns"
                  value={newSpotForm.name}
                  onChange={(e) => setNewSpotForm({ ...newSpotForm, name: e.target.value })}
                  className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Spot Category</label>
                <select
                  value={newSpotForm.category}
                  onChange={(e) =>
                    setNewSpotForm({
                      ...newSpotForm,
                      category: e.target.value as EventSpot["category"],
                    })
                  }
                  className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="venue">🏰 Main Venue / Lawns</option>
                  <option value="hotel">🏨 Guest Hotel & Accommodations</option>
                  <option value="ceremony">🪔 Ceremony & Mandap</option>
                  <option value="transport">✈️ Airport / Shuttle Pickup Hub</option>
                  <option value="afterparty">🍸 After-Party & Cocktail Lounge</option>
                  <option value="parking">🚗 Valet & Parking Area</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Address / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near Hinjewadi Flyover, Pune"
                  value={newSpotForm.address}
                  onChange={(e) => setNewSpotForm({ ...newSpotForm, address: e.target.value })}
                  className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Capacity / Rooms</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 Guests / 40 Rooms"
                    value={newSpotForm.capacityOrRooms}
                    onChange={(e) =>
                      setNewSpotForm({ ...newSpotForm, capacityOrRooms: e.target.value })
                    }
                    className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98000 00000"
                    value={newSpotForm.phone}
                    onChange={(e) => setNewSpotForm({ ...newSpotForm, phone: e.target.value })}
                    className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Notes for Guests</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Valet drop at Gate 2; elderly ramp accessible"
                  value={newSpotForm.notes}
                  onChange={(e) => setNewSpotForm({ ...newSpotForm, notes: e.target.value })}
                  className="w-full rounded-xl border bg-muted/30 px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Save Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
