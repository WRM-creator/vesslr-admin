import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Page } from "@/components/shared/page";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { AdminSummaryDto } from "@/lib/api/generated";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { SupportStats } from "../components/support-stats";
import {
  TicketStatusBadge,
  TicketPriorityBadge,
  TicketCategoryBadge,
} from "../components/ticket-status-badge";

interface SupportTicket {
  _id: string;
  displayId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  organization?: {
    _id: string;
    name: string;
    displayId?: string;
  };
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SupportFilters {
  search: string;
  status: string;
  category: string;
  priority: string;
  assignee: string;
}

const ticketColumns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "displayId",
    header: "Ticket ID",
    cell: ({ row }) => (
      <span className="font-medium font-mono text-xs">
        {row.original.displayId
          ? `TKT-${String(row.original.displayId).padStart(5, "0")}`
          : row.original._id.slice(-6).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <span
        className="block max-w-[250px] truncate"
        title={row.original.subject}
      >
        {row.original.subject}
      </span>
    ),
  },
  {
    accessorKey: "organization.name",
    header: "Organization",
    cell: ({ row }) => row.original.organization?.name || "N/A",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <TicketCategoryBadge category={row.original.category} />
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <TicketPriorityBadge priority={row.original.priority} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <TicketStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "assignedTo.name",
    header: "Assignee",
    cell: ({ row }) => row.original.assignedTo?.name || "Unassigned",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateTime(row.getValue("createdAt")),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Activity",
    cell: ({ row }) => formatDateTime(row.getValue("updatedAt")),
  },
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<SupportFilters>({
    search: "",
    status: "all",
    category: "all",
    priority: "all",
    assignee: "all",
  });

  const queryParams = React.useMemo(() => {
    const q: Record<string, string> = {
      page: String(page),
      limit: "25",
    };
    if (filters.status !== "all") q.status = filters.status;
    if (filters.category !== "all") q.category = filters.category;
    if (filters.priority !== "all") q.priority = filters.priority;
    if (filters.assignee !== "all") q.assignee = filters.assignee;
    if (filters.search) q.search = filters.search;
    return q;
  }, [page, filters]);

  const { data: statsData } = api.support.stats.useQuery(undefined as never);
  const { data: ticketsData, isLoading } = api.support.list.useQuery({
    query: queryParams,
  } as never);
  const { data: adminsData } = api.support.adminSummary.useQuery(
    undefined as never,
  );

  const statsInner = (statsData as any)?.data ?? {};
  const ticketsInner = (ticketsData as any)?.data ?? {};
  const tickets: SupportTicket[] = ticketsInner.docs ?? [];

  const admins = ((adminsData as any)?.data ?? []) as unknown as AdminSummaryDto[];

  const pagination = {
    totalDocs: ticketsInner.totalDocs ?? 0,
    totalPages: ticketsInner.totalPages ?? 1,
    page: ticketsInner.page ?? 1,
  };

  const handleFilterChange = (key: keyof SupportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
      category: "all",
      priority: "all",
      assignee: "all",
    });
    setPage(1);
  };

  const isFiltered =
    filters.search ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.priority !== "all" ||
    filters.assignee !== "all";

  return (
    <Page>
      <PageHeader
        title="Support Tickets"
        description="Manage and respond to support requests."
      />

      <SupportStats
        stats={{
          open: statsInner.byStatus?.open ?? 0,
          inProgress: statsInner.byStatus?.in_progress ?? 0,
          awaitingAdmin: statsInner.byStatus?.awaiting_admin ?? 0,
          awaitingUser: statsInner.byStatus?.awaiting_user ?? 0,
          resolved: statsInner.byStatus?.resolved ?? 0,
          total: statsInner.total ?? 0,
        }}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search by subject or ticket ID..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="awaiting_admin">Awaiting Admin</SelectItem>
                <SelectItem value="awaiting_user">Awaiting User</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority}
              onValueChange={(value) => handleFilterChange("priority", value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.assignee}
              onValueChange={(value) => handleFilterChange("assignee", value)}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {admins.map((admin) => (
                  <SelectItem key={admin._id} value={admin._id}>
                    {admin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <DataTable
          columns={ticketColumns}
          data={tickets}
          isLoading={isLoading}
          emptyContent={
            <div className="py-6 text-center">No support tickets found</div>
          }
          onRowClick={(row) => navigate(`/support/${row.original._id}`)}
          renderBelowTable={
            pagination.totalPages > 1 ? (
              <div className="flex items-center justify-between px-2 py-4">
                <p className="text-muted-foreground text-sm">
                  Showing page {pagination.page} of {pagination.totalPages} (
                  {pagination.totalDocs} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : undefined
          }
        />
      </div>
    </Page>
  );
}
