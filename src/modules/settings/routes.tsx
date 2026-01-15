import type { RouteObject } from "react-router-dom";
import Settings from "./pages/settings";

export const settingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: <Settings />,
  },
];
