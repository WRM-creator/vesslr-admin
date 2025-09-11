import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

type Category = {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [q, setQ] = useState("");

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  function toastSuccess(msg: string) {
    setOk(msg);
    setErr("");
    setTimeout(() => setOk(""), 2500);
  }

  function toastError(msg: string) {
    setErr(msg);
    setOk("");
    setTimeout(() => setErr(""), 3500);
  }

  // Load categories (public endpoint)
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/categories"); // ✅ public
      const data: Category[] = r.data?.data?.docs || r.data?.data || r.data || [];
      setItems(data);
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term)
    );
  }, [items, q]);

  // Create category (admin endpoint)
  const createCategory = async () => {
    if (!newName.trim()) {
      toastError("Please enter a category name");
      return;
    }
    setCreating(true);
    try {
      await api.post("/admin/categories", { name: newName.trim() }); // ✅ admin
      setNewName("");
      toastSuccess("Category created");
      await load();
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Update category (admin endpoint)
  const saveEdit = async (id: string) => {
    if (!editingName.trim()) {
      toastError("Name cannot be empty");
      return;
    }
    try {
      await api.put(`/admin/categories/${id}`, { name: editingName.trim() }); // ✅ admin
      toastSuccess("Category updated");
      setEditingId(null);
      setEditingName("");
      await load();
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Update failed");
    }
  };

  // Delete category (admin endpoint)
  const remove = async (id: string) => {
    const cat = items.find((x) => x._id === id);
    if (!confirm(`Delete category "${cat?.name || id}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/categories/${id}`); // ✅ admin
      toastSuccess("Category deleted");
      await load();
    } catch (e: any) {
      toastError(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {!!ok && <div className="rounded bg-green-100 text-green-800 px-3 py-2">{ok}</div>}
      {!!err && <div className="rounded bg-red-100 text-red-800 px-3 py-2">{err}</div>}

      {/* Create */}
      <section className="bg-white shadow rounded p-4 space-y-3">
        <h2 className="text-lg font-semibold">Create Category</h2>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Category name (e.g., Metals)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={createCategory}
            disabled={creating}
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </div>
      </section>

      {/* List / Search */}
      <section className="bg-white shadow rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Categories</h2>
          <input
            className="border rounded px-3 py-2"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-6">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-6 text-gray-500">No categories found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Slug</th>
                  <th className="py-2 px-3">Created</th>
                  <th className="py-2 px-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className="border-b">
                    <td className="py-2 px-3">
                      {editingId === c._id ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="py-2 px-3 text-gray-600">{c.slug}</td>
                    <td className="py-2 px-3 text-gray-600">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="py-2 px-3">
                      {editingId === c._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(c._id)}
                            className="px-3 py-1 rounded bg-black text-white hover:opacity-90"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 rounded border hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(c)}
                            className="px-3 py-1 rounded border hover:bg-gray-50"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => remove(c._id)}
                            className="px-3 py-1 rounded border text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
