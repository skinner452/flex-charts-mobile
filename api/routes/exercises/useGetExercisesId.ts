import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { Exercise } from "@/types/exercises";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetExercisesIdQueryKey = (id?: number) => {
  const queryKey = ["exercises", "id"] as any[];
  if (id) queryKey.push({ id });
  return queryKey;
};

export const useGetExercisesId = (
  id: number,
  options?: Partial<UseQueryOptions<Exercise>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () =>
      fetchFromAPI<Exercise>({
        method: "GET",
        endpoint: `exercises/${id}`,
      }),
    queryKey: useGetExercisesIdQueryKey(id),
  });
};
