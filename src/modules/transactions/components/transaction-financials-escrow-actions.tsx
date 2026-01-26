import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Unlock } from "lucide-react";

interface TransactionFinancialsEscrowActionsProps {
  escrowStatus: any;
}

export function TransactionFinancialsEscrowActions({
  escrowStatus,
}: TransactionFinancialsEscrowActionsProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Settlement Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="mb-2 rounded-md bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
          <strong>Note:</strong> Release is currently blocked pending Quality &
          Quantity (Q&Q) results upload.
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="flex-1 gap-2"
            disabled={!escrowStatus.releaseReady}
          >
            <Unlock className="h-4 w-4" />
            Release Funds to Vendor
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive flex-1 gap-2"
          >
            Initiate Refund
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
