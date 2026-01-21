import type { RouteObject } from "react-router-dom";
import ProductsPage from "./pages/products";

export const productsRoutes: RouteObject[] = [
  {
    path: "products",
    element: <ProductsPage />,
  },
];
