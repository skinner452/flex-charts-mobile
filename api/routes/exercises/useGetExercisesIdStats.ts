import { fetchFromAPI } from "@/api/base/fetchFromAPI";
import { getQueryKey } from "@/api/base/queryKey";
import { ExerciseStats } from "@/types/exercises";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const getEndpoint = (id: number) => `exercises/${id}/stats`;

export const useGetExercisesIdStatsQueryKey = (id: number) =>
  getQueryKey(getEndpoint(id));

export const useGetExercisesIdStats = (
  id: number,
  options?: Partial<UseQueryOptions<ExerciseStats>>
) => {
  return useQuery({
    ...options,
    queryFn: () =>
      fetchFromAPI<ExerciseStats>({ method: "GET", endpoint: getEndpoint(id) }),
    queryKey: useGetExercisesIdStatsQueryKey(id),
  });
};
