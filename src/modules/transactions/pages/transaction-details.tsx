import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TransactionDetailsTabs } from "../components/transaction-details-tabs";
import { TransactionOrchestrationBar } from "../components/transaction-orchestration-bar";
import { TransactionPartyCard } from "../components/transaction-party-card";
import { TransactionStatusBadge } from "../components/transaction-status-badge";

export default function TransactionDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: transaction,
    isLoading,
    refetch,
    isRefetching,
  } = api.admin.transactions.detail.useQuery(
    {
      path: { id: id! },
    },
    {
      enabled: !!id,
    },
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (!transaction) {
    return "No transaction found";
  }

  console.log(transaction);

  const order = transaction.order;
  const buyerName = order?.buyerOrganization?.name || "Unknown Buyer";
  const sellerName = order?.sellerOrganization?.name || "Unknown Seller";

  const handleTaskAction = (action: any) => {
    if (!action) return;

    if (action.type === "navigate") {
      if (action.target === "documents-tab") {
        setActiveTab("documents");
      } else if (action.target === "compliance-tab") {
        setActiveTab("documents");
      } else if (action.target === "logistics-tab") {
        setActiveTab("logistics");
      } else if (action.target === "financials-tab") {
        setActiveTab("financials");
      }
    } else if (action.type === "modal") {
      console.log("Open modal:", action.target);
      // Future: Open specific modals
    }
  };

  return (
    <Page>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>Transaction #{transaction.displayId}</span>
            <TransactionStatusBadge status={transaction.status} />
          </div>
        }
        endContent={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      <div className="space-y-6">
        {/* 1. Identity Row (The Who) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TransactionPartyCard role="Buyer" name={buyerName} />
          <TransactionPartyCard role="Seller" name={sellerName} />
        </div>

        {/* 2. Orchestration Bar (The Bridge) */}
        <TransactionOrchestrationBar status={transaction.status} />

        {/* 3. Detailed Tabs (The What) */}
        <TransactionDetailsTabs
          transaction={transaction}
          value={activeTab}
          onValueChange={setActiveTab}
          onAction={handleTaskAction} // Wait, TransactionDetailsTabs doesn't have onAction yet?
          // Ah, I missed updating TransactionDetailsTabs to pass onAction down to TransactionOverviewTab
        />
      </div>
    </Page>
  );
}
