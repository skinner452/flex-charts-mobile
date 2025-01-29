import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Workout, WorkoutCreate } from "@/types/workouts";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetWorkoutsQueryKey } from "./useGetWorkouts";
import { fetchGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { invalidateQueryKeys } from "@/utils/invalidateQueryKeys";
import { fetchStatsQueryKey } from "../stats/fetchStatsQueryKey";

export const usePostWorkouts = (
  options?: Partial<UseMutationOptions<Workout, Error, WorkoutCreate>>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: (data?: WorkoutCreate) =>
      fetchFromAPI<Workout>({
        method: "POST",
        endpoint: "workouts",
        data,
      }),
    onSuccess: (workout, ...rest) => {
      invalidateQueryKeys(
        queryClient,
        fetchGetWorkoutsQueryKey(),
        fetchGetExercisesIdStatsQueryKey(),
        fetchStatsQueryKey()
      );

      options?.onSuccess?.(workout, ...rest);
    },
  });
};
