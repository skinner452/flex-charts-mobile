import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";

const getEndpoint = (id: number) => `sessions/${id}`;

export const useDeleteSessionsId = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: getEndpoint(id),
      }),
    onSuccess: (...rest) => {
      queryClient.invalidateQueries({
        queryKey: useGetSessionsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
