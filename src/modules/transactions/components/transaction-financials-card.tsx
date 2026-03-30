import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TransactionResponseDto } from "@/lib/api/generated";
import { formatCurrency } from "@/lib/currency";
import { AlertCircle, ExternalLink, RefreshCw, RotateCw } from "lucide-react";
import {
  TransactionPaymentStatus,
  TransactionPaymentStatusBadge,
} from "./transaction-payment-status-badge";

interface TransactionFinancialsCardProps {
  transaction: TransactionResponseDto;
}

export function TransactionFinancialsCard({
  transaction,
}: TransactionFinancialsCardProps) {
  // Derive payment status from transaction status
  const isFunded = [
    "ESCROW_FUNDED",
    "LOGISTICS_ASSIGNED",
    "IN_TRANSIT",
    "DELIVERY_CONFIRMED",
    "SETTLEMENT_RELEASED",
    "CLOSED",
  ].includes(transaction.status);

  const isRefunded = transaction.status === "REFUNDED";

  const paymentStatus =
    transaction.status === "SETTLEMENT_RELEASED" ||
    transaction.status === "CLOSED"
      ? TransactionPaymentStatus.RELEASED
      : isRefunded
        ? TransactionPaymentStatus.REFUNDED
        : isFunded
          ? TransactionPaymentStatus.FUNDED
          : TransactionPaymentStatus.PENDING;

  // Find the escrow funded event if it exists
  const fundingEvent = transaction.events?.find(
    (e) => e.metadata?.newStatus === "ESCROW_FUNDED",
  );

  const providerRef = isFunded ? "pi_mock_582962" : "Awaiting Initiation";

  const order = transaction.order;
  const currency = order.currency || "USD";
  const goodsAmount = order.totalAmount || 0;
  const serviceFeeAmount = order.serviceFeeAmount ?? 0;
  const totalWithFee = order.totalWithFee ?? goodsAmount + serviceFeeAmount;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <CardTitle>Payment Details</CardTitle>
          <TransactionPaymentStatusBadge status={paymentStatus} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
            <RotateCw className="size-3.5" />
            Sync Status
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
            <ExternalLink className="size-3.5" />
            View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Status Context Section */}
          <div className="bg-muted/40 border-border/50 rounded-md border p-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 rounded-full p-1 ${
                  isRefunded
                    ? "bg-amber-100 text-amber-600"
                    : isFunded
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                <RefreshCw
                  className={`size-4 ${!isFunded && !isRefunded && "animate-spin-slow"}`}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {transaction.status === "CLOSED" ||
                  transaction.status === "SETTLEMENT_RELEASED"
                    ? "Settlement Released"
                    : isRefunded
                      ? "Refunded to Buyer"
                      : isFunded
                        ? "Funds Secured"
                        : "Awaiting Funding"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {transaction.status === "CLOSED" ||
                  transaction.status === "SETTLEMENT_RELEASED"
                    ? "Funds have been released to the seller and the transaction is closed."
                    : isRefunded
                      ? "Dispute resolved in buyer's favour — escrowed funds have been refunded."
                      : isFunded
                        ? `Funds were successfully secured in escrow on ${new Date(fundingEvent?.timestamp || transaction.updatedAt).toLocaleDateString()}.`
                        : "The buyer has been notified to fund the escrow account via the platform."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Left Column: Financial Breakdown */}
            <div className="space-y-4">
              <h4 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Breakdown
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Goods Amount</span>
                  <span className="font-medium">
                    {formatCurrency(goodsAmount, currency)}
                  </span>
                </div>
                {serviceFeeAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee (3%)</span>
                    <span className="font-medium">
                      {formatCurrency(serviceFeeAmount, currency)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Buyer Paid</span>
                  <span className="font-semibold">
                    {formatCurrency(totalWithFee, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Seller Payout</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(goodsAmount, currency)}
                  </span>
                </div>
                {serviceFeeAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Platform Revenue</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(serviceFeeAmount, currency)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Meta Details */}
            <div className="space-y-4">
              <h4 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                Method
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Provider Ref</span>
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                    {providerRef}
                  </code>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>{isFunded ? "Wire Transfer (Mock)" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payer Account</span>
                  <span>{isFunded ? "Chase Bank **** 9876" : "Pending"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Intervention Zone */}
          <div className="mt-2 pt-4">
            <details className="group">
              <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                <AlertCircle className="size-3.5" />
                <span>Advanced Options</span>
              </summary>
              <div className="border-muted mt-3 ml-1.5 grid gap-2 border-l-2 pl-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    Manually override automation (Emergency only)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Force Mark as Funded
                  </Button>
                </div>
              </div>
            </details>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
