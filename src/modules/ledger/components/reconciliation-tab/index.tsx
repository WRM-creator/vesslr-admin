import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ReconciliationRun } from "../../types";
import { ReconciliationHealthCard } from "./reconciliation-health-card";
import { RunsTable } from "./runs-table";
import { getDiscrepancyIssueLabel } from "../../utils";

interface ReconciliationTabProps {
  runs: ReconciliationRun[];
  isLoading?: boolean;
  onRunInternal?: () => void;
  onRunExternal?: () => void;
}

export function ReconciliationTab({
  runs,
  isLoading,
  onRunInternal,
  onRunExternal,
}: ReconciliationTabProps) {
  const latestRun = runs.length > 0 ? runs[0] : null;

  // Count all unresolved discrepancies across all runs
  const unresolvedCount = runs.reduce(
    (count, run) =>
      count + run.discrepancies.filter((d) => !d.resolved).length,
    0,
  );

  // Collect unresolved discrepancies for the active issues section
  const unresolvedDiscrepancies = runs.flatMap((run) =>
    run.discrepancies
      .filter((d) => !d.resolved)
      .map((d) => ({ ...d, runId: run._id, runDate: run.runDate })),
  );

  return (
    <div className="space-y-6">
      <ReconciliationHealthCard
        latestRun={latestRun}
        unresolvedCount={unresolvedCount}
        isLoading={isLoading}
        onRunInternal={onRunInternal}
        onRunExternal={onRunExternal}
      />

      {/* Active discrepancies card */}
      {unresolvedDiscrepancies.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Unresolved Discrepancies
              <StatusBadge
                status={`${unresolvedDiscrepancies.length} issues`}
                variant="warning"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unresolvedDiscrepancies.map((d, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md border bg-amber-50/50 p-3"
              >
                <StatusBadge
                  status={getDiscrepancyIssueLabel(d.issue)}
                  variant={d.issue === "UNRESOLVABLE" ? "danger" : "warning"}
                />
                <div className="flex-1 space-y-1">
                  <span className="text-sm font-medium">
                    {d.entityType}: {d.entityId}
                  </span>
                  <p className="text-muted-foreground text-sm">{d.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <RunsTable data={runs} isLoading={isLoading} />
    </div>
  );
}
