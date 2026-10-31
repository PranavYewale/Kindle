import React from "react";
import { useDashboard } from "./dashboard-context";

export function ReadinessRing({
  size = 110,
  strokeWidth = 10,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  const { readinessPercentage, lang } = useDashboard();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessPercentage / 100) * circumference;

  // Color mapping based on score
  const strokeColor =
    readinessPercentage > 75
      ? "#10b981" // emerald
      : readinessPercentage > 50
        ? "#f59e0b" // amber
        : "#6366f1"; // indigo

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">
          {readinessPercentage}%
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
          {lang === "hi" ? "तैयारी" : "Ready"}
        </span>
      </div>
    </div>
  );
}
