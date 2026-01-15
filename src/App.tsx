// src/app.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/providers/auth-provider";
import ProtectedRoute from "./routes/protected-route";
import DashboardLayout from "./components/dashboard-layout";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Admins from "./pages/admins";
import Users from "./pages/users";
import Products from "./pages/products";
import Settings from "./pages/settings";
import Orders from "./pages/orders";
import Categories from "./pages/categories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="admins" element={<Admins />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="categories" element={<Categories />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
