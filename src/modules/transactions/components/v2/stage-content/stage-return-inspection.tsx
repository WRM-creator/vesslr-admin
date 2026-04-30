import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Search } from "lucide-react";

interface StageReturnInspectionContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

interface ReturnInspectionMetadata {
  notes?: string;
  completedAt?: string;
}

export function StageReturnInspectionContent({
  stage,
}: StageReturnInspectionContentProps) {
  const metadata = stage.metadata as unknown as
    | ReturnInspectionMetadata
    | undefined;

  if (stage.status === "ACTIVE") {
    return (
      <div className="flex items-center gap-3 py-4">
        <Search className="size-5 text-blue-500" />
        <p className="text-sm font-medium">
          Inspect the returned asset and complete this stage.
        </p>
      </div>
    );
  }

  if (stage.status === "COMPLETED") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {stage.completedAt && (
            <div className="text-sm">
              <span className="text-muted-foreground text-xs">Completed</span>
              <p className="font-medium">
                {formatDateTime(stage.completedAt)}
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

  return (
    <div className="flex items-center gap-3 py-4">
      <Search className="text-muted-foreground size-5 opacity-50" />
      <p className="text-muted-foreground text-sm">
        Awaiting return of the asset for inspection.
      </p>
    </div>
  );
}
