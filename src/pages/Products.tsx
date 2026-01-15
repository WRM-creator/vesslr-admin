import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

type Category = { _id: string; name: string; slug: string };
type Product = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  category?: string | Category;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "" | "pending" | "approved" | "rejected"
  >("");
  const [cat, setCat] = useState<string>("");

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  function toastSuccess(m: string) {
    setOk(m);
    setErr("");
    setTimeout(() => setOk(""), 2500);
  }
  function toastError(m: string) {
    setErr(m);
    setOk("");
    setTimeout(() => setErr(""), 3500);
  }

  async function load() {
    setLoading(true);
    try {
      const pr = await api.get("/products");
      const list: Product[] =
        pr.data?.data?.docs || pr.data?.data || pr.data || [];
      setProducts(list);

      const cr = await api.get("/categories");
      const cats: Category[] =
        cr.data?.data?.docs || cr.data?.data || cr.data || [];
      setCategories(cats);
    } catch (e: any) {
      toastError(
        e?.response?.data?.message || e.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      const byQ =
        !term ||
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      const byStatus = !status || p.status === status;
      const byCat =
        !cat ||
        (typeof p.category === "string"
          ? p.category === cat
          : p.category?._id === cat);
      return byQ && byStatus && byCat;
    });
  }, [products, q, status, cat]);

  const createProduct = async () => {
    if (!form.title.trim() || !form.category) {
      toastError("Title and Category are required");
      return;
    }
    setCreating(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        price: form.price ? Number(form.price) : undefined,
        category: form.category,
      };
      await api.post("/products", body);
      setForm({ title: "", description: "", price: "", category: "" });
      toastSuccess("Product created");
      await load();
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    try {
      await api.patch(`/products/${id}/status`, { status: newStatus });
      toastSuccess(`Status set to ${newStatus}`);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (e: any) {
      toastError(
        e?.response?.data?.message || e.message || "Failed to update status"
      );
    }
  };

  const deleteProduct = async (id: string) => {
    const p = products.find((x) => x._id === id);
    if (!confirm(`Delete product "${p?.title || id}"? This cannot be undone.`))
      return;
    try {
      await api.delete(`/products/${id}`);
      toastSuccess("Product deleted");
      setProducts((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  const getStatusVariant = (status?: string) => {
    if (status === "approved") return "default";
    if (status === "rejected") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      {ok && (
        <div className="p-3 bg-green-100 text-green-800 rounded">{ok}</div>
      )}
      {err && <div className="p-3 bg-red-100 text-red-800 rounded">{err}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category…" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="md:col-span-4"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <Button onClick={createProduct} disabled={creating}>
            {creating ? "Creating…" : "Create"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search title/description…"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQ(e.target.value)
              }
              className="w-64"
            />
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as typeof status)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cat} onValueChange={(value) => setCat(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-muted-foreground">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2 w-64">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const categoryName =
                      typeof p.category === "string"
                        ? categories.find((c) => c._id === p.category)?.name ||
                          "—"
                        : p.category?.name || "—";
                    return (
                      <tr key={p._id} className="border-t hover:bg-muted/50">
                        <td className="p-2">{p.title}</td>
                        <td className="p-2">{categoryName}</td>
                        <td className="p-2">
                          {typeof p.price === "number" ? p.price : "—"}
                        </td>
                        <td className="p-2">
                          <Badge variant={getStatusVariant(p.status)}>
                            {p.status || "pending"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(p._id, "approved")}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(p._id, "rejected")}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(p._id, "pending")}
                            >
                              Mark Pending
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProduct(p._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
