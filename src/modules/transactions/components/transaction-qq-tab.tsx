import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { CALLOUT, TINT } from "@/lib/tint";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { AlertCircle, Building2, CheckCircle, FileCheck, Upload, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RejectInspectionDialog } from "./reject-inspection-dialog";
import { TransactionQQDocuments } from "./transaction-qq-documents";
import { UploadInspectionDialog } from "./upload-inspection-dialog";

interface TransactionQQTabProps {
  transaction: TransactionResponseDto;
}

export function TransactionQQTab({ transaction }: TransactionQQTabProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { mutate: reviewInspection, isPending: isApproving } =
    api.admin.transactions.reviewInspection.useMutation();

  const inspectionStage = transaction.stages?.find(
    (s) => s.type === "INSPECTION",
  );

  if (!inspectionStage) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        No Q&amp;Q inspection stage for this transaction.
      </div>
    );
  }

  const metadata = inspectionStage.metadata as Record<string, unknown> | undefined;
  const qqCompany = metadata?.qqCompany as string | null | undefined;
  const qqCriteria = (metadata?.qqCriteria as Record<string, unknown>[]) ?? [];
  const submittedDocuments =
    (metadata?.submittedDocuments as { name: string; url: string }[]) ?? [];
  const inspectionReview = metadata?.inspectionReview as
    | { status: string; rejectionReason?: string | null }
    | undefined;
  const reviewStatus = inspectionReview?.status;

  const isCompleted = inspectionStage.status === "COMPLETED";
  const isActive = inspectionStage.status === "ACTIVE";
  const isAwaitingReview = isActive && reviewStatus === "AWAITING_REVIEW";
  const isRejected = isActive && reviewStatus === "REJECTED";
  const isAwaitingDocs = isActive && !reviewStatus;

  const handleApprove = () => {
    if (!transaction._id || !inspectionStage._id) return;
    reviewInspection(
      {
        path: { id: transaction._id, stageId: inspectionStage._id },
        body: { decision: "APPROVED" },
      },
      {
        onSuccess: () => {
          toast.success("Inspection approved. Transaction is advancing to the next stage.");
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to approve inspection", { description: message });
        },
      },
    );
  };

  const statusBadge = isCompleted ? (
    <Badge variant="outline" className={TINT.green}>
      Completed
    </Badge>
  ) : isAwaitingReview ? (
    <Badge variant="outline" className={TINT.blue}>
      Under Review
    </Badge>
  ) : isRejected ? (
    <Badge variant="outline" className={TINT.red}>
      Rejected
    </Badge>
  ) : isAwaitingDocs ? (
    <Badge variant="outline" className={TINT.amber}>
      Awaiting Documents
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground">
      Pending
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-medium">
            Quality &amp; Quantity Inspection
          </h3>
          {inspectionStage.completedAt && (
            <p className="text-muted-foreground text-sm">
              Completed{" "}
              {formatDateTime(inspectionStage.completedAt)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {statusBadge}
          {(isAwaitingDocs || isRejected) && transaction._id && inspectionStage._id && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          )}
        </div>
      </div>

      {/* Rejection reason banner */}
      {isRejected && inspectionReview?.rejectionReason && (
        <div className={`flex items-start gap-3 rounded-md border p-3 ${CALLOUT.red}`}>
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Documents Rejected
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {inspectionReview.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Approve / Reject actions when under review */}
      {isAwaitingReview && transaction._id && inspectionStage._id && (
        <div className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Review the submitted documents against the Q&amp;Q criteria below.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
              onClick={() => setIsRejectOpen(true)}
            >
              <XCircle className="size-4" />
              Reject
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
              disabled={isApproving}
            >
              <CheckCircle className="size-4" />
              {isApproving ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      )}

      {/* Inspection company */}
      {qqCompany && (
        <div className="bg-muted/50 flex items-center gap-3 rounded-md border p-3">
          <Building2 className="text-muted-foreground size-4 shrink-0" />
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Inspection Company
            </p>
            <p className="text-sm font-medium">{qqCompany}</p>
          </div>
        </div>
      )}

      {/* Acceptance criteria */}
      {qqCriteria.length > 0 && (
        <div className="space-y-2 rounded-md border p-3">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Acceptance Criteria
          </p>
          <ul className="space-y-1">
            {qqCriteria.map((criterion) => (
              <li
                key={criterion.id as string}
                className="flex items-center gap-2 text-sm"
              >
                <FileCheck className="text-muted-foreground size-3.5 shrink-0" />
                <span className="font-medium">{criterion.label as string}</span>
                {typeof criterion.unit === "string" && (
                  <span className="text-muted-foreground text-xs">
                    ({criterion.unit})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submitted documents */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Submitted Documents
        </p>
        <TransactionQQDocuments documents={submittedDocuments} />
      </div>

      {/* Dialogs */}
      {transaction._id && inspectionStage._id && (
        <>
          <UploadInspectionDialog
            open={isUploadOpen}
            onOpenChange={setIsUploadOpen}
            transactionId={transaction._id}
            stageId={inspectionStage._id}
          />
          <RejectInspectionDialog
            open={isRejectOpen}
            onOpenChange={setIsRejectOpen}
            transactionId={transaction._id}
            stageId={inspectionStage._id}
          />
        </>
      )}
    </div>
  );
}
