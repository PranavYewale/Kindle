import { createFileRoute } from "@tanstack/react-router";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — Kindle Event Suite" },
      {
        name: "description",
        content:
          "Professional minimalistic command center for weddings, birthdays, and celebrations. Rupee-exact budget river, 2D floor plans, decision queues, and Murphy mode.",
      },
      { property: "og:title", content: "Command Center — Kindle Event Suite" },
      {
        property: "og:description",
        content:
          "Decision-first command center, Time river, 2D floor plans, and real-time diff simulator.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  );
}
