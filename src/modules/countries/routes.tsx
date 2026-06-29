import type { RouteObject } from "react-router-dom";
import CountriesPage from "./pages/countries";

export const countriesRoutes: RouteObject[] = [
  {
    path: "countries",
    element: <CountriesPage />,
  },
];
