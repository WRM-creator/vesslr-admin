import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  type TransactionResponseDto,
  adminTransactionsControllerReleaseSettlement,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReleaseSettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionResponseDto;
  onSuccess?: () => void;
}

export function ReleaseSettlementDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: ReleaseSettlementDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: releaseSettlement, isPending } = useMutation({
    mutationFn: (data: { id: string }) =>
      adminTransactionsControllerReleaseSettlement({
        path: { id: data.id },
      }),
    onSuccess: () => {
      toast.success("Settlement released successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to release settlement", {
        description: error.message,
      });
    },
  });

  const handleRelease = () => {
    if (!transaction?._id) return;
    releaseSettlement({ id: transaction._id });
  };

  if (!transaction) return null;

  const currency = transaction.escrow?.currency || transaction.order.currency || "USD";
  const escrowAmount = transaction.escrow?.amount || 0;
  const totalAmount = transaction.order.totalAmount || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Settlement Release</DialogTitle>
          <DialogDescription>
            This action will release the escrowed funds to the seller and close
            the transaction. Please verify the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 rounded-md border p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Total Transaction Value
              </span>
              <span className="font-medium">
                {formatCurrency(totalAmount, currency)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Amount to Release</span>
              <span className="text-green-600">
                {formatCurrency(escrowAmount, currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            By clicking "Release Funds", you confirm that all delivery
            conditions have been met and authorize the immediate transfer of
            funds. This action cannot be undone.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleRelease} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 />
                Release Funds
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
