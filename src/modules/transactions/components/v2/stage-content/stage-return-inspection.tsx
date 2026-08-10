import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { CompleteReturnInspectionDialog } from "../../complete-return-inspection-dialog";

interface StageReturnInspectionContentProps {
  transaction: TransactionResponseDto;
  stage: TransactionStageResponseDto;
}

interface ReturnInspectionMetadata {
  notes?: string;
  completedAt?: string;
}

export function StageReturnInspectionContent({
  transaction,
  stage,
}: StageReturnInspectionContentProps) {
  const metadata = stage.metadata as unknown as
    | ReturnInspectionMetadata
    | undefined;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (stage.status === "ACTIVE") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 py-4">
          <Search className="size-5 text-blue-500" />
          <p className="text-sm font-medium">
            Inspect the returned asset and complete this stage.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Complete Return Inspection
        </Button>

        {transaction._id && stage._id && (
          <CompleteReturnInspectionDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            transactionId={transaction._id}
            stageId={stage._id}
          />
        )}
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
