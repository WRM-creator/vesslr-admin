import { Button } from "@/components/ui/button";
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
import { formatCurrency } from "@/lib/currency";

type ActionKey = "RELEASE" | "REFUND" | "ESCALATE" | "CUSTOM";

const ACTION_LABELS: Record<ActionKey, string> = {
  RELEASE: "Resolve & Resume Transaction",
  REFUND: "Cancel & Refund Buyer",
  ESCALATE: "Escalate Dispute",
  CUSTOM: "Custom Resolution",
};

interface DisputeResolutionDialogProps {
  selectedAction: ActionKey | null;
  notes: string;
  setNotes: (v: string) => void;
  customProceed: boolean;
  setCustomProceed: (v: boolean) => void;
  customRefund: number;
  setCustomRefund: (v: number) => void;
  amount: number;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DisputeResolutionDialog({
  selectedAction,
  notes,
  setNotes,
  customProceed,
  setCustomProceed,
  customRefund,
  setCustomRefund,
  amount,
  isPending,
  onConfirm,
  onCancel,
}: DisputeResolutionDialogProps) {
  return (
    <Dialog
      open={!!selectedAction}
      onOpenChange={(open) => !open && onCancel()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedAction ? ACTION_LABELS[selectedAction] : "Resolve Dispute"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {selectedAction === "CUSTOM" && (
            <>
              <div className="space-y-1.5">
                <Label>Transaction outcome</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={customProceed ? "default" : "outline"}
                    onClick={() => setCustomProceed(true)}
                  >
                    Proceed
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={!customProceed ? "default" : "outline"}
                    onClick={() => setCustomProceed(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  {customProceed
                    ? "Transaction resumes — remaining escrow is released to seller at completion."
                    : "Transaction is cancelled — remaining escrow is released to seller immediately."}
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Buyer refund{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <div>
                  <div className="relative">
                    <span className="text-muted-foreground absolute top-2.5 left-3 text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-6"
                      placeholder="0.00"
                      value={customRefund || ""}
                      onChange={(e) => {
                        const val = Number.parseFloat(e.target.value);
                        if (!Number.isNaN(val) && val >= 0 && val <= amount) {
                          setCustomRefund(val);
                        } else if (!e.target.value) {
                          setCustomRefund(0);
                        }
                      }}
                      min={0}
                      max={amount}
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">
                    This will be refunded to the buyer immediately.
                  </span>
                </div>
                {customRefund > 0 && (
                  <div className="flex justify-between border-t pt-2 text-sm">
                    <span className="text-muted-foreground">
                      Seller receives:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(amount - customRefund)}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Admin Decision Note (Required)</Label>
            <Textarea
              placeholder="Explain the reasoning for this decision..."
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!notes.trim() || isPending}>
            {isPending ? "Resolving..." : "Confirm Resolution"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
