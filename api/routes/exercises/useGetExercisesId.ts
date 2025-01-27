import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { Exercise } from "@/types/exercises";
import { UseQueryOptions } from "@tanstack/react-query";

export const fetchGetExercisesIdQueryKey = (id?: number) => {
  const queryKey = ["exercises", "id"] as any[];
  if (id) queryKey.push({ id });
  return queryKey;
};

export const useGetExercisesId = (
  id: number,
  options?: Partial<UseQueryOptions<Exercise>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<Exercise>({
        method: "GET",
        endpoint: `exercises/${id}`,
      }),
    queryKey: fetchGetExercisesIdQueryKey(id),
  });
};
