import type { RouteObject } from "react-router-dom";
import TransactionsPage from "./pages/transactions";

export const transactionRoutes: RouteObject[] = [
  {
    path: "transactions",
    element: <TransactionsPage />,
  },
  {
    path: "transactions/:id",
    lazy: async () => ({
      Component: (await import("./pages/transaction-details")).default,
    }),
  },
];
