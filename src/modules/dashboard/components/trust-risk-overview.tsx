import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertOctagon,
  Banknote,
  FileCheck,
  ShieldQuestion,
  UserMinus,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";

interface RiskItem {
  id: string;
  label: string;
  description: string;
  count?: number;
  value?: string;
  icon: React.ReactNode;
  href: string;
  severity: "high" | "medium" | "low";
}

const riskItems: RiskItem[] = [
  {
    id: "high-value-transactions",
    label: "High-Value Transactions In Progress",
    description: "Transactions exceeding €50,000 threshold",
    count: 5,
    icon: <Banknote className="h-5 w-5" />,
    href: "/transactions?value=high",
    severity: "medium",
  },
  {
    id: "unverified-sellers",
    label: "Unverified Sellers with Active Listings",
    description: "Merchants with incomplete verification",
    count: 12,
    icon: <ShieldQuestion className="h-5 w-5" />,
    href: "/merchants?verified=false&hasListings=true",
    severity: "high",
  },
  {
    id: "compliance-categories",
    label: "Categories with Elevated Requirements",
    description: "Require additional documentation or checks",
    count: 3,
    icon: <FileCheck className="h-5 w-5" />,
    href: "/categories?compliance=elevated",
    severity: "low",
  },
  {
    id: "manual-overrides",
    label: "Recent Admin Overrides",
    description: "Manual interventions in the last 24h",
    count: 8,
    icon: <Wrench className="h-5 w-5" />,
    href: "/analytics?view=overrides",
    severity: "medium",
  },
  {
    id: "suspended-accounts",
    label: "Suspended Accounts Pending Review",
    description: "Accounts requiring reinstatement decision",
    count: 2,
    icon: <UserMinus className="h-5 w-5" />,
    href: "/customers?status=suspended",
    severity: "high",
  },
];

function getSeverityStyles(severity: RiskItem["severity"]) {
  switch (severity) {
    case "high":
      return {
        border: "border-destructive/40",
        iconBg: "bg-destructive/10",
        iconText: "text-destructive",
      };
    case "medium":
      return {
        border: "border-orange-500/40",
        iconBg: "bg-orange-500/10",
        iconText: "text-orange-600 dark:text-orange-400",
      };
    case "low":
      return {
        border: "border-muted",
        iconBg: "bg-muted",
        iconText: "text-muted-foreground",
      };
  }
}

function getSeverityBadge(severity: RiskItem["severity"]) {
  switch (severity) {
    case "high":
      return <Badge variant="destructive">High Risk</Badge>;
    case "medium":
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        >
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          Low
        </Badge>
      );
  }
}

export function TrustRiskOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-orange-500" />
          Trust & Risk Overview
        </CardTitle>
        <CardDescription>
          Areas where platform trust may be under pressure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {riskItems.map((item) => {
            const styles = getSeverityStyles(item.severity);
            return (
              <div
                key={item.id}
                className={`group flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-sm ${styles.border}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-md p-2 ${styles.iconBg} ${styles.iconText}`}
                  >
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.label}</p>
                      {getSeverityBadge(item.severity)}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                    {item.count !== undefined && (
                      <p className="text-lg font-semibold">
                        {item.count}{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          {item.count === 1 ? "item" : "items"}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={item.href}>Investigate →</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
