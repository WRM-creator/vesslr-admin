import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Flag,
  MoreVertical,
  ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_TRANSACTION_DETAILS } from "../lib/transaction-details-model";

// Components
import { CounterpartiesCard } from "../components/counterparties-card";
import { EscrowStatusCard } from "../components/escrow-status-card";
import { TransactionAdminNotesCard } from "../components/transaction-admin-notes-card";
import { TransactionComplianceCard } from "../components/transaction-compliance-card";
import { TransactionDetailsCard } from "../components/transaction-details-card";
import { TransactionLifecycleStepper } from "../components/transaction-lifecycle-stepper";
import { TransactionLogisticsCard } from "../components/transaction-logistics-card";
import { TransactionTimelineCard } from "../components/transaction-timeline-card";

export default function TransactionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app we'd fetch based on ID
  const data = MOCK_TRANSACTION_DETAILS;

  return (
    <Page>
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="hover:text-primary pl-0 hover:bg-transparent"
          onClick={() => navigate("/transactions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
      </div>

      {/* Header & Actions */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <PageHeader
              title={`Transaction #${data.id}`}
              description={`Created on ${new Date(data.createdAt).toLocaleDateString()} • Type: ${data.type.toUpperCase()}`}
            />
            <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {data.state.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Invoice
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

      {/* Lifecycle Stepper */}
      <div className="bg-card mb-8 rounded-xl border p-6 shadow-sm">
        <TransactionLifecycleStepper currentState={data.state} />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (66%) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Counterparties */}
          <CounterpartiesCard buyer={data.buyer} seller={data.seller} />

          {/* Transaction Details */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Transaction Details</h3>
            </div>
            <div className="p-6">
              <TransactionDetailsCard
                product={data.product}
                financials={data.financials}
              />
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Compliance & Documentation</h3>
            </div>
            <div className="p-6">
              <TransactionComplianceCard compliance={data.compliance} />
            </div>
          </div>

          {/* Logistics */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Logistics & Fulfillment</h3>
            </div>
            <div className="p-6">
              <TransactionLogisticsCard logistics={data.logistics} />
            </div>
          </div>
        </div>

        {/* Right Column (33%) */}
        <div className="space-y-6">
          {/* Escrow Status (High Priority) */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Escrow & Settlement</h3>
            </div>
            <div className="p-6">
              <EscrowStatusCard data={data.escrow} />
            </div>
          </div>

          {/* Timeline / Audit Log */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="font-semibold">Timeline & Audit</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <TransactionTimelineCard timeline={data.timeline} />
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-card rounded-xl border border-amber-200 shadow-sm dark:border-amber-900/50">
            <div className="p-6">
              <TransactionAdminNotesCard data={data.admin} />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
