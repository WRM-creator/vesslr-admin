"use client";

import { DateRangePicker } from "@/components/shared/date-range-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterIcon, SearchIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { Escrow } from "../../lib/escrow-model";

export interface EscrowFilters {
  search: string;
  status?: Escrow["status"] | "all";
  merchantName?: string;
  customerName?: string;
  dateRange?: DateRange;
  minAmount?: string;
  maxAmount?: string;
}

interface FiltersProps {
  filters: EscrowFilters;
  onFilterChange: (key: keyof EscrowFilters, value: any) => void;
  onReset: () => void;
}

export function Filters({ filters, onFilterChange, onReset }: FiltersProps) {
  const hasActiveFilters =
    (filters.status && filters.status !== "all") ||
    !!filters.merchantName ||
    !!filters.customerName ||
    !!filters.dateRange ||
    !!filters.minAmount ||
    !!filters.maxAmount;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search by ID or Reference..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-8"
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-[10px]">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="m-2 max-h-[calc(100vh_-_1rem)] rounded-xl">
          <SheetHeader>
            <SheetTitle>Filter Escrows</SheetTitle>
            <SheetDescription>
              Narrow down your escrow search with specific criteria.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 px-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => onFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="held">Held</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Merchant Name</Label>
              <Input
                placeholder="Filter by merchant..."
                value={filters.merchantName || ""}
                onChange={(e) => onFilterChange("merchantName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                placeholder="Filter by customer..."
                value={filters.customerName || ""}
                onChange={(e) => onFilterChange("customerName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount || ""}
                  onChange={(e) => onFilterChange("minAmount", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount || ""}
                  onChange={(e) => onFilterChange("maxAmount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Created</Label>
              <DateRangePicker
                initialDateFrom={filters.dateRange?.from}
                initialDateTo={filters.dateRange?.to}
                onUpdate={(values) => onFilterChange("dateRange", values.range)}
                className="w-full justify-start"
              />
            </div>
          </div>

          <SheetFooter className="gap-2 sm:justify-start">
            <SheetClose asChild>
              <Button type="submit">Apply custom filters</Button>
            </SheetClose>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={onReset} className="px-3">
                Reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {(filters.search || hasActiveFilters) && (
        <Button variant="ghost" onClick={onReset} className="h-9 px-2 lg:px-3">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
