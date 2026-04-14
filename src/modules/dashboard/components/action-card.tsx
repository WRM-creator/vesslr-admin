import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { AdminPendingAction } from "../hooks/use-admin-pending-actions";

interface ActionCardProps {
  action: AdminPendingAction;
  onClick: () => void;
}

const priorityTint: Record<AdminPendingAction["priority"], string> = {
  1: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  2: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  3: "bg-primary/10 text-primary",
};

const priorityLabel: Record<AdminPendingAction["priority"], string> = {
  1: "Urgent",
  2: "Follow up",
  3: "When ready",
};

export const ActionCard = ({ action, onClick }: ActionCardProps) => {
  const { icon: Icon, priority, title, description, ctaLabel } = action;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group border-border/60 bg-card hover:border-primary/30 relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            priorityTint[priority],
          )}
        >
          <Icon className="size-4" />
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
            priorityTint[priority],
          )}
        >
          {priorityLabel[priority]}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h6 className="text-foreground text-sm font-semibold">{title}</h6>
        <p className="text-muted-foreground line-clamp-2 text-xs">
          {description}
        </p>
      </div>
      <div className="text-primary mt-auto inline-flex items-center gap-1 text-xs font-medium">
        {ctaLabel}
        <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
      </div>
    </button>
  );
};
