import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetSessions, useGetSessionsQueryKey } from "./useGetSessions";
import { useGetSessionsIdQueryKey } from "./useGetSessionsId";

const getEndpoint = (id: number) => `sessions/${id}/end`;

export const usePostSessionsIdEnd = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "POST",
        endpoint: getEndpoint(id),
      }),
    onSuccess: (...rest) => {
      // Invalidate the sessions query and the session ID query
      queryClient.invalidateQueries({
        queryKey: useGetSessionsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: useGetSessionsIdQueryKey(id),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
