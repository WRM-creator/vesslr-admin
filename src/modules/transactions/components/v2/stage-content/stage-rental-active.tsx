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
        <div className="flex items-center gap-3 py-4">
          <Clock className="size-5 text-blue-500" />
          <p className="text-sm font-medium">
            Rental period is currently active.
          </p>
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
