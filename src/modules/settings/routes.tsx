import type { RouteObject } from "react-router-dom";
import SettingsPage from "./pages/settings";

export const settingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <SettingsPage />,
  },
];
