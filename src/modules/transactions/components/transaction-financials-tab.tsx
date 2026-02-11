import type { TransactionResponseDto } from "@/lib/api/generated";
import { TransactionFinancialsCard } from "./transaction-financials-card";
import { TransactionPaymentLogs } from "./transaction-payment-logs";

interface TransactionFinancialsTabProps {
  transaction: TransactionResponseDto;
}

export function TransactionFinancialsTab({
  transaction,
}: TransactionFinancialsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Column 1: Financial Details (2/3 width on large screens) */}
      <div className="space-y-4 lg:col-span-2">
        <TransactionFinancialsCard transaction={transaction} />
      </div>

      {/* Column 2: Payment Logs (1/3 width) */}
      <div className="space-y-4">
        <TransactionPaymentLogs />
      </div>
    </div>
  );
}
