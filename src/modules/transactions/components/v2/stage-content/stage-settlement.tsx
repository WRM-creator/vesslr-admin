import { Separator } from "@/components/ui/separator";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { formatDateTime } from "@/lib/utils";
import {
  deriveSettlementFees,
  ratePercentLabel,
} from "@/modules/transactions/lib/settlement-fees";

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

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Seller Payout</span>
          <span className="font-medium text-green-600">
            {formatCurrency(fees.sellerPayout, currency)}
          </span>
        </div>
        {fees.escrowFeeAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Escrow fee (buyer{ratePercentLabel(fees.escrowFeeRate)})
            </span>
            <span className="font-medium">
              {formatCurrency(fees.escrowFeeAmount, currency)}
            </span>
          </div>
        )}
        {fees.serviceChargeAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Service charge (seller{ratePercentLabel(fees.serviceChargeRate)})
            </span>
            <span className="font-medium">
              {formatCurrency(fees.serviceChargeAmount, currency)}
            </span>
          </div>
        )}
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

      {!isReleased && stage.status === "ACTIVE" && (
        <p className="text-muted-foreground text-xs">
          Use the action bar above to release funds to the seller.
        </p>
      )}
    </div>
  );
}
