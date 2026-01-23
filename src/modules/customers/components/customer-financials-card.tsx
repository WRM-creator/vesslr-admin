import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Landmark, Plus, Wallet } from "lucide-react";
import type { CustomerDetails } from "../lib/customer-details-model";

interface CustomerFinancialsCardProps {
  data: CustomerDetails["financials"];
}

export function CustomerFinancialsCard({ data }: CustomerFinancialsCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Wallet Balance */}
        <div className="bg-primary/5 border-primary/10 rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Wallet className="text-primary h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Escrow Balance
            </span>
          </div>
          <div className="text-primary text-2xl font-bold">
            {formatCurrency(data.escrowBalance, data.currency)}
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            Funds currently actionable in trades
          </div>
        </div>

        {/* Total Spend */}
        <div className="bg-muted/30 rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-muted rounded-full p-2">
              <CreditCard className="text-muted-foreground h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm font-medium">
              Lifetime Spend
            </span>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalSpend, data.currency)}
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            Total volume settled successfully
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Saved Payment Methods</h4>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Plus className="mr-1 h-3 w-3" />
            Add Method
          </Button>
        </div>

        <div className="space-y-3">
          {data.activePaymentMethods.map((method, idx) => (
            <div
              key={idx}
              className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md">
                  {method.type === "bank_transfer" ? (
                    <Landmark className="h-5 w-5" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {method.bankName || "Card"}
                    {method.isDefault && (
                      <Badge variant="secondary" className="h-4 text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Ends in •••• {method.last4}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] capitalize">
                {method.type.replace("_", " ")}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
