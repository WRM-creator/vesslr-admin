
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, UserCheck } from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  type: "match" | "verification" | "dispute";
  priority: "high" | "medium" | "low";
}

const actionItems: ActionItem[] = [
  {
    id: "REQ-382",
    title: "Manual Match Needed",
    subtitle: "Request #382: 5000L Diesel (No Auto-Match)",
    type: "match",
    priority: "high",
  },
  {
    id: "USR-992",
    title: "Merchant Verification",
    subtitle: "Acme Oil Ltd submitted KYC docs",
    type: "verification",
    priority: "medium",
  },
  {
    id: "DIS-041",
    title: "Q&Q Dispute Report",
    subtitle: "Order #442: Quantity Mismatch detected",
    type: "dispute",
    priority: "high",
  },
  {
     id: "USR-999",
     title: "Merchant Verification",
     subtitle: "Global Logistics Co. submitted KYC docs",
     type: "verification",
     priority: "medium",
  }
];

export function ActionCenter() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Action Center</CardTitle>
        <CardDescription>Pending tasks requiring attention.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 mt-auto">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between space-x-4 rounded-md border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {item.type === "match" && (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
                {item.type === "verification" && (
                  <UserCheck className="h-5 w-5 text-blue-500" />
                )}
                {item.type === "dispute" && (
                  <FileText className="h-5 w-5 text-destructive" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                <div className="flex gap-2 pt-1">
                     {item.priority === "high" && <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Urgent</Badge>}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8">
              Review
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
