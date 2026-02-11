import { CardTitleText } from "@/components/shared/card-title-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

const MOCK_LOGS = [
  {
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    message: "Escrow Funded",
    details: "$450,000.00 deposited by Buyer",
    performedBy: { firstName: "Buyer", lastName: "" },
  },
  {
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    message: "Contract Signed",
    details: "Both parties signed the SPA",
    performedBy: { firstName: "System", lastName: "Platform" },
  },
  {
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    message: "Transaction Created",
    details: "Initiated by Buyer",
    performedBy: { firstName: "Buyer", lastName: "" },
  },
];

export function TransactionRecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          <CardTitleText>Recent Activity</CardTitleText>
        </CardTitle>
        <Button variant="ghost" size="icon" className="size-6 px-2 text-xs">
          <Download className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {MOCK_LOGS.map((log, index) => (
            <div key={index} className="group flex gap-3 text-sm">
              {/* Date/Time Left Sidebar */}
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

              {/* Timeline Line & Content */}
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
                  {log.performedBy &&
                    log.performedBy.lastName !== "Platform" && (
                      <div className="pt-0.5">
                        <span className="text-muted-foreground text-[9px] font-medium tracking-wider uppercase">
                          by {log.performedBy.firstName}
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
