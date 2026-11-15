import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { toast } from "sonner";

interface StageRentalActiveContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

interface RentalActiveMetadata {
  endedAt?: string;
  /** Who ended it: the auto-end sweep, or an admin's End Rental. */
  endedBy?: "automatic" | "admin";
  notes?: string;
}

export function StageRentalActiveContent({
  transaction,
  stage,
}: StageRentalActiveContentProps) {
  const metadata = stage.metadata as unknown as
    | RentalActiveMetadata
    | undefined;

  const { mutate, isPending } =
    api.admin.transactions.endRentalPeriod.useMutation();

  const handleEndRental = () => {
    mutate(
      { path: { id: transaction._id!, stageId: stage._id! } },
      {
        onSuccess: () => toast.success("Rental period ended"),
        onError: (err: any) =>
          toast.error(err.message || "Failed to end rental period"),
      },
    );
  };

  if (stage.status === "COMPLETED") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {stage.completedAt && (
            <div className="text-sm">
              <span className="text-muted-foreground text-xs">Ended</span>
              <p className="font-medium">
                {formatDateTime(metadata?.endedAt || stage.completedAt)}
              </p>
            </div>
          )}
          {metadata?.endedBy && (
            <div className="text-sm">
              <span className="text-muted-foreground text-xs">Ended by</span>
              <p className="font-medium">
                {metadata.endedBy === "automatic"
                  ? "Automatically, at the end of the booked period"
                  : "Admin"}
              </p>
            </div>
          )}
        </div>

        {metadata?.notes && (
          <div className="text-sm">
            <span className="text-muted-foreground text-xs">Notes</span>
            <p className="font-medium">{metadata.notes}</p>
          </div>
        )}
      </div>
    );
  }

  if (stage.status === "ACTIVE") {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 py-4">
          <Clock className="mt-0.5 size-5 shrink-0 text-blue-500" />
          <div className="space-y-1 text-sm">
            <p className="font-medium">Rental period is currently active.</p>
            <p className="text-muted-foreground">
              {transaction.rentalEndsAt
                ? `Ends automatically on ${formatDateTime(transaction.rentalEndsAt)}, at the end of the booked period. End it now only for an early return.`
                : transaction.rentalStartedAt
                  ? "This booking has no automatic end (it is not counted in whole days, weeks, months or years). End it when the equipment is off hire."
                  : "No end date yet. The automatic check counts one from the delivery date; if it cannot, end it when the equipment is off hire."}
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={handleEndRental}
        >
          {isPending ? "Ending…" : "End Rental"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-4">
      <Clock className="text-muted-foreground size-5 opacity-50" />
      <p className="text-muted-foreground text-sm">
        Rental period has not started yet.
      </p>
    </div>
  );
}
