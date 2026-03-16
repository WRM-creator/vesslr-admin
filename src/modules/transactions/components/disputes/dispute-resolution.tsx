import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { formatCurrency, toMinorUnit } from "@/lib/currency";
import { CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { DisputeActionMenu } from "./dispute-action-menu";
import { DisputeResolutionDialog } from "./dispute-resolution-dialog";
import { ResolvedSummary } from "./resolved-summary";
import { WithdrawnSummary } from "./withdrawn-summary";

interface DisputeResolutionProps {
  dispute: AdminDisputeResponseDto;
  escrowStatus: any;
  amount: number;
  onResolved?: () => void;
}

type ActionKey = "RELEASE" | "REFUND" | "ESCALATE" | "CUSTOM";

export function DisputeResolution({
  dispute,
  escrowStatus,
  amount,
  onResolved,
}: DisputeResolutionProps) {
  const [selectedAction, setSelectedAction] = useState<ActionKey | null>(null);
  const [notes, setNotes] = useState("");
  const [customProceed, setCustomProceed] = useState(true);
  const [customRefund, setCustomRefund] = useState(0);

  const resolveMutation = api.admin.disputes.resolve.useMutation();

  const handleConfirm = () => {
    if (!selectedAction || !notes.trim()) return;

    let outcome: "PROCEED" | "CANCELLED" | "ESCALATED";
    switch (selectedAction) {
      case "RELEASE":
        outcome = "PROCEED";
        break;
      case "REFUND":
        outcome = "CANCELLED";
        break;
      case "ESCALATE":
        outcome = "ESCALATED";
        break;
      case "CUSTOM":
        outcome = customProceed ? "PROCEED" : "CANCELLED";
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
            selectedAction === "CUSTOM" && customRefund > 0
              ? { buyerRefundAmount: toMinorUnit(customRefund) }
              : undefined,
        },
      },
      {
        onSuccess: () => {
          setSelectedAction(null);
          setNotes("");
          setCustomProceed(true);
          setCustomRefund(0);
          onResolved?.();
        },
        onError: (error: any) => {
          console.error("Failed to resolve dispute:", error);
        },
      },
    );
  };

  const handleCancel = () => {
    setSelectedAction(null);
    setCustomProceed(true);
    setCustomRefund(0);
  };

  const isResolved = !!dispute.resolution;
  const isWithdrawn = dispute.status === "withdrawn";

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

          {isWithdrawn ? (
            <WithdrawnSummary dispute={dispute} />
          ) : isResolved ? (
            <ResolvedSummary dispute={dispute} />
          ) : (
            <DisputeActionMenu
              onSelect={(action) => {
                if (action === "CUSTOM") {
                  setCustomProceed(true);
                  setCustomRefund(0);
                }
                setSelectedAction(action);
              }}
            />
          )}
        </CardContent>
      </Card>

      <DisputeResolutionDialog
        selectedAction={selectedAction}
        notes={notes}
        setNotes={setNotes}
        customProceed={customProceed}
        setCustomProceed={setCustomProceed}
        customRefund={customRefund}
        setCustomRefund={setCustomRefund}
        amount={amount}
        isPending={resolveMutation.isPending}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
