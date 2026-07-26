import type { RouteObject } from "react-router-dom";
import NotificationsPage from "./pages/notifications";

export const notificationsRoutes: RouteObject[] = [
  {
    path: "notifications",
    element: <NotificationsPage />,
  },
];
