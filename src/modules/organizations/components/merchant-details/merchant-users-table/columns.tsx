import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export interface MerchantUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleInOrganization?: string;
  jobPosition?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
  createdAt?: string | Date;
  status?: string;
}

export const merchantUserColumns: ColumnDef<MerchantUser>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "roleInOrganization",
    header: "Role",
    cell: ({ row }) => {
      return (
        <span className="capitalize">
          {row.original.roleInOrganization || "Member"}
        </span>
      );
    },
  },
  {
    accessorKey: "jobPosition",
    header: "Job Title",
    cell: ({ row }) => row.original.jobPosition || "-",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => row.original.phoneNumber || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Logic to determine status if not explicitly provided
      const isVerified = row.original.emailVerified;
      // const isCompleted = row.original.onboardingCompleted;

      let status = "Active";
      let variant: "default" | "secondary" | "outline" | "destructive" =
        "outline";

      if (!isVerified) {
        status = "Unverified";
        variant = "secondary";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => {
      if (!row.original.createdAt) return "-";
      return format(new Date(row.original.createdAt), "MMM d, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Member</DropdownMenuItem>
            <DropdownMenuItem>Reset Password</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Remove from Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
