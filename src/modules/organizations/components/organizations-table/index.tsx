import { DataTable } from "@/components/shared/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { columns, type OrganizationTableItem } from "./columns";

interface TabItem {
  label: string;
  value: string;
}

interface OrganizationsTableProps {
  data: OrganizationTableItem[];
  isLoading?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  onRowClick?: (row: any) => void;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export function OrganizationsTable({
  data,
  isLoading,
  search,
  onSearchChange,
  title,
  onRowClick,
  tabs,
  activeTab,
  onTabChange,
}: OrganizationsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {(onSearchChange || tabs) && (
        <div className="flex items-center justify-between gap-2">
          {tabs && activeTab && onTabChange && (
            <Select value={activeTab} onValueChange={onTabChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {onSearchChange && (
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
          )}
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
