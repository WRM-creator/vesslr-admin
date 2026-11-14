import type { TransactionResponseDto } from "@/lib/api/generated";
import {
  AlertTriangle,
  Ban,
  Banknote,
  CheckCircle2,
  Clock,
  Lock,
  RotateCcw,
} from "lucide-react";

/**
 * Where the buyer's money stands, derived once for every admin surface that
 * shows it, so the overview and the sidebar can never disagree.
 */
export type EscrowState =
  | "awaiting"
  | "depositReview"
  | "shortfall"
  | "secured"
  | "released"
  | "refunding"
  | "refunded"
  | "cancelled";

export function getEscrowState(
  transaction: Pick<
    TransactionResponseDto,
    "status" | "escrow" | "escrowFunding"
  >,
): EscrowState {
  // The escrow document is the source of truth once it exists; deriving from
  // transaction.status breaks on flow-specific statuses (rental, charter).
  const escrow = transaction.escrow;
  if (escrow) {
    switch (escrow.status) {
      case "RELEASED":
        return "released";
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "refunded";
      case "REFUND_PENDING":
        return "refunding";
      // FUNDED / RELEASE_PENDING — funds still in custody.
      default:
        return "secured";
    }
  }
  // No escrow yet: cancelled before funding, or still awaiting it.
  if (transaction.status === "CANCELLED") return "cancelled";
  // Deposit-led funding accumulates deposits under admin review before the
  // escrow exists; surface that review state instead of a bare "awaiting".
  const funding = transaction.escrowFunding;
  if (funding?.mode === "DEPOSIT_LED") {
    if (funding.state === "DEPOSIT_RECEIVED") return "depositReview";
    if (funding.state === "SHORTFALL_REPORTED") return "shortfall";
  }
  return "awaiting";
}

export const ESCROW_CONFIG: Record<
  EscrowState,
  { icon: typeof Clock; label: string; iconClass: string; badgeClass: string }
> = {
  awaiting: {
    icon: Clock,
    label: "Awaiting Funding",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  depositReview: {
    icon: Banknote,
    label: "Deposit under review",
    iconClass: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  shortfall: {
    icon: AlertTriangle,
    label: "Additional deposit required",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  secured: {
    icon: Lock,
    label: "Funds Secured",
    iconClass: "text-green-600",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
  released: {
    icon: CheckCircle2,
    label: "Released",
    iconClass: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  refunding: {
    icon: RotateCcw,
    label: "Refund in progress",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  refunded: {
    icon: RotateCcw,
    label: "Refunded",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  cancelled: {
    icon: Ban,
    label: "Not Funded",
    iconClass: "text-muted-foreground",
    badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  },
};
