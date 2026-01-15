import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("dev@vesslr.com");
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  // for display only
  const base =
    (api as any)?.defaults?.baseURL ||
    (import.meta.env.VITE_API_BASE as string) ||
    "http://localhost:8001/api/v1";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      // Hit the admin login route relative to VITE_API_BASE
      const resp = await api.post("/admin/auth/login", { email, password });

      // Adjust these two lines if your response shape differs
      const token =
        resp?.data?.data?.token ??
        resp?.data?.token ??
        resp?.data?.access_token;
      const refreshToken =
        resp?.data?.data?.refreshToken ?? resp?.data?.refreshToken;
      const expiresAt = resp?.data?.data?.expiresAt ?? resp?.data?.expiresAt;

      if (!token) throw new Error("No token in response");

      // Use AuthProvider's login to save tokens and update state
      login(token, refreshToken, expiresAt);

      // Go where user tried to go before login, else dashboard/home
      const next = (loc.state as any)?.from || "/admin/dashboard";
      nav(next, { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Login failed");
      console.error("login error", e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>

        {!!err && (
          <div className="rounded bg-red-100 text-red-800 px-3 py-2">{err}</div>
        )}

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Email</span>
          <input
            className="border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Password</span>
          <input
            type="password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-xs text-gray-500">
          API base: <code>{String(base)}</code>
        </p>
      </form>
    </div>
  );
}
