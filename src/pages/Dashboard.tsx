import { useEffect, useMemo, useState } from "react";
import axiosLib from "axios";
import type { AxiosInstance } from "axios";

export default function Dashboard() {
  const base = (import.meta.env.VITE_API_BASE as string) || "http://localhost:8001";
  const token = localStorage.getItem("adminToken") || "";

  const api: AxiosInstance = useMemo(
    () =>
      axiosLib.create({
        baseURL: `${base}/api/v1`,
        headers: token ? ({ Authorization: `Bearer ${token}` } as any) : undefined,
      }),
    [base, token]
  );

  const [admins, setAdmins] = useState(0);
  const [products, setProducts] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const a = await api.get("/admin", { params: { page: 1, limit: 1 } });
        setAdmins(a.data?.data?.totalDocs || 0);
      } catch {}
      try {
        const p = await api.get("/products", { params: { page: 1, limit: 1 } });
        setProducts(p.data?.data?.totalDocs || 0);
      } catch {}
    })();
  }, [api]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-gray-500">Admins</div>
          <div className="text-2xl font-semibold">{admins}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-2xl font-semibold">{products}</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="text-sm text-gray-500">Version</div>
          <div className="text-2xl font-semibold">MVP</div>
        </div>
      </div>
    </div>
  );
}
