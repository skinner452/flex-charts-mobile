import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetSessionsQueryKey } from "./useGetSessions";
import { fetchGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { invalidateQueryKeys } from "@/utils/invalidateQueryKeys";

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
      invalidateQueryKeys(
        queryClient,
        fetchGetSessionsQueryKey(),
        fetchGetExercisesIdStatsQueryKey()
      );

      options?.onSuccess?.(...rest);
    },
  });
};
