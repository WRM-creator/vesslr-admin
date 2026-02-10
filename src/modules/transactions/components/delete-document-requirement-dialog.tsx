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
import { api } from "@/lib/api";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DeleteDocumentRequirementDialogProps {
  transactionId: string;
  document: any; // Using any to match TransactionDocumentSlotDto with possible _id
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteDocumentRequirementDialog({
  transactionId,
  document,
  open,
  onOpenChange,
  onSuccess,
}: DeleteDocumentRequirementDialogProps) {
  const {
    mutate: deleteRequirement,
    isPending,
    error,
    isError,
    reset,
  } = api.admin.transactions.deleteRequirement.useMutation({
    onSuccess: () => {
      toast.success("Requirement deleted successfully");
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (err) => {
      console.error("Failed to delete requirement:", err);
      // We don't close the dialog here, allowing the error to be displayed
    },
  });

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent automatic closing if AlertDialogAction behaves like a button
    if (document?._id) {
      deleteRequirement({
        path: { id: transactionId, requirementId: document._id },
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset(); // Clear errors when closing
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            document requirement for{" "}
            <span className="font-semibold">{document?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isError && (
          <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
            <AlertCircle className="h-4 w-4" />
            <p>
              {(error as any)?.body?.message ||
                "Failed to delete requirement. Please try again."}
            </p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive-outline" })}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
