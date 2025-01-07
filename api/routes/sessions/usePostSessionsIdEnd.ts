import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";

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
      queryClient.invalidateQueries({
        queryKey: useGetSessionsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: useGetExercisesIdStatsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
