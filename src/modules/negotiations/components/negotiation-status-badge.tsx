import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NegotiationStatusBadgeProps {
  status: string;
  className?: string;
}

export const NegotiationStatusBadge = ({
  status,
  className,
}: NegotiationStatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();

  let statusClassName = "";

  switch (normalizedStatus) {
    case "active":
      statusClassName =
        "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200";
      break;
    case "pending_buyer_review":
      statusClassName =
        "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200";
      break;
    case "accepted":
      statusClassName =
        "bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200";
      break;
    case "rejected":
      statusClassName =
        "bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200";
      break;
    case "expired":
      statusClassName =
        "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200";
      break;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 font-medium capitalize",
        statusClassName,
        className,
      )}
    >
      {normalizedStatus === "pending_buyer_review" ? "Pending Review" : status}
    </Badge>
  );
};
