import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, FileText, Flag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_PRODUCT_DETAILS } from "../lib/product-details-model";

// Components
import { CategoryComplianceCard } from "../components/category-compliance-card";
import { MerchantInfoCard } from "../components/merchant-info-card";
import { ProductActivityCard } from "../components/product-activity-card";
import { ProductAdminNotesCard } from "../components/product-admin-notes-card";
import { ProductDetailsCard } from "../components/product-details-card";
import { ProductLogisticsCard } from "../components/product-logistics-card";
import { ProductOverviewCard } from "../components/product-overview-card";
import { ProductTransactionHistoryCard } from "../components/product-transaction-history-card";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app we'd fetch based on ID
  const data = MOCK_PRODUCT_DETAILS;

  return (
    <Page>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader
          title="Product Details"
          description={`Product ID: ${data.id}`}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Validate Compliance
          </Button>
          <Button variant="outline">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* KPI Highlights */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Inventory Status
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {data.specs.inventory.available}
              </span>
              <span className="text-muted-foreground text-sm">
                available / {data.specs.inventory.total}
              </span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Total Transactions
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.transactions.totalCount}
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Active Escrows
            </div>
            <div className="mt-2 text-2xl font-bold">
              {
                data.transactions.history.filter((t) => t.status === "active")
                  .length
              }
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Risk Level
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.admin.riskScore < 30 ? "Low" : "High"}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Main Info) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Overview / Identity */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Product Overview</h3>
              </div>
              <div className="p-6">
                <ProductOverviewCard data={data.overview} />
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Specifications & Inventory</h3>
              </div>
              <div className="p-6">
                <ProductDetailsCard data={data.specs} />
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Compliance & Category</h3>
              </div>
              <div className="p-6">
                <CategoryComplianceCard data={data.compliance} />
              </div>
            </div>

            {/* Logistics (Conditional) */}
            {data.logistics && (
              <div className="bg-card rounded-xl border shadow-sm">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h3 className="font-semibold">Live Logistics & Tracking</h3>
                  <div className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
                </div>
                <div className="p-6">
                  <ProductLogisticsCard data={data.logistics} />
                </div>
              </div>
            )}

            {/* Transaction History */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Transaction History</h3>
              </div>
              <div className="p-6">
                <ProductTransactionHistoryCard data={data.transactions} />
              </div>
            </div>
          </div>

          {/* Right Column (Merchant, Activity, Admin) */}
          <div className="space-y-6">
            {/* Merchant Info */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Listed By</h3>
              </div>
              <div className="p-6">
                <MerchantInfoCard data={data.merchant} />
              </div>
            </div>

            {/* Activity & Signals */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Activity & Signals</h3>
              </div>
              <div className="p-6">
                <ProductActivityCard data={data.activity} />
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-card rounded-xl border border-amber-200 shadow-sm dark:border-amber-900/50">
              <div className="border-b border-amber-200 bg-amber-50/50 px-6 py-4 dark:border-amber-900/50 dark:bg-amber-900/10">
                <h3 className="font-semibold text-amber-900 dark:text-amber-500">
                  Internal Admin Notes
                </h3>
              </div>
              <div className="p-6">
                <ProductAdminNotesCard data={data.admin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
