import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Exercise, ExerciseCreate } from "@/types/exercises";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const endpoint = "exercises";

export const usePostExercises = (
  options?: Partial<UseMutationOptions<Exercise, Error, ExerciseCreate>>
) => {
  return useMutation({
    ...options,
    mutationFn: (data?: ExerciseCreate) =>
      fetchFromAPI<Exercise>({
        method: "POST",
        endpoint: endpoint,
        data,
      }),
  });
};
