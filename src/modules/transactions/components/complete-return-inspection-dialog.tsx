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

interface CompleteReturnInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  stageId: string;
}

export function CompleteReturnInspectionDialog({
  open,
  onOpenChange,
  transactionId,
  stageId,
}: CompleteReturnInspectionDialogProps) {
  const [notes, setNotes] = useState("");

  const { mutate: completeReturnInspection, isPending } =
    api.admin.transactions.completeReturnInspection.useMutation();

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setNotes("");
    onOpenChange(isOpen);
  };

  const handleComplete = () => {
    completeReturnInspection(
      {
        path: { id: transactionId, stageId },
        body: notes.trim() ? { notes: notes.trim() } : {},
      },
      {
        onSuccess: () => {
          toast.success(
            "Return inspection completed. The transaction is ready for settlement.",
          );
          setNotes("");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to complete return inspection", {
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
          <DialogTitle>Complete Return Inspection</DialogTitle>
          <DialogDescription>
            Confirm the returned asset has been inspected and is in acceptable
            condition. This advances the transaction to settlement and cannot be
            undone. If you found damage or a discrepancy, raise a dispute
            instead.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Optional notes on the condition of the returned asset."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
          <Button onClick={handleComplete} disabled={isPending}>
            {isPending ? "Completing..." : "Complete Inspection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
