import { useEffect, useMemo, useState } from "react";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import api from "@/lib/api";
import Badge from "@/components/ui/Badge";



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
  const [status, setStatus] = useState<"" | "pending" | "approved" | "rejected">("");
  const [cat, setCat] = useState<string>("");

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });

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
      const list: Product[] = pr.data?.data?.docs || pr.data?.data || pr.data || [];
      setProducts(list);

      const cr = await api.get("/categories");
      const cats: Category[] = cr.data?.data?.docs || cr.data?.data || cr.data || [];
      setCategories(cats);
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Failed to load products");
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
        (typeof p.category === "string" ? p.category === cat : p.category?._id === cat);
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

  const updateStatus = async (id: string, newStatus: "approved" | "rejected" | "pending") => {
    try {
      await api.patch(`/products/${id}/status`, { status: newStatus });
      toastSuccess(`Status set to ${newStatus}`);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Failed to update status");
    }
  };

  const deleteProduct = async (id: string) => {
    const p = products.find((x) => x._id === id);
    if (!confirm(`Delete product "${p?.title || id}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toastSuccess("Product deleted");
      setProducts((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {ok && <div className="badge-ok">{ok}</div>}
      {err && <div className="badge-err">{err}</div>}

      <Card>
        <CardHeader title="Create Product" />
        <CardBody>
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
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
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Filters" />
        <CardBody>
          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search title/description…"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
            />
            <Select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatus(e.target.value as typeof status)
              }
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
            <Select
              value={cat}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCat(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Products" />
        <CardBody>
          {loading ? (
            <div>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-[var(--mutd)]">No products found.</div>
          ) : (
            <div className="table-wrap">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="th">Title</th>
                    <th className="th">Category</th>
                    <th className="th">Price</th>
                    <th className="th">Status</th>
                    <th className="th">Created</th>
                    <th className="th w-64">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const categoryName =
                      typeof p.category === "string"
                        ? categories.find((c) => c._id === p.category)?.name || "—"
                        : p.category?.name || "—";
                    return (
                      <tr key={p._id} className="row-hover">
                        <td className="td">{p.title}</td>
                        <td className="td">{categoryName}</td>
                        <td className="td">{typeof p.price === "number" ? p.price : "—"}</td>
                        <td className="td">
                          <Badge
                            tone={
                              p.status === "approved"
                                ? "ok"
                                : p.status === "rejected"
                                ? "err"
                                : "warn"
                            }
                          >
                            {p.status || "pending"}
                          </Badge>
                        </td>
                        <td className="td">
                          {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                        </td>
                        <td className="td">
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
        </CardBody>
      </Card>
    </div>
  );
}
