import { api } from "@/lib/api";
import type { DashboardStatsDto } from "@/lib/api/generated";
import type { LucideIcon } from "lucide-react";
import { Building2, Package, Scale, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

export type AdminPendingActionType =
  | "disputes"
  | "compliance"
  | "products"
  | "registrations";

export interface AdminPendingAction {
  id: string;
  type: AdminPendingActionType;
  priority: 1 | 2 | 3;
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  route: string;
}

export interface UseAdminPendingActionsResult {
  actions: AdminPendingAction[];
  isLoading: boolean;
}

export function useAdminPendingActions(): UseAdminPendingActionsResult {
  const { data, isLoading } = api.admin.dashboard.stats.useQuery({});
  const stats = data?.data as DashboardStatsDto | undefined;

  const actions = useMemo<AdminPendingAction[]>(() => {
    if (!stats) return [];

    const items: AdminPendingAction[] = [];

    if (stats.openDisputes > 0) {
      items.push({
        id: "disputes",
        type: "disputes",
        priority: 1,
        icon: Scale,
        title: `${stats.openDisputes} open dispute${stats.openDisputes === 1 ? "" : "s"} need resolution`,
        description:
          "Open disputes require immediate attention to protect buyer and seller interests.",
        ctaLabel: "Review disputes",
        route: "/disputes?status=open",
      });
    }

    if (stats.pendingComplianceReviews > 0) {
      items.push({
        id: "compliance",
        type: "compliance",
        priority: 2,
        icon: ShieldCheck,
        title: `${stats.pendingComplianceReviews} compliance review${stats.pendingComplianceReviews === 1 ? "" : "s"} pending`,
        description:
          "Organizations are waiting for KYC/KYB approval to start transacting on the platform.",
        ctaLabel: "Review compliance",
        route: "/organizations?compliance=pending",
      });
    }

    if (stats.pendingProductApprovals > 0) {
      items.push({
        id: "products",
        type: "products",
        priority: 3,
        icon: Package,
        title: `${stats.pendingProductApprovals} product${stats.pendingProductApprovals === 1 ? "" : "s"} awaiting approval`,
        description:
          "New products have been submitted by merchants and need review before they can be listed.",
        ctaLabel: "Review products",
        route: "/products?status=pending",
      });
    }

    if (stats.pendingRegistrations > 0) {
      items.push({
        id: "registrations",
        type: "registrations",
        priority: 3,
        icon: Building2,
        title: `${stats.pendingRegistrations} organization${stats.pendingRegistrations === 1 ? "" : "s"} still onboarding`,
        description:
          "These organizations have started registration but haven't completed all onboarding steps.",
        ctaLabel: "View registrations",
        route: "/registrations",
      });
    }

    return items.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }, [stats]);

  return { actions, isLoading };
}
