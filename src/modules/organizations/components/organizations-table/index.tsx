"use client";

import { DataTable } from "@/components/shared/data-table";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { columns, type OrganizationTableItem } from "./columns";
// import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"; // Assuming this exists or using standard Input
import { Input } from "@/components/ui/input"; // Fallback to standard Input if InputGroup not found globally

interface OrganizationsTableProps {
  data: OrganizationTableItem[];
  isLoading?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  onRowClick?: (row: any) => void;
}

export function OrganizationsTable({
  data,
  isLoading,
  search,
  onSearchChange,
  title,
  onRowClick,
}: OrganizationsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Search Bar - Optional if onSearchChange is provided */}
      {onSearchChange && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />
    </div>
  );
}
