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

interface ApproveProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ApproveProductDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: ApproveProductDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onInteractOutside={() => onOpenChange(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Product</AlertDialogTitle>
          <AlertDialogDescription>
            This product will become visible to buyers on the marketplace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="size-4" /> : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
