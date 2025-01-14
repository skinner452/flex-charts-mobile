import {
  DefaultError,
  QueryClient,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useBaseQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient
) =>
  useQuery(
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options,
    },
    queryClient
  );
