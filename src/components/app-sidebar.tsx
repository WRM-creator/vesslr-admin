import { cn } from "@/lib/utils";
import {
  ArrowRightLeft,
  BookOpenIcon,
  Building2Icon,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Lock,
  Package,
  Scale,
  Settings,
  Tags,
  TimerIcon,
  Unplug,
  Waypoints,
} from "lucide-react";
import * as React from "react";

import { NavMain, type NavGroup } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      // {
      //   title: "Analytics",
      //   url: "/analytics",
      //   icon: BarChart3,
      // },
    ],
  },
  {
    label: "Organizations",
    items: [
      {
        title: "Organizations",
        url: "/organizations",
        icon: Building2Icon,
      },
      {
        title: "Compliance Review",
        url: "/registrations",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Categories",
        url: "/categories",
        icon: Tags,
      },
      {
        title: "Products",
        url: "/products",
        icon: Package,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Requests",
        url: "/requests",
        icon: ClipboardList,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: ArrowRightLeft,
      },
      {
        title: "Escrows",
        url: "/escrows",
        icon: Lock,
      },
      {
        title: "Funding Windows",
        url: "/funding-windows",
        icon: TimerIcon,
      },
      {
        title: "Ledger",
        url: "/ledger",
        icon: BookOpenIcon,
      },
      {
        title: "Payment Routing",
        url: "/routing",
        icon: Waypoints,
      },
      {
        title: "Provider Drain",
        url: "/provider-drain",
        icon: Unplug,
      },
      {
        title: "Benchmarks",
        url: "/benchmarks",
        icon: LineChart,
      },
      {
        title: "Disputes",
        url: "/disputes",
        icon: Scale,
      },
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
      // {
      //   title: "Logistics & Fulfilments",
      //   url: "/logistics",
      //   icon: ContainerIcon,
      // },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Pages",
        url: "/cms/pages",
        icon: FileText,
      },
    ],
  },
  {
    label: "System",
    items: [
      // {
      //   title: "Notifications",
      //   url: "/notifications",
      //   icon: Bell,
      // },
      {
        title: "Countries",
        url: "/countries",
        icon: Globe,
      },
      {
        title: "System Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className={cn(className, isCollapsed && "ml-1")}
      {...props}
    >
      <SidebarHeader
        className={
          isCollapsed
            ? "items-center justify-center p-4"
            : "mb-[27px] px-[32px] pt-[30px]"
        }
      >
        <div className="mx-auto flex w-fit flex-col items-center gap-2">
          <img
            src="/logo-full-white.svg"
            alt="Vesslr"
            className={`transition-all duration-200 ${isCollapsed ? "w-8" : "w-20"}`}
          />
          {!isCollapsed && (
            <Badge
              variant="secondary"
              className="bg-sidebar-accent text-sidebar-foreground border-primary/20 animate-in fade-in zoom-in min-w-[auto] border px-2 text-[10px] font-medium tracking-widest duration-200"
            >
              ADMIN
            </Badge>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
