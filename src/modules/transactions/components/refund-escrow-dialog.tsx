import { useState } from "react";
import { AlertCircle, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";

const MIN_REASON = 5;

/** The API's error arrives as the parsed body, not an Error. */
function errorMessage(err: unknown): string {
  const message = (err as { message?: string | string[] })?.message;
  if (Array.isArray(message)) return message.join("; ");
  return message || "Request failed";
}

interface RefundEscrowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionResponseDto;
}

export function RefundEscrowDialog({
  open,
  onOpenChange,
  transaction,
}: RefundEscrowDialogProps) {
  const [reason, setReason] = useState("");
  const { mutate: refundEscrow, isPending } =
    api.admin.transactions.refundEscrow.useMutation();

  const escrow = transaction.escrow;
  if (!escrow) return null;
  const amount = formatCurrency(escrow.amount, escrow.currency);
  const buyerName = transaction.order?.buyerOrganization?.name || "the buyer";
  const trimmed = reason.trim();

  const handleRefund = () => {
    if (!transaction._id || trimmed.length < MIN_REASON) return;
    refundEscrow(
      { path: { id: transaction._id }, body: { reason: trimmed } },
      {
        onSuccess: () => {
          toast.success("Refund sent", {
            description: `${amount} is on its way to ${buyerName}'s wallet.`,
          });
          setReason("");
          onOpenChange(false);
        },
        onError: (error: unknown) => {
          toast.error("Refund not sent", { description: errorMessage(error) });
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund escrow to buyer</DialogTitle>
          <DialogDescription>
            Returns everything held in escrow to {buyerName}'s wallet and
            closes the transaction as refunded. The seller receives nothing.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 rounded-md border p-4 text-center">
          <p className="text-muted-foreground text-xs">Refund to buyer</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {amount}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refund-reason">Reason</Label>
          <Textarea
            id="refund-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this escrow being refunded?"
            maxLength={500}
            rows={3}
            disabled={isPending}
          />
          <p className="text-muted-foreground text-xs">
            Kept on the transaction log for admins. Neither party sees it.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            Both parties are told the transaction was cancelled. This can't be
            undone.
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
          <Button
            variant="destructive"
            onClick={handleRefund}
            disabled={isPending || trimmed.length < MIN_REASON}
          >
            {isPending ? (
              <>
                <Spinner />
                Refunding...
              </>
            ) : (
              <>
                <Undo2 />
                Refund {amount}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
