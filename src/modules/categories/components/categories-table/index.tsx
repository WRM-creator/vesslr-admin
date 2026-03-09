"use client";

import { DataTable } from "@/components/shared/data-table";
import { SearchIcon } from "lucide-react";
import { type CategoryTableItem, getCategoriesColumns } from "./columns";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

interface CategoriesTableProps {
  data: CategoryTableItem[];
  isLoading?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
  isToggling?: boolean;
}

export function CategoriesTable({
  data,
  isLoading,
  search,
  onSearchChange,
  onToggleActive,
  isToggling = false,
}: CategoriesTableProps) {
  const columns = getCategoriesColumns(onToggleActive, isToggling);

  return (
    <div className="space-y-4">
      <InputGroup className="max-w-sm">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search categories..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>
      <DataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
