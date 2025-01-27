import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetExercisesQueryKey } from "./useGetExercises";
import { fetchGetWorkoutsQueryKey } from "../workouts/useGetWorkouts";
import { useBaseMutation } from "@/api/base/useBaseMutation";

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
      queryClient.invalidateQueries({
        queryKey: fetchGetExercisesQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: fetchGetWorkoutsQueryKey(),
      });

      options?.onSuccess?.(...rest);
    },
  });
};
