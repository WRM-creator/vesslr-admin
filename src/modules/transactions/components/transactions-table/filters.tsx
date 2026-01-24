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

export interface TransactionFilters {
  search: string;
  status?: string;
  merchantId?: string;
  customerId?: string;
  type?: string;
  paymentStatus?: string;
  complianceStatus?: string;
  dateRange?: DateRange;
}

interface FiltersProps {
  filters: TransactionFilters;
  merchantOptions?: { label: string; value: string }[];
  onFilterChange: (key: keyof TransactionFilters, value: any) => void;
  onReset: () => void;
}

export function Filters({
  filters,
  merchantOptions = [],
  onFilterChange,
  onReset,
}: FiltersProps) {
  // Logic to detect if any filters other than search are active
  const hasActiveFilters =
    (filters.merchantId && filters.merchantId !== "all") ||
    (filters.type && filters.type !== "all") ||
    (filters.paymentStatus && filters.paymentStatus !== "all") ||
    (filters.complianceStatus && filters.complianceStatus !== "all") ||
    !!filters.customerId ||
    !!filters.dateRange;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search transactions..."
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
            <SheetTitle>Filter Transactions</SheetTitle>
            <SheetDescription>
              Narrow down your transaction search with specific criteria.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 px-4">
            <div className="space-y-2">
              <Label>Merchant</Label>
              <Select
                value={filters.merchantId}
                onValueChange={(value) => onFilterChange("merchantId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Merchants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Merchants</SelectItem>
                  {merchantOptions.map((merchant) => (
                    <SelectItem key={merchant.value} value={merchant.value}>
                      {merchant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Customer</Label>
              <Input
                placeholder="Filter by customer..."
                value={filters.customerId || ""}
                onChange={(e) => onFilterChange("customerId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => onFilterChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="payout">Payout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) =>
                  onFilterChange("paymentStatus", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Payment Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Compliance Status</Label>
              <Select
                value={filters.complianceStatus}
                onValueChange={(value) =>
                  onFilterChange("complianceStatus", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Compliance Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compliance Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
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
