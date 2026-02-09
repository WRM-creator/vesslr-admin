import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { getDisputes, type Dispute } from "@/lib/api/disputes";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Link, useOutletContext } from "react-router-dom";

export function MerchantDisputesTab() {
  const { organization } = useOutletContext<{
    organization: { _id: string };
  }>();

  const { data, isLoading } = useQuery({
    queryKey: ["disputes", "merchant", organization._id],
    queryFn: () =>
      getDisputes({
        page: 1,
        limit: 10,
        respondent: organization._id,
      }),
  });

  const columns: ColumnDef<Dispute>[] = [
    {
      accessorKey: "_id",
      header: "Dispute ID",
      cell: ({ row }) => {
        const dispute = row.original;
        // Use transaction ID if available, otherwise fallback (though API implies it exists)
        const transactionId = dispute.transaction?._id;

        return (
          <Link
            to={`/transactions/${transactionId}?tab=disputes`}
            className="font-medium hover:underline"
          >
            {dispute._id}
          </Link>
        );
      },
    },
    {
      accessorKey: "transaction.product.title",
      header: "Product",
      cell: ({ row }) => (
        <span
          className="block max-w-[200px] truncate"
          title={row.original.transaction?.product?.title}
        >
          {row.original.transaction?.product?.title || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "open"
            ? "destructive"
            : status === "resolved_release"
              ? "default"
              : "secondary";

        return (
          <Badge
            variant={variant}
            className={`capitalize ${
              status === "resolved_release"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : ""
            }`}
          >
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("amount")),
    },
    {
      accessorKey: "createdAt",
      header: "Date Opened",
      cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dispute History</h3>
      </div>
      <DataTable
        columns={columns}
        data={data?.data.docs || []}
        isLoading={isLoading}
      />
    </div>
  );
}
