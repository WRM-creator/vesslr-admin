import type { RouteObject } from "react-router-dom";
import CustomerDetailsPage from "./pages/customer-details";
import { CustomersPage } from "./pages/customers-page";

export const customersRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <CustomersPage />,
  },
  {
    path: "customers/:id",
    element: <CustomerDetailsPage />,
  },
];
