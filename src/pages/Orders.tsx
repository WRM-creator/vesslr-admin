// src/pages/Orders.tsx
import { useEffect, useState } from "react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import api from "@/lib/api";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";


type Order = {
  _id: string;
  product?: {
    _id: string;
    name?: string;
  };
  buyer?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  seller?: string;
  quantity?: number;
  price?: number;
  status?: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt?: string;
};

type Page<T> = {
  docs: T[];
  page: number;
  totalPages: number;
  totalDocs: number;
};

export default function Orders() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const r = await api.get("/admin/orders", { params: { page, limit: 10 } });
      setData(r.data?.data || r.data);
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const setStatus = async (id: string, status: Order["status"]) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOk("Status updated");
      setTimeout(() => setOk(""), 2000);
      load();
    } catch (e: any) {
      setErr(e.response?.data?.message || e.message);
    }
  };

  const getStatusTone = (status: Order["status"]) => {
    switch (status) {
      case "cancelled":
        return "err";
      case "pending":
        return "warn";
      case "paid":
        return "info";
      case "shipped":
        return "blue";
      case "completed":
        return "ok";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Orders" />
        <CardBody>
          {ok && <div className="mb-3 badge-ok">{ok}</div>}
          {err && <div className="mb-3 badge-err">{err}</div>}

          {loading ? (
            <div>Loading…</div>
          ) : !data || data.docs.length === 0 ? (
            <div className="text-[var(--mutd)]">No orders yet.</div>
          ) : (
            <>
              <div className="table-wrap">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="th">Order ID</th>
                      <th className="th">Product</th>
                      <th className="th">Buyer</th>
                      <th className="th">Qty</th>
                      <th className="th">Price</th>
                      <th className="th">Status</th>
                      <th className="th">Created</th>
                      <th className="th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.docs.map((o) => (
                      <tr key={o._id} className="row-hover">
                        <td className="td">{o._id}</td>
                        <td className="td">{o.product?.name || "—"}</td>
                        <td className="td">
                          {[o.buyer?.firstName, o.buyer?.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                            o.buyer?.email ||
                            "—"}
                        </td>
                        <td className="td">{o.quantity ?? "—"}</td>
                        <td className="td">
                          {typeof o.price === "number"
                            ? `$${o.price.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="td capitalize">
                          <Badge tone={getStatusTone(o.status)}>
                            {o.status || "pending"}
                          </Badge>
                        </td>
                        <td className="td">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="td space-x-2 whitespace-nowrap">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setStatus(o._id, "paid")}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setStatus(o._id, "shipped")}
                          >
                            Mark Shipped
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setStatus(o._id, "completed")}
                          >
                            Complete
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            tone="err"
                            onClick={() => setStatus(o._id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
                  Page {data.page} / {data.totalPages}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={data.page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
