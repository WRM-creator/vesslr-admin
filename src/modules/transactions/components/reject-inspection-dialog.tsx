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
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface RejectInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  stageId: string;
}

export function RejectInspectionDialog({
  open,
  onOpenChange,
  transactionId,
  stageId,
}: RejectInspectionDialogProps) {
  const [reason, setReason] = useState("");

  const { mutate: reviewInspection, isPending } =
    api.admin.transactions.reviewInspection.useMutation();

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setReason("");
    onOpenChange(isOpen);
  };

  const handleReject = () => {
    if (!reason.trim()) return;

    reviewInspection(
      {
        path: { id: transactionId, stageId },
        body: { decision: "REJECTED", rejectionReason: reason.trim() },
      },
      {
        onSuccess: () => {
          toast.success(
            "Inspection rejected. Buyer has been notified to re-upload.",
          );
          setReason("");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to reject inspection", {
            description: message,
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Inspection Documents</DialogTitle>
          <DialogDescription>
            Provide a reason for rejection. The buyer will be notified and asked
            to re-upload corrected documents.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="e.g. Sulfur content certificate is missing. Please upload the ASTM D4294 report."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          disabled={isPending}
        />

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => handleClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!reason.trim() || isPending}
          >
            {isPending ? "Rejecting..." : "Reject & Notify Buyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
