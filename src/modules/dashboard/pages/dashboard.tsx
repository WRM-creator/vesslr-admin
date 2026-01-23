import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { CriticalAttentionArea } from "../components/critical-attention-area";
import { Notifications } from "../components/notifications";
import { OperationalHealthSnapshot } from "../components/operational-health-snapshot";
import { QuickNavigation } from "../components/quick-navigation";

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

      {/* Zone 1: Operational Health Snapshot */}
      <OperationalHealthSnapshot />

      {/* Zone 2: Critical Attention Area */}
      <CriticalAttentionArea />

      {/* Zone 3: Notifications */}
      <Notifications />

      {/* Zone 4: Quick Navigation & Shortcuts */}
      <QuickNavigation />
    </Page>
  );
}
