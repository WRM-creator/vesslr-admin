import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

interface TransactionFinancialsEscrowStatusProps {
  escrowStatus: any;
}

export function TransactionFinancialsEscrowStatus({
  escrowStatus,
}: TransactionFinancialsEscrowStatusProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent>
        <div className="flex w-full items-start justify-between">
          <div className="space-y-2">
            <div className="text-muted-foreground text-sm">
              Current Balance Held
            </div>
            <div className="text-foreground text-3xl font-bold">
              {formatCurrency(escrowStatus.lockedAmount)}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Fully Funded
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-end gap-2">
              <Badge variant="secondary">
                <Lock className="h-3.5 w-3.5" />
                {escrowStatus.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="text-muted-foreground text-xs">
              Since {formatDateTime(escrowStatus.lastActivity)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
