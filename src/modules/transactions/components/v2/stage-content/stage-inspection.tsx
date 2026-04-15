import { Badge } from "@/components/ui/badge";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Building2, ExternalLink, FileCheck, FileText } from "lucide-react";

interface StageInspectionContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageInspectionContent({
  transaction,
  stage,
}: StageInspectionContentProps) {
  const metadata = stage.metadata as Record<string, unknown> | undefined;
  const qqCompany = metadata?.qqCompany as string | null | undefined;
  const qqCriteria = (metadata?.qqCriteria as Record<string, unknown>[]) ?? [];
  const submittedDocuments =
    (metadata?.submittedDocuments as { name: string; url: string }[]) ?? [];
  const inspectionReview = metadata?.inspectionReview as
    | { status: string; rejectionReason?: string | null; reviewedAt?: string }
    | undefined;

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

      {/* Review outcome */}
      {inspectionReview && (
        <div className="bg-muted/40 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium">Review Decision:</p>
            <Badge
              variant="outline"
              className={
                inspectionReview.status === "APPROVED"
                  ? "border-green-500 text-green-700"
                  : inspectionReview.status === "REJECTED"
                    ? "border-red-500 text-red-700"
                    : "text-muted-foreground"
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
