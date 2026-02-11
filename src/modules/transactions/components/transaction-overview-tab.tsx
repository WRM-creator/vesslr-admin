import type { TransactionResponseDto } from "@/lib/api/generated";
import { TransactionPendingTasks } from "./transaction-pending-tasks";
import { TransactionRecentActivity } from "./transaction-recent-activity";

interface TransactionOverviewTabProps {
  transaction: TransactionResponseDto;
  onAction?: (action: any) => void;
}

export function TransactionOverviewTab({
  transaction,
  onAction,
}: TransactionOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Column 1: Dashboard & Pending Tasks (2/3 width on large screens) */}
      <div className="space-y-4 md:col-span-2">
        {/* <TransactionAttentionNeeded /> -- Redundant with Pending Tasks card */}
        <TransactionPendingTasks
          transaction={transaction}
          onAction={onAction}
        />
      </div>

      {/* Column 2: Activity & Quick Actions (1/3 width) */}
      <div className="space-y-4">
        <TransactionRecentActivity />
      </div>
    </div>
  );
}
