import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetSessionsQueryKey } from "./useGetSessions";
import { fetchGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";

export const usePostSessionsIdEnd = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "POST",
        endpoint: `sessions/${id}/end`,
      }),
    onSuccess: (...rest) => {
      queryClient.invalidateQueries({
        queryKey: fetchGetSessionsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: fetchGetExercisesIdStatsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
