import { Card, CardContent } from "@/components/ui/card";
import type { TransactionResponseDto } from "@/lib/api/generated/types.gen";
import { TransactionStepper } from "./transaction-stepper";

interface TransactionOrchestrationBarProps {
  status?: TransactionResponseDto["status"];
}

export function TransactionOrchestrationBar({
  status,
}: TransactionOrchestrationBarProps) {
  return (
    <Card className="border-none">
      <CardContent className="flex flex-col gap-8 pb-6">
        <TransactionStepper status={status} />
      </CardContent>
    </Card>
  );
}
