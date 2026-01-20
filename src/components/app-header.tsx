import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Fragment } from "react";

export function AppHeader() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Helper to capitalize and format segment
  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home / Admin Root */}
            {/* Assumes /admin is the root for this layout */}
            {pathSegments.length === 0 ||
            (pathSegments.length === 1 && pathSegments[0] === "dashboard") ? (
              <BreadcrumbItem>
                <BreadcrumbPage>Vesslr Admin</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/">Vesslr Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {/* Dynamic Segments */}
            {pathSegments.map((segment, index) => {
              // Skip "admin" if it's the first segment - now unnecessary check but safe to keep or remove.
              // We'll remove it to be clean.
              if (segment === "admin") return null;

              const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;
              const title = formatSegment(segment);

              return (
                <Fragment key={path}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={path}>{title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
