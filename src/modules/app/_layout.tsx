import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

type Props = {
  children?: ReactNode;
  title?: string;
};

export default function AppLayout({ children, title }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="flex h-16 items-center gap-2 border-b border-vesslr-border bg-[#0B1424]/80 backdrop-blur px-6 py-4 text-white">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">{title ?? "Admin Panel"}</h1>
        </header>

        <div className="p-6">{children ?? <Outlet />}</div>
      </main>
    </SidebarProvider>
  );
}
