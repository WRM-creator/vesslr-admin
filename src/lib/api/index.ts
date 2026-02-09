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

import { createMutation, createQuery } from "./factory";

// Import client config to initialize interceptors
import "./client-config";

// Import generated SDK functions as needed
// NOTE: These imports will be available after running `npm run generate:api`
// Uncomment and add imports as you need them:
//
import {
  adminAuthControllerLogin,
  adminAuthControllerVerifyOtp,
  adminTransactionsControllerFindAll,
} from "./generated";

export const api = {
  auth: {
    login: createMutation(adminAuthControllerLogin),
    verifyOtp: createMutation(adminAuthControllerVerifyOtp),
  },
  admin: {
    transactions: {
      list: createQuery(adminTransactionsControllerFindAll, (args) => [
        "admin",
        "transactions",
        "list",
        args?.query,
      ]),
    },
  },
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
