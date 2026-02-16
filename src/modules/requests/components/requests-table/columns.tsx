import {
  StatusBadge,
  type StatusVariant,
} from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type RequestResponseDto } from "@/lib/api/generated";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface AdminRequest extends RequestResponseDto {}

// Valid status values as per API
const statusStyles: Record<string, StatusVariant> = {
  PENDING: "warning",
  IN_REVIEW: "info",
  MATCHED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const requestColumns: ColumnDef<AdminRequest>[] = [
  {
    accessorKey: "displayId",
    header: "ID",
    cell: ({ row }) => {
      const displayId = row.original.displayId;
      return (
        <span className="font-mono text-sm">
          {displayId ? `#${displayId}` : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-sm whitespace-nowrap">
        {format(new Date(row.original.createdAt), "MMM d, yyyy")}
      </div>
    ),
  },
  {
    id: "organization",
    header: "Organization",
    cell: ({ row }) => {
      const org = row.original.organization;
      return <span className="font-medium">{org.name || "N/A"}</span>;
    },
  },
  {
    id: "requester",
    header: "Requester",
    cell: ({ row }) => {
      const requester = row.original.requester;
      if (!requester || typeof requester !== "object")
        return <span className="text-muted-foreground">-</span>;

      const firstName = "firstName" in requester ? requester.firstName : "";
      const lastName = "lastName" in requester ? requester.lastName : "";
      const email = "email" in requester ? requester.email : "";

      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {firstName} {lastName}
          </span>
          <span className="text-muted-foreground text-xs">{email}</span>
        </div>
      );
    },
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.name || row.original.category.name || "-"}
        </span>
      );
    },
  },
  {
    id: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const qty = row.original.quantity;
      const unit = row.original.unitOfMeasurement;
      if (!qty) return "-";
      return (
        <div className="font-medium">
          {qty.toLocaleString()}{" "}
          <span className="text-muted-foreground text-xs">{unit}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "targetPricePerUnit",
    header: "Target Price",
    cell: ({ row }) => {
      const price = row.original.targetPricePerUnit;
      const currency = row.original.currency || "USD";

      if (price === undefined || price === null) return "-";

      return (
        <div className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          }).format(price)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const state = row.original.status;
      if (!state) return <Badge variant="outline">Unknown</Badge>;
      // Map API status to StatusVariant if needed, or loosely type it
      const variant = statusStyles[state] || "neutral";
      return <StatusBadge status={state} variant={variant} />;
    },
  },
  {
    id: "matchedSeller",
    header: "Matched Seller",
    cell: ({ row }) => {
      const seller = row.original.matchedSeller;
      if (!seller) return <span className="text-muted-foreground">-</span>;

      return (
        <span className="font-medium text-emerald-600">
          {seller.name || "Matched"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line
      const navigate = useNavigate();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/requests/${row.original._id}`)}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
