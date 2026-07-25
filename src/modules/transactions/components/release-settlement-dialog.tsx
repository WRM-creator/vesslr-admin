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
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import {
  deriveSettlementFees,
  ratePercentLabel,
} from "@/modules/transactions/lib/settlement-fees";
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
  const { mutate: releaseSettlement, isPending } =
    api.admin.transactions.releaseSettlement.useMutation();

  const handleRelease = () => {
    if (!transaction?._id) return;
    releaseSettlement(
      { path: { id: transaction._id } },
      {
        onSuccess: () => {
          toast.success("Settlement released successfully");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast.error("Failed to release settlement", {
            description: message,
          });
        },
      },
    );
  };

  if (!transaction) return null;

  const fees = deriveSettlementFees(transaction);
  const { currency } = fees;

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
              <span className="text-muted-foreground">Goods subtotal</span>
              <span className="font-medium">
                {formatCurrency(fees.goodsAmount, currency)}
              </span>
            </div>
            {fees.escrowFeeAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Escrow fee (buyer{ratePercentLabel(fees.escrowFeeRate)})
                </span>
                <span className="font-medium">
                  +{formatCurrency(fees.escrowFeeAmount, currency)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Escrow balance (buyer funded)
              </span>
              <span className="font-medium">
                {formatCurrency(fees.escrowHeld, currency)}
              </span>
            </div>
            {fees.serviceChargeAmount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Service charge (seller
                  {ratePercentLabel(fees.serviceChargeRate)})
                </span>
                <span className="font-medium">
                  −{formatCurrency(fees.serviceChargeAmount, currency)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Amount to Release to Seller</span>
              <span className="text-green-600">
                {formatCurrency(fees.sellerPayout, currency)}
              </span>
            </div>
            {fees.platformRevenue > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Vesslr total take</span>
                <span className="text-muted-foreground">
                  {formatCurrency(fees.platformRevenue, currency)}
                </span>
              </div>
            )}
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
