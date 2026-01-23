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
  AlertTriangle,
  Clock,
  FileWarning,
  Scale,
  ShieldAlert,
  UserX,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AttentionItem {
  id: string;
  label: string;
  count: number;
  icon: React.ReactNode;
  action: string;
  href: string;
  variant: "destructive" | "warning" | "default";
}

const attentionItems: AttentionItem[] = [
  {
    id: "stalled-transactions",
    label: "Stalled Transactions",
    count: 3,
    icon: <Clock className="h-5 w-5" />,
    action: "Review",
    href: "/transactions?status=stalled",
    variant: "destructive",
  },
  {
    id: "pending-compliance",
    label: "Pending Compliance Reviews",
    count: 7,
    icon: <FileWarning className="h-5 w-5" />,
    action: "Review",
    href: "/merchants?compliance=pending",
    variant: "warning",
  },
  {
    id: "active-disputes",
    label: "Active Disputes",
    count: 2,
    icon: <Scale className="h-5 w-5" />,
    action: "Resolve",
    href: "/disputes?status=active",
    variant: "destructive",
  },
  {
    id: "flagged-users",
    label: "Flagged Users",
    count: 4,
    icon: <UserX className="h-5 w-5" />,
    action: "Inspect",
    href: "/customers?flagged=true",
    variant: "warning",
  },
  {
    id: "failed-workflows",
    label: "Failed Workflows",
    count: 1,
    icon: <ShieldAlert className="h-5 w-5" />,
    action: "Review",
    href: "/logistics?status=failed",
    variant: "destructive",
  },
];

function getVariantStyles(variant: AttentionItem["variant"]) {
  switch (variant) {
    case "destructive":
      return {
        bg: "bg-destructive/10",
        text: "text-destructive",
        badgeBg: "bg-destructive",
      };
    case "warning":
      return {
        bg: "bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
        badgeBg: "bg-orange-500",
      };
    default:
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        badgeBg: "bg-muted-foreground",
      };
  }
}

export function CriticalAttentionArea() {
  const hasItems = attentionItems.some((item) => item.count > 0);

  if (!hasItems) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-muted-foreground h-5 w-5" />
            Critical Attention
          </CardTitle>
          <CardDescription>
            Items requiring your immediate attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No critical items at this time. All systems operational.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-destructive h-5 w-5" />
          Critical Attention
        </CardTitle>
        <CardDescription>
          Items requiring your immediate attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {attentionItems
            .filter((item) => item.count > 0)
            .map((item) => {
              const styles = getVariantStyles(item.variant);
              return (
                <div
                  key={item.id}
                  className={`group relative flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md ${styles.bg}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={styles.text}>{item.icon}</div>
                    <div>
                      <p className="text-sm leading-none font-medium">
                        {item.label}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`mt-1.5 ${styles.badgeBg} text-white`}
                      >
                        {item.count} {item.count === 1 ? "item" : "items"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={item.href}>{item.action}</Link>
                  </Button>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
