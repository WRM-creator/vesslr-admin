"use client";

import { DataTable } from "@/components/shared/data-table";
import type { Escrow } from "../../lib/escrow-model";
import { escrowsColumns } from "./columns";

interface EscrowsTableProps {
  data: Escrow[];
  isLoading?: boolean;
}

export function EscrowsTable({ data, isLoading }: EscrowsTableProps) {
  return (
    <DataTable
      columns={escrowsColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={<div className="py-6 text-center">No escrows found</div>}
    />
  );
}
