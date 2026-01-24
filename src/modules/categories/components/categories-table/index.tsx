"use client";

import { DataTable } from "@/components/shared/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type CategoryTableItem, getCategoriesColumns } from "./columns";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

interface CategoriesTableProps {
  data: CategoryTableItem[];
  isLoading?: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function CategoriesTable({
  data,
  isLoading,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: CategoriesTableProps) {
  const navigate = useNavigate();
  const columns = getCategoriesColumns(navigate);

  const emptyContent = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 mb-3 rounded-full p-4">
        {/* Placeholder icon */}
        <div className="bg-muted size-8 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold">No categories found</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Get started by creating your first product category.
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="equipment-and-products">
              Products & Equipment
            </TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
        </Tabs>
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
      </div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyContent={emptyContent}
        onRowClick={(row) => navigate(`/categories/${row.original._id}`)}
      />
    </div>
  );
}
