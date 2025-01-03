import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { getQueryKey } from "@/api/base/queryKey";
import { Session } from "@/types/sessions";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const getEndpoint = (id: number) => `sessions/${id}`;

export const useGetSessionsIdQueryKey = (id: number) =>
  getQueryKey(getEndpoint(id));

export const useGetSessionsId = (
  id: number,
  options?: Partial<UseQueryOptions<Session>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () =>
      fetchFromAPI<Session>({ method: "GET", endpoint: getEndpoint(id) }),
    queryKey: useGetSessionsIdQueryKey(id),
  });
};
