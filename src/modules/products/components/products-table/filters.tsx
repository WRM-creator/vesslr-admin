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

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  transactionType: string;
  minPrice: string;
  maxPrice: string;
  dateRange: DateRange | undefined;
}

interface FiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: any) => void;
  onReset: () => void;
}

export function Filters({ filters, onFilterChange, onReset }: FiltersProps) {
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.transactionType !== "all" ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.dateRange;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search products..."
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
        <SheetContent className="m-2 max-h-[calc(100vh_-_0.5rem)] rounded-xl">
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
            <SheetDescription>
              Narrow down your product search with specific criteria.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 px-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => onFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Commodities">Commodities</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Data & Intelligence">
                    Data & Intelligence
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => onFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="in_transaction">In Transaction</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                value={filters.transactionType}
                onValueChange={(value) =>
                  onFilterChange("transactionType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Transactions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="charter">Charter</SelectItem>
                  <SelectItem value="bulk_supply">Bulk Supply</SelectItem>
                  <SelectItem value="spot_trade">Spot Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange("minPrice", e.target.value)}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date Created</Label>
              <DateRangePicker
                initialDateFrom={filters.dateRange?.from}
                initialDateTo={filters.dateRange?.to}
                onUpdate={(values) => onFilterChange("dateRange", values.range)}
                className="justify-start"
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
