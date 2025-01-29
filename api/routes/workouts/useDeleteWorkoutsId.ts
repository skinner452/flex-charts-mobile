import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetWorkoutsQueryKey } from "./useGetWorkouts";
import { fetchGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { invalidateQueryKeys } from "@/utils/invalidateQueryKeys";
import { fetchStatsQueryKey } from "../stats/fetchStatsQueryKey";

export const useDeleteWorkoutsId = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: `workouts/${id}`,
      }),
    onSuccess: (response, ...rest) => {
      invalidateQueryKeys(
        queryClient,
        fetchGetWorkoutsQueryKey(),
        fetchGetExercisesIdStatsQueryKey(),
        fetchStatsQueryKey()
      );

      options?.onSuccess?.(response, ...rest);
    },
  });
};
