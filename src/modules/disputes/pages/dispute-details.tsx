import { NotFoundPage } from "@/components/not-found-page";
import { Page } from "@/components/shared/page";
import { PageLoader } from "@/components/shared/page-loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { AlertCircle, ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DisputeAuditLog } from "@/modules/transactions/components/disputes/dispute-audit-log";
import { DisputeClaim } from "@/modules/transactions/components/disputes/dispute-claim";
import { DisputeHeader } from "@/modules/transactions/components/disputes/dispute-header";
import { DisputeInformationRequests } from "@/modules/transactions/components/disputes/dispute-information-requests";
import { DisputeResolution } from "@/modules/transactions/components/disputes/dispute-resolution";

function formatDisputeId(displayId: number) {
  return `DSP-${String(displayId).padStart(4, "0")}`;
}

function formatDisputeType(type: string) {
  return type
    .replace(/_DISPUTE$/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

const STATUS_STYLES: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  open: { variant: "destructive" },
  under_review: { variant: "secondary" },
  resolved_release: { variant: "default", className: "bg-emerald-600 hover:bg-emerald-700" },
  resolved_refund: { variant: "default", className: "bg-emerald-600 hover:bg-emerald-700" },
  escalated: { variant: "destructive", className: "bg-orange-600 hover:bg-orange-700" },
  withdrawn: { variant: "outline" },
  dismissed: { variant: "outline" },
};

export default function DisputeDetailsPage() {
  const { id } = useParams();

  const {
    data: dispute,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = api.admin.disputes.detail.useQuery(
    { path: { id: id! } },
    { enabled: !!id },
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <Page>
        <Alert variant="destructive" className="mx-auto mt-12 max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load dispute</AlertTitle>
          <AlertDescription>
            Something went wrong while loading this dispute.
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </Page>
    );
  }

  if (!dispute) {
    return <NotFoundPage />;
  }

  // Cast for component compatibility
  const d = dispute as any;
  const amount = d.amount ?? 0;
  const status = d.status as string;
  const statusStyle = STATUS_STYLES[status] ?? { variant: "outline" as const };
  const transactionId = d.transaction?._id;

  // Escrow context for the resolution component
  const escrowStatus = {
    status: "LOCKED",
    lockedAmount: amount,
  };

  return (
    <Page>
      {/* ── Command Bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5" asChild>
            <Link to="/disputes">
              <ArrowLeft className="size-3.5" />
              Disputes
            </Link>
          </Button>
          <div className="bg-border h-5 w-px" />
          <h1 className="text-lg font-semibold tracking-tight">
            {formatDisputeId(d.displayId)}
          </h1>
          <Badge variant="outline" className="text-xs">
            {formatDisputeType(d.type || "")}
          </Badge>
          <Badge
            variant={statusStyle.variant}
            className={`capitalize ${statusStyle.className ?? ""}`}
          >
            {status.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {transactionId && (
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link to={`/transactions/${transactionId}`}>
                View Transaction
                <ArrowUpRight className="size-3" />
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — main content */}
        <div className="space-y-6 xl:col-span-2">
          <DisputeHeader dispute={d} amount={amount} />
          <DisputeClaim dispute={d} />
          <DisputeInformationRequests dispute={d} onUpdate={refetch} />
          <DisputeResolution
            dispute={d}
            escrowStatus={escrowStatus}
            amount={amount}
            onResolved={refetch}
          />
        </div>

        {/* Right column — context sidebar */}
        <div className="space-y-4">
          <TransactionContextCard dispute={d} />
          <DisputeAuditLog dispute={d} />
        </div>
      </div>
    </Page>
  );
}

// ─── Transaction Context Card ──────────────────────────────────────
function TransactionContextCard({ dispute }: { dispute: any }) {
  const tx = dispute.transaction;
  if (!tx) return null;

  const product = tx.product;
  const amount = dispute.amount ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Transaction Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Transaction link */}
        <div>
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Transaction
          </p>
          <Link
            to={`/transactions/${tx._id}`}
            className="text-primary mt-0.5 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            TXN-{String(tx.displayId ?? "").padStart(4, "0")}
            <ArrowUpRight className="size-3 opacity-60" />
          </Link>
        </div>

        {/* Product */}
        {product?.title && (
          <div>
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
              Product
            </p>
            <p className="mt-0.5 text-sm font-medium">{product.title}</p>
          </div>
        )}

        {/* Transaction status */}
        <div>
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Transaction Status
          </p>
          <Badge variant="outline" className="mt-0.5 capitalize">
            {(tx.status ?? "").replace(/_/g, " ").toLowerCase()}
          </Badge>
        </div>

        {/* Amount in dispute */}
        <div>
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Amount in Dispute
          </p>
          <p className="mt-0.5 text-lg font-semibold">
            {formatCurrency(amount)}
          </p>
        </div>

        {/* Parties */}
        {dispute.initiator && (
          <div className="border-t pt-3">
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
              Raised By
            </p>
            <div className="mt-0.5">
              <p className="text-sm font-medium">
                {dispute.initiator.firstName} {dispute.initiator.lastName}
              </p>
              <p className="text-muted-foreground text-xs">
                {dispute.raisedByRole === "BUYER" ? "Buyer" : "Seller"} ·{" "}
                {dispute.initiator.organization?.name ?? dispute.initiator.email}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
