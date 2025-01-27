import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { Exercise } from "@/types/exercises";
import { UseQueryOptions } from "@tanstack/react-query";

export const fetchGetExercisesQueryKey = () => ["exercises"];

export const useGetExercises = (
  options?: Partial<UseQueryOptions<Exercise[]>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Exercise[]>({ method: "GET", endpoint: "exercises" }),
    queryKey: fetchGetExercisesQueryKey(),
  });
};
