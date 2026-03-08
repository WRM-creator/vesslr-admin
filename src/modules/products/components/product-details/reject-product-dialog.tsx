import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface RejectProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function RejectProductDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: RejectProductDialogProps) {
  const [reason, setReason] = useState("");

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setReason("");
    onOpenChange(nextOpen);
  };

  const handleConfirm = () => {
    onConfirm(reason.trim());
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent onInteractOutside={() => handleClose(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Product</AlertDialogTitle>
          <AlertDialogDescription>
            Provide a reason so the merchant knows what to fix before
            resubmitting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          placeholder="Describe the issue with this product..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          disabled={isSubmitting}
        />
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isSubmitting}
            onClick={() => handleClose(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={reason.trim().length < 1 || isSubmitting}
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
