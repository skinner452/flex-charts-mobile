import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { Session } from "@/types/sessions";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetSessionsIdQueryKey = (id: number) => {
  const queryKey = ["sessions", "id"] as any[];
  if (id) queryKey.push({ id });
  return queryKey;
};

export const useGetSessionsId = (
  id: number,
  options?: Partial<UseQueryOptions<Session>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Session>({ method: "GET", endpoint: `sessions/${id}` }),
    queryKey: useGetSessionsIdQueryKey(id),
  });
};
