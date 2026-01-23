import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Banknote, Calendar } from "lucide-react";
import type { EscrowDetails } from "../lib/escrow-details-model";

interface EscrowFinancialDetailsCardProps {
  data: EscrowDetails;
}

export function EscrowFinancialDetailsCard({
  data,
}: EscrowFinancialDetailsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: data.currency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Financial Details</CardTitle>
        <Banknote className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee</span>
              <span>{formatCurrency(data.platformFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Escrow Fee</span>
              <span>{formatCurrency(data.escrowFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(data.tax)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between font-bold">
            <span>Amount Secured</span>
            <span className="text-primary text-lg">
              {formatCurrency(data.amountSecured)}
            </span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground mb-1 block">
                  Deposit Date
                </span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                  {data.depositDate
                    ? format(new Date(data.depositDate), "PP p")
                    : "-"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground mb-1 block">
                  Est. Release
                </span>
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                  {data.releaseDate
                    ? format(new Date(data.releaseDate), "PP p")
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" className="w-full">
              Initiate Refund
            </Button>
            <Button variant="outline" className="w-full">
              Force Payout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
