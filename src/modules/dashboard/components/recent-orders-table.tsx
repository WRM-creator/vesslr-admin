
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Acme Corp",
    total: "$2,500.00",
    status: "Completed",
    date: "2024-04-30",
  },
  {
    id: "ORD-002",
    customer: "Global Supplies",
    total: "$1,200.00",
    status: "Processing",
    date: "2024-04-29",
  },
  {
    id: "ORD-003",
    customer: "Tech Solutions",
    total: "$850.00",
    status: "Pending",
    date: "2024-04-29",
  },
  {
    id: "ORD-004",
    customer: "BuildIt Inc.",
    total: "$5,400.00",
    status: "Completed",
    date: "2024-04-28",
  },
  {
    id: "ORD-005",
    customer: "Energy Systems",
    total: "$3,100.00",
    status: "Cancelled",
    date: "2024-04-27",
  },
];

export function RecentOrdersTable() {
  return (
    <Card className="xl:col-span-2 h-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Orders</CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent transactions from your store.
          </p>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/orders">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.id}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.customer}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {order.customer}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge className="text-xs" variant="outline">
                    Sale
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Badge
                    className="text-xs"
                    variant={
                      order.status === "Completed"
                        ? "default" // or a success variant if available
                        : order.status === "Processing"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                  {order.date}
                </TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
