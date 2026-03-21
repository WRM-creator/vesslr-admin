import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { Building2 } from "lucide-react";
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

function getComplianceBadge(status: string) {
  switch (status) {
    case "pending_review":
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-xs text-amber-700"
        >
          Pending Review
        </Badge>
      );
    case "action_required":
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-xs text-red-700"
        >
          Action Required
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-xs text-green-700"
        >
          Approved
        </Badge>
      );
    case "submitted":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-xs text-blue-700"
        >
          Submitted
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status || "Draft"}
        </Badge>
      );
  }
}

export function RecentRegistrations() {
  const { data, isLoading } = api.admin.organizations.list.useQuery({
    query: { page: "1", limit: "5" },
  });

  const rows = useMemo<RegistrationRow[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = data as any;
    const docs = response?.data?.docs;
    if (!Array.isArray(docs)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs.map((org: any) => ({
      _id: org._id,
      name: org.name ?? "Unnamed",
      type: org.type ?? "merchant",
      createdAt: org.createdAt,
      complianceStatus: org.complianceStatus ?? "draft",
    }));
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/registrations">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No registrations yet.
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((reg) => (
              <div
                key={reg._id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <Building2 className="text-muted-foreground h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{reg.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {reg.type}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {reg.createdAt
                          ? format(new Date(reg.createdAt), "MMM d, yyyy")
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
                {getComplianceBadge(reg.complianceStatus)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
