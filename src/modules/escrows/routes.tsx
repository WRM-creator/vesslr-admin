import type { RouteObject } from "react-router-dom";
import EscrowDetailsPage from "./pages/escrow-details";
import EscrowsPage from "./pages/escrows";

export const escrowsRoutes: RouteObject[] = [
  {
    path: "escrows",
    element: <EscrowsPage />,
  },
  {
    path: "escrows/:id",
    element: <EscrowDetailsPage />,
  },
];
