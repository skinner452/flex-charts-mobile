import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Exercise, ExerciseCreate } from "@/types/exercises";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { fetchGetExercisesQueryKey } from "./useGetExercises";
import { useBaseMutation } from "@/api/base/useBaseMutation";
import { invalidateQueryKeys } from "@/utils/invalidateQueryKeys";

export const usePostExercises = (
  options?: Partial<UseMutationOptions<Exercise, Error, ExerciseCreate>>
) => {
  const queryClient = useQueryClient();

  return useBaseMutation({
    ...options,
    mutationFn: (data: ExerciseCreate) =>
      fetchFromAPI<Exercise>({
        method: "POST",
        endpoint: "exercises",
        data,
      }),
    onSuccess: (exercise, ...rest) => {
      invalidateQueryKeys(queryClient, fetchGetExercisesQueryKey());

      options?.onSuccess?.(exercise, ...rest);
    },
  });
};
