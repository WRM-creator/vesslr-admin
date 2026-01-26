import { TransactionFinancialsEscrowActions } from "./transaction-financials-escrow-actions";
import { TransactionFinancialsEscrowStatus } from "./transaction-financials-escrow-status";
import { TransactionFinancialsEscrowTimeline } from "./transaction-financials-escrow-timeline";

interface TransactionFinancialsEscrowProps {
  escrowStatus: any;
}

export function TransactionFinancialsEscrow({
  escrowStatus,
}: TransactionFinancialsEscrowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* LEFT COLUMN: Status & Timeline (2/3 width) */}
      <div className="space-y-4 lg:col-span-2">
        <TransactionFinancialsEscrowStatus escrowStatus={escrowStatus} />
        <TransactionFinancialsEscrowActions escrowStatus={escrowStatus} />
      </div>

      {/* RIGHT COLUMN: Actions (1/3 width) */}
      <div className="space-y-4">
        <TransactionFinancialsEscrowTimeline escrowStatus={escrowStatus} />
      </div>
    </div>
  );
}
