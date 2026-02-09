/**
 * Central API Export
 *
 * This is the ONLY file you should import from for API calls.
 * All SDK functions are wrapped with React Query factories for
 * automatic caching, type inference, and optimistic updates.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const { data } = api.products.list.useSuspenseQuery({});
 */

import { createMutation } from "./factory";

// Import client config to initialize interceptors
import "./client-config";

// Import generated SDK functions as needed
// NOTE: These imports will be available after running `npm run generate:api`
// Uncomment and add imports as you need them:
//
import {
  adminAuthControllerLogin,
  adminAuthControllerVerifyOtp,
} from "./generated";

// async function getEscrowStats() {
//   const { data } = await client.request<{
//     success: boolean;
//     data: {
//       totalHeld: number;
//       totalTransacted: number;
//       activeCount: number;
//       disputedCount: number;
//       completedCount: number;
//     };
//   }>({
//     url: "/api/v1/admin/escrows/stats",
//     method: "GET",
//   });
//   return data!;
// }

export const api = {
  // Add endpoints as they are needed, following this pattern:
  //
  // products: {
  //   list: createQuery(getApiV1Products, ["products", "list"]),
  //   create: createMutation(postApiV1Products, {
  //     invalidates: () => [["products", "list"]],
  //   }),
  // },
  auth: {
    login: createMutation(adminAuthControllerLogin),
    verifyOtp: createMutation(adminAuthControllerVerifyOtp),
  },
  // admin: {
  //   transactions: {
  //     list: createQuery(getApiV1AdminTransactions, [
  //       "admin",
  //       "transactions",
  //       "list",
  //     ]),
  //     updateStatus: createMutation(patchApiV1AdminTransactionsByIdStatus, {
  //       invalidates: () => [["admin", "transactions", "list"]],
  //     }),
  //   },
  //   escrows: {
  //     list: createQuery(getApiV1AdminEscrows, ["admin", "escrows", "list"]),
  //     detail: createQuery(getApiV1AdminEscrowsById, [
  //       "admin",
  //       "escrows",
  //       "detail",
  //     ]),
  //     stats: createQuery(getEscrowStats, ["admin", "escrows", "stats"]),
  //   },
  //   // users: {
  //   //   list: createQuery(getApiV1AdminUsers, ["admin", "users", "list"]),
  //   // },
  // },
  // categories: {
  //   list: createQuery(getApiV1AdminCategories, ["categories", "list"]),
  //   detail: createQuery(getApiV1AdminCategoriesById, ["categories", "detail"]),
  //   create: createMutation(postApiV1AdminCategories, {
  //     invalidates: () => [["categories", "list"]],
  //   }),
  //   update: createMutation(putApiV1AdminCategoriesById, {
  //     invalidates: () => [["categories", "list"]],
  //   }),
  //   delete: createMutation(deleteApiV1AdminCategoriesById, {
  //     invalidates: () => [["categories", "list"]],
  //   }),
  // },
  // organizations: {
  //   list: createQuery(getApiV1AdminOrganizations, ["organizations", "list"]),
  //   detail: createQuery(getApiV1AdminOrganizationsById, [
  //     "organizations",
  //     "detail",
  //   ]),
  //   create: createMutation(postApiV1AdminOrganizations, {
  //     invalidates: () => [["organizations", "list"]],
  //   }),
  //   update: createMutation(putApiV1AdminOrganizationsById, {
  //     invalidates: () => [["organizations", "list"]],
  //   }),
  //   delete: createMutation(deleteApiV1AdminOrganizationsById, {
  //     invalidates: () => [["organizations", "list"]],
  //   }),
  // },
  // products: {
  //   list: createQuery(getApiV1Products, ["products", "list"]),
  //   detail: createQuery(getApiV1ProductsById, ["products", "detail"]),
  //   update: createMutation(putApiV1ProductsById, {
  //     invalidates: () => [
  //       ["products", "list"],
  //       ["products", "detail"],
  //     ],
  //   }),
  //   updateStatus: createMutation(patchApiV1ProductsByIdStatus, {
  //     invalidates: () => [
  //       ["products", "list"],
  //       ["products", "detail"],
  //     ],
  //   }),
  // },
  // vendors: {
  //   detail: createQuery(getApiV1VendorsById, ["vendors", "detail"]),
  //   payments: {
  //     list: createQuery(getApiV1VendorsByIdPayments, [
  //       "vendors",
  //       "payments",
  //       "list",
  //     ]),
  //     create: createMutation(postApiV1VendorsByIdPayments, {
  //       invalidates: () => [["vendors", "payments", "list"]],
  //     }),
  //   },
  // },
};

// Re-export factory utilities for advanced usage
export {
  createMutation,
  createQuery,
  shallowMergeApiResponse,
} from "./factory";
export type {
  ApiResponse,
  MutationConfig,
  OptimisticUpdateConfig,
} from "./factory";

export { clearAuthTokens, getAuthToken, isAuthenticated, logout } from "./auth";
