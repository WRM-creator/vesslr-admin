import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Building2, CheckCircle, ExternalLink, FileCheck, FileText, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RejectInspectionDialog } from "../../reject-inspection-dialog";

interface StageInspectionContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageInspectionContent({
  transaction,
  stage,
}: StageInspectionContentProps) {
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const metadata = stage.metadata as Record<string, unknown> | undefined;
  const qqCompany = metadata?.qqCompany as string | null | undefined;
  const qqCriteria = (metadata?.qqCriteria as Record<string, unknown>[]) ?? [];
  const submittedDocuments =
    (metadata?.submittedDocuments as { name: string; url: string }[]) ?? [];
  const inspectionReview = metadata?.inspectionReview as
    | { status: string; rejectionReason?: string | null; reviewedAt?: string }
    | undefined;

  const { mutate: reviewInspection, isPending: isApproving } =
    api.admin.transactions.reviewInspection.useMutation();

  const handleApprove = () => {
    if (!transaction._id || !stage._id) return;
    reviewInspection(
      {
        path: { id: transaction._id, stageId: stage._id },
        body: { decision: "APPROVED" },
      },
      {
        onSuccess: () => toast.success("Inspection approved."),
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to approve inspection", { description: message });
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* Q&Q Company */}
      {qqCompany && (
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="text-muted-foreground size-3.5" />
          <span className="text-muted-foreground text-xs">Inspection Company:</span>
          <span className="font-medium">{qqCompany}</span>
        </div>
      )}

      {/* Acceptance criteria */}
      {qqCriteria.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Acceptance Criteria
          </p>
          <ul className="space-y-1">
            {qqCriteria.map((c) => (
              <li
                key={c.id as string}
                className="flex items-center gap-2 text-sm"
              >
                <FileCheck className="text-muted-foreground size-3 shrink-0" />
                <span>{c.label as string}</span>
                {typeof c.unit === "string" && (
                  <span className="text-muted-foreground text-[10px]">
                    ({c.unit})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submitted documents */}
      {submittedDocuments.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Submitted Documents
          </p>
          <div className="flex flex-wrap gap-2">
            {submittedDocuments.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="hover:bg-muted inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors"
              >
                <FileText className="size-3 shrink-0" />
                {doc.name}
                <ExternalLink className="size-2.5 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Review actions — shown when documents are submitted and awaiting admin review */}
      {inspectionReview?.status === "AWAITING_REVIEW" && transaction._id && stage._id && (
        <div className="flex items-center justify-end gap-2 border-t pt-3">
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
            onClick={handleApprove}
            disabled={isApproving}
          >
            {isApproving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle className="size-3.5" />
            )}
            Approve
          </Button>
          <RejectInspectionDialog
            open={isRejectOpen}
            onOpenChange={setIsRejectOpen}
            transactionId={transaction._id}
            stageId={stage._id}
          />
        </div>
      )}

      {/* Review outcome — only shown after a decision is made */}
      {inspectionReview && inspectionReview.status !== "AWAITING_REVIEW" && (
        <div className="bg-muted/40 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium">Review Decision:</p>
            <Badge
              variant="outline"
              className={
                inspectionReview.status === "APPROVED"
                  ? "border-green-500 text-green-700"
                  : "border-red-500 text-red-700"
              }
            >
              {inspectionReview.status}
            </Badge>
          </div>
          {inspectionReview.rejectionReason && (
            <p className="text-muted-foreground mt-1 text-xs">
              Reason: {inspectionReview.rejectionReason}
            </p>
          )}
          {inspectionReview.reviewedAt && (
            <p className="text-muted-foreground mt-1 text-[11px]">
              Reviewed {formatDateTime(inspectionReview.reviewedAt)}
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {submittedDocuments.length === 0 && !inspectionReview && stage.status === "ACTIVE" && (
        <p className="text-muted-foreground text-sm">
          No inspection documents submitted yet.
        </p>
      )}
    </div>
  );
}
