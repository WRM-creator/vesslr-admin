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

import { createQuery, createMutation } from "./factory";

// Import client config to initialize interceptors
import "./client-config";

// Import generated SDK functions as needed
// NOTE: These imports will be available after running `npm run generate:api`
// Uncomment and add imports as you need them:
//
// import {
//   getApiV1Products,
//   postApiV1Products,
//   // ... add more as needed
// } from "./generated";

export const api = {
  // Add endpoints as they are needed, following this pattern:
  //
  // products: {
  //   list: createQuery(getApiV1Products, ["products", "list"]),
  //   create: createMutation(postApiV1Products, {
  //     invalidates: () => [["products", "list"]],
  //   }),
  // },
};

// Re-export factory utilities for advanced usage
export {
  createQuery,
  createMutation,
  shallowMergeApiResponse,
} from "./factory";
export type {
  ApiResponse,
  MutationConfig,
  OptimisticUpdateConfig,
} from "./factory";

export { logout, isAuthenticated, getAuthToken, clearAuthTokens } from "./auth";
