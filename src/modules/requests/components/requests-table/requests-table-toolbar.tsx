"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cross2Icon } from "@radix-ui/react-icons";

interface RequestTableToolbarProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
  filters: {
    status?: string[];
  };
  onFilterChange: (key: string, value: string[]) => void;
  onReset: () => void;
}

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Matched", value: "MATCHED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function RequestsTableToolbar({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  onReset,
}: RequestTableToolbarProps) {
  const currentStatus = filters.status?.[0] || "all";
  const isFiltered =
    searchValue.length > 0 || (filters.status?.length ?? 0) > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search requests..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <Select
          value={currentStatus}
          onValueChange={(value) => {
            const newStatus = value === "all" ? [] : [value];
            onFilterChange("status", newStatus);
          }}
        >
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
