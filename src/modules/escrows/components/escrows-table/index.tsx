"use client";

import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/shared/data-table";
import type { Escrow } from "../../lib/escrow-model";
import { escrowsColumns } from "./columns";

interface EscrowsTableProps {
  data: Escrow[];
  isLoading?: boolean;
}

export function EscrowsTable({ data, isLoading }: EscrowsTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      columns={escrowsColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={<div className="py-6 text-center">No escrows found</div>}
      onRowClick={(row) => navigate(`/escrows/${row.original.id}`)}
    />
  );
}
