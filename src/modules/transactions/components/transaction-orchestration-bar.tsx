import { Card, CardContent } from "@/components/ui/card";
import type {
  TransactionResponseDto,
  TransactionStageResponseDto,
} from "@/lib/api/generated/types.gen";
import { TransactionStepper } from "./transaction-stepper";

interface TransactionOrchestrationBarProps {
  stages?: Array<TransactionStageResponseDto>;
}

export function TransactionOrchestrationBar({
  stages,
}: TransactionOrchestrationBarProps) {
  return (
    <Card className="border-none">
      <CardContent className="flex flex-col gap-8 pb-6">
        <TransactionStepper stages={stages} />
      </CardContent>
    </Card>
  );
}
