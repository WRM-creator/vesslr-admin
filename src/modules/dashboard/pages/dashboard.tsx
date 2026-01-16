
import { PageHeader } from "@/components/shared/page-header";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { DashboardStats } from "../components/dashboard-stats";
import { TransactionChart } from "../components/transaction-chart";
import { CategoryDemandChart } from "../components/category-demand-chart";
import { RecentOrdersTable } from "../components/recent-orders-table";
import { ActionCenter } from "../components/action-center";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader 
        title="Dashboard" 
        endContent={<DateRangePicker align="end" />} 
      />

      <DashboardStats />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="size-full">
            <RecentOrdersTable />
        </div>
        <div className="size-full">
            <ActionCenter />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4 size-full">
          <TransactionChart />
        </div>
        <div className="lg:col-span-3 size-full">
          <CategoryDemandChart />
        </div>
      </div>
    </div>
  );
}
