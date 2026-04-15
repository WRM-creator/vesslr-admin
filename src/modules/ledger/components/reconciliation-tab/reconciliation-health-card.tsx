import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  PlayIcon,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { ReconciliationRun } from "../../types";
import { getReconStatusVariant } from "../../utils";

interface ReconciliationHealthCardProps {
  latestRun: ReconciliationRun | null;
  unresolvedCount: number;
  isLoading?: boolean;
  onRunInternal?: () => void;
  onRunExternal?: () => void;
}

export function ReconciliationHealthCard({
  latestRun,
  unresolvedCount,
  isLoading,
  onRunInternal,
  onRunExternal,
}: ReconciliationHealthCardProps) {
  const statusInfo = latestRun
    ? getReconStatusVariant(latestRun.summary.status)
    : null;

  const HealthIcon =
    unresolvedCount > 0
      ? AlertTriangleIcon
      : latestRun?.summary.status === "CLEAN"
        ? CheckCircle2Icon
        : InfoIcon;

  const healthColor =
    unresolvedCount > 0
      ? "text-amber-500"
      : latestRun?.summary.status === "CLEAN"
        ? "text-green-500"
        : "text-blue-500";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center @2xl:justify-between">
          {/* Left — status */}
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ${healthColor}`}
            >
              <HealthIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">
                  Reconciliation Health
                </h3>
                {isLoading ? (
                  <Skeleton className="h-5 w-20" />
                ) : statusInfo ? (
                  <StatusBadge
                    status={statusInfo.label}
                    variant={statusInfo.variant}
                  />
                ) : (
                  <StatusBadge status="No Runs" variant="neutral" />
                )}
              </div>
              {isLoading ? (
                <Skeleton className="mt-1 h-4 w-64" />
              ) : latestRun ? (
                <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span>
                    Last run: {formatDateTime(latestRun.completedAt)}
                  </span>
                  <span>
                    {latestRun.summary.entriesChecked} entries checked
                  </span>
                  {unresolvedCount > 0 && (
                    <span className="font-medium text-amber-600">
                      {unresolvedCount} unresolved
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground mt-1 text-sm">
                  No reconciliation runs recorded yet.
                </p>
              )}
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRunInternal}
            >
              <PlayIcon className="mr-1.5 h-3.5 w-3.5" />
              Run Internal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRunExternal}
            >
              <PlayIcon className="mr-1.5 h-3.5 w-3.5" />
              Run External
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
