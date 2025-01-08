import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetWorkoutsQueryKey } from "./useGetWorkouts";
import { Workout } from "@/types/workouts";

export const useDeleteWorkoutsId = (
  options?: Partial<UseMutationOptions<void, Error, Workout>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
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

      options?.onSuccess?.(response, workout, ...rest);
    },
  });
};
