import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Bell, CheckCircle2, Info, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "alert" | "warning" | "info" | "success";
  link?: {
    label: string;
    href: string;
  };
}

const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "System Maintenance Scheduled",
    message:
      "Scheduled maintenance on Saturday, Jan 25th from 2:00 AM to 4:00 AM UTC.",
    timestamp: "2 hours ago",
    type: "info",
  },
  {
    id: "notif-2",
    title: "High Risk Transaction Detected",
    message: "Transaction #TX-9982 flagged for unusual activity pattern.",
    timestamp: "45 mins ago",
    type: "alert",
    link: {
      label: "View Transaction",
      href: "/transactions/tx_9982",
    },
  },
  {
    id: "notif-3",
    title: "Pending Merchant Verifications",
    message: "5 new merchant accounts are awaiting KYC document review.",
    timestamp: "3 hours ago",
    type: "warning",
    link: {
      label: "Review Queue",
      href: "/merchants?status=pending_review",
    },
  },
  {
    id: "notif-4",
    title: "Export Completed",
    message:
      "Your monthly transaction report export has completed successfully.",
    timestamp: "5 hours ago",
    type: "success",
    link: {
      label: "Download",
      href: "/reports/monthly-transactions",
    },
  },
];

function getTypeStyles(type: NotificationItem["type"]) {
  switch (type) {
    case "alert":
      return {
        border: "border-destructive/40",
        iconBg: "bg-destructive/10",
        iconText: "text-destructive",
        icon: <XCircle className="h-5 w-5" />,
      };
    case "warning":
      return {
        border: "border-orange-500/40",
        iconBg: "bg-orange-500/10",
        iconText: "text-orange-600 dark:text-orange-400",
        icon: <AlertTriangle className="h-5 w-5" />,
      };
    case "info":
      return {
        border: "border-blue-500/40",
        iconBg: "bg-blue-500/10",
        iconText: "text-blue-600 dark:text-blue-400",
        icon: <Info className="h-5 w-5" />,
      };
    case "success":
      return {
        border: "border-green-500/40",
        iconBg: "bg-green-500/10",
        iconText: "text-green-600 dark:text-green-400",
        icon: <CheckCircle2 className="h-5 w-5" />,
      };
  }
}

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="text-primary h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Recent alerts, updates, and system activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((item) => {
            const styles = getTypeStyles(item.type);
            return (
              <div
                key={item.id}
                className={`group flex items-start justify-between rounded-lg border p-4 transition-all hover:shadow-sm ${styles.border}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 rounded-md p-2 ${styles.iconBg} ${styles.iconText}`}
                  >
                    {styles.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <span className="text-muted-foreground text-xs">
                        • {item.timestamp}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
                {item.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="ml-2 shrink-0"
                  >
                    <Link to={item.link.href}>{item.link.label} →</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
