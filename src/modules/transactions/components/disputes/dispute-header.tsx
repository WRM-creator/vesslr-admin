import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle } from "lucide-react";
import type { Dispute } from "./dispute-types";

interface DisputeHeaderProps {
  dispute: Dispute;
}

export function DisputeHeader({ dispute }: DisputeHeaderProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <AlertCircle className="h-4 w-4" />
                  {dispute.status}
                </Badge>
                <div className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                  {formatDistanceToNow(dispute.openedAt, { addSuffix: true })}
                </div>
              </div>
              <h2 className="text-xl font-medium tracking-tight">
                {dispute.category}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs tracking-wide">
                  #{dispute.id}
                </span>
                <CopyButton
                  value={dispute.id}
                  className="text-muted-foreground hover:text-foreground size-3"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="text-muted-foreground text-sm font-medium tracking-wider">
              Amount In Dispute
            </div>
            <div className="text-destructive text-xl font-semibold">
              {formatCurrency(dispute.amount)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
