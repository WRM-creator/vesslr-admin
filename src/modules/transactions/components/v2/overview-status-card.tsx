import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { cn, formatDateTime } from "@/lib/utils";
import {
  AlertTriangle,
  Ban,
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  ListChecks,
  Lock,
  Package,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";
import { format } from "date-fns";
import { useDifferentialFormula } from "../differential-formula";

interface OverviewStatusCardProps {
  transaction: TransactionResponseDto;
}

type EscrowState = "awaiting" | "secured" | "released" | "refunded" | "cancelled";

function getEscrowState(
  transaction: Pick<TransactionResponseDto, "status" | "escrow">,
): EscrowState {
  // The escrow document is the source of truth once it exists; deriving from
  // transaction.status breaks on flow-specific statuses (rental, charter).
  const escrow = transaction.escrow;
  if (escrow) {
    switch (escrow.status) {
      case "RELEASED":
        return "released";
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "refunded";
      // FUNDED / RELEASE_PENDING / REFUND_PENDING — funds still in custody.
      default:
        return "secured";
    }
  }
  // No escrow yet: cancelled before funding, or still awaiting it.
  return transaction.status === "CANCELLED" ? "cancelled" : "awaiting";
}

const ESCROW_CONFIG: Record<
  EscrowState,
  { icon: typeof Clock; label: string; iconClass: string; badgeClass: string }
> = {
  awaiting: {
    icon: Clock,
    label: "Awaiting Funding",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  secured: {
    icon: Lock,
    label: "Funds Secured",
    iconClass: "text-green-600",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
  released: {
    icon: CheckCircle2,
    label: "Released",
    iconClass: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  refunded: {
    icon: RotateCcw,
    label: "Refunded",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  cancelled: {
    icon: Ban,
    label: "Not Funded",
    iconClass: "text-muted-foreground",
    badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  },
};

function activeStageIcon(type: string): ReactNode {
  switch (type) {
    case "DOCUMENT_SUBMISSION":
      return <FileText className="size-4" />;
    case "COMPLIANCE_REVIEW":
      return <ShieldCheck className="size-4" />;
    case "FUND_ESCROW":
      return <Lock className="size-4" />;
    case "LOGISTICS":
    case "IN_TRANSIT":
      return <Truck className="size-4" />;
    case "INSPECTION":
      return <ClipboardCheck className="size-4" />;
    case "DELIVERY_CONFIRMATION":
      return <PackageCheck className="size-4" />;
    case "MILESTONE_SUBMIT":
    case "MILESTONE_APPROVE":
      return <ListChecks className="size-4" />;
    case "SETTLEMENT":
      return <Banknote className="size-4" />;
    default:
      return null;
  }
}

function activeStageMessage(
  stage: NonNullable<TransactionResponseDto["stages"]>[number],
  transaction: TransactionResponseDto,
): string {
  switch (stage.type) {
    case "DOCUMENT_SUBMISSION": {
      const docs = transaction.requiredDocuments ?? [];
      const submitted = docs.filter((d) => d.status !== "PENDING").length;
      return docs.length === 0
        ? "No required documents for this transaction."
        : `${submitted} of ${docs.length} document${docs.length !== 1 ? "s" : ""} submitted.`;
    }
    case "COMPLIANCE_REVIEW":
      return "Reviewing compliance documents.";
    case "FUND_ESCROW": {
      if (!transaction.fundingDueAt) return "Awaiting escrow funding to proceed.";
      const dueLabel = format(new Date(transaction.fundingDueAt), "MMM d, yyyy");
      return new Date(transaction.fundingDueAt) < new Date()
        ? `The buyer's funding window closed on ${dueLabel}.`
        : `Awaiting escrow funding. The buyer's window closes on ${dueLabel}.`;
    }
    case "LOGISTICS": {
      const carrier = stage.metadata?.carrierName as string | undefined;
      return carrier ? `Carrier: ${carrier}.` : "Awaiting carrier assignment.";
    }
    case "IN_TRANSIT":
      return "Shipment is in transit.";
    case "INSPECTION": {
      const company = stage.metadata?.qqCompany as string | undefined;
      return company
        ? `Inspection by ${company}.`
        : "Awaiting inspection report.";
    }
    case "DELIVERY_CONFIRMATION":
      return "Awaiting delivery confirmation from buyer.";
    case "MILESTONE_SUBMIT":
      return "Seller submission pending.";
    case "MILESTONE_APPROVE":
      return "Awaiting buyer approval.";
    case "SETTLEMENT":
      return "Settlement is being processed.";
    default:
      return stage.description ?? "";
  }
}

export function OverviewStatusCard({
  transaction,
}: OverviewStatusCardProps) {
  const escrowState = getEscrowState(transaction);
  const escrowConfig = ESCROW_CONFIG[escrowState];
  const EscrowIcon = escrowConfig.icon;

  const currency = transaction.order?.currency || "USD";
  const amount = transaction.order?.totalAmount || 0;
  const serviceFeeAmount = transaction.order?.serviceFeeAmount ?? 0;
  const totalWithFee = transaction.order?.totalWithFee ?? amount + serviceFeeAmount;

  // A differential order is unpriced until its benchmark resolves at funding;
  // the formula stands in for the amounts until then.
  const { isDifferential, formula } = useDifferentialFormula(transaction.order);
  const amountPending = isDifferential && transaction.order?.totalAmount == null;

  // A cancelled transaction's stages are frozen; the "active" stage is no
  // longer actionable, so its strip is suppressed.
  const isCancelled = transaction.status === "CANCELLED";
  const activeStage = isCancelled
    ? undefined
    : transaction.stages?.find((s) => s.status === "ACTIVE");
  const disputedStage = transaction.stages?.find(
    (s) => (s.status as string) === "DISPUTED",
  );
  const showDispute =
    !!disputedStage &&
    escrowState !== "refunded" &&
    escrowState !== "released";

  // Milestone breakdown
  const escrow = transaction.escrow as any;
  const milestonePayouts = escrow?.milestonePayouts;
  const hasMilestones = milestonePayouts && milestonePayouts.length > 0;

  const order = transaction.order;
  const productName = order?.product?.title;
  const quantity = order?.quantity;
  const unitOfMeasurement = order?.unitOfMeasurement;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Transaction Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Order context strip */}
          {productName && (
            <>
              <div className="flex items-start gap-2.5">
                <Package className="mt-0.5 size-4 shrink-0 text-indigo-500" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Product
                    </span>
                  </div>
                  <p className="text-sm font-medium">{productName}</p>
                  {quantity != null && (
                    <p className="text-muted-foreground text-xs">
                      {Number(quantity).toLocaleString()} {unitOfMeasurement || "units"}{" "}
                      · {amountPending
                        ? (formula ?? "Benchmark differential")
                        : formatCurrency(amount, currency)}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t" />
            </>
          )}

          {/* Escrow strip */}
          <div className="flex items-start gap-2.5">
            <EscrowIcon
              className={cn("mt-0.5 size-4 shrink-0", escrowConfig.iconClass)}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Escrow
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    escrowConfig.badgeClass,
                  )}
                >
                  {escrowConfig.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                {amountPending ? (
                  <span className="text-base font-semibold tracking-tight">
                    {formula ?? "Benchmark differential"}
                  </span>
                ) : (
                  <>
                    <span className="text-base font-semibold tracking-tight">
                      {formatCurrency(totalWithFee, currency)}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      {currency}
                    </span>
                  </>
                )}
              </div>

              {/* Milestone breakdown */}
              {hasMilestones && (
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Released</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(escrow?.totalReleased ?? 0, currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium">
                      {formatCurrency(
                        (escrow?.sellerAmount ?? 0) - (escrow?.totalReleased ?? 0),
                        currency,
                      )}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    {milestonePayouts.filter((p: any) => p.status === "RELEASED").length}{" "}
                    of {milestonePayouts.length} milestones paid
                  </p>
                </div>
              )}
            </div>

            {/* Financial breakdown — compact right column (unpriced orders have no figures yet) */}
            {!amountPending && (
              <div className="hidden text-right sm:block">
                <div className="text-muted-foreground space-y-0.5 text-[11px]">
                  <div>
                    Goods: {formatCurrency(amount, currency)}
                  </div>
                  {serviceFeeAmount > 0 && (
                    <div>
                      Fee: {formatCurrency(serviceFeeAmount, currency)}
                    </div>
                  )}
                  <div className="font-medium text-green-600">
                    Seller payout: {formatCurrency(amount, currency)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cancellation strip */}
          {isCancelled && (
            <>
              <div className="border-t" />
              <div className="flex items-start gap-2.5">
                <Ban className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Cancelled
                  </span>
                  <p className="text-sm font-medium">
                    {transaction.cancellationReason === "funding_window_expired"
                      ? `Escrow was not funded${transaction.fundingDueAt ? ` by ${format(new Date(transaction.fundingDueAt), "MMM d, yyyy")}` : " in time"}.`
                      : "This transaction was cancelled."}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    The order is closed. No funds were moved.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Dispute strip */}
          {showDispute && (
            <>
              <div className="border-t" />
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      Dispute
                    </span>
                    <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-[11px] font-semibold">
                      Active
                    </span>
                  </div>
                  <p className="text-sm font-medium">{disputedStage.name}</p>
                  <p className="text-muted-foreground text-xs">
                    Escrow funds are frozen pending resolution.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Active stage strip */}
          {activeStage && !showDispute && (
            <>
              <div className="border-t" />
              <div className="flex items-start gap-2.5">
                <div className="text-muted-foreground mt-0.5 shrink-0">
                  {activeStageIcon(activeStage.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{activeStage.name}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {activeStageMessage(activeStage, transaction)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
