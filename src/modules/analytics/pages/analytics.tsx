import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { BuyerBehaviourChart } from "../components/buyer-behaviour-chart";
import { CategoryDemandChart } from "../components/category-demand-chart";
import { FraudSignalsPanel } from "../components/fraud-signals-panel";
import { SellerReliabilityChart } from "../components/seller-reliability-chart";
import { StatsOverview } from "../components/stats-overview";
import { TransactionVolumeChart } from "../components/transaction-volume-chart";

export default function AnalyticsPage() {
  return (
    <Page>
      <PageHeader
        title="Analytics & Intelligence"
        description="Platform-wide metrics, transaction analysis, and risk monitoring."
      />

      <StatsOverview />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full">
          <TransactionVolumeChart />
        </div>

        <div className="col-span-4">
          <CategoryDemandChart />
        </div>

        <div className="col-span-3">
          <SellerReliabilityChart />
        </div>

        <div className="col-span-4">
          <BuyerBehaviourChart />
        </div>

        <div className="col-span-3">
          <FraudSignalsPanel />
        </div>
      </div>
    </Page>
  );
}
