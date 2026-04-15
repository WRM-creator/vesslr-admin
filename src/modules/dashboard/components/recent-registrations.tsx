import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table/data-table";
import { api } from "@/lib/api";
import { TINT } from "@/lib/tint";
import { formatDateTime } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface RegistrationRow {
  _id: string;
  name: string;
  type: string;
  createdAt: string;
  complianceStatus: string;
}

const COMPLIANCE_STYLES: Record<string, string> = {
  pending_review: TINT.amber,
  action_required: TINT.red,
  approved: TINT.green,
  submitted: TINT.blue,
};

const COMPLIANCE_LABELS: Record<string, string> = {
  pending_review: "Pending Review",
  action_required: "Action Required",
  approved: "Approved",
  submitted: "Submitted",
};

const columns: ColumnDef<RegistrationRow>[] = [
  {
    accessorKey: "name",
    header: "Organization",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs font-medium capitalize">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "complianceStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.complianceStatus;
      return (
        <Badge
          variant="outline"
          className={`text-xs ${COMPLIANCE_STYLES[status] ?? ""}`}
        >
          {COMPLIANCE_LABELS[status] ?? (status || "Draft")}
        </Badge>
      );
    },
    meta: { className: "text-right" },
  },
];

export function RecentRegistrations() {
  const { data, isLoading } = api.admin.organizations.list.useQuery({
    query: { page: "1", limit: "5" },
  });

  const rows = useMemo<RegistrationRow[]>(() => {
    const response = data as unknown as
      | { data?: { docs?: Array<Record<string, unknown>> } }
      | undefined;
    const docs = response?.data?.docs;
    if (!Array.isArray(docs)) return [];
    return docs.map((org) => ({
      _id: (org._id as string) ?? "",
      name: (org.name as string) ?? "Unnamed",
      type: (org.type as string) ?? "merchant",
      createdAt: (org.createdAt as string) ?? "",
      complianceStatus: (org.complianceStatus as string) ?? "draft",
    }));
  }, [data]);

  return (
    <Card className="h-full py-3">
      <CardHeader className="flex flex-row items-center justify-between px-3">
        <CardTitle>Recent Registrations</CardTitle>
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/registrations">
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
          loadingRowCount={5}
          emptyContent="No registrations yet."
        />
      </CardContent>
    </Card>
  );
}
