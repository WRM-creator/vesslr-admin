import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { TransactionDocumentSlotDto } from "@/lib/api/generated";
import { format } from "date-fns";
import { AlertCircle, Check, ExternalLink, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TransactionDocumentStatusBadge } from "./transaction-document-status-badge";

interface DocumentReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: TransactionDocumentSlotDto | null;
  onApprove: (documentId: string) => void;
  onReject: (documentId: string, reason: string) => void;
  isPending?: boolean;
}

export function DocumentReviewDialog({
  open,
  onOpenChange,
  document,
  onApprove,
  onReject,
  isPending = false,
}: DocumentReviewDialogProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);

  useEffect(() => {
    if (!isPending) {
      setPendingAction(null);
    }
  }, [isPending]);

  if (!document) return null;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsRejecting(false);
      setRejectionReason("");
      setPendingAction(null);
    }
    onOpenChange(newOpen);
  };

  const handleApprove = () => {
    setPendingAction("approve");
    onApprove(document._id);
    // Dialog closing is handled by parent on success
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    setPendingAction("reject");
    onReject(document._id, rejectionReason);
    // Dialog closing is handled by parent on success
    setIsRejecting(false);
    setRejectionReason("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Document</DialogTitle>
          <DialogDescription>
            Review the submitted document details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Details Card */}
          <div className="space-y-4 rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  {document.name}
                </h4>
                <p className="text-muted-foreground text-xs capitalize">
                  {document.type.replace(/_/g, " ").toLowerCase()} • Required
                  from {document.requiredFrom === "BUYER" ? "Buyer" : "Seller"}
                </p>
              </div>
              <TransactionDocumentStatusBadge status={document.status} />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Uploaded</span>
                <span className="font-medium">
                  {format(new Date(), "PPP")}{" "}
                  {/* TODO: Use actual submission date */}
                </span>
              </div>
              {document.submission?.url && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="ml-auto h-8 gap-2 border"
                  asChild
                >
                  <a
                    href={document.submission.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Document
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Rejection Form or Actions */}
          {isRejecting ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-destructive">
                  Reason for Rejection{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a clear reason for rejecting this document (e.g., incomplete information, illegible copy)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="border-destructive/20 focus-visible:ring-destructive/20 min-h-[100px]"
                />
              </div>
              <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
                <AlertCircle className="h-4 w-4" />
                This will notify the user to re-upload.
              </div>
            </div>
          ) : (
            <div className="bg-muted/10 rounded-md border p-4">
              <p className="text-muted-foreground mb-4 text-sm">
                Please verify that the document meets all compliance
                requirements before approving.
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleApprove}
                  disabled={isPending}
                >
                  {isPending && pendingAction === "approve" ? (
                    <>
                      <Spinner />
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive-outline"
                  onClick={() => setIsRejecting(true)}
                  disabled={isPending}
                >
                  {isPending && pendingAction === "reject" ? (
                    <>
                      <Spinner />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {isRejecting ? (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsRejecting(false)}
                disabled={isPending}
              >
                Back
              </Button>
              <Button
                variant="destructive-outline"
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isPending}
              >
                {isPending && <Spinner className="mr-2 h-4 w-4" />}
                Confirm Rejection
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
