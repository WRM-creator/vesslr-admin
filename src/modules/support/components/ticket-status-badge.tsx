import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  },
  awaiting_user: {
    label: "Awaiting User",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  awaiting_admin: {
    label: "Awaiting Admin",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  high: {
    label: "High",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

const categoryConfig: Record<string, string> = {
  account: "Account",
  onboarding: "Onboarding",
  billing: "Billing",
  transactions: "Transactions",
  products: "Products",
  technical: "Technical",
  feature_request: "Feature Request",
  other: "Other",
};

interface TicketStatusBadgeProps {
  status: string;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface TicketPriorityBadgeProps {
  priority: string;
  className?: string;
}

export function TicketPriorityBadge({ priority, className }: TicketPriorityBadgeProps) {
  const config = priorityConfig[priority] || {
    label: priority,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface TicketCategoryBadgeProps {
  category: string;
  className?: string;
}

export function TicketCategoryBadge({ category, className }: TicketCategoryBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      {categoryConfig[category] || category}
    </Badge>
  );
}
