import { formatCurrency } from "@/lib/currency";
import {
  ratePercentLabel,
  type SettlementFees,
} from "@/modules/transactions/lib/settlement-fees";

/**
 * The platform take as its two fees, or as one combined line when the take
 * cannot be split reliably (a legacy escrow in other units, or a deposit).
 */
export function SettlementFeeLines({
  fees,
  rowClassName,
}: {
  fees: SettlementFees;
  rowClassName: string;
}) {
  const { currency, split } = fees;
  const Row = ({ label, amount }: { label: string; amount: number }) => (
    <div className="flex items-center justify-between">
      <span className={rowClassName}>{label}</span>
      <span className={`${rowClassName} font-medium`}>
        {formatCurrency(amount, currency)}
      </span>
    </div>
  );

  if (!split) {
    return fees.platformRevenue > 0 ? (
      <Row label="Escrow fee and service charge" amount={fees.platformRevenue} />
    ) : null;
  }
  return (
    <>
      {split.escrowFeeAmount > 0 && (
        <Row
          label={`Escrow fee, buyer${ratePercentLabel(split.escrowFeeRate)}`}
          amount={split.escrowFeeAmount}
        />
      )}
      {split.serviceChargeAmount > 0 && (
        <Row
          label={`Service charge, seller${ratePercentLabel(split.serviceChargeRate)}`}
          amount={split.serviceChargeAmount}
        />
      )}
    </>
  );
}
