import type { EscrowState } from "@/modules/transactions/lib/escrow-state";
import {
  AlertTriangle,
  Ban,
  Banknote,
  CheckCircle2,
  Clock,
  Lock,
  RotateCcw,
} from "lucide-react";

/** How each escrow state looks wherever admin shows it. */
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
