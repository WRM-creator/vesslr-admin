import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreditCard } from "lucide-react";

export function TransactionPaymentLogs() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Payment Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty className="border-none py-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CreditCard />
            </EmptyMedia>
            <EmptyTitle>No payment activity yet</EmptyTitle>
            <EmptyDescription>
              Payment activity logs will appear here once payment tracking is
              connected.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  );
}
