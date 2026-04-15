import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import type {
  TransactionResponseDto,
  TransactionTaskActionDto,
  TransactionTaskDto,
} from "@/lib/api/generated";
import { useState } from "react";
import { ReleaseSettlementDialog } from "./release-settlement-dialog";

type AssignedTo = TransactionTaskDto["assignedTo"];

const ASSIGNED_TO_LABELS: Record<AssignedTo, string> = {
  BUYER: "Buyer",
  SELLER: "Seller",
  ADMIN: "Admin",
};

const ASSIGNED_TO_VARIANTS: Record<
  AssignedTo,
  "default" | "secondary" | "outline"
> = {
  BUYER: "default",
  SELLER: "secondary",
  ADMIN: "outline",
};

function AssignedToBadge({ assignedTo }: { assignedTo: AssignedTo }) {
  return (
    <Badge variant={ASSIGNED_TO_VARIANTS[assignedTo]}>
      {ASSIGNED_TO_LABELS[assignedTo]}
    </Badge>
  );
}

interface TransactionPendingTasksProps {
  transaction?: TransactionResponseDto;
  onAction?: (action: TransactionTaskActionDto) => void;
}

export function TransactionPendingTasks({
  transaction,
  onAction,
}: TransactionPendingTasksProps) {
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const tasks = transaction?.pendingTasks || [];

  const handleAction = (task: TransactionTaskDto) => {
    if (task.action?.target === "approve-settlement") {
      setIsSettlementOpen(true);
    } else {
      if (task.action) onAction?.(task.action);
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-6">
          <div className="flex size-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">No pending tasks</p>
            <p className="text-muted-foreground text-xs">
              All blockers have been resolved.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
        <CardDescription>
          Blockers preventing the transaction from progressing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {task.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AssignedToBadge assignedTo={task.assignedTo} />
                {task.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(task)}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <ReleaseSettlementDialog
        open={isSettlementOpen}
        onOpenChange={setIsSettlementOpen}
        transaction={transaction}
      />
    </Card>
  );
}
