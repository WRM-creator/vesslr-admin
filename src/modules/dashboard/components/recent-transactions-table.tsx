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
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const recentTransactions = [
  {
    id: "TX-001",
    customer: "Acme Corp",
    total: "$2,500.00",
    status: "closed",
    date: "2024-04-30",
  },
  {
    id: "TX-002",
    customer: "Global Supplies",
    total: "$1,200.00",
    status: "compliance_review",
    date: "2024-04-29",
  },
  {
    id: "TX-003",
    customer: "Tech Solutions",
    total: "$850.00",
    status: "initiated",
    date: "2024-04-29",
  },
  {
    id: "TX-004",
    customer: "BuildIt Inc.",
    total: "$5,400.00",
    status: "closed",
    date: "2024-04-28",
  },
  {
    id: "TX-005",
    customer: "Energy Systems",
    total: "$3,100.00",
    status: "cancelled",
    date: "2024-04-27",
  },
];

export function RecentTransactionsTable() {
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
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.id}</div>
                  <div className="text-muted-foreground hidden text-sm md:inline">
                    {transaction.customer}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {transaction.customer}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge className="text-xs" variant="outline">
                    Purchase
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge
                    className="text-xs"
                    variant={
                      transaction.status === "closed"
                        ? "default"
                        : transaction.status === "initiated"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                  {transaction.date}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
