// src/pages/Users.tsx
import { useEffect, useState } from "react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";


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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Users" actions={<Button variant="ghost">Export</Button>} />
        <CardBody>
          {err && <div className="mb-3 badge-err">{err}</div>}

          {loading ? (
            <div>Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-[var(--mutd)]">No users yet.</div>
          ) : (
            <div className="table-wrap">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="th">Name</th>
                    <th className="th">Email</th>
                    <th className="th">Phone</th>
                    <th className="th">Type</th>
                    <th className="th">Status</th>
                    <th className="th">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u._id} className="row-hover">
                      <td className="td">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</td>
                      <td className="td">{u.email}</td>
                      <td className="td">{u.phoneNumber || "—"}</td>
                      <td className="td capitalize">{u.type || "—"}</td>
                      <td className="td">
                        <Badge
                          tone={
                            u.status === "blocked"
                              ? "err"
                              : u.status === "pending"
                              ? "warn"
                              : "ok"
                          }
                        >
                          {u.status || "active"}
                        </Badge>
                      </td>
                      <td className="td">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
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
            <div className="text-sm text-[var(--muted)]">
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
        </CardBody>
      </Card>
    </div>
  );
}
