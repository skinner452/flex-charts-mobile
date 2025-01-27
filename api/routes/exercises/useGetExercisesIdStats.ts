import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { useBaseQuery } from "@/api/base/useBaseQuery";
import { ExerciseStats } from "@/types/exercise_stats";
import { UseQueryOptions } from "@tanstack/react-query";

export const fetchGetExercisesIdStatsQueryKey = (id?: number) => {
  const queryKey = ["exercises", "id", "stats"] as any[];
  if (id) queryKey.push({ id });
  return queryKey;
};

export const useGetExercisesIdStats = (
  id: number,
  options?: Partial<UseQueryOptions<ExerciseStats>>
) => {
  return useBaseQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<ExerciseStats>({
        method: "GET",
        endpoint: `exercises/${id}/stats`,
      }),
    queryKey: fetchGetExercisesIdStatsQueryKey(id),
  });
};
