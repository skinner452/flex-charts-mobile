import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Session, SessionFilters } from "@/types/sessions";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetSessionsQueryKey = (filters?: SessionFilters) => {
  const queryKey = ["sessions"] as any[];
  if (filters) queryKey.push(filters);
  return queryKey;
};

export const useGetSessions = (
  filters?: SessionFilters,
  options?: Partial<UseQueryOptions<Session[]>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () =>
      fetchFromAPI<Session[]>({
        method: "GET",
        endpoint: "sessions",
        params: filters,
      }),
    queryKey: useGetSessionsQueryKey(filters),
  });
};
