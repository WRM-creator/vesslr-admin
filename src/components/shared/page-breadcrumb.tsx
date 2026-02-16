import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemType[];
  backUrl?: string;
  className?: string;
}

export function PageBreadcrumb({
  items,
  backUrl,
  className,
}: PageBreadcrumbProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-8 shrink-0 rounded-lg border-gray-200"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Button>
        <span
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          onClick={handleGoBack}
        >
          Go Back
        </span>
      </div>

      <Breadcrumb>
        <BreadcrumbList className="sm:gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={item.label}>
                <BreadcrumbItem>
                  {!isLast ? (
                    <BreadcrumbLink
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground/80 text-sm font-normal"
                    >
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-sm font-medium text-[hsl(var(--primary))] opacity-90">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator className="[&>svg]:size-4">
                    /
                  </BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
