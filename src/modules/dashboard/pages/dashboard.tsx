import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { ActionRequiredCards } from "../components/action-required-cards";
import { PlatformOverviewCard } from "../components/platform-overview-card";
import { PlatformStats } from "../components/platform-stats";
import { RecentRegistrations } from "../components/recent-registrations";
import { RecentTransactionsTable } from "../components/recent-transactions-table";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Page>
      <PageHeader title="Dashboard" description={currentDate} />

      <PlatformOverviewCard />

      <ActionRequiredCards />

      <PlatformStats />

      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <RecentTransactionsTable />
        <RecentRegistrations />
      </div>
    </Page>
  );
}
