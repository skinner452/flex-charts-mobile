import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetExercisesQueryKey } from "./useGetExercises";
import { useGetWorkoutsQueryKey } from "../workouts/useGetWorkouts";

export const useDeleteExercisesId = (
  id: number,
  options?: Partial<UseMutationOptions>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      fetchFromAPI({
        method: "DELETE",
        endpoint: `exercises/${id}`,
      }),
    onSuccess: (...rest) => {
      queryClient.invalidateQueries({
        queryKey: useGetExercisesQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: useGetWorkoutsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
