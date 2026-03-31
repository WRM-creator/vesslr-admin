"use client";

import { Thumbnail } from "@/components/shared/thumbnail";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

export interface CategoryTableItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export const getCategoriesColumns = (
  onToggleActive: (id: string, current: boolean) => void,
  isPending: boolean,
  onEdit: (category: CategoryTableItem) => void,
): ColumnDef<CategoryTableItem>[] => [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Thumbnail src={row.original.image} alt={row.original.name} size="lg" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.slug}
          </span>
        </div>
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
      <div className="flex items-center justify-end gap-2">
        <Switch
          checked={row.original.isActive}
          disabled={isPending}
          onCheckedChange={() =>
            onToggleActive(row.original._id, row.original.isActive)
          }
        />
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="size-3.5" />
        </Button>
      </div>
    ),
  },
];
