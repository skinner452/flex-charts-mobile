import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Workout, WorkoutCreate } from "@/types/workouts";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetWorkoutsQueryKey } from "./useGetWorkouts";
import { useGetExercisesIdStatsQueryKey } from "../exercises/useGetExercisesIdStats";

export const usePostWorkouts = (
  options?: Partial<UseMutationOptions<Workout, Error, WorkoutCreate>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
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
