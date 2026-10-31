import React, { useState } from "react";
import { useDashboard, type Decision } from "./dashboard-context";
import { getLocalRealtimeAudit } from "@/lib/realtime-service";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

interface RealtimeDecisionAuditProps {
  decision: Decision;
  compact?: boolean;
}

export function RealtimeDecisionAudit({ decision }: RealtimeDecisionAuditProps) {
  const { eventCity } = useDashboard();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Approximate hours remaining until decision hold expires
  const hoursUntilExpiry = Math.max(12, decision.urgencyDays * 24 - 6);

  const auditData = getLocalRealtimeAudit({
    decisionId: decision.id,
    decisionTitle: decision.title,
    category: decision.category,
    eventCity,
    penaltyPerDay: decision.penaltyPerDay,
    urgencyDays: decision.urgencyDays,
    priceSpikeWarning: decision.priceSpikeWarning,
  });

  return (
    <div className="mt-3.5 border-t border-border/50 pt-3 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div className="space-y-0.5 max-w-xl">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber-500 shrink-0" />
            <span>
              Hold expires in ~{hoursUntilExpiry} hours in {eventCity}
            </span>
          </p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {decision.priceSpikeWarning ||
              "Locking early protects quoted rates and confirms calendar slots."}{" "}
            Required before confirming{" "}
            <strong>{decision.downstreamImpacts} downstream vendor contracts</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition shrink-0 self-start sm:self-auto"
        >
          <span>{showDetails ? "Hide breakdown" : "Why timing matters"}</span>
          {showDetails ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>
      </div>

      {showDetails && (
        <div className="mt-2.5 pt-2.5 border-t border-border/30 grid gap-3 sm:grid-cols-3 text-[11px] text-muted-foreground animate-enter">
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground block">Price Protection</span>
            <p className="leading-relaxed">{auditData.consequencesIfIgnored.financial}</p>
          </div>
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground block">Timeline & Permits</span>
            <p className="leading-relaxed">{auditData.consequencesIfIgnored.operational}</p>
          </div>
          <div className="space-y-0.5">
            <span className="font-semibold text-foreground block">Vendor Availability</span>
            <p className="leading-relaxed">{auditData.consequencesIfIgnored.vendorQuality}</p>
          </div>
        </div>
      )}
    </div>
  );
}
