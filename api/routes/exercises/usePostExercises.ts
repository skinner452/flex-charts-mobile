import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Exercise, ExerciseCreate } from "@/types/exercises";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useGetExercisesQueryKey } from "./useGetExercises";

const endpoint = "exercises";

export const usePostExercises = (
  options?: Partial<UseMutationOptions<Exercise, Error, ExerciseCreate>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data?: ExerciseCreate) =>
      fetchFromAPI<Exercise>({
        method: "POST",
        endpoint: endpoint,
        data,
      }),
    onSuccess: (exercise, ...rest) => {
      // Invalidate the exercises query
      queryClient.invalidateQueries({
        queryKey: useGetExercisesQueryKey(),
      });

      options?.onSuccess?.(exercise, ...rest);
    },
  });
};
