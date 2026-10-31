import React, { useState } from "react";
import { useDashboard, type DietaryType, type Guest } from "./dashboard-context";
import { GuestInvitationModal } from "./guest-invitation-modal";
import {
  Users,
  UtensilsCrossed,
  HeartHandshake,
  AlertTriangle,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Accessibility,
  Flame,
  ShieldAlert,
  Mail,
  Send,
  Share2,
} from "lucide-react";

export function GuestPulse() {
  const {
    lang,
    guests,
    addGuest,
    updateGuestRsvp,
    assignGuestTable,
    dietCounts,
    rsvpCounts,
    harmonyAlerts,
    venueZones,
  } = useDashboard();

  const [name, setName] = useState("");
  const [group, setGroup] = useState<Guest["group"]>("Bride Family");
  const [diet, setDiet] = useState<DietaryType>("Vegetarian");
  const [tableId, setTableId] = useState("");
  const [isElderly, setIsElderly] = useState(false);
  const [phone, setPhone] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [targetGuestId, setTargetGuestId] = useState<string | null>(null);

  const diningTables = venueZones.filter((z) => z.type === "dining");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addGuest({
      name: name.trim(),
      group,
      diet,
      rsvp: "Attending",
      tableId,
      isElderly,
      feudWithIds: [],
      phone: phone || "+91 98000 00000",
    });
    setName("");
    setPhone("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <HeartHandshake className="size-3.5" />
            <span>{lang === "hi" ? "अतिथि प्रबंधन" : "Guest Management"}</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {lang === "hi" ? "अतिथि सूची व बैठक व्यवस्था" : "Guest List & Seating Arrangement"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "hi"
              ? "आरएसवीपी (RSVP) प्रतिक्रियाएं ट्रैक करें, विशेष भोजन प्राथमिकताओं (जैन, सात्विक, शाकाहारी) की सटीक गिनती रखें, और मेहमानों को आराम से बैठाएं।"
              : "Track RSVP responses, count special meal requirements (Strict Jain, Satvik, Veg, Halal), and seat guests comfortably without conflicts."}
          </p>
        </div>

        {/* Send Invitations Action Button */}
        <button
          onClick={() => {
            setTargetGuestId(null);
            setIsInviteModalOpen(true);
          }}
          className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-700 active:scale-95 transition-all shrink-0"
        >
          <Mail className="size-4" />
          <span>
            {lang === "hi"
              ? "डिजिटल निमंत्रण भेजें (WhatsApp/Email)"
              : "Send Digital Invitations (WhatsApp & Email)"}
          </span>
        </button>
      </div>

      {/* Harmony Engine Alerts Banner */}
      {harmonyAlerts.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
            <ShieldAlert className="size-4" />
            <span>Harmony Seating Solver Warnings ({harmonyAlerts.length})</span>
          </div>
          <div className="space-y-1 text-xs text-rose-700 dark:text-rose-400">
            {harmonyAlerts.map((alt, i) => (
              <p key={i}>• {alt}</p>
            ))}
          </div>
        </div>
      )}

      {/* Top 2 Summary Cards: RSVP Pulse & Catering Kitchen Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RSVP Status Tracker */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span>{lang === "hi" ? "लाइव RSVP स्थिति ट्रैकर" : "Live RSVP Status Tallies"}</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-emerald-500/10 p-4 text-center">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <p className="font-display text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                {rsvpCounts.Attending}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Attending</p>
            </div>

            <div className="rounded-2xl border bg-amber-500/10 p-4 text-center">
              <Clock className="size-5 text-amber-600 dark:text-amber-400 mx-auto" />
              <p className="font-display text-2xl font-bold text-amber-700 dark:text-amber-300 mt-2">
                {rsvpCounts.Pending}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Pending</p>
            </div>

            <div className="rounded-2xl border bg-rose-500/10 p-4 text-center">
              <XCircle className="size-5 text-rose-600 dark:text-rose-400 mx-auto" />
              <p className="font-display text-2xl font-bold text-rose-700 dark:text-rose-300 mt-2">
                {rsvpCounts.Declined}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Declined</p>
            </div>
          </div>
        </div>

        {/* Catering Diet Breakdown */}
        <div className="rounded-3xl border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <UtensilsCrossed className="size-4 text-primary" />
              <span>{lang === "hi" ? "कैटरिंग आहार विभाजन" : "Kitchen Catering Diet Counts"}</span>
            </h3>
            <span className="text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground font-mono">
              Zero kitchen mix-ups
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {Object.entries(dietCounts).map(([dName, count]) => (
              <div key={dName} className="rounded-xl border bg-muted/40 p-3">
                <p className="text-xs font-semibold text-muted-foreground truncate">{dName}</p>
                <p className="font-display text-xl font-bold text-foreground mt-1">
                  {count}{" "}
                  <span className="text-[11px] font-normal text-muted-foreground">plates</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fast Add Guest Form */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="size-4 text-primary" />
          <span>
            {lang === "hi" ? "त्वरित अतिथि प्रविष्टि" : "Quick Add Guest with Dietary Prefs"}
          </span>
        </h3>

        <form onSubmit={handleAddSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground">Guest Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kavita Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Social Circle</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as Guest["group"])}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="Bride Family">Bride Family</option>
              <option value="Groom Family">Groom Family</option>
              <option value="College Friends">College Friends</option>
              <option value="Office Colleagues">Office Colleagues</option>
              <option value="Elders">Elders</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Catering Diet</label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value as DietaryType)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="Strict Jain">Strict Jain</option>
              <option value="Satvik (No Onion/Garlic)">Satvik (No Onion/Garlic)</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Halal">Halal</option>
              <option value="Vegan">Vegan</option>
              <option value="Regular">Regular</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Assign Table</label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="">Unassigned</option>
              {diningTables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (T-{t.tableNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Add Guest
            </button>
          </div>
        </form>
      </div>

      {/* Guest Directory List */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h3 className="font-display text-base font-bold text-foreground mb-4">
          {lang === "hi"
            ? "अतिथि निर्देशिका और टेबल असाइनमेंट"
            : "Master Guest Directory & Table Seating"}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" role="table">
            <thead className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Guest</th>
                <th className="p-3">Circle</th>
                <th className="p-3">Dietary Preference</th>
                <th className="p-3">Assigned Table</th>
                <th className="p-3">Special Tag</th>
                <th className="p-3">RSVP Status</th>
                <th className="p-3">Invitation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {guests.map((g) => (
                <tr key={g.id} className="hover:bg-muted/20">
                  <td className="p-3">
                    <p className="font-semibold text-foreground">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.phone}</p>
                  </td>
                  <td className="p-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                      {g.group}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                      {g.diet}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={g.tableId}
                      onChange={(e) => assignGuestTable(g.id, e.target.value)}
                      className="rounded border bg-background px-2 py-1 text-xs"
                    >
                      <option value="">Unassigned</option>
                      {diningTables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    {g.isElderly && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                        <Accessibility className="size-3" /> Senior Elder
                      </span>
                    )}
                    {g.feudWithIds.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 px-2 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-400 ml-1">
                        Feud Flagged
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      value={g.rsvp}
                      onChange={(e) => updateGuestRsvp(g.id, e.target.value as Guest["rsvp"])}
                      className="rounded border bg-background px-2 py-1 text-xs font-semibold"
                    >
                      <option value="Attending">Attending</option>
                      <option value="Pending">Pending</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setTargetGuestId(g.id);
                        setIsInviteModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition"
                      title="Send personalized invitation via WhatsApp or Email"
                    >
                      <Send className="size-3 text-emerald-500" />
                      <span>Invite</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personalized Guest Invitation Modal */}
      <GuestInvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        targetGuestId={targetGuestId}
      />
    </div>
  );
}
