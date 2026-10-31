import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useDashboard, eventThemes } from "./dashboard-context";
import { ReadinessRing } from "./readiness-ring";
import { ConfettiEffect } from "./confetti-effect";
import { ChatBot } from "./chatbot";
import { EventWizardModal } from "./event-wizard-modal";
import { MasterPlanDossierModal } from "./master-plan-dossier-modal";
import { DashboardAnimatedBackground } from "./dashboard-animated-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { AiKeyModal } from "./ai-key-modal";

// Sub-page component imports
import { StreamlinedOverview } from "./streamlined-overview";
import { DecisionQueue } from "./decision-queue";
import { TimeRiver } from "./time-river";
import { MoneyRiver } from "./money-river";
import { VirtualVenue } from "./virtual-venue";
import { GuestPulse } from "./guest-pulse";
import { WhatIfSimulator } from "./what-if-simulator";
import { MurphyMode } from "./murphy-mode";
import { QuoteCruncher } from "./quote-cruncher";
import { CulturalPacks } from "./cultural-packs";
import { FamilyRoom } from "./family-room";
import { DayOfExecution } from "./day-of-execution";
import { AfterPartyWrap } from "./after-party-wrap";
import { CreativeIdeas } from "./creative-ideas";

import {
  Flame,
  LayoutDashboard,
  Target,
  GitBranch,
  Wallet,
  LayoutGrid,
  MapPin,
  Users,
  SlidersHorizontal,
  ShieldAlert,
  FileSearch,
  Sparkles,
  Vote,
  Clock,
  Gift,
  Lightbulb,
  Globe,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Bell,
  Plus,
  FileText,
  Printer,
  RotateCcw,
  Lock,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

interface NavGroup {
  title: string;
  titleHi: string;
  items: Array<{
    id: string;
    label: string;
    labelHi: string;
    icon: LucideIcon;
    badge?: string;
  }>;
}

const navGroups: NavGroup[] = [
  {
    title: "Overview & Decisions",
    titleHi: "अवलोकन और निर्णय",
    items: [
      { id: "overview", label: "Event Overview", labelHi: "इवेंट अवलोकन", icon: LayoutDashboard },
      {
        id: "decisions",
        label: "Key Decisions",
        labelHi: "मुख्य निर्णय",
        icon: Target,
        badge: "3 Urgent",
      },
    ],
  },
  {
    title: "Timeline & Venue",
    titleHi: "समय व स्थल",
    items: [
      {
        id: "timeline",
        label: "Timeline & Schedule",
        labelHi: "समयरेखा व कार्यक्रम",
        icon: GitBranch,
      },
      { id: "venue", label: "Venue & Map Locations", labelHi: "वेन्यू व मैप स्थान", icon: MapPin },
      {
        id: "guests",
        label: "Guest List & Seating",
        labelHi: "अतिथि व बैठक व्यवस्था",
        icon: Users,
      },
    ],
  },
  {
    title: "Budget & Expenses",
    titleHi: "बजट व खर्चे",
    items: [
      { id: "budget", label: "Budget Tracker", labelHi: "बजट ट्रैकर", icon: Wallet },
      {
        id: "quotes",
        label: "Vendor Cost Checker",
        labelHi: "वेंडर बिल व छिपी फीस",
        icon: FileSearch,
        badge: "AI",
      },
      {
        id: "wrap",
        label: "Split Costs & Thank You",
        labelHi: "खर्च बंटवारा व धन्यवाद",
        icon: Gift,
      },
    ],
  },
  {
    title: "Planning & Backup",
    titleHi: "योजना व बैकअप",
    items: [
      {
        id: "simulator",
        label: "Guest & Cost Calculator",
        labelHi: "मेहमान व खर्च कैलकुलेटर",
        icon: SlidersHorizontal,
      },
      {
        id: "murphy",
        label: "Emergency Backups",
        labelHi: "बैकअप योजनाएं",
        icon: ShieldAlert,
        badge: "8 Plans",
      },
      {
        id: "culture",
        label: "Traditions & Customs",
        labelHi: "रीति-रिवाज व रस्में",
        icon: Sparkles,
      },
      { id: "ideas", label: "Creative Ideas", labelHi: "रचनात्मक विचार", icon: Lightbulb },
    ],
  },
  {
    title: "Team & Day-Of",
    titleHi: "टीम व कार्यक्रम दिन",
    items: [
      { id: "family", label: "Family Voting & Polls", labelHi: "पारिवारिक मतदान", icon: Vote },
      {
        id: "dayof",
        label: "Day-Of Live Schedule",
        labelHi: "कार्यक्रम दिन का लाइव शेड्यूल",
        icon: Clock,
        badge: "Live",
      },
    ],
  },
];

interface ErrorBoundaryProps {
  children: React.ReactNode;
  activeTab: string;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DashboardTabErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dashboard tab error boundary caught an error:", error, errorInfo);
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.activeTab !== this.props.activeTab && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-500/30 bg-card p-6 text-center space-y-4 max-w-lg mx-auto my-8 shadow-sm">
          <div className="size-12 mx-auto rounded-full bg-rose-500/10 text-rose-500 grid place-items-center">
            <Flame className="size-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">
              Unable to load this section
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {this.state.error?.message || "A temporary rendering glitch occurred in this tab."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition"
            >
              Retry Tab
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset();
              }}
              className="rounded-xl border bg-muted/40 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              Return to Overview
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function DashboardShell() {
  const {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    confettiTrigger,
    readinessPercentage,
    activePersona,
    eventName,
    eventCity,
    eventDate,
    daysRemaining,
    eventType,
    setIsWizardOpen,
    setIsDossierOpen,
    resetToSamplePlan,
    apiKey,
    setIsAiKeyModalOpen,
  } = useDashboard();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeTheme = eventThemes[eventType] || eventThemes["Wedding"];

  // Render appropriate page content
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <StreamlinedOverview />;
      case "decisions":
        return <DecisionQueue />;
      case "timeline":
        return <TimeRiver />;
      case "budget":
        return <MoneyRiver />;
      case "venue":
        return <VirtualVenue />;
      case "guests":
        return <GuestPulse />;
      case "simulator":
        return <WhatIfSimulator />;
      case "murphy":
        return <MurphyMode />;
      case "quotes":
        return <QuoteCruncher />;
      case "culture":
        return <CulturalPacks />;
      case "family":
        return <FamilyRoom />;
      case "dayof":
        return <DayOfExecution />;
      case "wrap":
        return <AfterPartyWrap />;
      case "ideas":
        return <CreativeIdeas />;
      default:
        return <StreamlinedOverview />;
    }
  };

  return (
    <div className="relative flex min-h-screen bg-muted/30 text-foreground overflow-x-hidden">
      {/* Live Animated Background in Dark Mode & Thematic Background Image in Light Mode (Dashboard Only) */}
      <DashboardAnimatedBackground />

      {/* Confetti celebration container */}
      <ConfettiEffect trigger={confettiTrigger} />

      {/* Interactive 4-step Questionnaire Modal */}
      <EventWizardModal />

      {/* Official Master Event Dossier (Print / PDF / Export Modal) */}
      <MasterPlanDossierModal />

      {/* AI Key & Settings Modal */}
      <AiKeyModal />

      {/* Sidebar for Desktop */}
      <aside
        className={`hidden shrink-0 flex-col border-r bg-card/90 backdrop-blur-xl lg:flex transition-[width,padding] duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-20 p-3" : "w-[290px] p-4 sm:p-5"
        }`}
      >
        {/* Brand Logo & Collapse Toggle */}
        <div
          className={`flex items-center ${
            isSidebarCollapsed ? "justify-center flex-col gap-2" : "justify-between"
          }`}
        >
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight text-foreground group"
            title="Kindle Dashboard"
          >
            <Flame
              className="size-6 text-primary shrink-0 transition-transform group-hover:scale-110"
              aria-hidden
            />
            {!isSidebarCollapsed && <span>Kindle</span>}
          </Link>

          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                v2.6 PRO
              </span>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="grid size-8 place-items-center rounded-xl border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="size-4 text-primary" />
            </button>
          )}
        </div>

        {/* Current Event Pill & Launch Wizard Action */}
        {!isSidebarCollapsed ? (
          <div className="mt-5 rounded-2xl border bg-muted/40 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Master Event
              </span>
              <button
                onClick={resetToSamplePlan}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
                title="Reset to sample demo plan"
              >
                <RotateCcw className="size-2.5" /> Sample
              </button>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-foreground truncate">{eventName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {eventCity} · {daysRemaining} days to go
              </p>
            </div>

            {/* Locked Event Type Display */}
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "hi" ? "इवेंट प्रकार" : "Event Type"}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-foreground text-[11px] bg-muted/60 px-2 py-0.5 rounded-lg border border-border/50">
                <Lock className="size-3 text-muted-foreground" />
                <span>
                  {eventType === "Wedding"
                    ? "💍 Royal Wedding"
                    : eventType === "Birthday"
                      ? "🎂 Birthday"
                      : eventType === "Community Festival"
                        ? "🎪 Festival"
                        : eventType === "Anniversary"
                          ? "🥂 Anniversary"
                          : `🏡 ${eventType}`}
                </span>
              </span>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition active:scale-95"
            >
              <Plus className="size-3.5" />
              <span>{lang === "hi" ? "नया आयोजन प्लान करें" : "Plan New Event"}</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition active:scale-95"
              title={`Plan New Event: ${eventName} (${daysRemaining}d to go)`}
            >
              <Plus className="size-4.5" />
            </button>
          </div>
        )}

        {/* Navigation Categories */}
        <div className="mt-5 flex-1 overflow-y-auto pr-1 space-y-6 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {lang === "hi" ? group.titleHi : group.title}
                </p>
              )}
              {isSidebarCollapsed && <div className="h-px bg-border/40 mx-2 my-1" />}
              <nav className="grid gap-0.5">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={lang === "hi" ? item.labelHi : item.label}
                      className={`group flex items-center rounded-xl text-xs font-semibold transition-all relative ${
                        isSidebarCollapsed
                          ? "size-11 mx-auto justify-center p-0"
                          : "w-full justify-between px-3 py-2.5 gap-2"
                      } ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`flex items-center min-w-0 ${
                          isSidebarCollapsed ? "justify-center" : "gap-2.5 flex-1 overflow-hidden"
                        }`}
                      >
                        <Icon
                          className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate whitespace-nowrap text-left block">
                            {lang === "hi" ? item.labelHi : item.label}
                          </span>
                        )}
                      </div>
                      {item.badge && !isSidebarCollapsed && (
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-muted text-muted-foreground group-hover:bg-card"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.badge && isSidebarCollapsed && (
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Section: Sidebar Collapse Toggle */}
        <div className="mt-auto border-t pt-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`flex items-center rounded-xl text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition ${
              isSidebarCollapsed
                ? "size-10 mx-auto justify-center"
                : "w-full justify-between px-3 py-2"
            }`}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div className="flex items-center gap-2">
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="size-4 text-primary" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
              {!isSidebarCollapsed && (
                <span>{lang === "hi" ? "साइडबार छुपाएं" : "Collapse Sidebar"}</span>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top App Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-card/80 px-4 sm:px-6 backdrop-blur-md">
          {/* Mobile hamburger, Desktop sidebar toggle & title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-9 place-items-center rounded-xl border bg-card text-foreground lg:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            {/* Desktop Sidebar Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:grid size-9 place-items-center rounded-xl border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition shadow-2xs"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="size-4.5 text-primary" />
              ) : (
                <PanelLeftClose className="size-4.5" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="lg:hidden flex items-center gap-2 font-display font-semibold text-2xl tracking-tight text-foreground"
              >
                <Flame className="size-6 text-primary shrink-0" aria-hidden />
                <span>Kindle</span>
              </Link>
              <span className="hidden sm:inline-block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Event:
              </span>
              <span className="hidden sm:inline-block rounded-xl border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground truncate max-w-xs">
                {eventName}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* AI Engine & API Key Setup */}
            <button
              onClick={() => setIsAiKeyModalOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-bold transition shadow-2xs ${
                apiKey
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
              title="Configure Google Gemini API Key"
            >
              <KeyRound className="size-3.5 text-primary" />
              <span className="hidden md:inline">{apiKey ? "AI Active" : "AI Key"}</span>
            </button>

            {/* Master Plan Dossier / Print Button */}
            <button
              onClick={() => setIsDossierOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition shadow-2xs"
              title="Print Master Event Dossier / PDF"
            >
              <Printer className="size-3.5 text-primary" />
              <span className="hidden sm:inline">
                {lang === "hi" ? "मास्टर डॉसियर" : "Master Dossier"}
              </span>
            </button>

            {/* Quick Plan New Event Button in Header */}
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
            >
              <Sparkles className="size-3.5" />
              <span className="hidden sm:inline">
                {lang === "hi" ? "नया इवेंट बनाएं" : "Plan New Event"}
              </span>
            </button>

            {/* Bilingual EN / HI Switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="inline-flex items-center gap-1.5 rounded-xl border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
              title="Toggle English / Hindi"
            >
              <Globe className="size-3.5 text-primary" />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* User Profile Pill (matching attached design) */}
            <div className="flex items-center justify-between gap-3 rounded-full border border-border/80 bg-card/90 dark:bg-[#0c121e] dark:border-slate-800/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
              <button
                onClick={() => setActiveTab("family")}
                className="flex items-center gap-2.5 text-left hover:opacity-90 transition min-w-0"
                title="Switch Persona / Family Room"
              >
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  className="size-8 rounded-full object-cover shrink-0 ring-1 ring-border/50 dark:ring-white/10"
                />
                <div className="min-w-0 hidden sm:block">
                  <p className="truncate text-xs sm:text-[13px] font-bold text-foreground dark:text-white leading-tight">
                    {activePersona.name}
                  </p>
                  <p className="truncate text-[10px] sm:text-[11px] text-muted-foreground dark:text-slate-400 font-medium leading-tight mt-0.5">
                    {activePersona.role}
                  </p>
                </div>
              </button>

              <Link
                to="/login"
                className="grid size-7 place-items-center rounded-full text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white hover:bg-muted/60 dark:hover:bg-slate-800 transition shrink-0 ml-0.5"
                title="Sign Out"
              >
                <LogOut className="size-3.5" />
              </Link>
            </div>

            {/* Mini Readiness Ring Badge */}
            <div
              onClick={() => setActiveTab("decisions")}
              className="cursor-pointer hidden xl:flex items-center gap-2 rounded-xl border bg-card px-2.5 py-1 hover:border-primary/40 transition"
              title="Readiness Score"
            >
              <span className="text-xs font-bold text-foreground">{readinessPercentage}%</span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                Ready
              </span>
            </div>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-card p-5 overflow-y-auto lg:hidden animate-enter">
            <div className="space-y-6">
              {/* Mobile Event Type Switcher */}
              <div className="rounded-2xl border bg-muted/40 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Active Event
                  </span>
                  <span className="text-xs font-bold text-foreground truncate max-w-[200px]">
                    {eventName}
                  </span>
                </div>
                {/* Event Type (Locked) */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Event Type
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-foreground text-xs">
                    <Lock className="size-3 text-muted-foreground" />
                    <span>
                      {eventType === "Wedding"
                        ? "💍 Royal Wedding"
                        : eventType === "Birthday"
                          ? "🎂 Birthday"
                          : eventType === "Community Festival"
                            ? "🎪 Festival"
                            : eventType === "Anniversary"
                              ? "🥂 Anniversary"
                              : eventType}
                    </span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsWizardOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow"
              >
                <Plus className="size-4" />
                <span>Plan New Event (Questionnaire)</span>
              </button>

              {navGroups.map((group) => (
                <div key={group.title} className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {lang === "hi" ? group.titleHi : group.title}
                  </p>
                  <div className="grid gap-1">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold gap-2 ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/40 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                            <Icon className="size-4 shrink-0" />
                            <span className="truncate whitespace-nowrap">
                              {lang === "hi" ? item.labelHi : item.label}
                            </span>
                          </div>
                          {item.badge && (
                            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Page Content View */}
        <main className="relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="relative z-10 mx-auto max-w-7xl animate-enter">
            <DashboardTabErrorBoundary
              activeTab={activeTab}
              onReset={() => setActiveTab("overview")}
            >
              {renderContent()}
            </DashboardTabErrorBoundary>
          </div>
        </main>
      </div>

      {/* Floating Bottom-Right ChatBot */}
      <ChatBot />
    </div>
  );
}
