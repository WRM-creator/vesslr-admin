import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, X } from "lucide-react";

export interface CmsPageFilters {
  search: string;
  status: string;
}

interface FiltersProps {
  filters: CmsPageFilters;
  onFilterChange: (key: keyof CmsPageFilters, value: string) => void;
  onReset: () => void;
}

export function Filters({ filters, onFilterChange, onReset }: FiltersProps) {
  const hasActiveFilters =
    filters.search || (filters.status && filters.status !== "all");

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search pages..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-8"
        />
      </div>

      <Select
        value={filters.status || "all"}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onReset} className="h-9 px-2 lg:px-3">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
