import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  Users,
  Package,
  ShoppingCart,
  Tags,
  Settings,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Michael",
    email: "mike@vesslr.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Vesslr Admin",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: Tags,
    },
  ],
};

import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon" className={cn(className, isCollapsed && "ml-1")} {...props}>
      <SidebarHeader className={isCollapsed ? "p-4 items-center justify-center" : "pt-[30px] px-[32px] mb-[27px]"}>
        <div className="flex flex-col items-center gap-2 w-fit mx-auto">
          <img
            src="/logo.svg"
            alt="Vesslr"
            className={`transition-all duration-200 ${isCollapsed ? "w-8" : "w-[72px]"}`}
          />
          {!isCollapsed && (
            <Badge
              variant="secondary"
              className="px-2 min-w-[auto] bg-sidebar-accent text-sidebar-foreground border border-primary/20 text-[10px] tracking-widest font-medium animate-in fade-in zoom-in duration-200"
            >
              ADMIN
            </Badge>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
