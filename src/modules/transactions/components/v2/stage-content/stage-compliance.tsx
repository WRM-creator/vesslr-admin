import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CALLOUT } from "@/lib/tint";
import type {
  TransactionDocumentSlotDto,
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, FileText, Plus, X } from "lucide-react";
import { useState } from "react";
import { AddRequirementDialog } from "../../add-requirement-dialog";
import { DocumentReviewDialog } from "../../document-review-dialog";
import { TransactionDocumentStatusBadge } from "../../transaction-document-status-badge";

interface StageComplianceContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageComplianceContent({
  transaction,
  stage,
}: StageComplianceContentProps) {
  const [reviewDoc, setReviewDoc] = useState<TransactionDocumentSlotDto | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addParty, setAddParty] = useState<"BUYER" | "SELLER">("SELLER");

  const docs = transaction.requiredDocuments ?? [];
  const mandatoryDocs = docs.filter((d) => d.isMandatory);
  const approvedCount = mandatoryDocs.filter((d) => d.status === "APPROVED").length;
  const totalMandatory = mandatoryDocs.length;
  const isActive = stage.status === "ACTIVE";

  const canReview = ["DOCUMENTS_SUBMITTED", "COMPLIANCE_REVIEWED", "INITIATED"].includes(
    transaction.status,
  );

  return (
    <div className="space-y-4">
      {/* Progress summary */}
      {totalMandatory > 0 && (
        <div className="flex items-center gap-3">
          <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                approvedCount === totalMandatory ? "bg-green-500" : "bg-primary",
              )}
              style={{ width: `${(approvedCount / totalMandatory) * 100}%` }}
            />
          </div>
          <span className="text-muted-foreground shrink-0 text-xs">
            {approvedCount}/{totalMandatory} approved
          </span>
        </div>
      )}

      {/* Document list */}
      {docs.length > 0 && (
        <div className="space-y-1.5">
          {docs.map((doc) => {
            const isSubmitted = doc.status === "SUBMITTED";
            return (
              <div
                key={doc._id}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2",
                  isSubmitted && canReview && CALLOUT.amber,
                )}
              >
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="text-sm">{doc.name}</span>
                  <span className="text-muted-foreground text-[10px]">
                    ({doc.requiredFrom === "BUYER" ? "Buyer" : "Seller"})
                  </span>
                  {doc.isMandatory && (
                    <Badge variant="outline" className="text-[10px]">
                      Required
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <TransactionDocumentStatusBadge status={doc.status} />
                  {doc.submission?.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-1.5 text-[11px]"
                      asChild
                    >
                      <a href={doc.submission.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  )}
                  {isSubmitted && canReview && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 gap-1 text-[11px]"
                      onClick={() => setReviewDoc(doc)}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add requirement button */}
      {isActive && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => {
              setAddParty("BUYER");
              setIsAddOpen(true);
            }}
          >
            <Plus className="size-3" />
            Add Buyer Requirement
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => {
              setAddParty("SELLER");
              setIsAddOpen(true);
            }}
          >
            <Plus className="size-3" />
            Add Seller Requirement
          </Button>
        </div>
      )}

      <DocumentReviewDialog
        open={!!reviewDoc}
        onOpenChange={(open) => !open && setReviewDoc(null)}
        transactionId={transaction._id}
        document={reviewDoc}
      />

      <AddRequirementDialog
        transactionId={transaction._id}
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        defaultRequiredFrom={addParty}
      />
    </div>
  );
}
