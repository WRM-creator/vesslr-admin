import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Inbox,
  MessageSquare,
} from "lucide-react";

interface SupportStatsProps {
  stats: {
    open?: number;
    inProgress?: number;
    awaitingAdmin?: number;
    awaitingUser?: number;
    resolved?: number;
    total?: number;
  };
}

export function SupportStats({ stats }: SupportStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open</CardTitle>
          <Inbox className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.open ?? 0}</div>
          <p className="text-muted-foreground text-xs">New tickets</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgress ?? 0}</div>
          <p className="text-muted-foreground text-xs">Being worked on</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Awaiting Admin</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.awaitingAdmin ?? 0}</div>
          <p className="text-muted-foreground text-xs">Needs admin response</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Awaiting User</CardTitle>
          <MessageSquare className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.awaitingUser ?? 0}</div>
          <p className="text-muted-foreground text-xs">
            Waiting for user reply
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.resolved ?? 0}</div>
          <p className="text-muted-foreground text-xs">
            Successfully closed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
