import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function TransactionQQStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="shadow-none">
        <CardContent>
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-sm font-medium">
              Quantity Verified
            </span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">50,000 MT</div>
          <p className="text-muted-foreground text-xs">
            100% of ordered quantity
          </p>
          <Progress value={100} className="mt-3 h-2" />
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent>
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-sm font-medium">
              Quality Score
            </span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">Passed</div>
          <p className="text-muted-foreground text-xs">
            Meets all specifications
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              API Gravity: 34.5°
            </span>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Sulfur: 0.14%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardContent>
          <div className="flex items-center justify-between space-y-0 pb-2">
            <span className="text-muted-foreground text-sm font-medium">
              Discrepancies
            </span>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-muted-foreground text-xs">No issues reported</p>
        </CardContent>
      </Card>
    </div>
  );
}
