import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  back?: {
    href: string;
    label?: string;
  };
  endContent?: React.ReactNode;
}

export const PageHeader = ({ title, back, endContent }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {back && (
            <Button variant="ghost" size="icon" className="-ml-3" asChild>
                <Link to={back.href}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">{back.label ?? "Back"}</span>
                </Link>
            </Button>
        )}
        <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      </div>
      {endContent && <div className="flex items-center gap-2">{endContent}</div>}
    </div>
  );
};
