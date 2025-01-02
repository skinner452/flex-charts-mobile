import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetWorkoutsQueryKey } from "./useGetWorkouts";
import { Workout } from "@/types/workouts";

const getEndpoint = (id: number) => `workouts/${id}`;

export const useDeleteWorkoutsId = (
  options?: Partial<UseMutationOptions<void, Error, Workout>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (workout) =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: getEndpoint(workout.id),
      }),
    onSuccess: (response, workout, ...rest) => {
      // Invalidate the workouts query for the session
      queryClient.invalidateQueries({
        queryKey: useGetWorkoutsQueryKey({ sessionID: workout.sessionID }),
      });

      options?.onSuccess?.(response, workout, ...rest);
    },
  });
};
