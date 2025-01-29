import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetExercisesQueryKey } from "./useGetExercises";
import { fetchGetWorkoutsQueryKey } from "../workouts/useGetWorkouts";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { invalidateQueryKeys } from "@/utils/invalidateQueryKeys";
import { fetchStatsQueryKey } from "../stats/fetchStatsQueryKey";

export const useDeleteExercisesId = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: `exercises/${id}`,
      }),
    onSuccess: (...rest) => {
      invalidateQueryKeys(
        queryClient,
        fetchGetExercisesQueryKey(),
        fetchGetWorkoutsQueryKey(),
        fetchStatsQueryKey()
      );

      options?.onSuccess?.(...rest);
    },
  });
};
