import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { useGetSessionsQueryKey } from "./useGetSessions";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
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
        queryKey: useGetSessionsQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: useGetExercisesIdStatsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
