import { NavLink, Outlet, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
};

export default function DashboardLayout({ children, title }: Props) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login", { replace: true });
  };

  const navItem = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
          isActive ? "bg-vesslr-blue text-white" : "text-[var(--mutd)] hover:bg-white/5"
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-vesslr-border bg-[#0B1424] px-3 py-4 flex flex-col">
        <div className="px-2 py-3 text-lg font-semibold text-white">Vesslr Admin</div>
        <nav className="mt-2 flex-1 space-y-1">
          {navItem("/admin/dashboard", "Dashboard")}
          {navItem("/admin/admins", "Manage Admins")}
          {navItem("/admin/users", "Users")}
          {navItem("/admin/products", "Products")}
          {navItem("/admin/orders", "Orders")}
          {navItem("/admin/categories", "Categories")}
          {navItem("/admin/settings", "Settings")}
        </nav>
        <button
          onClick={logout}
          className="mt-4 w-full rounded-md border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/5 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-auto">
        <header className="border-b border-vesslr-border bg-[#0B1424]/80 backdrop-blur px-6 py-4">
          <h1 className="text-xl font-semibold text-white">{title ?? "Admin Panel"}</h1>
        </header>

        <div className="p-6">
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
