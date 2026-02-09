import type { RouteObject } from "react-router-dom";
import EscrowsPage from "./pages/escrows";

export const escrowsRoutes: RouteObject[] = [
  {
    path: "escrows",
    element: <EscrowsPage />,
  },
];
