import type { TransactionResponseDto } from "@/lib/api/generated";
import { TransactionLogisticsCard } from "./transaction-logistics-card";
import { TransactionLogisticsEvents } from "./transaction-logistics-events";

interface TransactionLogisticsTabProps {
  transaction: TransactionResponseDto;
}

export function TransactionLogisticsTab({
  transaction,
}: TransactionLogisticsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Column 1: Logistics Details (2/3 width on large screens) */}
      <div className="space-y-4 lg:col-span-2">
        <TransactionLogisticsCard transaction={transaction} />
      </div>

      {/* Column 2: Logistics Events (1/3 width) */}
      <div className="space-y-4">
        <TransactionLogisticsEvents transaction={transaction} />
      </div>
    </div>
  );
}
