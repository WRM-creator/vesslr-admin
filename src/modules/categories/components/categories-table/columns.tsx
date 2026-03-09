"use client";

import { Switch } from "@/components/ui/switch";
import type { ColumnDef } from "@tanstack/react-table";

export interface CategoryTableItem {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export const getCategoriesColumns = (
  onToggleActive: (id: string, current: boolean) => void,
  isPending: boolean,
): ColumnDef<CategoryTableItem>[] => [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.original.name}</span>
        <span className="text-muted-foreground text-xs">
          {row.original.slug}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`rounded-full px-2 py-1 text-xs ${row.original.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="flex justify-end">Active</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Switch
          checked={row.original.isActive}
          disabled={isPending}
          onCheckedChange={() =>
            onToggleActive(row.original._id, row.original.isActive)
          }
        />
      </div>
    ),
  },
];
