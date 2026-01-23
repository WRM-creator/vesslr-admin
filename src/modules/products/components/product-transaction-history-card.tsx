import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductDetails } from "../lib/product-details-model";

interface ProductTransactionHistoryCardProps {
  data: ProductDetails["transactions"];
}

export function ProductTransactionHistoryCard({
  data,
}: ProductTransactionHistoryCardProps) {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-muted/30 grid grid-cols-3 gap-4 rounded-lg border p-4">
        <div>
          <div className="text-muted-foreground text-xs font-medium">Total</div>
          <div className="text-2xl font-bold">{data.totalCount}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs font-medium">
            Completed
          </div>
          <div className="text-2xl font-bold text-green-600">
            {data.completedCount}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs font-medium">
            Active
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {data.activeCount}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  No transactions yet
                </TableCell>
              </TableRow>
            ) : (
              data.history.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {format(new Date(tx.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{tx.buyer}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: tx.currency,
                    }).format(tx.value)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "completed"
                          ? "default"
                          : tx.status === "active"
                            ? "secondary"
                            : "outline"
                      }
                      className="capitalize"
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/transactions/${tx.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
