import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Download, XCircle } from "lucide-react";
import { useState } from "react";
import {
  type ComplianceDocumentStatus,
  TransactionComplianceBadge,
} from "./transaction-compliance-badge";
import { type ComplianceDocument } from "./transaction-compliance-table";

interface TransactionComplianceActionDialogProps {
  document: ComplianceDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (
    id: string,
    newStatus: ComplianceDocumentStatus,
    comment?: string,
  ) => void;
}

export function TransactionComplianceActionDialog({
  document,
  open,
  onOpenChange,
  onStatusChange,
}: TransactionComplianceActionDialogProps) {
  const [comment, setComment] = useState("");

  if (!document) return null;

  const handleAction = (status: ComplianceDocumentStatus) => {
    onStatusChange(document.id, status, comment);
    onOpenChange(false);
    setComment(""); // Reset comment
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{document.name}</DialogTitle>
          <DialogDescription>{document.requiredFor}</DialogDescription>
          <div className="flex w-full items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs font-normal capitalize"
                >
                  {document.type}
                </Badge>
                <TransactionComplianceBadge status={document.status} />
              </div>
            </div>

            {/* Download Action */}
            {document.status !== "pending" && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-auto"
                asChild
              >
                <a
                  href={document.fileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="mb-2 space-y-4">
          {/* Header Info */}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-medium">
                Uploaded By
              </span>
              <p className="font-medium">{document.uploadedBy || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-medium">
                Uploaded Date
              </span>
              <p className="font-medium">
                {document.uploadedDate?.toLocaleDateString() || "-"}
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-3">
            <div className="space-y-2">
              <span className="text-muted-foreground text-xs font-medium">
                Comment
              </span>
              <Textarea
                placeholder="Add a comment about your decision (optional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleAction("rejected")}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleAction("verified")}
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
