import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";

type Props = {
  children?: ReactNode;
  title?: string;
};

export default function AppLayout({ children, title }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children ?? <Outlet />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
