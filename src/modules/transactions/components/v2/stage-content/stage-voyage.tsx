import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Anchor } from "lucide-react";

interface StageVoyageContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

interface VoyageMetadata {
  notes?: string;
  completedAt?: string;
}

export function StageVoyageContent({ stage }: StageVoyageContentProps) {
  const metadata = stage.metadata as unknown as VoyageMetadata | undefined;

  if (stage.status !== "COMPLETED") {
    return (
      <div className="flex items-center gap-3 py-4">
        <Anchor className="text-muted-foreground size-5 opacity-50" />
        <p className="text-muted-foreground text-sm">
          Awaiting voyage report from the seller.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {stage.completedAt && (
          <div className="text-sm">
            <span className="text-muted-foreground text-xs">Completed</span>
            <p className="font-medium">{formatDateTime(stage.completedAt)}</p>
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
