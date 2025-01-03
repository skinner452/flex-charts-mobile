import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { getQueryKey } from "@/api/base/queryKey";
import { Exercise } from "@/types/exercises";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const endpoint = "exercises";

export const useGetExercisesQueryKey = () => getQueryKey(endpoint);

export const useGetExercises = (
  options?: Partial<UseQueryOptions<Exercise[]>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () => fetchFromAPI<Exercise[]>({ method: "GET", endpoint }),
    queryKey: useGetExercisesQueryKey(),
  });
};
