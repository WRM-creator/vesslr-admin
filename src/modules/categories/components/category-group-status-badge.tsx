import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryGroupStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export const CategoryGroupStatusBadge = ({
  isActive,
  className,
}: CategoryGroupStatusBadgeProps) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let badgeClassName = "";

  if (isActive) {
    variant = "outline";
    badgeClassName =
      "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200";
  } else {
    variant = "outline";
    badgeClassName =
      "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200";
  }

  return (
    <Badge
      variant={variant}
      className={cn("capitalize", badgeClassName, className)}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
};
