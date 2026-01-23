import type { RouteObject } from "react-router-dom";
import ProductDetailsPage from "./pages/product-details";
import ProductsPage from "./pages/products";

export const productsRoutes: RouteObject[] = [
  {
    path: "products",
    element: <ProductsPage />,
  },
  {
    path: "products/:id",
    element: <ProductDetailsPage />,
  },
];
