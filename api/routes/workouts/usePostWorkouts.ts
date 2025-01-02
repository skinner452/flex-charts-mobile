import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Workout, WorkoutCreate } from "@/types/workouts";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetWorkoutsQueryKey } from "./useGetWorkouts";

const endpoint = "workouts";

export const usePostWorkouts = (
  options?: Partial<UseMutationOptions<Workout, Error, WorkoutCreate>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data?: WorkoutCreate) =>
      fetchFromAPI<Workout>({
        method: "POST",
        endpoint: endpoint,
        data,
      }),
    onSuccess: (workout, ...rest) => {
      // Invalidate the session's workouts query
      queryClient.invalidateQueries({
        queryKey: useGetWorkoutsQueryKey({ sessionID: workout.sessionID }),
      });

      options?.onSuccess?.(workout, ...rest);
    },
  });
};
