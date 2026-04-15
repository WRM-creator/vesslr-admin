import { Separator } from "@/components/ui/separator";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/utils";

interface StageEscrowContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageEscrowContent({
  transaction,
  stage,
}: StageEscrowContentProps) {
  const order = transaction.order;
  const escrow = transaction.escrow;
  const currency = order?.currency || "USD";
  const goodsAmount = order?.totalAmount || 0;
  const serviceFeeAmount = order?.serviceFeeAmount ?? 0;
  const totalWithFee = order?.totalWithFee ?? goodsAmount + serviceFeeAmount;
  const isFunded = stage.status === "COMPLETED";

  const va = (transaction as any).virtualAccount as
    | { accountNumber: string; bankName: string }
    | undefined;
  const fundingEvent = transaction.events?.find(
    (e) => e.metadata?.newStatus === "ESCROW_FUNDED",
  );

  return (
    <div className="space-y-4">
      {/* Financial breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Goods Amount</span>
          <span className="font-medium">
            {formatCurrency(goodsAmount, currency)}
          </span>
        </div>
        {serviceFeeAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Service Fee (3%)</span>
            <span className="font-medium">
              {formatCurrency(serviceFeeAmount, currency)}
            </span>
          </div>
        )}
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Due from Buyer</span>
          <span className="font-semibold">
            {formatCurrency(totalWithFee, currency)}
          </span>
        </div>
      </div>

      {/* Virtual account info */}
      {va && (
        <div className="bg-muted/40 rounded-md border p-3">
          <p className="text-muted-foreground mb-1 text-[10px] font-medium uppercase tracking-wider">
            Virtual Account
          </p>
          <div className="flex items-center gap-4 text-sm">
            <code className="bg-background rounded px-1.5 py-0.5 font-mono text-xs">
              {va.accountNumber}
            </code>
            <span className="text-muted-foreground text-xs">{va.bankName}</span>
          </div>
        </div>
      )}

      {/* Funding details */}
      {isFunded && (
        <div className="space-y-2">
          {escrow?.referenceId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Provider Reference</span>
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                {escrow.referenceId}
              </code>
            </div>
          )}
          {fundingEvent && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Funded At</span>
              <span className="text-xs">
                {formatDateTime(fundingEvent.timestamp)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
