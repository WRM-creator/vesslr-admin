import { Separator } from "@/components/ui/separator";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/utils";
import { deriveSettlementFees } from "@/modules/transactions/lib/settlement-fees";
import { SettlementFeeLines } from "../../settlement-fee-lines";

interface StageSettlementContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

export function StageSettlementContent({
  transaction,
  stage,
}: StageSettlementContentProps) {
  const escrow = transaction.escrow;
  const fees = deriveSettlementFees(transaction);
  const { currency } = fees;
  const isReleased = stage.status === "COMPLETED";
  const isRefunding =
    escrow?.status === "REFUND_PENDING" || escrow?.status === "REFUNDED";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Seller Payout</span>
          <span className="font-medium text-green-600">
            {formatCurrency(fees.sellerPayout, currency)}
          </span>
        </div>
        <SettlementFeeLines fees={fees} rowClassName="text-muted-foreground text-sm" />
        {fees.platformRevenue > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vesslr total take</span>
            <span className="font-medium text-blue-600">
              {formatCurrency(fees.platformRevenue, currency)}
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

      {isRefunding ? (
        <p className="text-muted-foreground text-xs">
          The escrow was returned to the buyer. Nothing will be released to
          the seller.
        </p>
      ) : (
        !isReleased &&
        stage.status === "ACTIVE" && (
          <p className="text-muted-foreground text-xs">
            Use the action bar above to release funds to the seller.
          </p>
        )
      )}
    </div>
  );
}
