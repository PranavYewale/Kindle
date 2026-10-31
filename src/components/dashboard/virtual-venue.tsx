import React, { useState, useRef } from "react";
import { useDashboard, type VenueZone } from "./dashboard-context";
import { EventMapPlanner } from "./event-map-planner";
import {
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Maximize2,
  Users,
  Utensils,
  Share2,
  Sparkles,
  LayoutGrid,
  MapPin,
} from "lucide-react";

export function VirtualVenue() {
  const {
    lang,
    venueZones,
    selectedZoneId,
    setSelectedZoneId,
    updateZonePosition,
    nudgeZone,
    activePreset,
    applyPreset,
    guests,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<"map" | "floorplan">("map");
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedZone = venueZones.find((z) => z.id === selectedZoneId);

  // Guests seated at currently selected table
  const seatedGuests =
    selectedZone && selectedZone.type === "dining"
      ? guests.filter((g) => g.tableId === selectedZone.id)
      : [];

  const handleDrag = (e: React.MouseEvent, zoneId: string) => {
    e.preventDefault();
    setSelectedZoneId(zoneId);
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const relX = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const relY = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      updateZonePosition(zoneId, Math.round(relX), Math.round(relY));
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const exportSummary = () => {
    const text =
      `KINDLE 2D BLUEPRINT SPECIFICATION — ${activePreset}\n` +
      `----------------------------------------\n` +
      venueZones
        .map(
          (z) =>
            `• ${z.name} [Type: ${z.type.toUpperCase()}] at Grid Coordinates (${z.x}%, ${z.y}%), Capacity: ${z.capacity || "N/A"}`,
        )
        .join("\n") +
      `\n\nTotal Seated Capacity: ${venueZones.reduce((sum, z) => sum + (z.capacity || 0), 0)} guests. Generated on Kindle Event Suite.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Tabs: Real Map vs 2D Floor Plan */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-xs ${
              activeTab === "map"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <MapPin className="size-4" />
            <span>
              {lang === "hi" ? "वास्तविक शहर मैप व स्थान" : "Real City Map & Event Spots"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("floorplan")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-xs ${
              activeTab === "floorplan"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-4" />
            <span>
              {lang === "hi" ? "2D हॉल व स्टेज फ्लोर प्लान" : "2D Room & Stage Floor Plan"}
            </span>
          </button>
        </div>

        <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
          {activeTab === "map"
            ? "Real OpenStreetMap with Live Markers & Transit"
            : "Geometric Blueprint Grid with Seating Sync"}
        </span>
      </div>

      {activeTab === "map" ? (
        <EventMapPlanner />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                <LayoutGrid className="size-3.5" />
                <span>
                  {lang === "hi" ? "स्थानिक 2D फ्लोर प्लान" : "Spatial 2D Blueprint Engine"}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {lang === "hi" ? "वेन्यू फ्लोर प्लान व लेआउट" : "Venue Floor Plan & Layout"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === "hi"
                  ? "हॉल और लॉन का इंटरैक्टिव नक्शा। मंडप/स्टेज, खाने की टेबल, बुफे और डीजे कंसोल को खींचकर अपनी पसंद से व्यवस्थित करें।"
                  : "Interactive layout for your event hall or lawn. Drag and arrange dining tables, stage, buffet, and DJ console to organize your space."}
              </p>
            </div>

            {/* Export Action */}
            <button
              onClick={exportSummary}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              <span>{copied ? "Copied Blueprint Spec!" : "Export Venue Brief"}</span>
            </button>
          </div>

          {/* Preset Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-2">
                Preset Layouts:
              </span>
              {[
                "Traditional Mandap & Banquet",
                "Outdoor Lawn & Sangeet",
                "Intimate Lounge & Cocktail",
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    activePreset === preset
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* North Indicator */}
            <div className="flex items-center gap-2 pr-2 text-xs font-bold text-muted-foreground">
              <Compass className="size-4 text-primary animate-spin-slow" />
              <span>TRUE NORTH ↑</span>
            </div>
          </div>

          {/* Main Floor Plan Grid & Inspection Panel */}
          <div className="grid gap-6 lg:grid-cols-4">
            {/* 2D Canvas Blueprint */}
            <div className="lg:col-span-3">
              <div
                ref={containerRef}
                className="relative h-[560px] w-full select-none overflow-hidden rounded-3xl border-2 border-border/80 bg-slate-950 p-4 shadow-inner"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.12) 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              >
                {/* North Indicator in Blueprint */}
                <div className="absolute right-4 top-4 flex flex-col items-center rounded-xl border border-white/10 bg-black/60 px-3 py-1.5 text-white/80 backdrop-blur-md">
                  <span className="text-[10px] font-mono tracking-widest text-primary font-bold">
                    N
                  </span>
                  <ArrowUp className="size-3 text-primary" />
                </div>

                {/* Scale Marker */}
                <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-mono text-white/60">
                  Grid Scale: 1 unit = 2.5 meters
                </div>

                {/* Render Blueprint Zones */}
                {venueZones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  let shapeClass = "rounded-xl";
                  if (zone.shape === "circle")
                    shapeClass = "rounded-full aspect-square flex items-center justify-center";
                  if (zone.shape === "pill")
                    shapeClass = "rounded-full flex items-center justify-center";

                  return (
                    <div
                      key={zone.id}
                      onMouseDown={(e) => handleDrag(e, zone.id)}
                      onClick={() => setSelectedZoneId(zone.id)}
                      style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        backgroundColor: zone.color,
                      }}
                      className={`absolute cursor-grab active:cursor-grabbing p-2 transition-transform shadow-lg backdrop-blur-sm select-none ${shapeClass} ${
                        isSelected
                          ? "ring-4 ring-white ring-offset-2 ring-offset-black scale-105 z-20"
                          : "hover:scale-102 z-10"
                      }`}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center text-center text-white drop-shadow">
                        <p className="font-display text-xs font-bold leading-tight">{zone.name}</p>
                        {zone.capacity && (
                          <span className="text-[10px] font-medium opacity-90">
                            Cap: {zone.capacity}
                          </span>
                        )}
                        {zone.tableNumber && (
                          <span className="text-[10px] font-mono font-bold bg-black/30 rounded px-1.5 mt-0.5">
                            T-{zone.tableNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Zone Inspector & Fine-tune Nudge Panel */}
            <div className="space-y-4">
              <div className="rounded-3xl border bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-display text-base font-bold text-foreground">
                  {lang === "hi" ? "जोन नियंत्रक व नड्‍ज" : "Zone Fine-Tune & Seating"}
                </h3>

                {selectedZone ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border bg-muted/40 p-3 space-y-1">
                      <p className="text-xs uppercase font-semibold text-muted-foreground">
                        Selected Item
                      </p>
                      <p className="font-display text-base font-bold text-foreground">
                        {selectedZone.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Type: <span className="font-mono uppercase">{selectedZone.type}</span> ·
                        Grid: ({selectedZone.x}%, {selectedZone.y}%)
                      </p>
                      {selectedZone.capacity && (
                        <p className="text-xs text-primary font-medium">
                          Capacity: {selectedZone.capacity} Guests
                        </p>
                      )}
                    </div>

                    {/* Arrow Nudge Pad */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground text-center">
                        Fine-tune Position (1% Nudge)
                      </p>
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          onClick={() => nudgeZone(selectedZone.id, 0, -1)}
                          className="grid size-9 place-items-center rounded-xl border bg-card hover:bg-muted text-foreground transition"
                          title="Nudge Up"
                        >
                          <ArrowUp className="size-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => nudgeZone(selectedZone.id, -1, 0)}
                            className="grid size-9 place-items-center rounded-xl border bg-card hover:bg-muted text-foreground transition"
                            title="Nudge Left"
                          >
                            <ArrowLeft className="size-4" />
                          </button>
                          <span className="text-xs font-mono font-bold text-muted-foreground px-2">
                            PAD
                          </span>
                          <button
                            onClick={() => nudgeZone(selectedZone.id, 1, 0)}
                            className="grid size-9 place-items-center rounded-xl border bg-card hover:bg-muted text-foreground transition"
                            title="Nudge Right"
                          >
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => nudgeZone(selectedZone.id, 0, 1)}
                          className="grid size-9 place-items-center rounded-xl border bg-card hover:bg-muted text-foreground transition"
                          title="Nudge Down"
                        >
                          <ArrowDown className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* Seating Sync details if table is selected */}
                    {selectedZone.type === "dining" && (
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground">
                            Seated Guests ({seatedGuests.length}/{selectedZone.capacity || 8})
                          </h4>
                          <Users className="size-3.5 text-primary" />
                        </div>

                        {seatedGuests.length > 0 ? (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
                            {seatedGuests.map((g) => (
                              <div
                                key={g.id}
                                className="flex items-center justify-between rounded-lg border bg-card p-2 text-xs"
                              >
                                <span className="font-semibold text-foreground truncate">
                                  {g.name}
                                </span>
                                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground shrink-0 ml-1">
                                  {g.diet}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            No guests assigned to this table yet. Assign guests via Guest Pulse tab.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Click any zone on the blueprint grid to select, nudge, and inspect.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
