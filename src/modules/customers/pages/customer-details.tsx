import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, FileText, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_CUSTOMER_DETAILS } from "../lib/customer-details-model";

// Components
import { CustomerBusinessInfoCard } from "../components/customer-business-info-card";
import { CustomerComplianceCard } from "../components/customer-compliance-card";
import { CustomerFinancialsCard } from "../components/customer-financials-card";
import { CustomerOverviewCard } from "../components/customer-overview-card";
import { CustomerRiskCard } from "../components/customer-risk-card";
import { CustomerSystemNotesCard } from "../components/customer-system-notes-card";
import { CustomerTransactionsCard } from "../components/customer-transactions-card";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app we'd fetch based on ID
  const data = MOCK_CUSTOMER_DETAILS;

  return (
    <Page>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageHeader
          title="Customer Details"
          description={`Profile and controls for ${data.overview.name}`}
        />

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Request Documents
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Suspend Customer"
          >
            <Ban className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Main Info - 66%) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Transactions / KPI Highlights */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Transaction Activity</h3>
              </div>
              <div className="p-6">
                <CustomerTransactionsCard data={data.transactions} />
              </div>
            </div>

            {/* Financials / Wallet */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Financials & Wallet</h3>
              </div>
              <div className="p-6">
                <CustomerFinancialsCard data={data.financials} />
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Compliance & Documents</h3>
              </div>
              <div className="p-6">
                <CustomerComplianceCard data={data.compliance} />
              </div>
            </div>

            {/* Business Info (Only if Business) */}
            {data.business && (
              <div className="bg-card rounded-xl border shadow-sm">
                <div className="border-b px-6 py-4">
                  <h3 className="font-semibold">Business Identity</h3>
                </div>
                <div className="p-6">
                  <CustomerBusinessInfoCard data={data.business} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Overview, Risk, Notes - 33%) */}
          <div className="space-y-6">
            {/* Overview / Identity Card */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Customer Profile</h3>
              </div>
              <div className="p-6">
                <CustomerOverviewCard
                  data={data.overview}
                  status={data.admin.status}
                />
              </div>
            </div>

            {/* Risk & Signals */}
            <div className="bg-card rounded-xl border shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-semibold">Trust & Risk</h3>
              </div>
              <div className="p-6">
                <CustomerRiskCard
                  trustData={data.trust}
                  activityData={data.activity}
                />
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
                <CustomerSystemNotesCard data={data.admin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
