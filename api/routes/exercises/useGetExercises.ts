import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Exercise } from "@/types/exercises";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetExercisesQueryKey = () => ["exercises"];

export const useGetExercises = (
  options?: Partial<UseQueryOptions<Exercise[]>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () =>
      fetchFromAPI<Exercise[]>({ method: "GET", endpoint: "exercises" }),
    queryKey: useGetExercisesQueryKey(),
  });
};
