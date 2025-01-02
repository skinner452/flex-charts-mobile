import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { getQueryKey } from "@/api/base/queryKey";
import { Session, SessionFilters } from "@/types/sessions";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const endpoint = "sessions";

export const useGetSessionsQueryKey = (filters?: SessionFilters) =>
  getQueryKey(endpoint, filters);

export const useGetSessions = (
  filters?: SessionFilters,
  options?: Partial<UseQueryOptions<Session[]>>
) => {
  return useQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Session[]>({ method: "GET", endpoint, params: filters }),
    queryKey: useGetSessionsQueryKey(filters),
  });
};
