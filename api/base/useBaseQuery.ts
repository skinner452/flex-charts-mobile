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
) => {
  const queryResponse = useQuery(
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
      ...options,
    },
    queryClient
  );

  // Injected fix for brief moment when data is missing but no error
  if (!queryResponse.data && !queryResponse.isError) {
    queryResponse.isLoading = true;
    queryResponse.isFetching = true;
  }

  return queryResponse;
};
