import { CardTitleText } from "@/components/shared/card-title-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { TransactionTaskDto } from "@/lib/api/generated";

interface TransactionPendingTasksProps {
  tasks?: TransactionTaskDto[];
  onAction?: (action: any) => void;
}

export function TransactionPendingTasks({
  tasks,
  onAction,
}: TransactionPendingTasksProps) {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitleText>Pending Tasks</CardTitleText>
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
                    {task.description} •{" "}
                    <span className="font-medium">
                      {/*TODO: Fix*/}
                      {task.assignedTo}
                    </span>
                  </p>
                </div>
              </div>
              {task.action && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction?.(task.action)}
                >
                  View
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
