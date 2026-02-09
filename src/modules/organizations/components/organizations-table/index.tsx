import { DataTable } from "@/components/shared/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { columns, type OrganizationTableItem } from "./columns";
// import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"; // Assuming this exists or using standard Input
import { Input } from "@/components/ui/input"; // Fallback to standard Input if InputGroup not found globally

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
      {/* Search Bar and Tabs if provided */}
      {(onSearchChange || tabs) && (
        <div className="flex items-center justify-between gap-4">
          {tabs && activeTab && onTabChange ? (
            <Tabs
              defaultValue={tabs[0].value}
              value={activeTab}
              onValueChange={onTabChange}
            >
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : (
            <div /> /* Spacer if no tabs */
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
