import { defaultQueryOptions } from "@/api/base/defaultQueryOptions";
import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { ExerciseStats } from "@/types/exercises";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetExercisesIdStatsQueryKey = (id?: number) => {
  const queryKey = ["exercises", "id", "stats"] as any[];
  if (id) queryKey.push({ id });
  return queryKey;
};

export const useGetExercisesIdStats = (
  id: number,
  options?: Partial<UseQueryOptions<ExerciseStats>>
) => {
  return useQuery({
    ...defaultQueryOptions,
    ...options,
    queryFn: () =>
      fetchFromAPI<ExerciseStats>({
        method: "GET",
        endpoint: `exercises/${id}/stats`,
      }),
    queryKey: useGetExercisesIdStatsQueryKey(id),
  });
};
