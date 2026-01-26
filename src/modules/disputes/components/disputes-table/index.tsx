"use client";

import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/shared/data-table";
import type { Dispute } from "@/lib/api/disputes";
import { disputesColumns } from "./columns";

interface DisputesTableProps {
  data: Dispute[];
  isLoading?: boolean;
}

export function DisputesTable({ data, isLoading }: DisputesTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      columns={disputesColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={<div className="py-6 text-center">No disputes found</div>}
      onRowClick={(row) => navigate(`/disputes/${row.original._id}`)}
    />
  );
}
