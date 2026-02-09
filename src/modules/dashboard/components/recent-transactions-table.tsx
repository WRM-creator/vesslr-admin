import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export function RecentTransactionsTable() {
  const { data: transactionsData, isLoading } =
    api.admin.transactions.list.useQuery({
      query: { page: "1", limit: "5" },
    });

  const recentTransactions = useMemo(() => {
    return transactionsData?.data?.docs || [];
  }, [transactionsData]);

  return (
    <Card className="h-full xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-muted-foreground text-sm">
            Recent activity from your platform.
          </p>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/transactions">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            Loading...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden xl:table-column">Type</TableHead>
                <TableHead className="hidden xl:table-column">Status</TableHead>
                <TableHead className="hidden xl:table-column">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => {
                const displayId =
                  transaction.displayId?.toString() || transaction._id;
                const customerName =
                  transaction.order?.buyerOrganization?.name || "Unknown";
                const amount = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: transaction.order?.currency || "USD",
                }).format(transaction.order?.totalAmount || 0);

                return (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <div className="font-medium">
                        #{displayId.replace("#", "")}
                      </div>
                      <div className="text-muted-foreground hidden text-sm md:inline">
                        {customerName}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {customerName}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Badge className="text-xs" variant="outline">
                        {transaction.order?.transactionType || "Purchase"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Badge
                        className="text-xs"
                        variant={
                          transaction.status === "CLOSED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                      {format(new Date(transaction.createdAt), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-right">{amount}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
