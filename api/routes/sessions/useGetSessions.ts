import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { Session, SessionFilters } from "@/types/sessions";
import { UseQueryOptions } from "@tanstack/react-query";

export const fetchGetSessionsQueryKey = (filters?: SessionFilters) => {
  const queryKey = ["sessions"] as any[];
  if (filters) queryKey.push(filters);
  return queryKey;
};

export const useGetSessions = (
  filters?: SessionFilters,
  options?: Partial<UseQueryOptions<Session[]>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Session[]>({
        method: "GET",
        endpoint: "sessions",
        params: filters,
      }),
    queryKey: fetchGetSessionsQueryKey(filters),
  });
};
