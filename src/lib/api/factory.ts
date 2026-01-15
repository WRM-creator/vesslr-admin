import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  type UseQueryOptions,
  type UseSuspenseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
  useQueryClient,
} from "@tanstack/react-query";

// Helper to infer the argument type of the SDK function
type InferArgs<T> = T extends (args: infer A) => any ? A : never;

// Helper to infer the return data type (unwrapping the generated response object)
// The generated client returns { data: T, error: E, response: ... }
type InferData<T> = T extends (...args: any) => Promise<infer R>
  ? R extends { data?: infer D }
    ? D
    : R
  : never;

type InferError<T> = T extends (...args: any) => Promise<infer R>
  ? R extends { error?: infer E }
    ? E
    : unknown
  : unknown;

/**
 * Creates a type-safe query hook wrapper around a generated SDK function.
 *
 * @param sdkFn - The generated SDK function to wrap
 * @param baseKeyOrKeyFn - Either a static key array (e.g., ["vendors", "list"]) or
 *                          a function that generates a key from the args (e.g., (args) => ["vendors", "detail", args.path.id])
 */
export function createQuery<TFn extends (...args: any) => any>(
  sdkFn: TFn,
  baseKeyOrKeyFn: string[] | ((args: InferArgs<TFn>) => QueryKey)
) {
  type TArgs = InferArgs<TFn>;
  type TData = InferData<TFn>;

  const getQueryKey = (args: TArgs): QueryKey => {
    if (typeof baseKeyOrKeyFn === "function") {
      return baseKeyOrKeyFn(args);
    }
    return [...baseKeyOrKeyFn, args];
  };

  const queryFn = async (args: TArgs) => {
    const result = await sdkFn(args);
    // The generated client returns an object with handling for errors.
    // We want to throw if there's an error so React Query handles it.
    if ((result as any).error) {
      throw (result as any).error;
    }
    return (result as any).data as TData;
  };

  return {
    useQuery: (
      args: TArgs,
      options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
    ) => {
      return useQuery({
        queryKey: getQueryKey(args),
        queryFn: () => queryFn(args),
        ...options,
      });
    },

    useSuspenseQuery: (
      args: TArgs,
      options?: Omit<UseSuspenseQueryOptions<TData>, "queryKey" | "queryFn">
    ) => {
      return useSuspenseQuery({
        queryKey: getQueryKey(args),
        queryFn: () => queryFn(args),
        ...options,
      });
    },

    queryOptions: (args: TArgs) => ({
      queryKey: getQueryKey(args),
      queryFn: () => queryFn(args),
    }),

    queryKey: (args?: TArgs) => {
      if (typeof baseKeyOrKeyFn === "function") {
        // For dynamic keys, args is required
        return args !== undefined ? baseKeyOrKeyFn(args) : [];
      }
      return [...baseKeyOrKeyFn, args].filter((x) => x !== undefined);
    },
  };
}

// ============================================================================
// OPTIMISTIC UPDATE HELPERS
// ============================================================================

/**
 * API response wrapper type used by the generated client.
 * All API responses follow this structure.
 */
export interface ApiResponse<TData> {
  success?: boolean;
  statusCode?: number;
  message?: string | null;
  data?: TData;
  timestamp?: string;
  metadata?: Record<string, unknown> | null;
}

/**
 * Helper to shallow merge update request body into cached API response.
 *
 * Use this for simple updates where request field names match response field names.
 * For complex cases (computed fields, nested data), write a custom updater.
 *
 * @typeParam TData - The type of the data property in the cached response
 * @typeParam TUpdate - The update object type (must be a subset of TData fields)
 *
 * @example
 * // Type-safe usage - compiler will catch field name mismatches
 * optimistic: {
 *   queryKey: (args) => ["user", "detail", { path: { id: args.path.id } }],
 *   updater: (old, args) => shallowMergeApiResponse<UserDto>(old, args.body ?? {}),
 * }
 */
export function shallowMergeApiResponse<
  TData extends Record<string, unknown>,
  TUpdate extends Partial<TData> = Partial<TData>
>(
  oldData: ApiResponse<TData> | undefined,
  updates: TUpdate
): ApiResponse<TData> | undefined {
  if (!oldData || typeof oldData !== "object") return oldData;

  if (
    !("data" in oldData) ||
    !oldData.data ||
    typeof oldData.data !== "object"
  ) {
    return oldData;
  }

  // Filter out undefined values from updates to avoid overwriting with undefined
  const filteredUpdates: Partial<TData> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      (filteredUpdates as Record<string, unknown>)[key] = value;
    }
  }

  return {
    ...oldData,
    data: {
      ...oldData.data,
      ...filteredUpdates,
    },
  };
}

// ============================================================================
// MUTATION FACTORY
// ============================================================================

/**
 * Configuration for optimistic updates
 */
export interface OptimisticUpdateConfig<TArgs, TData = unknown> {
  /**
   * Returns the query key to optimistically update.
   * This should match a query created with createQuery.
   */
  queryKey: (args: TArgs) => QueryKey;
  /**
   * Updates the cached data optimistically before the mutation completes.
   * Return the new cache value.
   *
   * TIP: Use `shallowMergeApiResponse(oldData, args.body)` for simple merges.
   */
  updater: (oldData: TData, args: TArgs) => TData;
}

/**
 * Configuration object for createMutation
 */
export interface MutationConfig<TArgs> {
  /**
   * Query keys to invalidate after successful mutation.
   * Can return multiple keys to invalidate multiple queries.
   */
  invalidates?: (args: TArgs) => QueryKey[];
  /**
   * Optimistic update configuration.
   * Updates the cache immediately, rolls back on error.
   */
  optimistic?: OptimisticUpdateConfig<TArgs, any>;
}

export function createMutation<TFn extends (...args: any) => any>(
  sdkFn: TFn,
  config?: MutationConfig<InferArgs<TFn>>
) {
  type TArgs = InferArgs<TFn>;
  type TData = InferData<TFn>;
  type TError = InferError<TFn>;

  const mutationFn = async (args: TArgs) => {
    const result = await sdkFn(args);
    if ((result as any).error) {
      throw (result as any).error;
    }
    return (result as any).data as TData;
  };

  return {
    useMutation: (
      options?: Omit<
        UseMutationOptions<TData, TError, TArgs, unknown>,
        "mutationFn" | "onMutate" | "onError" | "onSuccess" | "onSettled"
      > & {
        onMutate?: (variables: TArgs) => Promise<unknown> | unknown;
        onError?: (err: TError, variables: TArgs, context: unknown) => void;
        onSuccess?: (data: TData, variables: TArgs, context: unknown) => void;
        onSettled?: (
          data: TData | undefined,
          err: TError | null,
          variables: TArgs,
          context: unknown
        ) => void;
      }
    ) => {
      const queryClient = useQueryClient();

      // Build optimistic update handlers if configured
      const optimisticHandlers = config?.optimistic
        ? {
            onMutate: async (variables: TArgs) => {
              const queryKey = config.optimistic!.queryKey(variables);

              // Cancel outgoing refetches to avoid overwriting optimistic update
              await queryClient.cancelQueries({ queryKey });

              // Snapshot the previous value for rollback
              const previousData = queryClient.getQueryData(queryKey);

              // Optimistically update cache
              queryClient.setQueryData(queryKey, (old: unknown) =>
                config.optimistic!.updater(old, variables)
              );

              return { previousData, queryKey };
            },
            onError: (
              _err: TError,
              _variables: TArgs,
              context: { previousData: unknown; queryKey: QueryKey } | undefined
            ) => {
              // Rollback on error
              if (context?.previousData !== undefined) {
                queryClient.setQueryData(
                  context.queryKey,
                  context.previousData
                );
              }
            },
            onSettled: (
              _data: TData | undefined,
              _err: TError | null,
              variables: TArgs
            ) => {
              // Always invalidate after settlement to ensure consistency
              if (config?.optimistic) {
                queryClient.invalidateQueries({
                  queryKey: config.optimistic.queryKey(variables),
                });
              }
            },
          }
        : {};

      return useMutation({
        mutationFn,
        ...optimisticHandlers,
        ...options,
        onMutate: async (variables) => {
          // Run factory's optimistic handler first
          let factoryContext = {};
          if (optimisticHandlers.onMutate) {
            factoryContext =
              (await optimisticHandlers.onMutate(variables)) || {};
          }
          // Then run user's onMutate
          const userContext = (await options?.onMutate?.(variables)) || {};
          return { ...factoryContext, ...userContext };
        },
        onError: (err, variables, context) => {
          // Run factory's rollback first
          if (optimisticHandlers.onError) {
            optimisticHandlers.onError(err, variables, context as any);
          }
          // Then run user's onError
          options?.onError?.(err, variables, context);
        },
        onSuccess: (data, variables, context) => {
          // Invalidate configured keys
          if (config?.invalidates) {
            config.invalidates(variables).forEach((key) => {
              queryClient.invalidateQueries({ queryKey: key });
            });
          }
          options?.onSuccess?.(data, variables, context);
        },
        onSettled: (data, err, variables, context) => {
          // Run factory's settlement handler
          if (optimisticHandlers.onSettled) {
            optimisticHandlers.onSettled(data, err, variables);
          }
          // Then run user's onSettled
          options?.onSettled?.(data, err, variables, context);
        },
      });
    },
  };
}
