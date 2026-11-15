import { NotFoundPage } from "@/components/not-found-page";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { useAppBreadcrumbLabel } from "@/contexts/breadcrumb-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowUpRight, RefreshCw } from "lucide-react";
import { useParams } from "react-router-dom";
import { EscrowExcessFlag } from "../components/escrow-excess-flag";
import { FailedPayoutResend } from "../components/failed-payout-resend";
import { payoutPollInterval } from "../components/unconfirmed-payout";
import { UnconfirmedPayoutLookup } from "../components/unconfirmed-payout-lookup";
import { ActionZone } from "../components/v2/action-zone";
import { ContextSidebar } from "../components/v2/context-sidebar";
import { FundingReviewCard } from "../components/v2/funding-review-card";
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
  } = api.admin.transactions.detail.useQuery(
    {
      path: { id: id! },
    },
    {
      enabled: !!id,
      refetchInterval: (query) => payoutPollInterval(query.state.data?.escrow),
    },
  );

  // Background polls must not spin the Refresh button; only a click does.
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  // When a polled payout settles, the activity log has new events too.
  const queryClient = useQueryClient();
  const escrowStatus = transaction?.escrow?.status;
  const lastEscrowStatus = useRef(escrowStatus);
  useEffect(() => {
    if (lastEscrowStatus.current && lastEscrowStatus.current !== escrowStatus) {
      queryClient.invalidateQueries({
        queryKey: ["admin", "transactions", "logs", id],
      });
    }
    lastEscrowStatus.current = escrowStatus;
  }, [escrowStatus, id, queryClient]);

  const order = transaction?.order;
  const txnLabel = transaction
    ? `TXN-${String(transaction.displayId).padStart(4, "0")}`
    : "";

  useAppBreadcrumbLabel(id!, txnLabel);

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

  const buyerName = order?.buyerOrganization?.name || "Unknown Buyer";
  const sellerName = order?.sellerOrganization?.name || "Unknown Seller";
  const buyerOrgId = order?.buyerOrganization?._id;
  const sellerOrgId = order?.sellerOrganization?._id;

  return (
    <Page>
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
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
      />

      {/* ── Overview + Action Zone ────────────────────────────── */}
      <OverviewStatusCard transaction={transaction} />
      <ActionZone transaction={transaction} />
      <FailedPayoutResend transaction={transaction} />
      <UnconfirmedPayoutLookup transaction={transaction} />
      <EscrowExcessFlag transaction={transaction} />
      {transaction.escrowFunding?.mode === "DEPOSIT_LED" && (
        <FundingReviewCard transaction={transaction} />
      )}

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
