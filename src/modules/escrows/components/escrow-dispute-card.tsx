import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import type { DisputeReference } from "../lib/escrow-details-model";

interface EscrowDisputeCardProps {
  dispute?: DisputeReference;
}

export function EscrowDisputeCard({ dispute }: EscrowDisputeCardProps) {
  if (!dispute) return null;

  return (
    <Card className="overflow-hidden border-red-200 dark:border-red-900/50">
      <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-6 py-2 text-xs font-semibold tracking-wider text-red-700 uppercase dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
        <AlertCircle className="h-3.5 w-3.5" />
        Active Dispute
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dispute Details</CardTitle>
        <Link
          to={`/disputes/${dispute.id}`}
          className="text-primary text-xs hover:underline"
        >
          {dispute.id}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground mb-1 block text-xs">
                Status
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 capitalize dark:bg-red-900/30 dark:text-red-400">
                {dispute.status}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground mb-1 block text-xs">
                Raised By
              </span>
              <div className="flex items-center gap-1.5 capitalize">
                <User className="text-muted-foreground h-3.5 w-3.5" />
                {dispute.raisedBy}
              </div>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground mb-1 block text-xs">
              Reason
            </span>
            <p className="text-sm">{dispute.reason}</p>
          </div>

          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            asChild
          >
            <Link to={`/disputes/${dispute.id}`}>Manage Dispute</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
