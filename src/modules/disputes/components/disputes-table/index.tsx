"use client";

import { DataTable } from "@/components/shared/data-table";
import type { Dispute } from "../../lib/dispute-model";
import { disputesColumns } from "./columns";

interface DisputesTableProps {
  data: Dispute[];
  isLoading?: boolean;
}

export function DisputesTable({ data, isLoading }: DisputesTableProps) {
  return (
    <DataTable
      columns={disputesColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={<div className="py-6 text-center">No disputes found</div>}
    />
  );
}
