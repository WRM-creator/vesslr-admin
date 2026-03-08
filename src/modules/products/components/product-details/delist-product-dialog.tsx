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
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface DelistProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}

export function DelistProductDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DelistProductDialogProps) {
  const [reason, setReason] = useState("");

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setReason("");
    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent onInteractOutside={() => handleClose(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delist Product</AlertDialogTitle>
          <AlertDialogDescription>
            This product will be removed from the marketplace and will no longer
            be visible to buyers. Optionally provide a reason for internal
            reference.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          placeholder="Reason for delisting (optional)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
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
            onClick={() => onConfirm(reason.trim())}
            disabled={isSubmitting}
            className={buttonVariants({
              variant: "destructive-outline",
            })}
          >
            {isSubmitting ? <Spinner className="size-4" /> : "Delist"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
