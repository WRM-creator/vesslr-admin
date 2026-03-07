import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";

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
    </Page>
  );
}
