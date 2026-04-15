import { Separator } from "@/components/ui/separator";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/utils";

interface StageSettlementContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageSettlementContent({
  transaction,
  stage,
}: StageSettlementContentProps) {
  const escrow = transaction.escrow;
  const currency = escrow?.currency || transaction.order?.currency || "USD";
  const sellerAmount =
    escrow?.sellerAmount ?? transaction.order?.totalAmount ?? 0;
  const serviceFeeAmount = escrow?.serviceFeeAmount ?? 0;
  const isReleased = stage.status === "COMPLETED";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Seller Payout</span>
          <span className="font-medium text-green-600">
            {formatCurrency(sellerAmount, currency)}
          </span>
        </div>
        {serviceFeeAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Platform Revenue</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(serviceFeeAmount, currency)}
            </span>
          </div>
        )}
      </div>

      {isReleased && escrow?.releasedAt && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Released At</span>
            <span className="text-xs">{formatDateTime(escrow.releasedAt)}</span>
          </div>
        </>
      )}

      {!isReleased && stage.status === "ACTIVE" && (
        <p className="text-muted-foreground text-xs">
          Use the action bar above to release funds to the seller.
        </p>
      )}
    </div>
  );
}
