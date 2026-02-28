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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRightLeft,
  CheckCircle2,
  ChevronDown,
  Flag,
  Lock,
  Undo2,
} from "lucide-react";
import { type ChangeEvent, useState } from "react";

interface DisputeResolutionProps {
  dispute: AdminDisputeResponseDto;
  escrowStatus: any;
  amount: number;
  onResolved?: () => void;
}

type ActionKey = "RELEASE" | "REFUND" | "SPLIT" | "ESCALATE";

const ACTION_LABELS: Record<ActionKey, string> = {
  RELEASE: "Release to Seller",
  REFUND: "Refund to Buyer",
  SPLIT: "Split Settlement",
  ESCALATE: "Escalate Dispute",
};

export function DisputeResolution({
  dispute,
  escrowStatus,
  amount,
  onResolved,
}: DisputeResolutionProps) {
  const [selectedAction, setSelectedAction] = useState<ActionKey | null>(null);
  const [refundAmount, setRefundAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const resolveMutation = api.admin.disputes.resolve.useMutation();

  const handleConfirm = () => {
    if (!selectedAction || !notes.trim()) return;

    let outcome: "PROCEED" | "CANCELLED" | "PARTIAL_REFUND" | "ESCALATED";
    switch (selectedAction) {
      case "RELEASE":
        outcome = "PROCEED";
        break;
      case "REFUND":
        outcome = "CANCELLED";
        break;
      case "SPLIT":
        outcome = "PARTIAL_REFUND";
        break;
      case "ESCALATE":
        outcome = "ESCALATED";
        break;
      default:
        return;
    }

    resolveMutation.mutate(
      {
        path: { id: dispute._id },
        body: {
          outcome,
          notes,
          metadata:
            selectedAction === "SPLIT"
              ? { buyerRefundAmount: refundAmount }
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setSelectedAction(null);
          setNotes("");
          onResolved?.();
        },
        onError: (error: any) => {
          console.error("Failed to resolve dispute:", error);
        },
      },
    );
  };

  const handleRefundAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value);
    if (!Number.isNaN(val) && val <= amount) {
      setRefundAmount(val);
    }
  };

  const sellerAmount = amount - refundAmount;

  const isResolved = !!dispute.resolution;

  return (
    <>
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle>Resolution Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Escrow status — compact */}
          <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Lock className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-xs font-medium">
                Escrow
              </span>
              <Badge
                variant="secondary"
                className="gap-1 text-[10px] font-normal"
              >
                {escrowStatus.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-semibold">
                {formatCurrency(escrowStatus.lockedAmount)}
              </span>
            </div>
          </div>

          {isResolved ? (
            <ResolvedSummary dispute={dispute} />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Take Action
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem
                  onClick={() => setSelectedAction("RELEASE")}
                  className="flex-col items-start gap-0.5"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & Release to Seller
                  </div>
                  <p className="text-muted-foreground pl-6 text-xs">
                    Dispute ruled in seller's favour — release escrowed funds
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedAction("REFUND")}
                  className="flex-col items-start gap-0.5"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Undo2 className="h-4 w-4" />
                    Cancel & Refund Buyer
                  </div>
                  <p className="text-muted-foreground pl-6 text-xs">
                    Dispute ruled in buyer's favour — return full amount
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedAction("SPLIT");
                    setRefundAmount(amount / 2);
                  }}
                  className="flex-col items-start gap-0.5"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <ArrowRightLeft className="h-4 w-4" />
                    Split Settlement
                  </div>
                  <p className="text-muted-foreground pl-6 text-xs">
                    Divide funds between buyer and seller
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedAction("ESCALATE")}
                  className="text-destructive focus:text-destructive flex-col items-start gap-0.5"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <Flag className="h-4 w-4" />
                    Escalate Dispute
                  </div>
                  <p className="text-destructive/70 pl-6 text-xs">
                    Refer to a senior admin for further review
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedAction}
        onOpenChange={(open) => !open && setSelectedAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction
                ? ACTION_LABELS[selectedAction]
                : "Resolve Dispute"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {selectedAction === "SPLIT" && (
              <div className="bg-muted/30 grid gap-4 rounded-lg border p-4">
                <h4 className="text-sm font-semibold">Split Allocation</h4>
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
                      max={amount}
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
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
              disabled={resolveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!notes.trim() || resolveMutation.isPending}
            >
              {resolveMutation.isPending
                ? "Resolving..."
                : "Confirm Resolution"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResolvedSummary({ dispute }: { dispute: AdminDisputeResponseDto }) {
  const resolution = dispute.resolution!;

  const outcomeLabel: Record<string, string> = {
    PROCEED: "Released to Seller",
    CANCELLED: "Refunded to Buyer",
    PARTIAL_REFUND: "Split Settlement",
    RE_INSPECT: "Re-inspect",
    MUTUAL_SETTLEMENT: "Mutual Settlement",
    ESCALATED: "Escalated",
  };

  return (
    <div className="space-y-2 rounded-md border p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Outcome</span>
        <Badge variant="secondary" className="text-[10px]">
          {outcomeLabel[resolution.outcome] ?? resolution.outcome}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">Resolved by</span>
        <span className="text-xs font-medium">
          {resolution.resolvedBy.firstName} {resolution.resolvedBy.lastName}
        </span>
      </div>
      {resolution.notes && (
        <p className="text-muted-foreground border-t pt-2 text-xs leading-relaxed">
          {resolution.notes}
        </p>
      )}
    </div>
  );
}
