import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Workout, WorkoutCreate } from "@/types/workouts";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { useGetWorkoutsQueryKey } from "./useGetWorkouts";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";

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
      queryClient.invalidateQueries({
        queryKey: useGetWorkoutsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: useGetExercisesIdStatsQueryKey(),
      });

      options?.onSuccess?.(workout, ...rest);
    },
  });
};
