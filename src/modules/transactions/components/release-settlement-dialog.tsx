import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import {
  deriveSettlementFees,
  ratePercentLabel,
} from "@/modules/transactions/lib/settlement-fees";
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
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
          {/* Anchor: the pool being distributed. */}
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Held in escrow</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCurrency(fees.escrowHeld, currency)}
            </p>
          </div>

          <Separator className="my-3" />

          {/* The split: seller payout dominant, platform fee muted. Together
              they reconcile to the escrow balance above. */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Release to seller</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(fees.sellerPayout, currency)}
              </span>
            </div>
            {fees.platformRevenue > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Vesslr fee</span>
                <span className="text-muted-foreground text-sm font-medium">
                  {formatCurrency(fees.platformRevenue, currency)}
                </span>
              </div>
            )}
          </div>

          {/* Progressive disclosure: the goods/fee derivation, collapsed. */}
          {(fees.escrowFeeAmount > 0 || fees.serviceChargeAmount > 0) && (
            <Collapsible className="mt-3">
              <CollapsibleTrigger className="text-muted-foreground hover:text-foreground group flex w-full items-center gap-1 text-xs">
                <ChevronRight className="size-3 transition-transform group-data-[state=open]:rotate-90" />
                Breakdown
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Goods subtotal</span>
                  <span>{formatCurrency(fees.goodsAmount, currency)}</span>
                </div>
                {fees.escrowFeeAmount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Escrow fee (buyer{ratePercentLabel(fees.escrowFeeRate)})
                    </span>
                    <span>+{formatCurrency(fees.escrowFeeAmount, currency)}</span>
                  </div>
                )}
                {fees.serviceChargeAmount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Service charge (seller
                      {ratePercentLabel(fees.serviceChargeRate)})
                    </span>
                    <span>
                      −{formatCurrency(fees.serviceChargeAmount, currency)}
                    </span>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
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
