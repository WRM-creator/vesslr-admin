import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ActionCard } from "./action-card";
import { useAdminPendingActions } from "../hooks/use-admin-pending-actions";

export function AdminActionCenter() {
  const { actions, isLoading } = useAdminPendingActions();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-medium">
          Needs attention
        </h3>
        <span className="text-muted-foreground text-xs">
          {actions.length} pending
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onClick={() => navigate(action.route)}
          />
        ))}
      </div>
    </div>
  );
}
