import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { DashboardStatsDto } from "@/lib/api/generated";
import { cn } from "@/lib/utils";
import { Building2, Package, Scale, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionItem {
  label: string;
  countKey: keyof DashboardStatsDto;
  icon: React.ReactNode;
  href: string;
  accent: string;
}

const actionItems: ActionItem[] = [
  {
    label: "Pending KYC/KYB Reviews",
    countKey: "pendingComplianceReviews",
    icon: <ShieldCheck className="h-4 w-4" />,
    href: "/organizations?compliance=pending",
    accent: "border-l-amber-500 text-amber-600",
  },
  {
    label: "Pending Product Approvals",
    countKey: "pendingProductApprovals",
    icon: <Package className="h-4 w-4" />,
    href: "/products?status=pending",
    accent: "border-l-blue-500 text-blue-600",
  },
  {
    label: "Open Disputes",
    countKey: "openDisputes",
    icon: <Scale className="h-4 w-4" />,
    href: "/disputes?status=open",
    accent: "border-l-red-500 text-red-600",
  },
  {
    label: "Pending Registrations",
    countKey: "pendingRegistrations",
    icon: <Building2 className="h-4 w-4" />,
    href: "/registrations",
    accent: "border-l-violet-500 text-violet-600",
  },
];

export function ActionRequiredCards() {
  const { data, isLoading } = api.admin.dashboard.stats.useQuery({});
  const stats = data?.data as DashboardStatsDto | undefined;

  return (
    <div>
      <h3 className="mb-3 text-base font-medium">Requires Your Attention</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actionItems.map((item) => (
          <Link key={item.label} to={item.href}>
            <Card className="hover:bg-accent/50 border-l-4 py-0 shadow-none transition-colors">
              <CardContent
                className={cn("flex items-center gap-3 p-4", item.accent)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  {item.icon}
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="mb-1 h-7 w-12" />
                  ) : (
                    <div className="text-2xl font-bold text-foreground">
                      {(stats?.[item.countKey] as number) ?? 0}
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
