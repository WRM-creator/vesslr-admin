import { NotFoundPage } from "@/components/not-found-page";
import { Page } from "@/components/shared/page";
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { AlertCircle, ArrowUpRight, RefreshCw } from "lucide-react";
import { useParams } from "react-router-dom";
import { ActionZone } from "../components/v2/action-zone";
import { ContextSidebar } from "../components/v2/context-sidebar";
import { OverviewStatusCard } from "../components/v2/overview-status-card";
import { StageTimeline } from "../components/v2/stage-timeline";
import { TransactionStatusBadge } from "../components/transaction-status-badge";

export default function TransactionDetailsPage() {
  const { id } = useParams();

  const {
    data: transaction,
    isLoading,
    isError,
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

  if (isError) {
    return (
      <Page>
        <Alert variant="destructive" className="mx-auto mt-12 max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load transaction</AlertTitle>
          <AlertDescription>
            Something went wrong while loading this transaction.
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </Page>
    );
  }

  if (!transaction) {
    return <NotFoundPage />;
  }

  const order = transaction.order;
  const buyerName = order?.buyerOrganization?.name || "Unknown Buyer";
  const sellerName = order?.sellerOrganization?.name || "Unknown Seller";
  const buyerOrgId = order?.buyerOrganization?._id;
  const sellerOrgId = order?.sellerOrganization?._id;
  const txnLabel = `TXN-${String(transaction.displayId).padStart(4, "0")}`;

  return (
    <Page>
      <PageBreadcrumb
        items={[
          { label: "Transactions", href: "/transactions" },
          { label: txnLabel },
        ]}
      />

      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <span>{txnLabel}</span>
            <TransactionStatusBadge status={transaction.status} />
            {transaction.workflowType === "MILESTONE" && (
              <Badge variant="outline" className="text-[10px]">
                Milestone
              </Badge>
            )}
          </div>
        }
        description={
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <span className="font-medium">Buyer:</span>
            {buyerOrgId ? (
              <a
                href={`/organizations/${buyerOrgId}`}
                className="text-foreground hover:underline inline-flex items-center gap-0.5"
              >
                {buyerName}
                <ArrowUpRight className="size-3 opacity-50" />
              </a>
            ) : (
              <span>{buyerName}</span>
            )}
            <span className="text-muted-foreground/50 mx-1">↔</span>
            <span className="font-medium">Seller:</span>
            {sellerOrgId ? (
              <a
                href={`/organizations/${sellerOrgId}`}
                className="text-foreground hover:underline inline-flex items-center gap-0.5"
              >
                {sellerName}
                <ArrowUpRight className="size-3 opacity-50" />
              </a>
            ) : (
              <span>{sellerName}</span>
            )}
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
              className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      {/* ── Overview + Action Zone ────────────────────────────── */}
      <OverviewStatusCard transaction={transaction} />
      <ActionZone transaction={transaction} />

      {/* ── Main Content: Timeline + Sidebar ────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <StageTimeline transaction={transaction} />
        </div>
        <div className="lg:col-span-2">
          <ContextSidebar transaction={transaction} />
        </div>
      </div>
    </Page>
  );
}
