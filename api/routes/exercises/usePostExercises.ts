import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Exercise, ExerciseCreate } from "@/types/exercises";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetExercisesQueryKey } from "./useGetExercises";

export const usePostExercises = (
  options?: Partial<UseMutationOptions<Exercise, Error, ExerciseCreate>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data?: ExerciseCreate) =>
      fetchFromAPI<Exercise>({
        method: "POST",
        endpoint: "exercises",
        data,
      }),
    onSuccess: (exercise, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: useGetExercisesQueryKey(),
      });

      options?.onSuccess?.(exercise, ...rest);
    },
  });
};
