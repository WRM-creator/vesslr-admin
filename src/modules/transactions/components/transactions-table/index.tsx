"use client";

import { DataTable } from "@/components/shared/data-table";
import { type Transaction, transactionsColumns } from "./columns";

export { transactionsColumns };
export type { Transaction };

interface TransactionsTableProps {
  data: Transaction[];
  isLoading?: boolean;
}

export function TransactionsTable({ data, isLoading }: TransactionsTableProps) {
  const emptyContent = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 mb-3 rounded-full p-4">
        <div className="bg-muted size-8 rounded"></div>
      </div>
      <h3 className="text-lg font-semibold">No transactions found</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Transactions will appear here once they are processed.
      </p>
    </div>
  );

  return (
    <DataTable
      columns={transactionsColumns}
      data={data}
      isLoading={isLoading}
      emptyContent={emptyContent}
    />
  );
}
