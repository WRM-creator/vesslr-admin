import type { RouteObject } from "react-router-dom";
import Products from "./pages/products";

export const productRoutes: RouteObject[] = [
  {
    path: "products",
    element: <Products />,
  },
];
