import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDisputeStats } from "@/lib/api/disputes";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Scale } from "lucide-react";

export function DisputeStats() {
  const { data: stats } = useQuery({
    queryKey: ["disputes", "stats"],
    queryFn: getDisputeStats,
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
          <Scale className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalDocs || 0}</div>
          <p className="text-muted-foreground text-xs">
            All time disputes raised
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.openDocs || 0}</div>
          <p className="text-muted-foreground text-xs">
            Currently active requiring attention
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.resolvedDocs || 0}</div>
          <p className="text-muted-foreground text-xs">
            Successfully closed disputes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
