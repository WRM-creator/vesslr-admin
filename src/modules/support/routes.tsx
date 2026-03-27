import type { RouteObject } from "react-router-dom";
import SupportPage from "./pages/support";
import TicketDetailPage from "./pages/ticket-detail";

export const supportRoutes: RouteObject[] = [
  { path: "support", element: <SupportPage /> },
  { path: "support/:id", element: <TicketDetailPage /> },
];
