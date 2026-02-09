import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Flag,
  Lock,
  Undo2,
} from "lucide-react";
import { type ChangeEvent, useState } from "react";
import type { Dispute } from "./dispute-types";

interface DisputeResolutionProps {
  dispute: Dispute;
  escrowStatus: any;
}

export function DisputeResolution({
  dispute,
  escrowStatus,
}: DisputeResolutionProps) {
  const [selectedAction, setSelectedAction] = useState<
    "RELEASE" | "REFUND" | "SPLIT" | "ESCALATE" | null
  >(null);
  const [refundAmount, setRefundAmount] = useState(0);

  const handleRefundAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value);
    if (!Number.isNaN(val) && val <= dispute.amount) {
      setRefundAmount(val);
    }
  };

  const sellerAmount = dispute.amount - refundAmount;

  const actionTitle = {
    RELEASE: "Release to Seller",
    REFUND: "Refund to Buyer",
    SPLIT: "Split Settlement",
    ESCALATE: "Escalate Dispute",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <AlertTriangle className="h-4 w-4" />
          Resolution Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Escrow Status Context */}
        <div className="space-y-2 rounded-lg border bg-slate-50 p-4 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Escrow
            </span>
            <Badge
              variant="secondary"
              className="gap-1 text-[10px] font-normal"
            >
              <Lock className="h-3 w-3" />
              {escrowStatus.status.replace("_", " ")}
            </Badge>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">
              {formatCurrency(escrowStatus.lockedAmount)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Funds Secured
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-foreground size-fit"
            >
              View
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            size="lg"
            onClick={() => setSelectedAction("RELEASE")}
          >
            <CheckCircle2 className="h-4 w-4" />
            Release to Seller
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            size="lg"
            onClick={() => setSelectedAction("REFUND")}
          >
            <Undo2 className="h-4 w-4" />
            Refund to Buyer
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            size="lg"
            onClick={() => {
              setSelectedAction("SPLIT");
              setRefundAmount(dispute.amount / 2);
            }}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Split Settlement
          </Button>
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            size="lg"
            onClick={() => setSelectedAction("ESCALATE")}
          >
            <Flag className="h-4 w-4" />
            Escalate to Team
          </Button>
        </div>

        <Dialog
          open={!!selectedAction}
          onOpenChange={(open) => !open && setSelectedAction(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedAction
                  ? actionTitle[selectedAction]
                  : "Resolve Dispute"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              {selectedAction === "SPLIT" && (
                <div className="bg-muted/30 grid gap-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Split Allocation</h4>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Refund to Buyer</Label>
                      <div className="relative">
                        <span className="text-muted-foreground absolute top-2.5 left-3 text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          className="pl-6"
                          value={refundAmount}
                          onChange={handleRefundAmountChange}
                          max={dispute.amount}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between border-t pt-2 text-sm">
                      <span className="text-muted-foreground">
                        Seller Receives:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(sellerAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Admin Decision Note (Required)</Label>
                <Textarea
                  placeholder="Explain the reasoning for this decision..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAction(null)}>
                Cancel
              </Button>
              <Button>Confirm Resolution</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
