"use client";

import { DataTable } from "@/components/shared/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../categories-table/input-group";
import {
  type CategoryGroupTableItem,
  getCategoryGroupsColumns,
} from "./columns";

interface CategoryGroupsTableProps {
  data: CategoryGroupTableItem[];
  isLoading?: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function CategoryGroupsTable({
  data,
  isLoading,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
}: CategoryGroupsTableProps) {
  const navigate = useNavigate();
  const columns = getCategoryGroupsColumns(navigate);

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
            placeholder="Search category groups..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>
      </div>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/categories/${row.original._id}`)}
      />
    </div>
  );
}
