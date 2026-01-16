import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Shield, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AdminUser, AdminRole, AdminStatus } from "../../types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const roleColors: Record<AdminRole, "default" | "secondary" | "destructive" | "outline"> = {
  super_admin: "default",
  manager: "secondary",
  compliance: "outline",
  support: "outline",
};

const statusColors: Record<AdminStatus, string> = {
  active: "text-emerald-500",
  invited: "text-amber-500",
  suspended: "text-rose-500",
};

const statusIcons: Record<AdminStatus, React.ComponentType<{ className?: string }>> = {
  active: CheckCircle2,
  invited: Mail,
  suspended: AlertCircle,
};

export const adminColumns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant={roleColors[role]} className="capitalize">
          {role.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const Icon = statusIcons[status];
      
      return (
        <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${statusColors[status]}`} />
            <span className="capitalize text-sm">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const date = new Date(row.original.lastActive);
      return (
        <span className="text-muted-foreground text-sm">
          {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
            Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 
            "day"
          )}
        </span>
      );
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Details</DropdownMenuItem>
            <DropdownMenuItem>Reset Password</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
              Suspend Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
