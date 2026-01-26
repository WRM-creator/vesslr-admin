import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

type Props = {
  children?: ReactNode;
  title?: string;
};

export default function AppLayout({ children, title }: Props) {
  return (
    <SidebarProvider>
      <BreadcrumbProvider>
        <NuqsAdapter>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="@container flex flex-1 flex-col gap-4 p-4">
              {children ?? <Outlet />}
            </div>
          </SidebarInset>
        </NuqsAdapter>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
