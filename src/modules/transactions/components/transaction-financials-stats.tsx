import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowRightLeft, TrendingUp } from "lucide-react";

interface TransactionFinancialsStatsProps {
  receivableTotal: number;
  payableTotal: number;
  grossMargin: number;
  marginPercent: number;
}

export function TransactionFinancialsStats({
  receivableTotal,
  payableTotal,
  grossMargin,
  marginPercent,
}: TransactionFinancialsStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex max-h-5 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-foreground/70 text-sm font-medium">
            Receivable
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-foreground/60 text-lg font-semibold">
            {formatCurrency(receivableTotal)}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex max-h-5 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-foreground/70 text-sm font-medium">
            Payable
          </CardTitle>
          <ArrowRightLeft className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-foreground/60 text-lg font-semibold">
            {formatCurrency(payableTotal)}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex max-h-5 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-foreground/70 text-sm font-medium">
            Margin
          </CardTitle>
          <Badge variant="outline" className="bg-background">
            {marginPercent.toFixed(2)}%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-foreground/60 text-lg font-semibold">
            {formatCurrency(grossMargin)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
