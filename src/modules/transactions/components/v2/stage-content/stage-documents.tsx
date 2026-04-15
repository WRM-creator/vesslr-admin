import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { ExternalLink, FileText } from "lucide-react";
import { TransactionDocumentStatusBadge } from "../../transaction-document-status-badge";

interface StageDocumentsContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageDocumentsContent({
  transaction,
}: StageDocumentsContentProps) {
  const docs = transaction.requiredDocuments ?? [];

  if (docs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No documents have been required for this transaction yet.
      </p>
    );
  }

  const buyerDocs = docs.filter((d) => d.requiredFrom === "BUYER");
  const sellerDocs = docs.filter((d) => d.requiredFrom === "SELLER");

  const renderDocList = (
    partyDocs: typeof docs,
    label: string,
  ) => {
    if (partyDocs.length === 0) return null;
    return (
      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
          {label}
        </p>
        {partyDocs.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground size-3.5 shrink-0" />
              <span className="text-sm">{doc.name}</span>
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
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderDocList(buyerDocs, "Buyer Documents")}
      {renderDocList(sellerDocs, "Seller Documents")}
    </div>
  );
}
