// src/pages/orders.tsx
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

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

  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      case "paid":
      case "shipped":
        return "outline";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {ok && <div className="mb-3 text-green-600">{ok}</div>}
          {err && <div className="mb-3 text-destructive">{err}</div>}

          {loading ? (
            <div>Loading…</div>
          ) : !data || data.docs.length === 0 ? (
            <div className="text-muted-foreground">No orders yet.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Order ID</th>
                      <th className="text-left p-2">Product</th>
                      <th className="text-left p-2">Buyer</th>
                      <th className="text-left p-2">Qty</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Created</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.docs.map((o) => (
                      <tr key={o._id} className="border-t hover:bg-muted/50">
                        <td className="p-2">{o._id}</td>
                        <td className="p-2">{o.product?.name || "—"}</td>
                        <td className="p-2">
                          {[o.buyer?.firstName, o.buyer?.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                            o.buyer?.email ||
                            "—"}
                        </td>
                        <td className="p-2">{o.quantity ?? "—"}</td>
                        <td className="p-2">
                          {typeof o.price === "number"
                            ? `$${o.price.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="p-2 capitalize">
                          <Badge variant={getStatusVariant(o.status)}>
                            {o.status || "pending"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="p-2 space-x-2 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatus(o._id, "paid")}
                          >
                            Mark Paid
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatus(o._id, "shipped")}
                          >
                            Mark Shipped
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStatus(o._id, "completed")}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
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
                <div className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}
