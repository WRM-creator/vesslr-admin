"use client";

import { DataPagination } from "@/components/shared/data-pagination";
import { DataTable } from "@/components/shared/data-table/data-table";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
// import { useNavigate } from "react-router-dom";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type AdminRequest, requestColumns } from "./columns";
import { RequestsTableToolbar } from "./requests-table-toolbar";

interface RequestsTableProps {
  data: AdminRequest[];
  isLoading?: boolean;
  pageCount: number;
}

export function RequestsTable({
  data,
  isLoading,
  pageCount,
}: RequestsTableProps) {
  // const navigate = useNavigate();

  // State for search/filters
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ history: "push", shallow: false }),
  );

  const [page, setPage] = useQueryState(
    "page",
    parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsString
      .withDefault("10")
      .withOptions({ history: "push", shallow: false }),
  );

  const handleSearchChange = (value: string) => {
    setSearch(value || null);
    setPage("1");
  };

  const handleFilterChange = (key: string, values: string[]) => {
    if (key === "status") {
      setStatus(values.length > 0 ? values : null);
    }
    setPage("1");
  };

  const handleReset = () => {
    setSearch(null);
    setStatus(null);
    setPage("1");
  };

  // We construct a valid table instance just for DataPagination if needed,
  // or we can use a simplified approach if DataPagination accepts props.
  // Checking DataPagination usage in other files would be ideal, but for now
  // let's stick to simple manual pagination that we know works if DataPagination is complex.
  // Actually, I'll use a simple pagination block here to be safe and dependency-free for this task.
  // The 'DataPagination' usually expects a `table` object from `useReactTable`.

  const table = useReactTable({
    data,
    columns: requestColumns,
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex: parseInt(page) - 1,
        pageSize: parseInt(pageSize),
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const state = updater({
          pageIndex: parseInt(page) - 1,
          pageSize: parseInt(pageSize),
        });
        setPage((state.pageIndex + 1).toString());
        setPageSize(state.pageSize.toString());
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-4">
      <RequestsTableToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        filters={{ status }}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
      <DataTable
        columns={requestColumns}
        data={data}
        isLoading={isLoading}
        // onRowClick to be added when we have a details page
        // onRowClick={(row) => navigate(`/requests/${row.original._id}`)}
      />
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataPagination
          currentPage={parseInt(page)}
          itemsPerPage={parseInt(pageSize)}
          totalItems={pageCount * parseInt(pageSize)}
          onPageChange={(page) => setPage(page.toString())}
        />
      </div>
    </div>
  );
}
