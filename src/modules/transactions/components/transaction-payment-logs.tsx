import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";

// Mock data for payment logs - in a real implementation this would come from the API
const MOCK_PAYMENT_LOGS = [
  {
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    message: "Payment Verified",
    details: "X transfer webhook received: payment_intent.succeeded",
    providerId: "evt_1M...",
  },
  {
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 mins ago
    message: "Funds Processing",
    details: "Payment processing initiated via ACH",
    providerId: "pi_3M...",
  },
  {
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    message: "Invoice Created",
    details: "Invoice #INV-2024-001 sent to buyer@example.com",
    providerId: "in_1M...",
  },
];

export function TransactionPaymentLogs() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Payment Activity</CardTitle>
        <Button variant="ghost" size="icon" className="size-6 px-2 text-xs">
          <Download className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          {MOCK_PAYMENT_LOGS.map((log, index) => (
            <div key={index} className="group flex gap-3 text-sm">
              <div className="flex min-w-[40px] flex-col items-end text-right">
                <span className="text-muted-foreground text-xs">
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="border-border/50 relative ml-1 flex-1 border-l pb-4 pl-4 group-last:border-transparent">
                {/* Timeline dot */}
                <div className="border-background bg-muted-foreground/30 ring-background group-first:bg-primary group-first:ring-primary/20 absolute top-1.5 -left-[6px] h-3 w-3 rounded-full border ring-2" />

                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground/90 text-xs font-medium">
                    {log.message}
                  </span>
                  <span className="text-muted-foreground text-[11px] leading-snug">
                    {log.details}
                  </span>
                  {log.providerId && (
                    <div className="pt-1">
                      <span className="text-primaryGreenDark/80 hover:text-primaryGreenDark bg-muted/50 inline-flex cursor-pointer items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-[10px] transition-colors">
                        {log.providerId}
                        <ExternalLink className="size-2.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
