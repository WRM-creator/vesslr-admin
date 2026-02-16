import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function TransactionAttentionNeeded() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attention Needed</CardTitle>
        <CardDescription>
          Items requiring your immediate attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center pb-6 text-center">
          <CheckCircle2
            className="text-muted-foreground/70 mb-3 size-8"
            strokeWidth={1}
          />
          <h3 className="text-sm font-medium">All caught up</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            There are no pending actions for you at this time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
