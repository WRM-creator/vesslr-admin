import { Page } from "@/components/shared/page";
import { AdminActionCenter } from "../components/admin-action-center";
import { DashboardGreeting } from "../components/dashboard-greeting";
import { DashboardMetricCards } from "../components/dashboard-metric-cards";
import { PlatformOverviewCard } from "../components/platform-overview-card";
import { RecentRegistrations } from "../components/recent-registrations";
import { RecentTransactionsTable } from "../components/recent-transactions-table";

export default function DashboardPage() {
  return (
    <Page>
      <DashboardGreeting />
      <AdminActionCenter />
      <PlatformOverviewCard />
      <DashboardMetricCards />
      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <RecentTransactionsTable />
        <RecentRegistrations />
      </div>
    </Page>
  );
}
