import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Flag, ShieldAlert } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_ESCROW_DETAILS } from "../lib/escrow-details-model";

// Components
import { EscrowAdminCard } from "../components/escrow-admin-card";
import { EscrowDisputeCard } from "../components/escrow-dispute-card";
import { EscrowFinancialDetailsCard } from "../components/escrow-financial-details-card";
import { EscrowOverviewCard } from "../components/escrow-overview-card";
import { EscrowPartiesCard } from "../components/escrow-parties-card";
import { EscrowReleaseConditionsCard } from "../components/escrow-release-conditions-card";
import { EscrowTimelineCard } from "../components/escrow-timeline-card";
import { EscrowTransactionCard } from "../components/escrow-transaction-card";

export default function EscrowDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app we'd fetch based on ID
  const data = MOCK_ESCROW_DETAILS;

  return (
    <Page>
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/escrows")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Escrows
        </Button>
      </div>

      {/* Header & Actions */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <PageHeader
              title={`Escrow #${data.id}`}
              description={`Created on ${new Date(data.createdAt).toLocaleDateString()} • Reference: ${data.transaction.id}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Statement
          </Button>
          <Button
            variant="outline"
            className="border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-500 dark:hover:bg-amber-900/10"
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Override State
          </Button>
          <Button variant="destructive" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (66%) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <EscrowOverviewCard data={data} />

          {/* Parties */}
          <EscrowPartiesCard
            merchant={data.merchant}
            customer={data.customer}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Transaction */}
            <EscrowTransactionCard transaction={data.transaction} />

            {/* Financials */}
            <EscrowFinancialDetailsCard data={data} />
          </div>

          {/* Release Conditions */}
          <EscrowReleaseConditionsCard conditions={data.releaseConditions} />

          {/* Dispute (Conditional) */}
          <EscrowDisputeCard dispute={data.dispute} />
        </div>

        {/* Right Column (33%) */}
        <div className="space-y-6">
          {/* Admin & Risk (High Priority) */}
          <EscrowAdminCard data={data} />

          {/* Timeline */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Audit Timeline</h3>
            </div>
            <div className="p-6">
              <EscrowTimelineCard timeline={data.timeline} />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
