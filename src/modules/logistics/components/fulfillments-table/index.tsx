"use client";

import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/shared/data-table";
import type { Fulfillment } from "../../lib/fulfillment-model";
import { fulfillmentsColumns } from "./columns";

interface FulfillmentsTableProps {
  data: Fulfillment[];
  isLoading?: boolean;
}

export function FulfillmentsTable({ data, isLoading }: FulfillmentsTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      columns={fulfillmentsColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={
        <div className="py-6 text-center">No fulfillments found</div>
      }
      onRowClick={(row) => navigate(`/logistics/${row.original.transactionId}`)}
    />
  );
}
