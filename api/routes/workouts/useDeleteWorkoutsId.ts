import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { useGetWorkoutsQueryKey } from "./useGetWorkouts";
import { Workout } from "@/types/workouts";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";
import { useBaseMutation } from "@/api/base/useBaseMutation";

export const useDeleteWorkoutsId = (
  options?: Partial<UseMutationOptions<void, Error, Workout>>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: (workout) =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: `workouts/${workout.id}`,
      }),
    onSuccess: (response, workout, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: useGetWorkoutsQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: useGetExercisesIdStatsQueryKey(),
      });

      options?.onSuccess?.(response, workout, ...rest);
    },
  });
};
