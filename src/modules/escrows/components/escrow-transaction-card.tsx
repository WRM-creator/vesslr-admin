import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { EscrowDetails } from "../lib/escrow-details-model";

interface EscrowTransactionCardProps {
  transaction: EscrowDetails["transaction"];
}

export function EscrowTransactionCard({
  transaction,
}: EscrowTransactionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Linked Transaction
        </CardTitle>
        <FileText className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link
              to={`/transactions/${transaction.id}`}
              className="text-lg font-bold hover:underline"
            >
              {transaction.id}
            </Link>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="capitalize">{transaction.type}</span>
              <span>•</span>
              <span className="capitalize">
                {transaction.state.replace(/_/g, " ")}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/transactions/${transaction.id}`}>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
