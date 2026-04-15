import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type {
  TransactionDocumentSlotDto,
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Send,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentReviewDialog } from "../document-review-dialog";
import { ReleaseSettlementDialog } from "../release-settlement-dialog";
import { RejectInspectionDialog } from "../reject-inspection-dialog";
import { UploadInspectionDialog } from "../upload-inspection-dialog";

interface ActionZoneProps {
  transaction: TransactionResponseDto;
}

type ActionContext =
  | { type: "documents_review"; docs: TransactionDocumentSlotDto[] }
  | { type: "awaiting_funding"; amount: number; currency: string }
  | { type: "inspection_awaiting_docs"; stage: TransactionStageResponseDto }
  | { type: "inspection_review"; stage: TransactionStageResponseDto }
  | { type: "inspection_rejected"; stage: TransactionStageResponseDto; reason: string }
  | { type: "settlement_ready" }
  | { type: "disputed" }
  | { type: "terminal"; label: string }
  | { type: "waiting"; label: string; description: string };

function deriveActionContext(tx: TransactionResponseDto): ActionContext {
  const status = tx.status;
  const stages = tx.stages ?? [];

  // Terminal states
  if (status === "CLOSED") return { type: "terminal", label: "Closed" };
  if (status === "CANCELLED") return { type: "terminal", label: "Cancelled" };
  if (status === "REFUNDED") return { type: "terminal", label: "Refunded" };
  if (status === "PARTIALLY_REFUNDED") return { type: "terminal", label: "Partially Refunded" };

  // Disputed
  if (status === "DISPUTED") return { type: "disputed" };

  // Documents awaiting review
  const docsAwaitingReview = (tx.requiredDocuments ?? []).filter(
    (d) => d.status === "SUBMITTED",
  );
  if (docsAwaitingReview.length > 0 && ["DOCUMENTS_SUBMITTED", "INITIATED"].includes(status)) {
    return { type: "documents_review", docs: docsAwaitingReview };
  }

  // Awaiting escrow funding
  const fundEscrowStage = stages.find(
    (s) => s.type === "FUND_ESCROW" && s.status === "ACTIVE",
  );
  if (fundEscrowStage || status === "COMPLIANCE_REVIEWED") {
    const currency = tx.order?.currency || "USD";
    const amount = tx.order?.totalWithFee ?? tx.order?.totalAmount ?? 0;
    return { type: "awaiting_funding", amount, currency };
  }

  // Inspection stages
  const inspectionStage = stages.find((s) => s.type === "INSPECTION");
  if (inspectionStage?.status === "ACTIVE") {
    const meta = inspectionStage.metadata as Record<string, unknown> | undefined;
    const reviewStatus = (meta?.inspectionReview as any)?.status;

    if (reviewStatus === "AWAITING_REVIEW") {
      return { type: "inspection_review", stage: inspectionStage };
    }
    if (reviewStatus === "REJECTED") {
      const reason = (meta?.inspectionReview as any)?.rejectionReason || "";
      return { type: "inspection_rejected", stage: inspectionStage, reason };
    }
    return { type: "inspection_awaiting_docs", stage: inspectionStage };
  }

  // Settlement ready
  const settlementStage = stages.find(
    (s) => s.type === "SETTLEMENT" && s.status === "ACTIVE",
  );
  if (settlementStage || status === "DELIVERY_CONFIRMED") {
    return { type: "settlement_ready" };
  }

  // Waiting states — no admin action required
  if (status === "INITIATED") {
    const pendingDocs = (tx.requiredDocuments ?? []).filter(
      (d) => d.status === "PENDING",
    );
    if (pendingDocs.length > 0) {
      return {
        type: "waiting",
        label: "Awaiting document submissions",
        description: `${pendingDocs.length} document(s) pending from buyer/seller.`,
      };
    }
  }

  if (status === "ESCROW_FUNDED") {
    return {
      type: "waiting",
      label: "Escrow funded — awaiting next stage",
      description: "Transaction is progressing. No admin action required.",
    };
  }

  if (status === "LOGISTICS_ASSIGNED" || status === "IN_TRANSIT") {
    return {
      type: "waiting",
      label: status === "IN_TRANSIT" ? "Shipment in transit" : "Logistics assigned",
      description: "Waiting for delivery confirmation. No admin action required.",
    };
  }

  if (status === "INSPECTION_PENDING") {
    return {
      type: "waiting",
      label: "Awaiting inspection documents",
      description: "The buyer needs to upload inspection documents.",
    };
  }

  if (status === "INSPECTION_UNDER_REVIEW") {
    const stage = stages.find((s) => s.type === "INSPECTION" && s.status === "ACTIVE");
    if (stage) return { type: "inspection_review", stage };
  }

  if (status === "MILESTONES_IN_PROGRESS") {
    return {
      type: "waiting",
      label: "Milestones in progress",
      description: "Seller is delivering milestones. Payments release as milestones are approved.",
    };
  }

  if (status === "SETTLEMENT_RELEASED") {
    return { type: "terminal", label: "Settlement Released" };
  }

  return {
    type: "waiting",
    label: "Transaction is progressing",
    description: "No admin action required at this time.",
  };
}

// ─── Style config per action type ──────────────────────────────────
const ZONE_STYLES = {
  documents_review: {
    border: "border-amber-200 dark:border-amber-800",
    bg: "bg-amber-50/80 dark:bg-amber-950/20",
    icon: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  awaiting_funding: {
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/80 dark:bg-blue-950/20",
    icon: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  inspection_awaiting_docs: {
    border: "border-amber-200 dark:border-amber-800",
    bg: "bg-amber-50/80 dark:bg-amber-950/20",
    icon: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  inspection_review: {
    border: "border-orange-200 dark:border-orange-800",
    bg: "bg-orange-50/80 dark:bg-orange-950/20",
    icon: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  inspection_rejected: {
    border: "border-red-200 dark:border-red-800",
    bg: "bg-red-50/80 dark:bg-red-950/20",
    icon: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  settlement_ready: {
    border: "border-green-200 dark:border-green-800",
    bg: "bg-green-50/80 dark:bg-green-950/20",
    icon: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  disputed: {
    border: "border-red-300 dark:border-red-800",
    bg: "bg-red-50/80 dark:bg-red-950/20",
    icon: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  terminal: {
    border: "border-border",
    bg: "bg-muted/40",
    icon: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  waiting: {
    border: "border-border",
    bg: "bg-muted/30",
    icon: "text-muted-foreground",
    dot: "bg-blue-400",
  },
};

export function ActionZone({ transaction }: ActionZoneProps) {
  const ctx = deriveActionContext(transaction);
  const styles = ZONE_STYLES[ctx.type];

  return (
    <div className={cn("rounded-lg border p-4", styles.border, styles.bg)}>
      <ActionContent context={ctx} transaction={transaction} styles={styles} />
    </div>
  );
}

// ─── Render the right content for each context ─────────────────────
function ActionContent({
  context: ctx,
  transaction,
  styles,
}: {
  context: ActionContext;
  transaction: TransactionResponseDto;
  styles: (typeof ZONE_STYLES)[keyof typeof ZONE_STYLES];
}) {
  const [reviewDoc, setReviewDoc] = useState<TransactionDocumentSlotDto | null>(null);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { mutate: reviewInspection, isPending: isApproving } =
    api.admin.transactions.reviewInspection.useMutation();

  const handleApproveInspection = (stageId: string) => {
    reviewInspection(
      {
        path: { id: transaction._id, stageId },
        body: { decision: "APPROVED" },
      },
      {
        onSuccess: () =>
          toast.success("Inspection approved — transaction advancing."),
        onError: (err: unknown) =>
          toast.error("Failed to approve", {
            description: err instanceof Error ? err.message : "Unknown error",
          }),
      },
    );
  };

  switch (ctx.type) {
    // ── Documents needing review ───────────────────────────────────
    case "documents_review":
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-amber-100 dark:bg-amber-900/40")}>
                <Eye className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {ctx.docs.length} document{ctx.docs.length > 1 ? "s" : ""} awaiting
                  your review
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Review and approve or reject each submitted document to advance
                  compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {ctx.docs.map((doc) => (
              <div
                key={doc._id}
                className="bg-background/60 flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="text-muted-foreground size-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-muted-foreground text-[11px]">
                      From {doc.requiredFrom === "BUYER" ? "Buyer" : "Seller"} ·{" "}
                      {doc.type.replace(/_/g, " ").toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.submission?.url && (
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
                      <a href={doc.submission.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3" />
                        View
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => setReviewDoc(doc)}
                  >
                    <Eye className="size-3" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DocumentReviewDialog
            open={!!reviewDoc}
            onOpenChange={(open) => !open && setReviewDoc(null)}
            transactionId={transaction._id}
            document={reviewDoc}
          />
        </>
      );

    // ── Awaiting escrow funding ────────────────────────────────────
    case "awaiting_funding": {
      const va = (transaction as any).virtualAccount as
        | { accountNumber: string; bankName: string }
        | undefined;

      return (
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-blue-100 dark:bg-blue-900/40")}>
            <Clock className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              Waiting for buyer to fund escrow —{" "}
              {formatCurrency(ctx.amount, ctx.currency)}
            </p>
            {va ? (
              <div className="mt-1.5 flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  Virtual Account:{" "}
                  <code className="bg-background/60 rounded px-1 py-0.5 font-mono">
                    {va.accountNumber}
                  </code>{" "}
                  ({va.bankName})
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground mt-0.5 text-xs">
                Buyer has been notified. No admin action required.
              </p>
            )}
          </div>
        </div>
      );
    }

    // ── Inspection: awaiting docs ──────────────────────────────────
    case "inspection_awaiting_docs":
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-amber-100 dark:bg-amber-900/40")}>
                <Upload className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Awaiting Q&Q inspection documents
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  The buyer needs to upload inspection documents, or you can
                  upload on their behalf.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="size-3.5" />
              Upload on Behalf
            </Button>
          </div>

          {transaction._id && ctx.stage._id && (
            <UploadInspectionDialog
              open={isUploadOpen}
              onOpenChange={setIsUploadOpen}
              transactionId={transaction._id}
              stageId={ctx.stage._id}
            />
          )}
        </>
      );

    // ── Inspection: review submitted docs ──────────────────────────
    case "inspection_review": {
      const meta = ctx.stage.metadata as Record<string, unknown> | undefined;
      const submittedDocs =
        (meta?.submittedDocuments as { name: string; url: string }[]) ?? [];

      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-orange-100 dark:bg-orange-900/40")}>
                <Eye className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Inspection documents submitted — review required
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {submittedDocs.length} file{submittedDocs.length !== 1 ? "s" : ""}{" "}
                  attached. Review against the Q&Q criteria and approve or reject.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                onClick={() => setIsRejectOpen(true)}
              >
                <XCircle className="size-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                onClick={() => handleApproveInspection(ctx.stage._id)}
                disabled={isApproving}
              >
                {isApproving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="size-3.5" />
                )}
                Approve
              </Button>
            </div>
          </div>

          {submittedDocs.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              {submittedDocs.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-background/60 hover:bg-background inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs transition-colors"
                >
                  <FileText className="size-3 shrink-0" />
                  {doc.name}
                  <ExternalLink className="size-2.5 opacity-50" />
                </a>
              ))}
            </div>
          )}

          {transaction._id && ctx.stage._id && (
            <RejectInspectionDialog
              open={isRejectOpen}
              onOpenChange={setIsRejectOpen}
              transactionId={transaction._id}
              stageId={ctx.stage._id}
            />
          )}
        </>
      );
    }

    // ── Inspection rejected ────────────────────────────────────────
    case "inspection_rejected":
      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-red-100 dark:bg-red-900/40")}>
                <XCircle className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Inspection rejected — awaiting re-upload
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Reason: {ctx.reason}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  The buyer has been notified to re-upload corrected documents. You
                  can also upload on their behalf.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="size-3.5" />
              Upload on Behalf
            </Button>
          </div>

          {transaction._id && ctx.stage._id && (
            <UploadInspectionDialog
              open={isUploadOpen}
              onOpenChange={setIsUploadOpen}
              transactionId={transaction._id}
              stageId={ctx.stage._id}
            />
          )}
        </>
      );

    // ── Settlement ready ───────────────────────────────────────────
    case "settlement_ready": {
      const currency = transaction.escrow?.currency || transaction.order?.currency || "USD";
      const sellerAmount =
        transaction.escrow?.sellerAmount ?? transaction.order?.totalAmount ?? 0;
      const sellerName = transaction.order?.sellerOrganization?.name || "Seller";

      return (
        <>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-green-100 dark:bg-green-900/40")}>
                <Send className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Ready for settlement —{" "}
                  {formatCurrency(sellerAmount, currency)} to {sellerName}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  All conditions met. Release the escrowed funds to the seller.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setIsSettlementOpen(true)}
            >
              <Send className="size-3.5" />
              Release Settlement
            </Button>
          </div>

          <ReleaseSettlementDialog
            open={isSettlementOpen}
            onOpenChange={setIsSettlementOpen}
            transaction={transaction}
          />
        </>
      );
    }

    // ── Disputed ───────────────────────────────────────────────────
    case "disputed":
      return (
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-red-100 dark:bg-red-900/40")}>
            <AlertTriangle className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              Transaction is under dispute
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Review the dispute details below and take action to resolve it.
            </p>
          </div>
        </div>
      );

    // ── Terminal states ────────────────────────────────────────────
    case "terminal":
      return (
        <div className="flex items-center gap-3">
          <div className={cn("rounded-full p-1.5", styles.icon, "bg-muted")}>
            <CheckCircle className="size-4" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Transaction {ctx.label.toLowerCase()}. No further action required.
          </p>
        </div>
      );

    // ── Waiting / info states ──────────────────────────────────────
    case "waiting":
      return (
        <div className="flex items-start gap-3">
          <div className={cn("mt-0.5 rounded-full p-1.5", styles.icon, "bg-muted")}>
            <Clock className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{ctx.label}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {ctx.description}
            </p>
          </div>
        </div>
      );
  }
}
