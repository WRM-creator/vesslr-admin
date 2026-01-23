import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Flag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_MERCHANT_DETAILS } from "../lib/merchant-details-model";

// Components
import { ActivitySignalsCard } from "../components/activity-signals-card";
import { AdminSystemNotesCard } from "../components/admin-system-notes-card";
import { BusinessInfoCard } from "../components/business-info-card";
import { ComplianceStatusCard } from "../components/compliance-status-card";
import { LogisticsFulfillmentCard } from "../components/logistics-fulfillment-card";
import { MerchantOverviewCard } from "../components/merchant-overview-card";
import { ProductsCapabilitiesCard } from "../components/products-capabilities-card";
import { TransactionHistoryCard } from "../components/transaction-history-card";
import { TrustVerificationCard } from "../components/trust-verification-card";

export default function MerchantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app we'd fetch based on ID
  const data = MOCK_MERCHANT_DETAILS;

  return (
    <Page>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/merchants")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Merchants
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader
          title="Merchant Details"
          description={`Profile and controls for ${data.overview.companyName}`}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Request Documents
          </Button>
          <Button variant="default">Initiate Transaction</Button>
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
              Trust Score
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  data.trust.trustScore >= 80
                    ? "text-green-600"
                    : data.trust.trustScore >= 60
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {data.trust.trustScore}
              </span>
              <span className="text-muted-foreground text-sm">/ 100</span>
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Verification Status
            </div>
            <div className="mt-2 text-2xl font-bold capitalize">
              {data.trust.verificationStatus}
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 shadow-sm">
            <div className="text-muted-foreground text-sm font-medium">
              Completed Orders
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.transactions.completed}
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

        {/* Mian Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Main Info) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Business Info */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Business Identity</h3>
              </div>
              <div className="p-6">
                <BusinessInfoCard data={data.business} />
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Compliance & Documents</h3>
              </div>
              <div className="p-6">
                <ComplianceStatusCard data={data.compliance} />
              </div>
            </div>

            {/* Products & Logistics */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Products & Fulfillment</h3>
              </div>
              <div className="space-y-6 p-6">
                <ProductsCapabilitiesCard data={data.products} />
                {data.logistics && (
                  <>
                    <div className="bg-border h-px" />
                    <LogisticsFulfillmentCard data={data.logistics} />
                  </>
                )}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Transaction History</h3>
              </div>
              <div className="p-6">
                <TransactionHistoryCard data={data.transactions} />
              </div>
            </div>
          </div>

          {/* Right Column (Signals & Notes) */}
          <div className="space-y-6">
            {/* Overview / Identity Card */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Merchant Profile</h3>
              </div>
              <div className="p-6">
                <MerchantOverviewCard data={data.overview} />
              </div>
            </div>

            {/* Trust & Signals */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Trust & Activity</h3>
              </div>
              <div className="space-y-6 p-6">
                <TrustVerificationCard data={data.trust} />
                <div className="bg-border h-px" />
                <ActivitySignalsCard data={data.activity} />
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-card rounded-xl border border-amber-200 shadow-sm dark:border-amber-900/50">
              <div className="border-b border-amber-200 bg-amber-50/50 px-6 py-4 dark:border-amber-900/50 dark:bg-amber-900/10">
                <h3 className="font-semibold text-amber-700 dark:text-amber-500">
                  Internal Admin Notes
                </h3>
              </div>
              <div className="p-6">
                <AdminSystemNotesCard data={data.admin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
