import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";

interface TransactionFinancialsEscrowTimelineProps {
  escrowStatus: any;
}

export function TransactionFinancialsEscrowTimeline({
  escrowStatus,
}: TransactionFinancialsEscrowTimelineProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Fund Movement Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 text-sm">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <div className="space-y-0.5">
            <div className="font-medium">Deposit Confirmed</div>
            <div className="text-muted-foreground text-xs">
              Total Energies via Wire Transfer
            </div>
            <div className="text-muted-foreground text-xs">
              {formatDateTime(escrowStatus.lastActivity)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm opacity-60">
          <div className="bg-muted-foreground mt-0.5 h-2 w-2 shrink-0 rounded-full" />
          <div className="space-y-0.5">
            <div className="font-medium">Invoice Generated</div>
            <div className="text-muted-foreground text-xs">System Auto-Gen</div>
            <div className="text-muted-foreground text-xs">
              Oct 23, 2023 14:30
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
