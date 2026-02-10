import { CardTitleText } from "@/components/shared/card-title-text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export function TransactionPendingTasks() {
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
          <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                1
              </div>
              <div>
                <p className="font-medium">Waiting for Insurance Certificate</p>
                <p className="text-muted-foreground text-sm">
                  Assigned to Seller • Due Today
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Remind
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                2
              </div>
              <div>
                <p className="font-medium">Verify Pro-forma Invoice</p>
                <p className="text-muted-foreground text-sm">
                  Assigned to Admin • Overdue
                </p>
              </div>
            </div>
            <Button size="sm">Review</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
