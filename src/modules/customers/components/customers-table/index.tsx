"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { DataTable } from "@/components/shared/data-table";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import type { Customer } from "../../lib/customer-model";
import { getCustomersColumns } from "./columns";
import { CustomersTableFilters } from "./filters";

interface CustomersTableProps {
  data: Customer[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function CustomersTable({ data, isLoading }: CustomersTableProps) {
  const navigate = useNavigate();
  const columns = getCustomersColumns(navigate);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [trustRange, setTrustRange] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Handler to reset all filters
  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRoleFilter("all");
    setTrustRange("all");
    setDateRange(undefined);
    setCurrentPage(1);
  };

  // Filter logic
  const filteredData = data.filter((customer) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = customer.name.toLowerCase().includes(query);
      const matchesEmail = customer.email.toLowerCase().includes(query);
      const matchesCompany = customer.company.toLowerCase().includes(query);
      if (!matchesName && !matchesEmail && !matchesCompany) return false;
    }

    // Status filter
    if (statusFilter !== "all" && customer.status !== statusFilter) {
      return false;
    }

    // Role filter
    if (roleFilter !== "all" && customer.role !== roleFilter) {
      return false;
    }

    // Trust Score filter
    if (trustRange !== "all") {
      const score = customer.trustScore;
      if (trustRange === "high" && score < 80) return false;
      if (trustRange === "medium" && (score < 60 || score >= 80)) return false;
      if (trustRange === "low" && score >= 60) return false;
    }

    // Date range filter
    if (dateRange?.from) {
      const customerDate = new Date(customer.dateRegistered);
      const start = startOfDay(dateRange.from);
      const end = dateRange.to
        ? endOfDay(dateRange.to)
        : endOfDay(dateRange.from);

      if (!isWithinInterval(customerDate, { start, end })) {
        return false;
      }
    }

    return true;
  });

  // Calculate pagination based on filtered data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Adjust current page if it exceeds total pages after filtering
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const emptyContent = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 mb-3 rounded-full p-4">
        <div className="bg-muted size-8 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold">No customers found</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        {searchQuery ||
        statusFilter !== "all" ||
        roleFilter !== "all" ||
        trustRange !== "all" ||
        dateRange
          ? "No customers match your current filters."
          : "There are no registered customers in the system."}
      </p>
      {(searchQuery ||
        statusFilter !== "all" ||
        roleFilter !== "all" ||
        trustRange !== "all" ||
        dateRange) && (
        <button
          onClick={handleReset}
          className="text-primary mt-4 text-sm font-medium hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <CustomersTableFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        roleFilter={roleFilter}
        onRoleChange={(val) => {
          setRoleFilter(val);
          setCurrentPage(1);
        }}
        trustRange={trustRange}
        onTrustRangeChange={(val) => {
          setTrustRange(val);
          setCurrentPage(1);
        }}
        dateRange={dateRange}
        onDateRangeChange={(val) => {
          setDateRange(val);
          setCurrentPage(1);
        }}
        onReset={handleReset}
      />

      <DataTable
        columns={columns}
        data={currentData}
        isLoading={isLoading}
        emptyContent={emptyContent}
        onRowClick={(row) => navigate(`/customers/${row.original.id}`)}
      />
      <DataPagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
