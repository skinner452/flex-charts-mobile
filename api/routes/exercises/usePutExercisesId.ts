import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetExercisesQueryKey } from "./useGetExercises";
import { fetchGetWorkoutsQueryKey } from "../workouts/useGetWorkouts";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { ExerciseUpdate } from "@/types/exercises";

export const usePutExercisesId = (
  id: number,
  options?: Partial<UseMutationOptions<void, Error, ExerciseUpdate>>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: (data: ExerciseUpdate) =>
      fetchFromAPI<void>({
        method: "PUT",
        endpoint: `exercises/${id}`,
        data,
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
