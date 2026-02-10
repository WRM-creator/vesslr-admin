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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>
          <CardTitleText>Recent Activity</CardTitleText>
        </CardTitle>
        <Button variant="ghost" size="icon" className="size-6 px-2 text-xs">
          <Download className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_LOGS.map((log, index) => (
            <div key={index} className="flex gap-4 text-sm">
              <span className="text-muted-foreground min-w-[60px] text-xs">
                {new Date(log.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div className="flex flex-col">
                <span className="text-foreground/80 text-xs font-medium">
                  {log.message}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {log.details}
                </span>
                {log.performedBy && log.performedBy.lastName !== "Platform" && (
                  <span className="text-muted-foreground mt-0.5 text-[9px] tracking-wider uppercase">
                    by {log.performedBy.firstName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
