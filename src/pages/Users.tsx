// src/pages/users.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  status?: string;
  type?: string;
  createdAt?: string;
};

export default function Users() {
  const [rows, setRows] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const limit = 10;

  async function loadUsers() {
    setLoading(true);
    setErr("");
    try {
      const r = await api.get("/admin/users", { params: { page, limit } });
      const data = r.data?.data || {};
      setRows(data.docs || []);
      setTotal(data.totalDocs || 0);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Failed to load users");
      console.error("Users load error:", e?.response?.data || e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [page]);

  const getStatusVariant = (status?: string) => {
    if (status === "blocked") return "destructive";
    if (status === "pending") return "secondary";
    return "default";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardAction>
            <Button variant="ghost">Export</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {err && <div className="mb-3 text-destructive">{err}</div>}

          {loading ? (
            <div>Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-muted-foreground">No users yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-muted/50">
                      <td className="p-2">
                        {[u.firstName, u.lastName].filter(Boolean).join(" ") ||
                          "—"}
                      </td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.phoneNumber || "—"}</td>
                      <td className="p-2 capitalize">{u.type || "—"}</td>
                      <td className="p-2">
                        <Badge variant={getStatusVariant(u.status)}>
                          {u.status || "active"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} • Total {total}
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={rows.length < limit}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
