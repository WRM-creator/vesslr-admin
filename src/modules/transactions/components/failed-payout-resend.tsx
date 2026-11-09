import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { AlertCircle, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import {
  failedPayoutLabel,
  resendableFailure,
  resendMessage,
} from "./full-payout-resend";

/**
 * A full release or refund the provider FAILED. The API reversed it and the
 * escrow holds the money again; resending sends it as the next attempt under
 * a fresh reference.
 */
export function FailedPayoutResend({
  transaction,
}: {
  transaction: TransactionResponseDto;
}) {
  // Toasts live on the hook: the page refetches after the resend and may
  // remount this block, which would drop per-call callbacks.
  const resend = api.admin.transactions.resendPayout.useMutation({
    onSuccess: (res) =>
      toast.success(resendMessage(res?.kind ?? "release", res?.reference)),
    onError: (err) => toast.error(`Resend failed: ${(err as Error).message}`),
  });
  const failure = resendableFailure(transaction.escrow);
  if (!failure) return null;

  const handleResend = () => resend.mutate({ path: { id: transaction._id } });

  return (
    <div className="border-destructive/40 bg-destructive/5 flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
      <div className="min-w-0 space-y-0.5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="text-destructive size-4 shrink-0" />
          {failedPayoutLabel(failure.kind)} failed
        </p>
        <p className="text-muted-foreground text-xs">
          {failure.cause === "refused"
            ? `The payment provider refused attempt ${failure.attempt} on ${formatDateTime(failure.failedAt)}. Nothing left the escrow.`
            : `The payment provider failed attempt ${failure.attempt} on ${formatDateTime(failure.failedAt)}. It was reversed and the escrow holds the money again.`}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleResend}
        disabled={resend.isPending}
      >
        {resend.isPending ? (
          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
        ) : (
          <RotateCw className="mr-1.5 size-3.5" />
        )}
        Resend payout
      </Button>
    </div>
  );
}
