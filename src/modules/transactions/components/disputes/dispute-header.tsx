import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { AdminDisputeResponseDto } from "@/lib/api/generated/types.gen";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";

interface DisputeHeaderProps {
  dispute: AdminDisputeResponseDto;
  amount: number;
}

export function DisputeHeader({ dispute, amount }: DisputeHeaderProps) {
  const category = dispute.type
    ? dispute.type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Unknown Category";

  const displayId = `DSP-${String(dispute.displayId).padStart(4, "0")}`;

  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <AlertCircle className="h-4 w-4" />
                {dispute.status}
              </Badge>
              <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                {formatDistanceToNow(new Date(dispute.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <h2 className="text-lg font-medium tracking-tight">{category}</h2>
            <span className="text-muted-foreground font-mono text-xs tracking-wide">
              {displayId}
            </span>
          </div>

          <div className="space-y-1 text-right">
            <CardTitle>Amount In Dispute</CardTitle>
            <div className="text-destructive text-lg font-semibold">
              {formatCurrency(amount)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
