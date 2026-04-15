import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { TINT } from "@/lib/tint";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface TransactionRow {
  _id: string;
  displayId: string;
  buyer: string;
  type: string;
  status: string;
  amount: string;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "CLOSED":
    case "SETTLEMENT_RELEASED":
    case "DELIVERY_CONFIRMED":
      return TINT.green;
    case "DISPUTED":
      return TINT.red;
    case "IN_TRANSIT":
    case "LOGISTICS_ASSIGNED":
      return TINT.blue;
    case "ESCROW_FUNDED":
    case "INITIATED":
    case "DOCUMENTS_SUBMITTED":
      return TINT.amber;
    case "CANCELLED":
    case "REFUNDED":
      return TINT.gray;
    default:
      return "";
  }
}

const columns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: "displayId",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium">#{row.original.displayId}</span>
    ),
  },
  {
    accessorKey: "buyer",
    header: "Buyer",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.buyer}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs font-medium">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`text-xs font-medium ${getStatusStyle(row.original.status)}`}
      >
        {row.original.status.toLowerCase().replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { className: "text-right" },
    cell: ({ row }) => (
      <span className="text-right text-sm font-medium">
        {row.original.amount}
      </span>
    ),
  },
];

export function RecentTransactionsTable() {
  const { data, isLoading } = api.admin.transactions.list.useQuery({
    query: { page: "1", limit: "5" },
  });

  const rows = useMemo<TransactionRow[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = (data?.data as any)?.docs;
    if (!Array.isArray(docs)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs.map((tx: any) => ({
      _id: tx._id,
      displayId: tx.displayId?.toString() ?? tx._id,
      buyer: tx.order?.buyerOrganization?.name ?? "Unknown",
      type: tx.order?.transactionType ?? "Purchase",
      status: tx.status ?? "INITIATED",
      amount: formatCurrency(
        tx.order?.totalAmount ?? 0,
        tx.order?.currency ?? "NGN",
      ),
    }));
  }, [data]);

  return (
    <Card className="h-full py-3">
      <CardHeader className="flex flex-row items-center justify-between px-3">
        <CardTitle>Recent Transactions</CardTitle>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/transactions">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-3">
        <DataTable
          columns={columns}
          data={rows}
          isLoading={isLoading}
          emptyContent="No transactions yet."
        />
      </CardContent>
    </Card>
  );
}
