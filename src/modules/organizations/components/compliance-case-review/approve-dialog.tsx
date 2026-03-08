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

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  reviewType: "KYB" | "KYC";
}

const APPROVE_COPY = {
  KYB: {
    title: "Approve Business Verification",
    description:
      "Are you sure you want to approve this organization's business verification?",
  },
  KYC: {
    title: "Approve Identity Verification",
    description:
      "Are you sure you want to approve this user's identity verification?",
  },
};

export function ApproveDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
  reviewType,
}: ApproveDialogProps) {
  const copy = APPROVE_COPY[reviewType];
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent onInteractOutside={() => onOpenChange(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.description}</AlertDialogDescription>
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
